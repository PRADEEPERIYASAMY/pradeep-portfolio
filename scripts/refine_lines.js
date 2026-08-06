const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const regex = /<div class="absolute left-8 top-0 h-4 border-l border-gray-700 z-0"><\/div>\s*<div class="absolute left-8 top-16 bottom-0 border-l border-gray-700 z-0"><\/div>\s*<div class="relative flex items-center mt-4 h-12 z-10 w-full">\s*<div class="absolute left-0 w-2 h-\[1px\] bg-gray-700 z-0"><\/div>\s*<div class="absolute left-2 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-500\/20 backdrop-blur-md border border-blue-500\/30 z-20">\s*<i class="fas fa-([a-zA-Z0-9-]+) text-blue-300 text-lg"><\/i>\s*<\/div>\s*<h3 class="relative ml-20 text-lg font-bold text-white z-10 whitespace-nowrap">\s*([\s\S]*?)\s*<\/h3>\s*<div class="flex-1 h-\[1px\] bg-gray-700 ml-4 z-0"><\/div>\s*<\/div>/g;

html = html.replace(regex, 
`<div class="absolute left-8 top-0 h-3 border-l border-gray-700 z-0"></div>
<div class="absolute left-8 top-[72px] bottom-0 border-l border-gray-700 z-0"></div>
<div class="relative flex items-center mt-4 h-12 z-10 w-full">
    <div class="absolute left-2 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-900 z-20 shadow-lg">
        <i class="fas fa-$1 text-blue-300 text-lg"></i>
    </div>
    <div class="absolute left-[68px] w-4 h-[1px] bg-gray-700 z-0"></div>
    <h3 class="relative ml-24 text-lg font-bold text-white z-10 whitespace-nowrap tracking-wide">
        $2
    </h3>
    <div class="flex-1 h-[1px] bg-gray-700 ml-6 z-0"></div>
</div>`);

fs.writeFileSync(indexPath, html);
console.log("Refined the lines perfectly!");
