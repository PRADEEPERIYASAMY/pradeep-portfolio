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

let lines = html.split('\n');
let newLines = [];
let currentProject = null;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Detect project start
    for (let p of projects) {
        if (line.includes(`<h3 class="text-xl font-bold text-white">${p.title}`) || line.includes(`<h3 class="text-xl font-bold text-white">${p.title} `) || line.includes(`<h3 class="text-xl font-bold text-white">${p.title}<`)) {
            currentProject = p;
            break;
        }
    }
    
    // We are looking for the tags div `<div class="flex flex-wrap gap-2 mt-auto">`
    if (currentProject && line.includes('<div class="flex flex-wrap gap-2 mt-auto">')) {
        // Change it to the wrapper start
        newLines.push('                        <div class="mt-auto w-full">');
        newLines.push('                        <div class="flex flex-wrap gap-2 mb-4">');
        continue; // skip pushing original line
    }
    
    // The card ends with `                    </div>`
    if (currentProject && line.match(/^\s{20}<\/div>\s*$/)) {
        let lastLine = newLines.pop();
        if (lastLine.match(/^\s{24}<\/div>\s*$/)) {
            newLines.push(lastLine); // tags closing div
            newLines.push(buttonTemplate(currentProject.url)); // button + wrapper closing div
            newLines.push(line); // card closing div
            currentProject = null;
            continue;
        } else {
            newLines.push(lastLine);
        }
    }
    
    newLines.push(line);
}

fs.writeFileSync(indexPath, newLines.join('\n'));
console.log("Properly injected buttons");
