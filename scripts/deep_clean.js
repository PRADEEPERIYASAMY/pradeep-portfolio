const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// The bad button pattern is:
// <a href="projects/[^"]+\.html" class="block w-full text-center border border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 font-medium py-2.5 rounded-lg transition-all duration-300">
//     Read Analysis <i class="fas fa-arrow-right ml-2 text-sm"></i>
// </a>
// </div>

const badPattern = /\s*<a href="projects\/[^"]+\.html" class="block w-full text-center border border-gray-600 hover:border-blue-500 hover:bg-blue-500\/10 text-gray-300 hover:text-blue-400 font-medium py-2\.5 rounded-lg transition-all duration-300">\s*Read Analysis <i class="fas fa-arrow-right ml-2 text-sm"><\/i>\s*<\/a>\s*<\/div>/g;

html = html.replace(badPattern, '');

// Also clean up any lingering `<div class="mt-auto w-full">` and `<div class="flex flex-wrap gap-2 mb-4">`
// that don't have a button next to them
html = html.replace(/<div class="mt-auto w-full">\s*<div class="flex flex-wrap gap-2 mb-4">/g, '<div class="flex flex-wrap gap-2 mt-auto">');

// Now, properly add the button to ALL projects!
// We can do this by matching the exact tags block for each project.
// The tags block always looks like:
// <div class="flex flex-wrap gap-2 mt-auto">
//     <span ...>...</span>
//     ...
// </div>
// </div> (this closes the card)

// Let's use a while loop with regex to find the end of the tags div and the card div
// Actually, it's safer to just do a replace for:
// </div>
// </div>
// that occurs after a span. But wait, it's easier to just rebuild it programmatically.

fs.writeFileSync(indexPath, html);
console.log("Fully cleaned index.html");
