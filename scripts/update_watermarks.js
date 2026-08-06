const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Replace the text-gray-900 watermark numbers in Core Philosophy cards
// so they are visible against the new glassy backgrounds.
// Old: text-gray-900 z-0
// New: text-white/5 z-0
html = html.replace(/text-gray-900 z-0/g, 'text-blue-200/10 z-0');

fs.writeFileSync(indexPath, html);
console.log("Updated watermark numbers!");
