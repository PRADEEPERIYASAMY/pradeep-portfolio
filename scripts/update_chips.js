const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. Tech Stack Chips (Experience & Projects)
// Old: bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium
// New: inline-flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[0.72rem] font-medium text-blue-300 font-mono tracking-wide backdrop-blur-sm transition-all duration-200 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-100
html = html.replace(/bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium/g, 'inline-flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[0.72rem] font-medium text-blue-300 font-mono tracking-wide backdrop-blur-sm transition-all duration-200 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-100');

// 2. Experience Tab Buttons (Active)
// Old: w-full rounded-lg border p-4 text-left transition-all border-blue-500/30 bg-blue-500/10 shadow-md
// New: w-full rounded-lg border p-4 text-left transition-all border-blue-500/30 bg-blue-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)]
html = html.replace(/w-full rounded-lg border p-4 text-left transition-all border-blue-500\/30 bg-blue-500\/10 shadow-md/g, 'w-full rounded-lg border p-4 text-left transition-all border-blue-500/30 bg-blue-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)]');

// 3. Experience Tab Buttons (Inactive)
// Old: w-full rounded-lg border p-4 text-left transition-all border-gray-700 hover:bg-blue-500/5
// New: w-full rounded-lg border p-4 text-left transition-all border-gray-700/50 bg-gray-800/40 backdrop-blur-md hover:bg-blue-500/10 hover:border-blue-500/30
html = html.replace(/w-full rounded-lg border p-4 text-left transition-all border-gray-700 hover:bg-blue-500\/5/g, 'w-full rounded-lg border p-4 text-left transition-all border-gray-700/50 bg-gray-800/40 backdrop-blur-md hover:bg-blue-500/10 hover:border-blue-500/30');

// 4. Expertise Tags (Skills section)
// Old: bg-blue-600/30 text-blue-300 px-4 py-2 rounded-full font-medium text-sm
// New: inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm font-medium text-blue-300 font-mono tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.1)]
html = html.replace(/bg-blue-600\/30 text-blue-300 px-4 py-2 rounded-full font-medium text-sm/g, 'inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm font-medium text-blue-300 font-mono tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.1)]');

// 5. Interests Tags (About section)
// Old: bg-gray-600/50 text-gray-300 px-4 py-2 rounded-full text-sm font-medium
// New: inline-flex items-center px-4 py-2 bg-gray-700/40 border border-gray-600/50 rounded-full text-sm font-medium text-gray-300 font-mono tracking-wide backdrop-blur-sm hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-300 transition-all duration-300
html = html.replace(/bg-gray-600\/50 text-gray-300 px-4 py-2 rounded-full text-sm font-medium/g, 'inline-flex items-center px-4 py-2 bg-gray-700/40 border border-gray-600/50 rounded-full text-sm font-medium text-gray-300 font-mono tracking-wide backdrop-blur-sm hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-300 transition-all duration-300');

fs.writeFileSync(indexPath, html);
console.log("Updated chips and inner cards!");
