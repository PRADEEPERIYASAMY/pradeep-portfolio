# Portfolio Content Outline

This document outlines the exact content, structure, and layout of the Pradeep Periyasamy portfolio page (`index.html`).

---

## 1. Hero Section (Home)
*Layout: Centered greeting, large name, dynamic typing effect, followed by quick action buttons and contact links.*

Hi! 👋 I'm
## Pradeep Periyasamy
_[Typing Effect: Software Engineer / AI/ML Enthusiast / System Architect / Full Stack Developer]_

**Action Buttons:**
- [Get in Touch](#contact)
- [RESUME](https://pradeeperiyasamy.github.io/pradeep-portfolio/pradeep_periyasamy_resume.pdf)

**Contact Info:**
- [papradeep11cs@gmail.com](mailto:papradeep11cs@gmail.com)
- [LinkedIn](https://linkedin.com/in/pradeep-periyasamy-b385181a0)
- [GitHub](https://github.com/PRADEEPERIYASAMY)

---

## 2. Core Philosophy (About)
*Layout: A paragraph introduction followed by a grid of numbered cards highlighting core engineering principles, and a row of quick statistics at the bottom.*

**About Me:**
I'm a Master's student in Computer Science at Texas A&M University, driven by a passion for architecting resilient and high-performance systems. For me, it's not just about writing code that works—it's about building systems that are modular, secure, and lightning-fast. I thrive on the challenge of optimizing performance, designing clean APIs, and building scalable microservices from the ground up.

**My Core Philosophy (Cards):**
1. **Architecture:** Modular, layered architecture ensuring maintainability and reusability.
2. **Data Flow:** Efficient API and database interaction with clean request/response handling.
3. **Security:** Input validation, encryption, and auth protocols to protect data and services.
4. **Performance:** Optimized queries, caching, and async processes for lightning-fast execution.
5. **Testing:** Comprehensive unit and integration testing to ensure bulletproof logic.
6. **Scalability:** Designing systems that handle high traffic and data volume without bottlenecks.

**Quick Stats:**
- **3+ Years** Professional Experience
- **20+ Projects** Built from Scratch
- **1000+ Hours** Problem Solving
- **80% Focus** on Scalability & Performance

---

## 3. Experience
*Layout: A vertical interactive timeline of professional roles and internships. Clicking on an entry expands it to show detailed bullet points and technologies used.*

### Software Development Engineer
**Optmyzr** | *Jun 2023 - Aug 2025* | Hyderabad, India
- Architected distributed GraphQL query layer reducing dashboard load times from 10–30 min → <1 sec (60–180× improvement); pivoted MongoDB → DuckDB mid-project when performance hit a wall.
- Engineered custom HotChocolate provider parsing GraphQL requests into native DuckDB SQL, eliminating 99% redundant API calls across fragmented team-specific fetching scripts.
- Evolved multi-account dashboard prototype into production system using Redis distributed locks for cache invalidation, decoupling frontend from platform-specific REST models via GraphQL schema.
- Implemented data ingestion pipeline unifying Google, Bing, Amazon API data into Parquet format on S3, supporting analytics on 10M+ rows with currency normalization across multi-currency portfolios.
- Led cross-platform metric unification effort establishing single source of truth for ROAS, CPA, impression volume across all ad platforms; mentored team, conducted KT sessions on GraphQL infrastructure.
- Designed centralized email consolidation engine reducing enterprise email volume by 99% (15,000+ → 1 digest/day) using distributed Redis locks and state machines for async reliability.
- Shipped AI summarization feature using context-injection layer to prevent LLM hallucinations, reducing Rule Engine support tickets by 90% and enabling customer self-serve analysis.
- Built rule recommendation system (trending/most-used tags) with zero database overhead — all computation in daily cron job, frontend reads precomputed S3 JSON, zero impact on scale.
- Architected many-to-many bulk scheduling system enabling clients to deploy strategies across hundreds of accounts in one click; discovered and fixed critical hidden scalability bug via stress testing.
- Launched telemetry tool logging user actions across three independent surfaces (.NET, PHP, React) with automatic 6-month retention, powering data-driven product decisions and seasonal trend analysis.

### Full Stack Web Developer Intern
**Indian Institute of Technology, Delhi** | *Dec 2022 - Jun 2023*
- Architected and shipped B-Reporter web platform (React.js, Next.js, MySQL) enabling university-wide collaborative reporting with commenting, tag-based post suggestions, and responsive UI — deployed across IIT Delhi.
- Designed tag-based recommendation system leveraging user engagement patterns to surface relevant posts without explicit search, improving content discoverability and user retention.
- Implemented real-time commenting system with nested replies, user mentions, and activity feeds using React state management and MySQL transactions for consistency.
- Built responsive UI with mobile-first design (CSS Grid, Flexbox) ensuring accessibility across 375px–1920px viewports; optimized load time to <2 sec on 3G networks.
- Engineered data pipeline normalizing user-generated content and metadata into relational schema, supporting 1000+ concurrent users without performance degradation.
- Led frontend architecture decisions (component composition, state management patterns) establishing best practices adopted by subsequent development batches.

### Software Developer Intern
**Optmyzr** | *May 2022 - Jul 2022*
- Architected .NET data-caching service reducing redundant Bing Ads API calls by 97%, eliminating per-team duplicate fetch logic and unifying data retrieval across platform.
- Integrated 43 Bing Ads widgets via async pipelines, achieving 95% feature parity with existing Google Ads platform while maintaining zero performance regression on dashboard load times.
- Engineered async/await patterns handling millions of daily widget impressions without database saturation; optimized connection pooling and batch processing for throughput at scale.
- Designed data persistence layer with intelligent TTL-based cache invalidation, ensuring stale data didn't block new API updates while minimizing redundant API round-trips.
- Implemented comprehensive integration tests covering edge cases (API timeouts, partial failures, concurrent requests) ensuring 99.5% uptime during production launch.
- Shipped feature within 10-week internship sprint with zero critical incidents; results directly influenced platform's multi-platform architecture roadmap for subsequent years.

### Full Stack Developer Intern
**Infigon Futures** | *Jun 2021 - Aug 2021*
- Built full-stack website from scratch using React, TypeScript, Redux, Firebase, and Docker; deployed containerized application achieving <1 sec load time and mobile-responsive design across all devices.
- Designed Redux state management architecture handling complex user workflows, enabling predictable state transitions and maintainable component composition across 15+ pages.
- Integrated Firebase authentication, real-time database, and hosting, implementing OAuth login flows and Firestore data synchronization supporting concurrent user sessions.
- Led 4-member web development team through 8-week sprint; conducted code reviews ensuring TypeScript best practices, organized KT sessions on component patterns, and unblocked team members on technical blockers.
- Established Git workflow (feature branches, squash commits, CI pre-checks) and linting standards using ESLint/Prettier, improving code quality and reducing merge conflicts.
- Shipped production website with zero critical bugs; stakeholders adopted platform for internal operations, validating architecture and UX decisions established during internship.

### Full Stack Android App Developer Intern
**Indian Institute of Technology, Delhi** | *Jun 2021 - Jul 2021*
- Developed the "B-Reporter" Android application from scratch using Kotlin, MVVM, and Node.js backend.
- Successfully launched the first version of the application on the Play Store.

### Mentor & Developer
**Delta Force (NIT Trichy)** | *Aug 2020 - Jul 2021*
- Mentored 24 developers, teaching scalable app/web architectures.
- Constructed core modules for Research Scholars Forum and Code Character, deployed university-wide.

---

## 4. Projects
*Layout: A responsive grid of project cards showcasing thumbnails, brief descriptions, and technology tags. Clicking a card opens a detailed modal with comprehensive technical information.*

- **PieceTable Editor:** A high-performance terminal text editor written from scratch in modern C++17, featuring zero external dependencies, robust memory management, and 50+ passing unit tests.
- **HowdyAI:** Graph-Based RAG Educational Assistant using Python, LangGraph, and ChromaDB.
- **MyMovies:** Modern Android streaming client with offline caching and BitTorrent playback using Kotlin, MVVM, and Hilt.
- **FunlearnV2:** Educational Android app rewrite featuring MLKit OCR and Room DB.
- **FunLearn:** Initial Android educational application using Java and Firebase.
- **Zombie Shooter:** Unity FPS case study highlighting 3D mechanics and C# scripting.
- **CPP DSA Practice:** 1,000+ Data Structure and Algorithm problems solved in C++.
- **ZapMail:** Intelligent bulk email automation platform for universities using Ruby on Rails and OpenAI.

*(Detailed project content is stored dynamically in the `projects/` directory HTML files).*

---

## 5. Skills
*Layout: Categorized sections (Languages, Frameworks, Tools) populated with visual pill/tags for each skill.*

**Languages:** 
- C++ (Expert)
- Kotlin / Java
- Python
- C# / .NET
- Ruby
- JavaScript / TypeScript
- SQL

**Frameworks & Libraries:** 
- React.js / Next.js
- Android (MVVM, Room, Hilt)
- Django / FastAPI / Flask
- Spring Boot
- Ruby on Rails / HotChocolate
- Tailwind CSS

**Databases & Tools:** 
- PostgreSQL / MySQL
- DuckDB / MongoDB
- Git / GitHub Actions (CI/CD)
- Docker
- AWS (S3, ECR) / Firebase
- Redis / ChromaDB
- LangChain / LangGraph

---

## 6. Education
*Layout: Large horizontal cards for each degree, showing university logos on the left and details/coursework on the right.*

### Texas A&M University
**College Station, TX**
- **Master of Computer Science**
- *Aug 2025 - May 2027* | GPA: 3.83/4.0
- **Coursework:** Distributed Systems & Cloud Computing, Analysis of Algorithms, Deep Learning, Operating Systems, Artificial Intelligence, Information Storage & Retrieval, Network Security, Software Engineering.

### National Institute of Technology
**Tiruchirappalli, India**
- **Bachelor of Technology (First Class with Distinction)**
- *Jul 2019 - May 2023* | CGPA: 8.57/10.0
- **Coursework:** Machine Learning, Web Technology, Introduction to Programming Language, Software Project Management.

---

## 7. Contact (Footer)
*Layout: Centered call-to-action with a brief statement, followed by flex-wrapped social links and email buttons.*

**Get In Touch**
I'm actively exploring opportunities across Software Engineering, AI/ML, Data Engineering, Distributed Systems, and Cloud Infrastructure.
I respond to relevant opportunities within 24 hours.

[Email](mailto:papradeep11cs@gmail.com) [LinkedIn](https://linkedin.com/in/pradeep-periyasamy-b385181a0) [GitHub](https://github.com/PRADEEPERIYASAMY)

*© 2026 Pradeep Periyasamy. All rights reserved.*