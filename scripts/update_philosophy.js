const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// The Core Philosophy cards use:
// class="relative md:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700...
html = html.replace(/bg-gray-800 p-6 rounded-xl/g, 'bg-gray-800/40 backdrop-blur-lg p-6 rounded-xl');

// Check for any other bg-gray-800 that isn't glassy yet
// Just in case there are others
html = html.replace(/bg-gray-800 border/g, 'bg-gray-800/40 backdrop-blur-lg border');

fs.writeFileSync(indexPath, html);
console.log("Updated Core Philosophy cards to be glassy!");
