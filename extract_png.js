const fs = require('fs');

const svgContent = fs.readFileSync('public/assets/solutions/cta-image.svg', 'utf8');

// Find the base64 data
const match = svgContent.match(/href="data:image\/png;base64,([^"]+)"/);

if (match && match[1]) {
  const base64Data = match[1];
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync('public/assets/solutions/cta-image.png', buffer);
  console.log('Successfully extracted PNG!');
} else {
  console.log('Base64 PNG not found in SVG.');
}
