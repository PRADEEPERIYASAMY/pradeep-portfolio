# Open Source & Community

## Delta Force

**Delta Force is the official programming club and central web team at NIT Trichy, supporting major digital initiatives for the institute and wider community.**

Through Delta Force, I contributed to multiple real-world projects that directly serve users—from civic technology platforms to open-source initiatives that teach collaborative development practices.

---

## Kavalan Arann — Public–Police Communication & Incident Reporting Platform

**A real-world civic technology platform developed as a group project by a 10-member team for Tiruchirappalli City Police to enable citizens to report incidents and police to manage/resolve them in real-time.**

Built as a dual-app system: a citizen-facing incident reporting app and a police-facing incident management dashboard, both deployed in production and in active use.

### Technical Architecture & Implementation

**Single-Codebase, Multi-Flavor Architecture (40% Development Effort Reduction)**
- Engineered a **single-codebase, multi-flavor Android architecture** using product flavors + flavor-specific source sets/resources to generate two distinct APKs — a citizen-facing app and a police-facing admin app — from one shared codebase.
- Shared components: core domain models, API client (Retrofit), data layer (Room), business logic.
- Platform-specific: UI, permissions, navigation flows, flavor-specific resource configurations.
- Result: 40% reduction in duplicate development effort and long-term maintenance burden. Bug fixes and feature improvements propagate to both apps automatically.

**Navigation Architecture (15+ Screens, Type-Safe)**
- Designed and implemented navigation using **Android Jetpack Navigation Component** with a single-activity, multi-fragment pattern.
- Implemented Safe Args for type-safe argument passing, shared nav graphs, and shared ViewModels scoped to activity lifecycle.
- Enabled seamless, type-safe transitions across 15+ screens/fragments, reducing navigation-related crashes to near-zero.

**Incident/Theft Reporting Pipeline (End-to-End)**
- **Citizen-side module:** Built end-to-end incident reporting capturing structured data — description, geolocation via FusedLocationProvider + Geocoder, media evidence via CameraX with image/video capture and watermarking.
- **Police-side dashboard:** Implemented real-time report listing, filtering, and status management using RecyclerView adapters and MVVM-driven LiveData/Flow observers.
- Enables police to ingest, triage, and track citizen reports in real-time, with clear operational visibility.

**Offline-First Data Layer**
- Implemented an offline-first persistence layer using **Room** for local caching with a repository pattern.
- Reconciles local drafts with a Retrofit-based REST API, ensuring reports can be composed offline (critical in low-connectivity zones) and synced automatically once network access resumes.
- Handles conflict resolution gracefully when local and remote states diverge.

**Clean Architecture & Testability**
- Adopted **MVVM + Repository pattern** with **Hilt** for dependency injection across API, cache (Room), and DataStore-backed preference layers.
- Decoupled business logic from UI: repositories abstract data sources, ViewModels manage state, fragments handle presentation.
- Result: improved testability and the ability to swap implementations (e.g., mock providers for testing, different API clients for different environments).

**Role-Based Access Control**
- Collaborated to design the app's core domain model (users, reports, comments, roles) supporting role-based access.
- Police accounts: view/manage aggregated public reports, update incident status, track operational workflows.
- Citizen accounts: restricted submission-focused access, track personal reports, receive notifications.
- Enforced at API layer (Retrofit interceptors) and UI layer (explicit role checks in fragments).

### Features

**Citizen App:**
- Report and track lost vehicles and mobile phones
- Submit locked-house notifications  
- Access CNTNS-linked services (national police-networking initiative)
- Find relevant emergency contact information

**Police App:**
- Attendance scheduling and management
- Locked-house alert management  
- Public-report collection and triage
- Real-time operational workflows for citizen requests

### Deployment & Impact

- **Deployed to:** Tiruchirappalli City Police + citizen population
- **Status:** Live and in active use (production deployment)
- **Users:** Police personnel + thousands of residents across Tiruchirappalli

This project taught me how to design role-based systems where public-facing usability and internal operational workflows have very different requirements, and how to architect a shared codebase that serves multiple platforms without compromise.

**Official Mention:** [Delta Force PDF (Page 2)](https://www.nitt.edu/home/students/clubsnassocs/techclubs/delta/Delta.pdf#page=2)

---

## Research Scholars Forum

A university-wide research directory platform for NIT Trichy. I developed core modules for researcher profiles, publication tracking, and cross-institution discovery.

**Technologies:** React, PostgreSQL, Django

---

## Code Character

Developed backend features using Spring Boot to initialize baseline ratings for newly joined players. Additionally, authored C++ matchmaking logic to power the competitive AI bots against human players.

---

## FunLear v2 — Open-Source Learning Platform

As part of **Delta Winter of Code (DWoC)**, I hosted and led development of **FunLear v2**, an open-source learning platform.

### Mentorship & Community Building

I structured the project to be welcoming to first-time open-source contributors while maintaining code quality and architectural standards. Mentees learned:
- Navigating shared codebases and selecting issues appropriate for their skill level
- Version control practices: branching strategies, commit messages, rebase workflows
- Code review culture: giving and receiving constructive feedback
- Transitioning from individual programming to team-based software engineering

This was as much about building a contributor community as shipping code.

---

## Delta Force Mentorship

During **Delta Force induction**, I mentored **24 incoming developers** in practical software engineering foundations:

- **Scalable web and application architecture:** monolithic vs. microservices, layered architecture, API design
- **Code organization:** modular design, separation of concerns, reusable components
- **Git-based collaboration:** branching strategies, code review, merge conflicts, commit hygiene
- **Debugging and profiling:** reading stack traces, using debuggers, profiling tools
- **Code review standards:** constructive feedback, catching bugs early, enforcing team norms
- **High engineering standards:** testability, maintainability, defensive programming

The goal: help transition new members from writing individual programs to contributing effectively in collaborative, professional software-engineering environments.

---

## Summary

Through Delta Force, I've contributed to real-world civic technology platforms, mentored dozens of developers in collaborative software practices, and helped build a community culture around open-source contribution. This experience shaped how I think about designing systems that serve diverse users, maintaining code quality at scale, and teaching others to become better engineers.
