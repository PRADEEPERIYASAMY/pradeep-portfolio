const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const tamuReplacement = `<div class="bg-gray-800/40 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-2 flex flex-col sm:flex-row gap-5 items-start">
                            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-900/60 rounded-xl p-2.5 flex items-center justify-center flex-shrink-0 border border-gray-700 shadow-inner">
                                <img src="https://files.marcomm.tamu.edu/marcomm/2024/05/23180154/TAM-Stacked-AllWhite-2.png" alt="Texas A&M University Logo" class="max-w-full max-h-full object-contain">
                            </div>
                            <div class="flex-grow w-full">
                                <div class="flex flex-wrap justify-between items-start">
                                    <h3 class="text-2xl font-bold text-white mb-1">Texas A&M University</h3>
                                    <span class="text-sm text-gray-400 mt-1">College Station, TX</span>
                                </div>
                                <p class="text-lg font-semibold text-blue-400 mb-2">Master of Computer Science</p>
                                <p class="text-sm text-gray-400 mb-3">Aug 2025 - May 2027 | GPA: 3.83/4.0</p>
                                <p class="text-sm text-gray-300 leading-relaxed"><strong>Coursework:</strong> Analysis of Algorithms, Software Engineering, Artificial Intelligence</p>
                            </div>
                        </div>`;

const nittReplacement = `<div class="bg-gray-800/40 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-2 flex flex-col sm:flex-row gap-5 items-start">
                            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-900/60 rounded-xl p-2.5 flex items-center justify-center flex-shrink-0 border border-gray-700 shadow-inner">
                                <img src="https://www.nitt.edu/home/about/High-Resolution-Emblem.png" alt="National Institute of Technology Logo" class="max-w-full max-h-full object-contain">
                            </div>
                            <div class="flex-grow w-full">
                                <div class="flex flex-wrap justify-between items-start">
                                    <h3 class="text-2xl font-bold text-white mb-1">National Institute of Technology</h3>
                                    <span class="text-sm text-gray-400 mt-1">Tiruchirappalli, India</span>
                                </div>
                                <p class="text-lg font-semibold text-blue-400 mb-2">Bachelor of Technology</p>
                                <p class="text-sm text-gray-400 mb-3">Jul 2019 - May 2023 | CGPA: 8.57/10.0</p>
                                <p class="text-sm text-gray-300 leading-relaxed"><strong>Coursework:</strong> Machine Learning, Web Technology, Software Project Management, Introduction to Programming Language</p>
                            </div>
                        </div>`;

html = html.replace(/<div class="bg-gray-800\/40 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500\/20 hover:-translate-y-2">\s*<div class="flex flex-wrap justify-between items-start">\s*<h3 class="text-2xl font-bold text-white mb-1">Texas A&M University<\/h3>[\s\S]*?<\/div>\s*<\/div>/, tamuReplacement);

html = html.replace(/<div class="bg-gray-800\/40 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500\/20 hover:-translate-y-2">\s*<div class="flex flex-wrap justify-between items-start">\s*<h3 class="text-2xl font-bold text-white mb-1">National Institute of Technology<\/h3>[\s\S]*?<\/div>\s*<\/div>/, nittReplacement);

fs.writeFileSync(indexPath, html);
console.log("Added logos to education cards");
