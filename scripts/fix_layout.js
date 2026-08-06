const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

html = html.split('<div class="flex flex-wrap gap-2 mt-auto mb-4">').join('<div class="mt-auto w-full">\\n                        <div class="flex flex-wrap gap-2 mb-4">');

html = html.split('Read Analysis <i class="fas fa-arrow-right ml-2 text-sm"></i>\\n                        </a>').join('Read Analysis <i class="fas fa-arrow-right ml-2 text-sm"></i>\\n                        </a>\\n                    </div>');

fs.writeFileSync(indexPath, html);
console.log("Fixed index.html layout");
