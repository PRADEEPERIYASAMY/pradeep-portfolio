const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Replace standard solid backgrounds with glassy equivalents
// Sections that use bg-gray-900 rounded-xl
html = html.replace(/class="py-16 bg-gray-900 rounded-xl/g, 'class="py-16 bg-gray-900/40 backdrop-blur-xl rounded-xl');

// Cards that use bg-gray-800
html = html.replace(/bg-gray-800 rounded-xl/g, 'bg-gray-800/40 backdrop-blur-lg rounded-xl');

// Skill cards that use bg-gray-900
html = html.replace(/bg-gray-900 rounded-xl/g, 'bg-gray-900/40 backdrop-blur-lg rounded-xl');

// Footer
html = html.replace(/<footer id="contact" class="bg-gray-900 /g, '<footer id="contact" class="bg-gray-900/50 backdrop-blur-xl ');

// Make sure the mobile menu is also glassy
html = html.replace(/bg-gray-900\/95/g, 'bg-gray-900/80 backdrop-blur-lg');

// We also might have bg-gray-700 on small chips or spans, which we probably don't need to make glassy, or maybe we do?
// "bg-gray-700" -> let's keep chips solid for contrast.

fs.writeFileSync(indexPath, html);
console.log("Made index.html glassy!");
