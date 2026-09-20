const fs = require('fs');
['src/app/economics/page.tsx', 'src/app/me/page.tsx'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/disabled=(?:""|"disabled"|"true")/gi, 'disabled={true}');
  content = content.replace(/checked=(?:""|"checked"|"true")/gi, 'checked={true}');
  content = content.replace(/selected=(?:""|"selected"|"true")/gi, 'selected={true}');
  fs.writeFileSync(f, content, 'utf8');
});
