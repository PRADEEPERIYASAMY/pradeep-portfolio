const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const projects = [
    'MyMovies', 'FunLearnV2', 'FunLearn', 'cpp-codes', 
    'ZombieShooter-full', 'ZapMail', 'piecetable-editor', 'HowdyAI', 'pradeep-portfolio'
];

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    content = content.replace(/Eriyasamy, Pradeep/g, 'PRADEEPERIYASAMY');
    content = content.replace(/Pradeep Eriyasamy/g, 'PRADEEPERIYASAMY');
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Updated', filePath);
    }
}

projects.forEach(p => {
    const projDir = path.join(root, p);
    if (!fs.existsSync(projDir)) return;
    
    // Check files
    processFile(path.join(projDir, 'README.md'));
    processFile(path.join(projDir, 'CITATION.cff'));
});

// Also fix build_projects.js template footer
processFile(path.join(__dirname, 'build_projects.js'));
