const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const projects = [
    {
        title: "PieceTable (Text Editor Backend)",
        category: "Systems Engineering",
        link: "projects/piecetable.html",
        chips: ["C++17", "POSIX Threads", "Piece Table", "Thompson NFA", "Makefile", "ASan/UBSan"],
        bullets: [
            "Engineered a zero-dependency Piece Table text storage engine in C++17, benchmarking O(1) amortized inserts against a custom Gap Buffer across 50,000-operation stress tests to prove out the design under real workloads.",
            "Built a Thompson NFA regex engine guaranteeing O(|pattern|×|text|) worst-case matching with zero catastrophic backtracking, validated by 50/50 passing tests under ASan/UBSan with no memory-safety violations."
        ]
    },
    {
        title: "ZapMail (Background Jobs)",
        category: "Distributed Systems",
        link: "projects/zapmail.html",
        chips: ["Ruby on Rails 8", "PostgreSQL", "Redis", "Sidekiq", "OpenAI GPT-4o", "Hotwire"],
        bullets: [
            "Architected a distributed job-scheduling pipeline on Redis-backed Sidekiq-Cron, diagnosing and eliminating a duplicate-send race condition across campaigns exceeding 5,000 rows.",
            "Designed a fault-tolerant AI copywriting layer with automatic GPT-4o fallback and Slack observability, enforcing ≥90% RSpec/Cucumber coverage gates before any production merge."
        ]
    },
    {
        title: "HowdyAI (LangGraph Agent)",
        category: "Agentic AI Architecture",
        link: "projects/howdyai.html",
        chips: ["Python", "LangGraph", "ChromaDB", "OpenAI GPT-4o", "Brave Search API", "Streamlit"],
        bullets: [
            "Orchestrated a 4-stage LangGraph RAG pipeline with a Chain-of-Verification judge, achieving 100% factual faithfulness and 100% adversarial guardrail success across a 30-query ground-truth benchmark.",
            "Engineered hybrid ChromaDB + Brave Search retrieval with Cross-Encoder re-ranking, lifting Recall@10 from 53% to 86.67% and driving hallucinated claims to zero."
        ]
    },
    {
        title: "My Movies (Streaming App)",
        category: "Offline-First Architecture",
        link: "projects/mymovies.html",
        chips: ["Kotlin", "Hilt", "Room", "ExoPlayer", "TorrentStream", "Retrofit2"],
        bullets: [
            "Designed a cache-as-source-of-truth architecture where every screen renders from Room instead of the network, guaranteeing offline resilience against a rate-limited third-party movie API.",
            "Bridged TorrentStream's sequential piece downloader to ExoPlayer via ExtractorMediaSource, enabling video playback to begin before a multi-gigabyte file finished downloading."
        ]
    },
    {
        title: "Fun Learn (AI Learning App)",
        category: "Mobile Architecture",
        link: "projects/funlearn.html",
        chips: ["Java", "Firebase ML Kit", "Realtime DB", "SQLite", "Glide", "Retrofit2 + RxJava2"],
        bullets: [
            "Authored an on-device OCR handwriting-practice feature using Firebase ML Vision, eliminating network round-trip latency to keep the pass/fail feedback loop instant for child users.",
            "Replaced a stack-overflow-prone recursive flood-fill with a scanline span-queue algorithm, making the custom coloring engine crash-safe across a 20-asset image library."
        ]
    },
    {
        title: "Kaval Arann (Police Dept. App)",
        category: "Mobile Application",
        link: "projects/kavalarann.html",
        chips: ["Kotlin", "MVVM", "Hilt", "Coroutines"],
        bullets: [
            "Engineered crime-reporting modules using MVVM and Coroutines, improving app responsiveness by 50%.",
            "Used app flavoring and Hilt-Dagger for dependency injection, enabling secure, role-specific features."
        ]
    },
    {
        title: "Zombie Shooter",
        category: "Game Systems Deep-Dive",
        link: "projects/zombieshooter.html",
        chips: ["Unity / C#", "Hitscan Combat", "State Machine AI", "Component Architecture"],
        bullets: [
            "Designed hitscan combat using raycasts in Unity to achieve deterministic, cheap-to-compute hit detection instead of simulating physical projectiles for every shot.",
            "Engineered a component-based architecture for game mechanics, seamlessly integrating Unity's physics, AI, and animation systems into scalable gameplay scripts."
        ]
    },
    {
        title: "FunLearn V2",
        category: "Android Systems Deep-Dive",
        link: "projects/funlearnv2.html",
        chips: ["Kotlin", "Hilt DI", "Firebase Dual-Backend", "MVVM Architecture", "Jetpack Navigation"],
        bullets: [
            "Rewrote the app from scratch using Kotlin and a clean MVVM architecture, structurally preventing memory leaks across configuration changes.",
            "Implemented a strict layered architecture with Hilt Dependency Injection, decoupling network and database logic from the UI to scale gracefully."
        ]
    }
];

let projectCardsHtml = '';
projects.forEach((proj, idx) => {
    let chipsHtml = proj.chips.map(chip => 
        `<span class="inline-flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[0.72rem] font-medium text-blue-300 font-mono tracking-wide backdrop-blur-sm transition-all duration-200 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-100">${chip}</span>`
    ).join('\n                                ');

    let bulletsHtml = proj.bullets.map(b => `<li>${b}</li>`).join('\n                            ');

    let delay = idx % 3 === 0 ? '' : ` style="transition-delay: ${idx % 3 * 100}ms;"`;

    projectCardsHtml += `
                    <div class="bg-gray-800/40 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-2 fade-in-up"${delay}>
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="text-xl font-bold text-white">${proj.title}</h3>
                        </div>
                        <p class="text-sm font-semibold text-blue-400 mb-4">${proj.category}</p>
                        <ul class="list-disc list-outside pl-5 space-y-2 text-gray-300 text-sm mb-4 flex-grow">
                            ${bulletsHtml}
                        </ul>
                        <div class="mt-auto flex flex-col gap-4">
                            <div class="flex flex-wrap gap-2">
                                ${chipsHtml}
                            </div>
                            <a href="${proj.link}" class="block w-full text-center border border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 font-medium py-2.5 rounded-lg transition-all duration-300">
                                Read Analysis <i class="fas fa-arrow-right ml-2 text-sm"></i>
                            </a>
                        </div>
                    </div>`;
});

const newProjectsSection = `<section id="projects" class="py-16 bg-gray-900/40 backdrop-blur-xl rounded-xl">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-16 fade-in-up border-b-2 border-blue-500 pb-4 inline-block mx-auto w-auto text-glow">
                    Featured Projects
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
${projectCardsHtml}
                </div>
            </div>
            </section>`;

// Regex to replace the entire projects section and the toy projects
const sectionRegex = /<section id="projects"[\s\S]*?<\/section>/;
html = html.replace(sectionRegex, newProjectsSection);

fs.writeFileSync(indexPath, html);
console.log("Updated projects section!");
