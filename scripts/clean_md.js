const fs = require('fs');
const path = require('path');
const refDir = path.join(__dirname, 'reference');

fs.readdirSync(refDir).forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(refDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Remove the giant inline style on the View Source button
        const regex = /<a href="([^"]+)" target="_blank" style="[^"]+" onmouseover="[^"]+" onmouseout="[^"]+">/g;
        const newContent = content.replace(regex, '<a href="$1" target="_blank">');
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Cleaned ${file}`);
        }
    }
});
