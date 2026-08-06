const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. Remove the lines and dot
html = html.replace(/<div class="absolute inset-x-0 top-10 z-0 border-t border-gray-700"><\/div>\s*<div class="absolute inset-y-0 inset-x-8 z-0 border-l border-gray-700"><\/div>\s*<span class="absolute left-8 top-10 w-2 h-2 bg-blue-500 rounded-full z-0 -translate-x-1 -translate-y-1"><\/span>/g, '');

// 2. Fix the circle (remove ring and make it glassy)
// <div class="absolute left-2 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-900 ring-8 ring-gray-800 z-20">
html = html.replace(/<div class="absolute left-2 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-900 ring-8 ring-gray-800 z-20">/g, '<div class="absolute left-2 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 z-20">');

// 3. Fix the h3 text box (remove bg-gray-800 and px-3)
// <h3 class="relative ml-20 px-3 text-lg font-bold text-white bg-gray-800 z-10">
html = html.replace(/<h3 class="relative ml-20 px-3 text-lg font-bold text-white bg-gray-800 z-10">/g, '<h3 class="relative ml-20 text-lg font-bold text-white z-10">');

fs.writeFileSync(indexPath, html);
console.log("Fixed hero cards layout!");
