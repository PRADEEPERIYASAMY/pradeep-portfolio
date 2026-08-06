const fs = require('fs');
const path = require('path');

const refDir = path.join(__dirname, 'reference');

const renames = {
    'README (1).md': 'piecetable_old.md', // We will replace with our essay
    'README (2).md': 'howdyai.md',
    'README (3).md': 'mymovies.md',
    'README (4).md': 'funlearnv2.md',
    'README (5).md': 'funlearn.md',
    'README (6).md': 'zombieshooter.md',
    'README (7).md': 'cppdsa.md',
    'README.md': 'zapmail.md'
};

for (const [oldName, newName] of Object.entries(renames)) {
    const oldPath = path.join(refDir, oldName);
    const newPath = path.join(refDir, newName);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${oldName} to ${newName}`);
    }
}

// Copy the piecetable essay from the root piecetable project dir to reference/piecetable.md
const sourcePie = path.join(__dirname, '..', 'piecetable-editor', 'README.md');
const targetPie = path.join(refDir, 'piecetable.md');
if (fs.existsSync(sourcePie)) {
    fs.copyFileSync(sourcePie, targetPie);
    console.log(`Copied piecetable-editor/README.md to reference/piecetable.md`);
}

// Now update build_projects.js
const buildJsPath = path.join(__dirname, 'build_projects.js');
let buildContent = fs.readFileSync(buildJsPath, 'utf8');

// Replace the projects array with the new one pointing to reference/
const newProjects = `const projects = [
    { id: 'mymovies', src: 'reference/mymovies.md', title: 'MyMovies' },
    { id: 'funlearnv2', src: 'reference/funlearnv2.md', title: 'FunLearn V2' },
    { id: 'funlearn', src: 'reference/funlearn.md', title: 'FunLearn' },
    { id: 'cppdsa', src: 'reference/cppdsa.md', title: 'C++ DSA Practice' },
    { id: 'zombieshooter', src: 'reference/zombieshooter.md', title: 'Zombie Shooter' },
    { id: 'zapmail', src: 'reference/zapmail.md', title: 'Zapmail' },
    { id: 'piecetable', src: 'reference/piecetable.md', title: 'PieceTable Editor' },
    { id: 'howdyai', src: 'reference/howdyai.md', title: 'HowdyAI' },
    { id: 'kavalarann', src: 'reference/kavalarann.md', title: 'Kaval Arann' } // We will create a placeholder for this
];`;

buildContent = buildContent.replace(/const projects = \[([\s\S]*?)\];/, newProjects);
fs.writeFileSync(buildJsPath, buildContent);
console.log('Updated build_projects.js to point to reference/');

