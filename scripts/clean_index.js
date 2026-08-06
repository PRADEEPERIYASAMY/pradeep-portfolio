const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. Remove all instances of the button
const buttonRegex = /\s*<a href="projects\/[^"]+\.html" class="mt-5 block w-full[^>]+>\s*Read Analysis <i class="fas fa-arrow-right ml-2 text-sm"><\/i>\s*<\/a>/g;
html = html.replace(buttonRegex, '');

// 2. Fix the mangled div tags (from fix_layout.js)
html = html.replace(/<div class="mt-auto w-full">\\n\s*<div class="flex flex-wrap gap-2 mb-4">/g, '<div class="flex flex-wrap gap-2 mt-auto">');
// Also fix any mt-auto mb-4 back to mt-auto
html = html.replace(/<div class="flex flex-wrap gap-2 mt-auto mb-4">/g, '<div class="flex flex-wrap gap-2 mt-auto">');

// Also remove any stray closing </div> that might have been added by accident, though we didn't successfully add them.
// Let's just write to index.html and then we'll verify it's clean.
fs.writeFileSync(indexPath, html);
console.log("Cleaned index.html");
