const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const repos = {
    "PieceTable (Text Editor Backend)": "https://github.com/PRADEEPERIYASAMY/piecetable-editor",
    "ZapMail (Background Jobs)": "https://github.com/PRADEEPERIYASAMY/zapmail",
    "HowdyAI (LangGraph Agent)": "https://github.com/PRADEEPERIYASAMY/HowdyAI",
    "My Movies (Streaming App)": "https://github.com/PRADEEPERIYASAMY/MyMovies",
    "Fun Learn (AI Learning App)": "https://github.com/PRADEEPERIYASAMY/FunLearn",
    "C++ Algorithms Library": "https://github.com/PRADEEPERIYASAMY/cpp-codes",
    "Zombie Shooter": "https://github.com/PRADEEPERIYASAMY/Zombie-Shooter",
    "FunLearn V2": "https://github.com/PRADEEPERIYASAMY/funlearn_app"
};

const projectsSectionMatch = html.match(/<section id="projects"[\s\S]*?<\/section>/);
if (!projectsSectionMatch) {
    console.log("Could not find projects section.");
    process.exit(1);
}

let projectsHtml = projectsSectionMatch[0];

for (let [title, url] of Object.entries(repos)) {
    // Escape regex special chars
    let escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const searchRegex = new RegExp(`(<div class="flex justify-between items-center mb-2">\\s*<h3 class="text-xl font-bold text-white">${escapedTitle}</h3>\\s*)(</div>)`, 'g');
    
    const githubLink = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="relative group flex items-center justify-center w-9 h-9 rounded-full ml-3 flex-shrink-0 transition-transform duration-300 hover:scale-110" aria-label="View Source">
                                <div class="absolute inset-0 rounded-full bg-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.4)] group-hover:bg-blue-400/50 group-hover:shadow-[0_0_24px_rgba(59,130,246,0.8)] transition-all duration-300"></div>
                                <i class="fab fa-github relative z-10 text-blue-100 group-hover:text-white text-[1.1rem] transition-colors"></i>
                            </a>
                        </div>`;
    
    // We captured the closing </div> but let's just replace it directly
    projectsHtml = projectsHtml.replace(searchRegex, `$1${githubLink}`);
}

html = html.replace(projectsSectionMatch[0], projectsHtml);

fs.writeFileSync(indexPath, html);
console.log("Added glowing GitHub icons to project cards!");
