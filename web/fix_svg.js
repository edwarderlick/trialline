const fs = require('fs');
const glob = require('glob');
// Wait, let's just use the explicit array
const files = [
  'src/app/me/page.tsx',
  'src/app/how/page.tsx',
  'src/app/post/page.tsx',
  'src/app/economics/page.tsx',
  'src/app/page.tsx',
  'src/app/browse/page.tsx',
  'src/app/stamp/[id]/page.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/font-family=/gi, 'fontFamily=');
    content = content.replace(/font-size=/gi, 'fontSize=');
    content = content.replace(/font-weight=/gi, 'fontWeight=');
    content = content.replace(/letter-spacing=/gi, 'letterSpacing=');
    fs.writeFileSync(f, content, 'utf8');
  }
});
