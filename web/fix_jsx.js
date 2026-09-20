const fs = require('fs');
const files = [
  'src/app/economics/page.tsx',
  'src/app/me/page.tsx',
  'src/app/post/page.tsx',
  'src/app/page.tsx',
  'src/app/how/page.tsx',
  'src/app/browse/page.tsx',
  'src/app/stamp/[id]/page.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/readOnly(?:=[\"'][^\"']*[\"'])?/g, 'readOnly={true}');
  content = content.replace(/maxLength=[\"'](\d+)[\"']/gi, 'maxLength={$1}');
  fs.writeFileSync(f, content, 'utf8');
});
