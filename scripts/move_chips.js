const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// We only want to affect the projects section
const projectsSectionMatch = html.match(/<section id="projects"[\s\S]*?<\/section>/);
if (!projectsSectionMatch) {
    console.log("Could not find projects section.");
    process.exit(1);
}

let projectsHtml = projectsSectionMatch[0];

// The regex needs to capture the chips div and the button div separately,
// and move the chips div up above the ul.

const cardRegex = /(<p class="text-sm font-semibold text-blue-400 mb-4">.*?<\/p>\s*)(<ul class="list-disc list-outside pl-5 space-y-2 text-gray-300 text-sm mb-4 flex-grow">[\s\S]*?<\/ul>\s*)<div class="mt-auto flex flex-col gap-4">\s*(<div class="flex flex-wrap gap-2">[\s\S]*?<\/div>)\s*(<a href="projects\/[\s\S]*?<\/a>\s*)<\/div>/g;

projectsHtml = projectsHtml.replace(cardRegex, (match, categoryP, ulList, chipsDiv, linkA) => {
    // Add margin bottom to chips div since it's now sitting above the ul list
    let modifiedChipsDiv = chipsDiv.replace('<div class="flex flex-wrap gap-2">', '<div class="flex flex-wrap gap-2 mb-4">');
    
    // The button should now just have mt-auto to push it to the bottom
    let modifiedLinkA = linkA.replace('class="', 'class="mt-auto ');
    
    return categoryP + modifiedChipsDiv + '\n                        ' + ulList + modifiedLinkA;
});

html = html.replace(projectsSectionMatch[0], projectsHtml);

fs.writeFileSync(indexPath, html);
console.log("Moved chips to above bullet points in project cards.");
