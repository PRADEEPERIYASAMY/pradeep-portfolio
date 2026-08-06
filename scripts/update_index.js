const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const projects = [
    { title: 'Kaval Arann', url: 'projects/kavalarann.html' },
    { title: 'My Movies', url: 'projects/mymovies.html' },
    { title: 'Fun Learn (AI Learning App)', url: 'projects/funlearn.html' },
    { title: 'HowdyAI', url: 'projects/howdyai.html' },
    { title: 'PieceTable Editor', url: 'projects/piecetable.html' },
    { title: 'Zapmail', url: 'projects/zapmail.html' },
    { title: 'Zombie Shooter', url: 'projects/zombieshooter.html' },
    { title: 'C++ DSA Practice', url: 'projects/cppdsa.html' },
    { title: 'FunLearn V2', url: 'projects/funlearnv2.html' }
];

const buttonTemplate = (url) => `                        <a href="${url}" class="block w-full text-center border border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 font-medium py-2.5 rounded-lg transition-all duration-300">
                            Read Analysis <i class="fas fa-arrow-right ml-2 text-sm"></i>
                        </a>
                        </div>`;

let currentProject = null;
let lines = html.split('\n');
let newLines = [];

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check if we hit a project title
    for (let p of projects) {
        if (line.includes(`<h3 class="text-xl font-bold text-white">${p.title}`) || line.includes(`<h3 class="text-xl font-bold text-white">${p.title} `) || line.includes(`<h3 class="text-xl font-bold text-white">${p.title}<`)) {
            currentProject = p;
            break;
        }
    }
    
    // Check if we hit the tags div
    if (currentProject && line.includes('<div class="flex flex-wrap gap-2 mt-auto">')) {
        line = line.replace('<div class="flex flex-wrap gap-2 mt-auto">', '<div class="mt-auto w-full">\n                        <div class="flex flex-wrap gap-2 mb-4">');
    }
    
    // We are at the end of the tags div
    if (currentProject && line.match(/^\s{24}<\/div>\s*$/)) {
        newLines.push(line); // push the closing div of the tags
        newLines.push(buttonTemplate(currentProject.url)); // push the button and the closing div of the wrapper
        currentProject = null; // reset
        continue;
    }
    
    newLines.push(line);
}

fs.writeFileSync(indexPath, newLines.join('\n'));
console.log("Updated index.html");
