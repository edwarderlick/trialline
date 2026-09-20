const fs = require('fs');
const path = require('path');

function convertHtmlToJsx(html) {
  // Extract content inside <main>
  const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;
  const match = html.match(mainRegex);
  if (!match) return null;
  
  let jsx = match[1];

  // 1. Remove script tags
  jsx = jsx.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 2. Remove comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, ''); 

  // 3. Escape { and } safely
  jsx = jsx.replace(/\{/g, '___OPEN_BRACE___').replace(/\}/g, '___CLOSE_BRACE___');
  jsx = jsx.replace(/___OPEN_BRACE___/g, '{"{"}').replace(/___CLOSE_BRACE___/g, '{"}"}');

  // 4. Convert basic HTML to JSX
  jsx = jsx.replace(/class=/g, 'className=');
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  // 5. Strip all event handlers
  jsx = jsx.replace(/\bon[a-z]+="[^"]*"/gi, '');

  // 6. Fix specific JSX property casings
  jsx = jsx.replace(/\breadonly\b/gi, 'readOnly');
  jsx = jsx.replace(/\bmaxlength\b/gi, 'maxLength');
  jsx = jsx.replace(/\btextpath\b/gi, 'textPath');
  jsx = jsx.replace(/\bviewbox=/gi, 'viewBox=');
  
  // Convert style="width: X%;" to style={{ width: "X%" }}
  jsx = jsx.replace(/style="([^"]+)"/g, (match, p1) => {
    if (p1.includes('width:')) {
      const wMatch = p1.match(/width:\s*([^;]+)/);
      if (wMatch) {
        return `style={{"{"} width: "${wMatch[1].trim()}" {"}"}}`.replace(/{"{"}/g, '{').replace(/{"}"}/g, '}');
      }
    }
    return `style={{}}`; 
  });

  // Replace unclosed img, input, br, hr tags
  jsx = jsx.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/gi, '<$1$2 />');
  
  // SVG attribute conversions
  const svgAttributes = [
    'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule',
    'stroke-dasharray', 'stroke-dashoffset'
  ];
  svgAttributes.forEach(attr => {
    const camelCase = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
    const regex = new RegExp(attr + '=', 'gi');
    jsx = jsx.replace(regex, camelCase + '=');
  });

  return `export default function Page() {\n  return (\n    <>\n      ${jsx}\n    </>\n  );\n}\n`;
}

const routes = [
  { folder: 'landing_trialline', route: 'src/app/page.tsx' },
  { folder: 'how_trialline_works_trialline', route: 'src/app/how/page.tsx' },
  { folder: 'post_a_stamp_trialline', route: 'src/app/post/page.tsx' },
  { folder: 'browse_stamps_trialline', route: 'src/app/browse/page.tsx' },
  { folder: 'stamp_detail_trialline', route: 'src/app/stamp/[id]/page.tsx' },
  { folder: 'my_stamps_trialline', route: 'src/app/me/page.tsx' },
  { folder: 'economics_trialline', route: 'src/app/economics/page.tsx' }
];

routes.forEach(({ folder, route }) => {
  const htmlPath = path.join('..', folder, 'code.html');
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const jsx = convertHtmlToJsx(html);
    if (jsx) {
      const outPath = path.join(process.cwd(), route);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, jsx, 'utf8');
      console.log(`Converted ${folder} to ${route}`);
    } else {
      console.log(`No <main> found in ${folder}`);
    }
  } else {
    console.log(`File not found: ${htmlPath}`);
  }
});
