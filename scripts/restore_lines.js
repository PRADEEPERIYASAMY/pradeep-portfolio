const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. Add vertical lines and left horizontal line snippet
html = html.replace(/<div class="relative flex items-center mt-4 h-12 z-10">/g, 
`<div class="absolute left-8 top-0 h-4 border-l border-gray-700 z-0"></div>
<div class="absolute left-8 top-16 bottom-0 border-l border-gray-700 z-0"></div>
<div class="relative flex items-center mt-4 h-12 z-10 w-full">
<div class="absolute left-0 w-2 h-[1px] bg-gray-700 z-0"></div>`);

// 2. Add right horizontal line snippet to each card
const headings = [
    "Secure & Reliable",
    "Scalable Architecture",
    "High Performance"
];

for (let heading of headings) {
    const searchRegex = new RegExp(`<h3 class="relative ml-20 text-lg font-bold text-white z-10">\\s*${heading}\\s*<\\/h3>`, 'g');
    
    html = html.replace(searchRegex, 
`<h3 class="relative ml-20 text-lg font-bold text-white z-10 whitespace-nowrap">
    ${heading}
</h3>
<div class="flex-1 h-[1px] bg-gray-700 ml-4 z-0"></div>`);
}

fs.writeFileSync(indexPath, html);
console.log("Restored lines without cutting through!");
