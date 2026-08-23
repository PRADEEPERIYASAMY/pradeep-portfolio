# FunlearnV2

[![Platform](https://img.shields.io/badge/platform-Android-3DDC84?style=flat-square&logo=android&logoColor=white)](https://developer.android.com)
[![Language](https://img.shields.io/badge/language-Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white)](https://kotlinlang.org)
[![Kotlin Version](https://img.shields.io/badge/kotlin-1.4.21-7F52FF?style=flat-square&logo=kotlin&logoColor=white)](https://github.com/JetBrains/kotlin/releases/tag/v1.4.21)
[![Min SDK](https://img.shields.io/badge/minSdk-23-informational?style=flat-square)](https://developer.android.com/studio/releases/platforms)
[![Target SDK](https://img.shields.io/badge/targetSdk-30-informational?style=flat-square)](https://developer.android.com/studio/releases/platforms)
[![Firebase](https://img.shields.io/badge/backend-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Hilt](https://img.shields.io/badge/DI-Hilt-3DDC84?style=flat-square)](https://dagger.dev/hilt)
[![Gradle](https://img.shields.io/badge/build-Gradle-02303A?style=flat-square&logo=gradle&logoColor=white)](https://gradle.org)
[![MLKit](https://img.shields.io/badge/ML-MLKit%20OCR-4285F4?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/ml-kit)
[![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

**FunlearnV2** is a from-scratch Kotlin rebuild of the original [FunLearn](https://github.com/PRADEEPERIYASAMY/FunLearn): a two-sided (parent/child) Android learning platform covering tutorials, quizzes, handwriting OCR, a custom coloring engine, and public/private/group chat, built on a dual Firebase backend (Firestore + Realtime Database) with Hilt-driven dependency injection.

Where V1 proved the product concept end-to-end as a solo build, V2 is a deliberate architecture upgrade: DI, a layered repository/ViewModel structure, typed local storage, and role-based navigation replacing V1's single-Activity-per-screen model. The core data layer, auth/role system, chat, and coloring engine are wired and working; several game and quiz screens are still stubs pending the full migration. See [Roadmap](#6-roadmap).

## Table of Contents

1. [What Changed from V1](#1-what-changed-from-v1)
2. [System Architecture](#2-system-architecture)
3. [Extended Architecture](#3-extended-architecture)
4. [Tech Stack](#4-tech-stack)
5. [Feature Notes](#5-feature-notes)
   - [User Journeys](#user-journeys)
   - [3.1 Roles: Parent, Child & Authentication](#31-roles-parent-child--authentication)
   - [3.2 Coloring Engine — Flood Fill](#32-coloring-engine--flood-fill)
   - [3.3 Chat — Public, Private & Group](#33-chat--public-private--group)
   - [3.4 Quiz, Classroom & Resources](#34-quiz-classroom--resources)
   - [3.5 Local State — DataStore](#35-local-state--datastore)
   - [Enums Reference](#enums-reference)
6. [Module Reference](#6-module-reference)
7. [Roadmap](#7-roadmap)
8. [Getting Started](#8-getting-started)
9. [Firebase Setup](#9-firebase-setup)
10. [Local Development Guide](#10-local-development-guide)
11. [Contributing & Community](#11-contributing--community)

## Asset Preview

Static art assets from `res/drawable/`.

<table>
<tr>
<td align="center"><img src="https://raw.githubusercontent.com/PRADEEPERIYASAMY/funlearn_app/main/app/src/main/res/drawable/xo_grid.png" width="180"/><br/><sub>Tic-Tac-Toe game board asset</sub></td>
<td align="center"><img src="https://raw.githubusercontent.com/PRADEEPERIYASAMY/funlearn_app/main/app/src/main/res/drawable/xo_back.png" width="180"/><br/><sub>Game background</sub></td>
<td align="center">
<img src="https://raw.githubusercontent.com/PRADEEPERIYASAMY/funlearn_app/main/app/src/main/res/drawable/chess_king_white.png" width="70"/>
<img src="https://raw.githubusercontent.com/PRADEEPERIYASAMY/funlearn_app/main/app/src/main/res/drawable/chess_queen_black.png" width="70"/>
<img src="https://raw.githubusercontent.com/PRADEEPERIYASAMY/funlearn_app/main/app/src/main/res/drawable/chess_rook_white.png" width="70"/>
<br/><sub>Chess piece set (GameFourFragment)</sub></td>
</tr>
</table>

## Origin

FunlearnV2 began as a proposed project for **Delta Winter of Code (DWoC)**, an initiative run by [Delta](https://delta.nitt.edu), NIT Trichy's software development club, to get students contributing to real, ongoing codebases in the open-source model. Turnout that cycle was light (this was during COVID) so I took the project forward independently and used the opportunity to scope it well beyond the original: Hilt for DI, a backend split between Firestore and Realtime Database by access pattern, typed DataStore in place of raw SQLite, and a role-scoped navigation model built around 4 host Activities instead of 42 flat ones.

## 1. What Changed from V1

| Concern | FunLearn V1 | FunlearnV2 | Why it matters |
|---|---|---|---|
| Language | Java | Kotlin, full rewrite | Coroutines/Flow-native repository layer |
| Navigation | 42 Activities, `Intent`-extra passing | 4 host Activities + Fragments, Navigation Component + Safe Args | Type-safe transitions, shared back-stack handling per role |
| Dependency management | Manual wiring | Hilt across ViewModels, repositories, Firebase sources (`FirebaseModules.kt`) | Testable, swappable dependencies |
| Backend | Realtime DB only | Realtime DB for presence/light data + Firestore for structured, queryable collections (chat, classes, quizzes, orders) | Firestore's query model fits chat/classroom/quiz data better than flat key lookups |
| Local storage | Raw `SQLiteOpenHelper` | Jetpack DataStore (`DataStoreRepository.kt`), coroutine-native typed preferences | Cleaner reads/writes, no manual cursor handling |
| Account model | No parent/child distinction | Explicit `Roles` enum + separate `ParentActivity`/`ChildActivity` entry points, phone-verified parent accounts | Matches how the product is actually used |
| Async | RxJava2 | Kotlin Coroutines + `kotlinx-coroutines-play-services`, `Flow`-based repositories | Idiomatic Kotlin, sealed `viewmodels/actions` state contracts |
| Image loading | Glide + Picasso both present | Glide only | One dependency, one caching behavior |

## 2. System Architecture

```mermaid
flowchart TD
    subgraph UI["UI Layer"]
        A1[AuthenticationActivity]
        A2[ParentActivity]
        A3[ChildActivity]
        F[Fragments / Adapters / Widgets]
    end

    subgraph VM["ViewModel Layer"]
        V1[FireStoreViewModel]
        V2[FirebaseDbViewModel]
        V3[BaseViewModel]
    end

    subgraph REPO["Repository Layer"]
        R1[FireStoreRepository]
        R2[FirebaseDbRepository]
        R3[DataStoreRepository]
    end

    subgraph SRC["Data Source Layer"]
        S1[FireStoreSource]
        S2[FirebaseDbSource]
    end

    subgraph DI["Hilt DI — FirebaseModules.kt"]
        M1[FirebaseAuth]
        M2[FirebaseFirestore]
        M3[FirebaseDatabase]
    end

    subgraph BACK["External Services"]
        B1[(Firestore)]
        B2[(Realtime Database)]
        B3[(Firebase Auth)]
        B4[(DataStore — on device)]
    end

    A1 & A2 & A3 --> F
    F --> V1 & V2
    V1 --> R1
    V2 --> R2
    V1 & V2 --> R3
    R1 --> S1
    R2 --> S2
    S1 --> M2
    S2 --> M3
    A1 --> M1
    M1 --> B3
    M2 --> B1
    M3 --> B2
    R3 --> B4

    classDef uiNode fill:#3DDC84,stroke:#2ba86a,color:#000,font-weight:bold
    classDef vmNode fill:#7F52FF,stroke:#5a3adb,color:#fff,font-weight:bold
    classDef repoNode fill:#4285F4,stroke:#2c6fd1,color:#fff
    classDef srcNode fill:#FF7043,stroke:#d84315,color:#fff
    classDef diNode fill:#FFCA28,stroke:#f9a825,color:#000
    classDef fbNode fill:#FFA000,stroke:#e65100,color:#000
    classDef localNode fill:#26A69A,stroke:#00796B,color:#fff

    class A1,A2,A3,F uiNode
    class V1,V2,V3 vmNode
    class R1,R2,R3 repoNode
    class S1,S2 srcNode
    class M1,M2,M3 diNode
    class B1,B2,B3 fbNode
    class B4 localNode

    style UI fill:#e8f5e9,stroke:#3DDC84
    style VM fill:#ede7f6,stroke:#7F52FF
    style REPO fill:#e3f2fd,stroke:#4285F4
    style SRC fill:#fbe9e7,stroke:#FF7043
    style DI fill:#fff8e1,stroke:#FFCA28
    style BACK fill:#fff3e0,stroke:#FFA000
```

---

```mermaid
flowchart LR
    subgraph AUTH["AuthenticationActivity"]
        direction TB
        SP[SplashFragment]
        WE[WelcomeFragment]
        GS[GetStartedFragment]
        UT[UserTypeFragment]
        SI[SignInFragment]
        SU[SignUpFragment]
        PV[PhoneVerificationFragment]
        SP --> WE --> GS --> UT
        UT --> SI & SU
        SU --> PV
    end

    subgraph PARENT["ParentActivity"]
        direction TB
        PDB[ParentDashBoardFragment]
        PPV[ParentVerificationFragment]
        PPRO[ProfileFragment]
        PSET[SettingFragment]
        PNOT[NotificationFragment]
        PCHAT[CommonChatFragment]
        PDB --> PPV & PPRO & PSET & PNOT & PCHAT
    end

    subgraph CHILD["ChildActivity"]
        direction TB
        DB[DashBoardFragment]
        FO[FunOptionsFragment]
        LRN[LearnFragment]
        GAMES[GamesFragment]
        CLR["ColouringOne/Two/ThreeFragment"]
        CLS[ClassTypeFragment]
        CHAT[CommonChatFragment]
        PRO[ProfileFragment]
        DB --> FO
        FO --> LRN & GAMES & CLR & CLS & CHAT & PRO
    end

    AUTH -->|"role = PARENT"| PARENT
    AUTH -->|"role = CHILD"| CHILD

    classDef authFrag fill:#EF5350,stroke:#b71c1c,color:#fff
    classDef parentFrag fill:#7F52FF,stroke:#5a3adb,color:#fff
    classDef childFrag fill:#3DDC84,stroke:#2ba86a,color:#000

    class SP,WE,GS,UT,SI,SU,PV authFrag
    class PDB,PPV,PPRO,PSET,PNOT,PCHAT parentFrag
    class DB,FO,LRN,GAMES,CLR,CLS,CHAT,PRO childFrag

    style AUTH fill:#fce4ec,stroke:#EF5350
    style PARENT fill:#ede7f6,stroke:#7F52FF
    style CHILD fill:#e8f5e9,stroke:#3DDC84
```

---

**Data split:** Firestore holds structured content and social data that benefits from querying (`Users`, `Messages`, `ClassRoom`, `Questions`, `Requests`, `Orders`); Realtime Database is reserved for lightweight, frequently-updated key/value data such as online presence. DataStore replaces the old SQLite `Level` table as the local cache for profile fields, score, and cash so the UI has something to render immediately while Firestore/RTDB catch up.

**DI:** `FirebaseModules.kt` provides `FirebaseAuth`, `FirebaseFirestore`, and `FirebaseDatabase` instances via Hilt; repositories and ViewModels (`FireStoreViewModel`, `FirebaseDbViewModel`, `BaseViewModel`) receive them by constructor injection rather than constructing clients themselves.

## 3. Extended Architecture

This document describes the architectural decisions in FunlearnV2 in more detail than the README overview. It is intended as a reference for contributors and as a record of why the system is structured the way it is.

### Background

FunlearnV2 is a from-scratch Kotlin rewrite of [FunLearn V1](https://github.com/PRADEEPERIYASAMY/FunLearn), a Java Android app. V1 proved the feature set end-to-end but accumulated structural debt typical of a first solo build: 42 Activities, no DI, dual image-loading libraries, raw SQLite, and RxJava mixed with ad-hoc threading. V2 is a deliberate structural reset that keeps the same features while replacing the scaffolding.

### Layers

```
UI (Activities / Fragments / Adapters / Widgets)
        ↕  observes / calls
ViewModels (FireStoreViewModel, FirebaseDbViewModel, BaseViewModel)
        ↕  injected via Hilt
Repositories (FireStoreRepository, FirebaseDbRepository, DataStoreRepository)
        ↕  injected via Hilt
Data Sources (FireStoreSource, FirebaseDbSource)  +  Local (DataStore)
        ↕
Firebase (Firestore, Realtime Database, Auth)  +  On-device (DataStore Preferences)
```

Each layer has a single responsibility. No layer reaches past its immediate neighbour. ViewModels never hold a reference to a `Context`. Fragments never call Firebase directly.

### Entry Points

The app has four Activity-level entry points, all gated by authentication state:

| Activity | Role | Hosted Fragments |
|----------|------|-----------------|
| `AuthenticationActivity` | Unauthenticated launcher | `SignInFragment`, `SignUpFragment`, `UserTypeFragment` |
| `ParentActivity` | Authenticated, role = PARENT | `ParentDashBoardFragment`, `ParentVerificationFragment`, settings, chat |
| `ChildActivity` | Authenticated, role = CHILD | `DashBoardFragment`, games, tutorials, coloring, chat, quiz |
| `BaseActivity` | Shared base | Not navigated to directly — provides common setup |

`AuthenticationActivity` writes a `Users` document with a `Roles` enum (`PARENT` or `CHILD`) on signup, then routes to the appropriate host Activity. The `Roles` enum is the single decision point for all role-based routing.

### Dependency Injection

```mermaid
classDiagram
    class HiltAndroidApp {
        +FunLearnApplication
    }

    class FirebaseModules {
        +provideFirebaseAuth() FirebaseAuth
        +provideFirestore() FirebaseFirestore
        +provideFirebaseDatabase() FirebaseDatabase
    }

    class FirebaseAuth
    class FirebaseFirestore
    class FirebaseDatabase

    class FireStoreSource {
        -FirebaseAuth auth
        -FirebaseFirestore firestore
    }

    class FirebaseDbSource {
        -FirebaseDatabase database
    }

    class FireStoreRepository {
        -FireStoreSource source
    }

    class FirebaseDbRepository {
        -FirebaseDbSource source
    }

    class DataStoreRepository {
        -ResourceProvider resourceProvider
    }

    class ResourceProvider {
        -DataStore preferences
    }

    class FireStoreViewModel {
        -FireStoreRepository repo
        -DataStoreRepository dataStore
    }

    class FirebaseDbViewModel {
        -FirebaseDbRepository repo
    }

    class BaseViewModel {
        -DataStoreRepository dataStore
    }

    FirebaseModules ..> FirebaseAuth : provides
    FirebaseModules ..> FirebaseFirestore : provides
    FirebaseModules ..> FirebaseDatabase : provides
    FirebaseAuth --> FireStoreSource
    FirebaseFirestore --> FireStoreSource
    FirebaseDatabase --> FirebaseDbSource
    FireStoreSource --> FireStoreRepository
    FirebaseDbSource --> FirebaseDbRepository
    ResourceProvider --> DataStoreRepository
    FireStoreRepository --> FireStoreViewModel
    DataStoreRepository --> FireStoreViewModel
    FirebaseDbRepository --> FirebaseDbViewModel
    DataStoreRepository --> BaseViewModel
    HiltAndroidApp --> FirebaseModules

    style HiltAndroidApp fill:#3DDC84,stroke:#2ba86a,color:#000
    style FirebaseModules fill:#FFCA28,stroke:#f9a825,color:#000
    style FirebaseAuth fill:#FFA000,stroke:#e65100,color:#000
    style FirebaseFirestore fill:#FFA000,stroke:#e65100,color:#000
    style FirebaseDatabase fill:#FFA000,stroke:#e65100,color:#000
    style FireStoreSource fill:#FF7043,stroke:#d84315,color:#fff
    style FirebaseDbSource fill:#FF7043,stroke:#d84315,color:#fff
    style FireStoreRepository fill:#4285F4,stroke:#2c6fd1,color:#fff
    style FirebaseDbRepository fill:#4285F4,stroke:#2c6fd1,color:#fff
    style DataStoreRepository fill:#26A69A,stroke:#00796B,color:#fff
    style ResourceProvider fill:#26A69A,stroke:#00796B,color:#fff
    style FireStoreViewModel fill:#7F52FF,stroke:#5a3adb,color:#fff
    style FirebaseDbViewModel fill:#7F52FF,stroke:#5a3adb,color:#fff
    style BaseViewModel fill:#7F52FF,stroke:#5a3adb,color:#fff
```

---

Hilt is the DI framework. `FirebaseModules.kt` is the only place Firebase client instances are constructed:

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object FirebaseModules {
    @Provides @Singleton fun provideFirebaseAuth(): FirebaseAuth = FirebaseAuth.getInstance()
    @Provides @Singleton fun provideFirestore(): FirebaseFirestore = FirebaseFirestore.getInstance()
    @Provides @Singleton fun provideFirebaseDatabase(): FirebaseDatabase = FirebaseDatabase.getInstance()
}
```

Repositories receive these instances by constructor injection. ViewModels receive repositories by constructor injection via `@HiltViewModel`. No component constructs its own dependencies.

### Firebase Backend Split

```mermaid
flowchart TD
    DATA([Application Data])
    Q1{Needs structured\nqueries or ordering?}
    Q2{Changes very\nfrequently or low-latency?}
    Q3{User-specific\nlocal cache?}

    FS[(Firestore)]
    RTDB[(Realtime Database)]
    DS[(DataStore on device)]

    FS1[Users profiles and roles]
    FS2[Messages / Comments / Reactions]
    FS3[Requests / GroupDetails]
    FS4[ClassRoom / ClassResource]
    FS5[Questions / QuizResult]
    FS6[Products / Orders]
    FS7[Notifications / Queries / Stats]

    RT1[Online presence indicators]
    RT2[AlphabetImagesAndNames]
    RT3[AlphabetWords / Phrases]
    RT4[Match data / OperatorImages]

    DS1[child and parent profile fields]
    DS2[account credentials cache]
    DS3[score and cash]

    DATA --> Q1
    Q1 -->|Yes| FS
    Q1 -->|No| Q2
    Q2 -->|Yes| RTDB
    Q2 -->|No| Q3
    Q3 -->|Yes| DS
    Q3 -->|No| FS

    FS --> FS1 & FS2 & FS3 & FS4 & FS5 & FS6 & FS7
    RTDB --> RT1 & RT2 & RT3 & RT4
    DS --> DS1 & DS2 & DS3

    classDef dataNode fill:#4285F4,stroke:#2c6fd1,color:#fff,font-weight:bold
    classDef decision fill:#78909C,stroke:#455A64,color:#fff
    classDef firestoreDB fill:#FFA000,stroke:#e65100,color:#000,font-weight:bold
    classDef rtdbDB fill:#FF7043,stroke:#d84315,color:#fff,font-weight:bold
    classDef dsDB fill:#26A69A,stroke:#00796B,color:#fff,font-weight:bold
    classDef fsLeaf fill:#FFE0B2,stroke:#FFA000,color:#000
    classDef rtLeaf fill:#FBE9E7,stroke:#FF7043,color:#000
    classDef dsLeaf fill:#E0F2F1,stroke:#26A69A,color:#000

    class DATA dataNode
    class Q1,Q2,Q3 decision
    class FS firestoreDB
    class RTDB rtdbDB
    class DS dsDB
    class FS1,FS2,FS3,FS4,FS5,FS6,FS7 fsLeaf
    class RT1,RT2,RT3,RT4 rtLeaf
    class DS1,DS2,DS3 dsLeaf
```

---

Two Firebase services are used intentionally for different data patterns:

#### Firestore (structured, queryable)

```mermaid
classDiagram
    class Users {
        +String id
        +String child_name
        +String child_grade
        +String child_profile_image
        +String child_online
        +String child_online_visibility
        +String child_mail
        +String child_dob
        +String child_gender
        +String child_description
        +String parent_name
        +String parent_dob
        +String parent_gender
        +String parent_grade
        +String parent_online
        +String parent_online_visibility
        +String parent_profile_image
        +String parent_mail
        +String account_mail
        +String account_password
        +String mobile_number
        +String address
        +GeoPoint geoPoint
        +Long score
        +Long cash
        +Roles role
    }

    class Messages {
        +String id
        +String from
        +String to
        +String message_content
        +String message_description
        +Timestamp timeStamp
        +Roles role
        +Mode mode
        +MessageTypes message_type
        +ArrayList deleted_by
    }

    class Comments {
        +String id
        +String message_id
        +String from
        +String from_name
        +String comment
        +Timestamp timeStamp
    }

    class Reactions {
        +String message_id
        +String user_id
        +String reaction
    }

    class Requests {
        +String from_id
        +String from_name
        +String to_id
        +String to_name
        +Status status
        +FieldValue timeStamp
    }

    class GroupDetails {
        +String id
        +String group_name
        +String group_description
        +Mode mode
        +ArrayList members
        +FieldValue timeStamp
    }

    class ClassRoom {
        +String id
        +String name
        +String image
        +String meet_url
        +String teacher_name
        +String teacher_id
        +String description
        +String timeStamp
    }

    class ClassResource {
        +String id
        +String class_id
        +String name
        +String image
        +String url
        +String duration
        +String pages
        +String author_name
        +String author_id
        +Resource type
        +FieldValue timeStamp
    }

    class Questions {
        +String resource_id
        +String question
        +String option_A
        +String option_b
        +String option_c
        +String option_D
        +String Answer
    }

    class QuizResult {
        +String quiz_id
        +String user_id
        +String score
        +String attempted
        +String un_attempted
        +String wrong
        +FieldValue timeStamp
    }

    class Products {
        +String id
        +String name
        +String price
        +String description
        +String images
    }

    class Orders {
        +String by_id
        +String by_name
        +String product_id
        +String name
        +String address
        +String description
        +String images
        +OrderStatus status
    }

    class Stats {
        +String user_id
        +ArrayList score
        +ArrayList cash
    }

    class Notifications {
        +String message_description
        +String mode
        +String to_id
        +ArrayList deleted_by
        +FieldValue timeStamp
    }

    class Queries {
        +String message_description
        +String from_id
        +String from_name
        +FieldValue timeStamp
    }

    Users "1" --> "0..*" Messages : sends
    Users "1" --> "0..*" Stats : tracked in
    Users "1" --> "0..*" Orders : places
    Messages "1" --> "0..*" Comments : has
    Messages "1" --> "0..*" Reactions : receives
    Users "1" --> "0..*" Requests : sends/receives
    GroupDetails "1" --> "0..*" Messages : groups
    ClassRoom "1" --> "0..*" ClassResource : contains
    ClassResource "1" --> "0..*" Questions : has when QUIZ
    Users "1" --> "0..*" QuizResult : records
    Products "1" --> "0..*" Orders : referenced by

    style Users fill:#4285F4,stroke:#2c6fd1,color:#fff
    style Messages fill:#7F52FF,stroke:#5a3adb,color:#fff
    style Comments fill:#9575CD,stroke:#6d44bd,color:#fff
    style Reactions fill:#9575CD,stroke:#6d44bd,color:#fff
    style Requests fill:#FF7043,stroke:#d84315,color:#fff
    style GroupDetails fill:#FF7043,stroke:#d84315,color:#fff
    style ClassRoom fill:#3DDC84,stroke:#2ba86a,color:#000
    style ClassResource fill:#3DDC84,stroke:#2ba86a,color:#000
    style Questions fill:#26A69A,stroke:#00796B,color:#fff
    style QuizResult fill:#26A69A,stroke:#00796B,color:#fff
    style Products fill:#FFCA28,stroke:#f9a825,color:#000
    style Orders fill:#FFA000,stroke:#e65100,color:#000
    style Stats fill:#78909C,stroke:#455A64,color:#fff
    style Notifications fill:#78909C,stroke:#455A64,color:#fff
    style Queries fill:#78909C,stroke:#455A64,color:#fff
```

---

Used for all data that benefits from a query model — compound queries, ordered collections, secondary-key lookups:

- `Users` — user profiles and role data
- `Messages`, `Comments`, `Reactions` — chat
- `Requests`, `GroupDetails` — group chat management
- `ClassRoom`, `Questions`, `QuizResult` — classroom and quiz content
- `Orders` — in-app purchases / rewards

#### Realtime Database (lightweight, low-latency)

```mermaid
classDiagram
    class FirebaseDbModels {
        +AlphabetImagesAndNames alphabetImagesAndNames
        +ArrayList AlphabetPhrases
        +AlphabetWords alphabetWords
        +ListOfAlphabets listOfAlphabets
        +Match match
        +String OperatorImages
    }

    class AlphabetImagesAndNames {
        +ArrayList Images
        +ArrayList Names
    }

    class AlphabetWords {
        +ArrayList Images
        +ArrayList Words
    }

    class ListOfAlphabets {
        +String Words
    }

    class Match {
        +String Images
        +String Names
    }

    FirebaseDbModels --> AlphabetImagesAndNames
    FirebaseDbModels --> AlphabetWords
    FirebaseDbModels --> ListOfAlphabets
    FirebaseDbModels --> Match

    style FirebaseDbModels fill:#FFA000,stroke:#e65100,color:#000,font-weight:bold
    style AlphabetImagesAndNames fill:#FF7043,stroke:#d84315,color:#fff
    style AlphabetWords fill:#FF7043,stroke:#d84315,color:#fff
    style ListOfAlphabets fill:#FF7043,stroke:#d84315,color:#fff
    style Match fill:#FF7043,stroke:#d84315,color:#fff
```

---

Used for data that changes frequently and does not need queries:

- Online presence indicators
- Counters
- Simple key/value flags

The split keeps Firestore costs predictable (fewer reads on frequently-changing data) and keeps the Realtime Database schema flat and fast.

### Local State — DataStore

`DataStoreRepository` wraps a single `androidx.datastore.preferences.DataStore` instance. Every profile field — both parent and child — plus `score` and `cash` is stored as a typed preference. The DataStore is provided by `ResourceProvider` and injected via Hilt.

This replaces V1's raw `SQLiteOpenHelper` `Level` table. The key benefit is coroutine-native access: every field is a `Flow<String>` that can be observed, or read once with `.first()` for suspend-style one-shot access.

**Read path:** UI starts rendering immediately from DataStore. Firestore/RTDB catch up in the background and update the DataStore, which propagates to the UI via Flow.

**Write path:** User action → ViewModel → Repository → Firestore write + DataStore write. The DataStore write ensures the local cache reflects the latest state immediately.

### ViewModel Contracts

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#EDE7F6', 'primaryTextColor': '#1a0050', 'primaryBorderColor': '#7F52FF', 'lineColor': '#37474F', 'secondaryColor': '#E8F5E9', 'secondaryTextColor': '#1b5e20', 'secondaryBorderColor': '#3DDC84', 'tertiaryColor': '#FFF8E1', 'tertiaryTextColor': '#4a3200', 'tertiaryBorderColor': '#FFCA28', 'edgeLabelBackground': '#f5f5f5', 'background': '#ffffff'}}}%%
stateDiagram-v2
    [*] --> Idle

    Idle --> Loading : user action triggers ViewModel call

    Loading --> CreateUser : FireStoreAction.CreateUser
    Loading --> CreateMessage : FireStoreAction.CreateMessage
    Loading --> CreateComment : FireStoreAction.CreateComment
    Loading --> FetchPublicMessages : FireStoreAction.FetchPublicMessages
    Loading --> Error : Firestore exception

    CreateUser --> Idle : Fragment handles result
    CreateMessage --> Idle : Fragment handles result
    CreateComment --> Idle : Fragment handles result
    FetchPublicMessages --> Idle : adapter updated
    Error --> Idle : Fragment shows error UI
```

---

ViewModels expose state via sealed action classes in `viewmodels/actions/`:

- `FireStoreAction` — all Firestore-related states (loading, success variants, error)
- `FirebaseDbAction` — all Realtime Database-related states

Fragments observe a `LiveData<FireStoreAction>` (or `FirebaseDbAction`) and handle each state in a `when` expression. This avoids boolean flags scattered across the Fragment and makes the full set of possible states explicit at compile time.

### Navigation

Each host Activity owns a NavHost. Navigation Component handles Fragment back-stack within a host Activity. There are no cross-Activity Fragment transactions.

Safe Args generates typed argument classes from the navigation graph. No `Bundle` keys are hardcoded as strings anywhere in the Fragment code.

Role-based routing (Parent vs. Child) is done with an explicit `startActivity` call after authentication, not within the Navigation graph. This keeps the four host Activities as hard boundaries.

### Coloring Engine

`FloodFill.kt` is an `object` singleton implementing a scanline span-queue flood-fill algorithm. It operates directly on a `Bitmap`, walking horizontal spans and queuing only the upper and lower boundaries of each span — avoiding the recursive call stack overflow that a naive recursive fill would hit on large bitmaps.

It is shared across three coloring Fragments (`ColouringOneFragment`, `ColouringTwoFragment`, `ColouringThreeFragment`) and the pattern-tracing game (`Patterns.kt`). `PaintView` and `ColorView` are the custom View classes that host the `Bitmap` and forward touch events to `FloodFill`.

### Chat Architecture

Chat uses a single set of Firestore collections with a `Mode` enum to distinguish conversation types:

```kotlin
enum class Mode { PRIVATE, PUBLIC, GROUP }
```

`Messages` documents carry a `mode` field. Queries filter by mode. This avoids parallel collection schemas that would drift independently. `CommonChatFragment` contains shared list and composer logic; `PublicChatFragment`, `PrivateChatFragment`, and `GroupChatFragment` override the parts that differ.

`ChatStatusFragment` handles real-time presence by writing to Realtime Database on foreground/background transitions.

### What V2 Does Not Have Yet

- Unit or integration tests. `FloodFill` and `DataStoreRepository` are the best starting points — both are side-effect-isolated.
- A complete offline-first strategy. DataStore provides an instant-render local cache, but there is no background sync queue for writes made while offline.
- Formal data-ownership documentation for every Firestore collection.
- Feature-complete stub screens (several game and quiz Fragments are navigation-wired but not fully implemented).

See [CHANGELOG.md](../CHANGELOG.md) and the [Roadmap section in the README](../README.md#6-roadmap) for current status.

---

## 4. Tech Stack

| Concern | Choice | Notes |
|---|---|---|
| Language | Kotlin | Full rewrite of the Java V1 codebase |
| DI | Hilt (`hilt-android`, `hilt-compiler`) | Wires Firebase clients, repositories, ViewModels |
| Async | Kotlin Coroutines + `kotlinx-coroutines-play-services` | `Flow`-based repository layer (`DataStoreRepository`) |
| Backend — structured data | Firestore (`firebase-firestore-ktx`) | Users, chat, classes, quizzes, orders — see [§2](#2-system-architecture) |
| Backend — realtime/light data | Firebase Realtime Database (`firebase-database-ktx`) | Presence-style, low-latency key/value data |
| Auth | Firebase Auth (`firebase-auth-ktx`) | Email/password + phone verification (`PhoneVerificationFragment`) |
| On-device ML | ML Kit (`ocr`), `play-services-mlkit-text-recognition` | Handwriting recognition, offline |
| Local persistence | Jetpack DataStore (Preferences) | Typed local cache, replaces V1's SQLite table — see [§3.5](#35-local-state--datastore) |
| Navigation | Android Navigation Component (`navigation-fragment-ktx`, `navigation-ui-ktx`, Safe Args) | Type-safe Fragment transitions inside 4 host Activities |
| Networking | Retrofit2 + Gson converter | Non-Firebase HTTP needs |
| Maps/Location | `play-services-maps`, `play-services-location`, Google Places | Location-aware features |
| Image loading | Glide | Single library (Picasso dropped from V1) |
| Biometric | `androidx.biometric` | Optional local auth gate |
| Crash/Analytics | Firebase Crashlytics, Analytics | |
| UI toolkit | Material Components, ConstraintLayout, ViewBinding, RecyclerView | `viewBinding = true` enabled at module level |

Full dependency list: [`app/build.gradle`](app/build.gradle).

## 5. Feature Notes

### User Journeys

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'fillType0': '#7F52FF', 'fillType1': '#3DDC84', 'fillType2': '#4285F4', 'fillType3': '#FFA000', 'fillType4': '#26A69A', 'fillType5': '#EF5350', 'fillType6': '#FFCA28', 'fillType7': '#FF7043'}}}%%
journey
    title Parent User Journey
    section Onboarding
      Launch app: 5: Parent
      See splash screen: 5: Parent
      Tap Get Started: 4: Parent
      Choose Parent role: 5: Parent
      Sign up with email: 3: Parent
      Verify phone number: 2: Parent
    section Daily Use
      Open parent dashboard: 5: Parent
      Check child profile: 4: Parent
      Monitor quiz scores: 4: Parent
      Open classroom: 4: Parent
      Join class via meet URL: 3: Parent
      Chat with other parents: 4: Parent
    section Settings
      Update profile: 4: Parent
      Toggle online visibility: 5: Parent
      Sign out: 5: Parent
```

---

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'fillType0': '#3DDC84', 'fillType1': '#7F52FF', 'fillType2': '#4285F4', 'fillType3': '#FFA000', 'fillType4': '#26A69A', 'fillType5': '#FF7043', 'fillType6': '#FFCA28', 'fillType7': '#EF5350'}}}%%
journey
    title Child User Journey
    section Onboarding
      Launch app: 5: Child
      Parent creates account: 3: Child
      Child logs in: 4: Child
    section Learning
      Open dashboard: 5: Child
      Choose Fun Options: 5: Child
      Study alphabet lesson: 5: Child
      Practice number writing: 4: Child
      Match alphabet words: 5: Child
    section Games
      Open games menu: 5: Child
      Play Tic-Tac-Toe: 5: Child
      Play chess game: 4: Child
      Earn score and cash: 5: Child
    section Creative
      Open coloring: 5: Child
      Flood-fill a drawing: 5: Child
      Trace patterns: 4: Child
    section Social
      Open public chat: 4: Child
      Send a message: 4: Child
      React to a message: 5: Child
      Join group chat: 3: Child
    section Assessment
      Open classroom: 4: Child
      Watch video resource: 4: Child
      Take quiz: 3: Child
      See quiz result: 5: Child
```

---

### 3.1 Roles: Parent, Child & Authentication

```mermaid
flowchart TD
    LAUNCH([App Launch])
    SPLASH[SplashFragment]
    AUTH_CHECK{Authenticated?}
    WELCOME[WelcomeFragment]
    GETSTARTED[GetStartedFragment]
    USERTYPE[UserTypeFragment]
    SIGNUP[SignUpFragment]
    SIGNIN[SignInFragment]
    FIREBASE_AUTH[(Firebase Auth\nemail/password)]
    ROLE_CHECK{Roles enum\nin Users doc}
    PARENT_VERIFY[ParentVerificationFragment]
    PHONE_VERIFY[PhoneVerificationFragment\nFirebase Phone Auth]
    PARENT_ACT[ParentActivity]
    CHILD_ACT[ChildActivity]

    LAUNCH --> SPLASH --> AUTH_CHECK
    AUTH_CHECK -->|No| WELCOME
    WELCOME --> GETSTARTED --> USERTYPE
    USERTYPE -->|New user| SIGNUP
    USERTYPE -->|Existing user| SIGNIN
    SIGNUP --> FIREBASE_AUTH
    SIGNIN --> FIREBASE_AUTH
    FIREBASE_AUTH --> ROLE_CHECK
    ROLE_CHECK -->|PARENT| PARENT_VERIFY
    PARENT_VERIFY --> PHONE_VERIFY --> PARENT_ACT
    ROLE_CHECK -->|CHILD| CHILD_ACT
    AUTH_CHECK -->|"Yes — PARENT"| PARENT_ACT
    AUTH_CHECK -->|"Yes — CHILD"| CHILD_ACT

    classDef terminal fill:#37474F,stroke:#263238,color:#fff,font-weight:bold
    classDef screen fill:#3DDC84,stroke:#2ba86a,color:#000
    classDef decision fill:#78909C,stroke:#455A64,color:#fff,font-weight:bold
    classDef authScreen fill:#EF5350,stroke:#b71c1c,color:#fff
    classDef firebase fill:#FFA000,stroke:#e65100,color:#000
    classDef activity fill:#7F52FF,stroke:#5a3adb,color:#fff,font-weight:bold

    class LAUNCH terminal
    class SPLASH,WELCOME,GETSTARTED,USERTYPE screen
    class SIGNUP,SIGNIN,PARENT_VERIFY,PHONE_VERIFY authScreen
    class AUTH_CHECK,ROLE_CHECK decision
    class FIREBASE_AUTH firebase
    class PARENT_ACT,CHILD_ACT activity
```

---

`AuthenticationActivity` is the single launcher Activity (see [`AndroidManifest.xml`](app/src/main/AndroidManifest.xml)), fronting `SignInFragment` / `SignUpFragment` / `UserTypeFragment`. Account data is modeled as one `Users` document (see [`models/FirestoreModels.kt`](app/src/main/java/com/example/funlearnv2/models/FirestoreModels.kt)) carrying **both** child and parent fields (`child_name`, `child_grade`, `parent_name`, `parent_grade`, etc.) plus a `Roles` enum, rather than separate user tables. `ParentVerificationFragment` and `PhoneVerificationFragment` gate access before handing off to `ParentActivity` or `ChildActivity`.

### 3.2 Coloring Engine — Flood Fill

```mermaid
flowchart TD
    TOUCH([User taps pixel on PaintView or ColorView])
    READ[Read targetColor at tap point]
    SAME{targetColor == newColor?}
    END([No-op — already filled])
    INIT[Push tap point onto span queue]
    LOOP{Queue empty?}
    POP[Pop next span seed point]
    SCAN_LEFT["Walk left until color changes\nRecord leftmost x"]
    SCAN_RIGHT["Walk right until color changes\nRecord rightmost x"]
    FILL[Fill entire horizontal span with newColor]
    CHECK_ABOVE[Check row above span for targetColor pixels]
    QUEUE_ABOVE[Push contiguous runs above as new seeds]
    CHECK_BELOW[Check row below span]
    QUEUE_BELOW[Push contiguous runs below as new seeds]
    INVALIDATE[Invalidate View — trigger redraw]
    END2([Fill complete])

    TOUCH --> READ --> SAME
    SAME -->|Yes| END
    SAME -->|No| INIT --> LOOP
    LOOP -->|No| POP
    POP --> SCAN_LEFT --> SCAN_RIGHT --> FILL
    FILL --> CHECK_ABOVE --> QUEUE_ABOVE --> CHECK_BELOW --> QUEUE_BELOW --> LOOP
    LOOP -->|Yes| INVALIDATE --> END2

    classDef terminal fill:#37474F,stroke:#263238,color:#fff,font-weight:bold
    classDef decision fill:#78909C,stroke:#455A64,color:#fff
    classDef process fill:#4285F4,stroke:#2c6fd1,color:#fff
    classDef scan fill:#7F52FF,stroke:#5a3adb,color:#fff
    classDef fill fill:#3DDC84,stroke:#2ba86a,color:#000
    classDef done fill:#26A69A,stroke:#00796B,color:#fff

    class TOUCH,END,END2 terminal
    class SAME,LOOP decision
    class READ,INIT,POP,CHECK_ABOVE,CHECK_BELOW,QUEUE_ABOVE,QUEUE_BELOW process
    class SCAN_LEFT,SCAN_RIGHT scan
    class FILL fill
    class INVALIDATE done
```

---

The scanline flood-fill from V1 was ported to Kotlin as an `object` singleton ([`views/widgets/FloodFill.kt`](app/src/main/java/com/example/funlearnv2/views/widgets/FloodFill.kt)), preserving the same span-queue algorithm to avoid recursive stack overflow on large bitmaps:

```kotlin
object FloodFill {
    fun floodFill(bitmap: Bitmap, point: Point, targetColor: Int, newColor: Int) {
        // walks horizontal spans, queues only span boundaries above/below
        ...
    }
}
```

It drives `PaintView.kt` / `ColorView.kt` and is shared across `ColouringOneFragment`, `ColouringTwoFragment`, and `ColouringThreeFragment`, plus the tracing game in `Patterns.kt` — the same one-implementation-many-consumers structure as V1's `Pattern/` module.

### 3.3 Chat — Public, Private & Group

```mermaid
flowchart TD
    ENTRY([User opens Chat])
    MODE{Mode?}
    PUB[PublicChatFragment]
    PRIV[PrivateChatFragment]
    GRP[GroupChatFragment]
    COMMON["CommonChatFragment\nshared list and composer"]
    SEND[Send Message]
    MSG[("Messages collection\nmode = PUBLIC / PRIVATE / GROUP")]
    REACT[React or Comment]
    REACT_COL[(Reactions collection)]
    COMMENT_COL[(Comments collection)]
    REQ[Manage Group]
    REQ_COL[("Requests collection\nstatus = PENDING / REJECTED")]
    GD_COL[("GroupDetails collection\nmembers list")]
    STATUS[ChatStatusFragment]
    PRESENCE[(Realtime Database\nonline presence)]

    ENTRY --> MODE
    MODE -->|PUBLIC| PUB
    MODE -->|PRIVATE| PRIV
    MODE -->|GROUP| GRP
    PUB & PRIV & GRP --> COMMON
    COMMON --> SEND & REACT
    SEND --> MSG
    REACT --> REACT_COL & COMMENT_COL
    GRP --> REQ
    REQ --> REQ_COL & GD_COL
    COMMON --> STATUS
    STATUS --> PRESENCE

    classDef terminal fill:#37474F,stroke:#263238,color:#fff
    classDef decision fill:#78909C,stroke:#455A64,color:#fff
    classDef pubFrag fill:#3DDC84,stroke:#2ba86a,color:#000
    classDef privFrag fill:#7F52FF,stroke:#5a3adb,color:#fff
    classDef grpFrag fill:#4285F4,stroke:#2c6fd1,color:#fff
    classDef shared fill:#26A69A,stroke:#00796B,color:#fff,font-weight:bold
    classDef action fill:#FFCA28,stroke:#f9a825,color:#000
    classDef store fill:#FFA000,stroke:#e65100,color:#000
    classDef rtdb fill:#FF7043,stroke:#d84315,color:#fff

    class ENTRY terminal
    class MODE decision
    class PUB pubFrag
    class PRIV privFrag
    class GRP grpFrag
    class COMMON,STATUS shared
    class SEND,REACT,REQ action
    class MSG,REACT_COL,COMMENT_COL,REQ_COL,GD_COL store
    class PRESENCE rtdb
```

---

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'actorBkg': '#7F52FF', 'actorBorder': '#5a3adb', 'actorTextColor': '#ffffff', 'noteBkgColor': '#fff8e1', 'noteTextColor': '#000000', 'noteBorderColor': '#FFCA28', 'activationBkgColor': '#4285F4', 'activationBorderColor': '#2c6fd1', 'signalColor': '#37474F', 'signalTextColor': '#37474F'}}}%%
sequenceDiagram
    participant User
    participant PublicChat as PublicChatFragment
    participant ViewModel as FireStoreViewModel
    participant Repo as FireStoreRepository
    participant Source as FireStoreSource
    participant FS as Firestore

    User->>PublicChat: types message, taps Send

    rect rgb(237, 231, 246)
        Note over PublicChat,Source: Write path — UI to Firestore
        PublicChat->>ViewModel: createMessage(Messages)
        ViewModel->>Repo: createMessage(Messages)
        Repo->>Source: addDocument("Messages", data)
        Source->>FS: collection("Messages").add(data)
        FS-->>Source: DocumentReference
        Source-->>Repo: success
        Repo-->>ViewModel: FireStoreAction.CreateMessage
        ViewModel-->>PublicChat: LiveData update
    end

    rect rgb(227, 242, 253)
        Note over PublicChat,FS: Read path — real-time listener
        PublicChat->>ViewModel: fetchPublicMessages()
        ViewModel->>Repo: getPublicMessages()
        Repo->>Source: query Messages where mode == PUBLIC
        Source->>FS: addSnapshotListener
        FS-->>Source: QuerySnapshot real-time
        Source-->>Repo: List of Messages
        Repo-->>ViewModel: FireStoreAction.FetchPublicMessages
        ViewModel-->>PublicChat: adapter.submitList(messages)
    end
```

---

Chat is modeled directly in Firestore via `Messages`, `Comments`, `Reactions`, `Requests`, and `GroupDetails` (all in [`FirestoreModels.kt`](app/src/main/java/com/example/funlearnv2/models/FirestoreModels.kt)), with a `Mode` enum (`PRIVATE`, `PUBLIC`, `GROUP`) distinguishing conversation types on the same collections rather than separate schemas per mode. Fragments split by mode: `PublicChatFragment`, `PrivateChatFragment`, `GroupChatFragment`, `CommonChatFragment` (shared list/composer logic), `CommentFragment`, and `ChatStatusFragment` for presence.

### 3.4 Quiz, Classroom & Resources

```mermaid
flowchart TD
    CHILD[ChildActivity]
    CLASS_TYPE["ClassTypeFragment\nlist of ClassRoom docs"]
    CLASS_CONTENT["ClassContentFragment\nlist of ClassResource docs"]
    RES_TYPE{Resource.type}
    WEB["WebFragment\nloads meet_url in WebView"]
    PDF["PdfViewFragment\nrenders PDF in viewer"]
    VIDEO["WebFragment\nvideo URL in WebView"]
    QUIZ["QuizFragment\nloads Questions by resource_id"]
    ANSWER["User answers MCQ\noption_A B C D"]
    SCORE["Calculate score\nattempted / wrong / un_attempted"]
    RESULT[(QuizResult written to Firestore)]
    DASH[Score reflected on DashBoardFragment]

    CHILD --> CLASS_TYPE --> CLASS_CONTENT --> RES_TYPE
    RES_TYPE -->|LINK| WEB
    RES_TYPE -->|PDF| PDF
    RES_TYPE -->|VIDEO| VIDEO
    RES_TYPE -->|QUIZ| QUIZ --> ANSWER --> SCORE --> RESULT --> DASH

    classDef activity fill:#7F52FF,stroke:#5a3adb,color:#fff,font-weight:bold
    classDef listFrag fill:#3DDC84,stroke:#2ba86a,color:#000
    classDef decision fill:#78909C,stroke:#455A64,color:#fff
    classDef linkRes fill:#4285F4,stroke:#2c6fd1,color:#fff
    classDef quizRes fill:#FF7043,stroke:#d84315,color:#fff
    classDef quizFlow fill:#FFCA28,stroke:#f9a825,color:#000
    classDef store fill:#FFA000,stroke:#e65100,color:#000
    classDef dashboard fill:#26A69A,stroke:#00796B,color:#fff

    class CHILD activity
    class CLASS_TYPE,CLASS_CONTENT listFrag
    class RES_TYPE decision
    class WEB,PDF,VIDEO linkRes
    class QUIZ quizRes
    class ANSWER,SCORE quizFlow
    class RESULT store
    class DASH dashboard
```

---

- `ClassRoom` / `ClassResource` — a class has a `meet_url`, `teacher_id`, and a list of `Resource` items typed as `LINK`, `PDF`, `VIDEO`, or `QUIZ`.
- `Questions` — flat MCQ shape (`option_A`..`option_D`, `Answer`) tied to a `resource_id`.
- `QuizResult` — per-attempt outcome (`score`, `attempted`, `un_attempted`, `wrong`), mirroring V1's separation of quiz content from quiz outcomes (`QuizMaster` vs `Rank` in the original app).
- UI: `ClassTypeFragment` → `ClassContentFragment` → `QuizFragment` / `PdfViewFragment` / `WebFragment`, depending on `Resource` type.

### 3.5 Local State — DataStore

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'actorBkg': '#4285F4', 'actorBorder': '#2c6fd1', 'actorTextColor': '#ffffff', 'noteBkgColor': '#fff8e1', 'noteTextColor': '#000000', 'noteBorderColor': '#FFCA28', 'activationBkgColor': '#7F52FF', 'activationBorderColor': '#5a3adb', 'sequenceNumberColor': '#ffffff', 'loopTextColor': '#000000', 'labelBoxBkgColor': '#e8f5e9', 'labelBoxBorderColor': '#3DDC84', 'labelTextColor': '#000000', 'signalColor': '#37474F', 'signalTextColor': '#37474F'}}}%%
sequenceDiagram
    participant Fragment
    participant ViewModel as FireStoreViewModel
    participant DSRepo as DataStoreRepository
    participant FSRepo as FireStoreRepository
    participant DS as DataStore on-device
    participant FS as Firestore

    Fragment->>ViewModel: observe LiveData

    rect rgb(232, 245, 233)
        Note over ViewModel,DS: Instant local render
        ViewModel->>DSRepo: read profile fields via first()
        DSRepo->>DS: preferences.data.first()
        DS-->>DSRepo: cached values
        DSRepo-->>ViewModel: profile data
        ViewModel-->>Fragment: render immediately
    end

    rect rgb(227, 242, 253)
        Note over ViewModel,FS: Background Firestore sync
        ViewModel->>FSRepo: fetchUser(uid)
        FSRepo->>FS: get Users document
        FS-->>FSRepo: Users doc snapshot
        FSRepo-->>ViewModel: Users object
        ViewModel->>DSRepo: write updated fields
        DSRepo->>DS: edit preferences
        DS-->>Fragment: Flow emits new values
    end

    Note over Fragment,DS: UI never blank — DataStore renders instantly, Firestore updates propagate via Flow
```

---

[`repository/DataStoreRepository.kt`](app/src/main/java/com/example/funlearnv2/repository/DataStoreRepository.kt) wraps a single `androidx.datastore.preferences` instance (provided by `ResourceProvider`) with typed getters/setters for every profile field (child + parent), account credentials cache, `score`, and `cash`. Each field is exposed as a `Flow<String>` internally and read via `.first()` for one-shot suspend access — replacing V1's raw `SQLiteOpenHelper` table with a coroutine-friendly, type-checked key-value store.

### Enums Reference

```mermaid
classDiagram
    class Roles {
        <<enumeration>>
        TEACHER
        CHILD
        PARENT
        ADMIN
    }

    class Mode {
        <<enumeration>>
        PRIVATE
        PUBLIC
        GROUP
    }

    class Resource {
        <<enumeration>>
        LINK
        PDF
        VIDEO
        QUIZ
    }

    class MessageTypes {
        <<enumeration>>
        TEXT
        IMAGE
        PDF
        VIDEO
    }

    class Status {
        <<enumeration>>
        PENDING
        REJECTED
    }

    class OrderStatus {
        <<enumeration>>
        PENDING
        DELIVERED
    }

    class Grade {
        <<enumeration>>
        PREKG
        LKG
        UKG
    }

    class ParentGrade {
        <<enumeration>>
        SCHOOL
        COLLEGE
        NOCOMMENTS
    }

    class OnlineVisibility {
        <<enumeration>>
        ONLINE
        OFFLINE
    }

    class Gender {
        <<enumeration>>
        MALE
        FEMALE
        NOTOSAY
    }

    style Roles fill:#EF5350,stroke:#b71c1c,color:#fff
    style Mode fill:#7F52FF,stroke:#5a3adb,color:#fff
    style Resource fill:#3DDC84,stroke:#2ba86a,color:#000
    style MessageTypes fill:#4285F4,stroke:#2c6fd1,color:#fff
    style Status fill:#FF7043,stroke:#d84315,color:#fff
    style OrderStatus fill:#FFA000,stroke:#e65100,color:#000
    style Grade fill:#26A69A,stroke:#00796B,color:#fff
    style ParentGrade fill:#26A69A,stroke:#00796B,color:#fff
    style OnlineVisibility fill:#78909C,stroke:#455A64,color:#fff
    style Gender fill:#FFCA28,stroke:#f9a825,color:#000
```

---

## 6. Module Reference

```
app/src/main/java/com/example/funlearnv2/
├── FirebaseSource/     FirebaseDbSource, FireStoreSource, FirebaseModules, Collections — data-source layer (§2)
├── models/             DataModel, FirebaseDbModels, FirestoreModels, chatModel, Result — data/DTO layer (§3.3, §3.4)
├── repository/         DataStoreRepository (§3.5), FireStoreRepository, FirebaseDbRepository
├── viewmodels/         BaseViewModel, FireStoreViewModel, FirebaseDbViewModel
│   └── actions/         FireStoreAction, FirebaseDbAction — sealed action/state contracts for ViewModels
├── utils/              CallUtil, ContextUtil, DateUtil, DialogUtil, DimensionUtil,
│                        FileUtil, FileSaveUtil, GlideUtil, HideKeyboardUtil, InputTextUtil,
│                        ProgressBarUtil, QueryUtil, SnackbarUtil, ViewGroupUtil, ViewUtil
│   ├── constants/        Constant, ButtonStatus, FunType, OperatorTypes
│   └── resourceProvider/ ResourceProvider — DataStore + resource access wrapper
├── views/
│   ├── activities/      AuthenticationActivity, BaseActivity, ParentActivity, ChildActivity (§2, §3.1)
│   ├── fragments/        45 Fragments across:
│   │                      - Onboarding: SplashFragment, WelcomeFragment, GetStartedFragment
│   │                      - Auth: SignInFragment, SignUpFragment, UserTypeFragment,
│   │                               PhoneVerificationFragment, ParentVerificationFragment
│   │                      - Dashboard: DashBoardFragment, ParentDashBoardFragment, FunOptionsFragment
│   │                      - Learn: LearnFragment, AlphabetListFragment, AlphabetCountFragment,
│   │                               AlphabetWordsFragment, AlphabetMatchFragment, AlphabetWriteFragment,
│   │                               NumberInfoFragment, NumberCountFragment, NumberOperationFragment,
│   │                               NumberWriteFragment, TutorialFragment
│   │                      - Games: GamesFragment, GameOnePlayFragment, GameTwoFragment,
│   │                               GameThreeFragment, GameFourFragment (chess)
│   │                      - Coloring: ColouringOneFragment, ColouringTwoFragment, ColouringThreeFragment
│   │                      - Chat: CommonChatFragment, PublicChatFragment, PrivateChatFragment,
│   │                               GroupChatFragment, CommentFragment, ChatStatusFragment
│   │                      - Classroom/Quiz: ClassTypeFragment, ClassContentFragment, QuizFragment,
│   │                                        PdfViewFragment, WebFragment, ListFilesFragment
│   │                      - Profile/Settings: ProfileFragment, SettingFragment, NotificationFragment
│   │                      Several of the above are navigation-wired stubs pending full V1 migration
│   ├── adapters/         16 adapters (15 RecyclerView + 1 ViewPager2) — one per list-backed screen
│   │                      ItemAlphabetAdapter, ItemAlphabetWordAdapter, ItemChessAdapter,
│   │                      ItemCommentAdapter, ItemDeadChessAdapter, ItemGameOneAdapter,
│   │                      ItemMatchAdapter, ItemNumbersInfoAdapter, ItemOperatorAdapter,
│   │                      ItemPatternAdapter, ItemPublicChatMessageAdapter, ItemSearchAdapter,
│   │                      ItemTemplateAdapter, ItemWordAdapter, ItemWordExampleAdapter,
│   │                      chatViewPagerAdapter
│   └── widgets/          FloodFill, PaintView, ColorView, Patterns, GameImages (§3.2)
└── FunLearnApplication.kt   @HiltAndroidApp entry point
```

## 7. Roadmap

- Finish stub screens (a subset of Fragments across games/quiz/settings are wired for navigation but not yet feature-complete) and confirm full V1 to V2 parity, then retire the legacy Java module.
- Extend `DataStoreRepository` into a full offline-first cache layer, with Firestore as the sync source of truth across devices.
- Formalize the `FirebaseDbSource` / `FireStoreSource` boundary into a documented data-ownership map as more collections are added.
- Add unit tests, starting with `FloodFill` and `DataStoreRepository` — both are side-effect-isolated and straightforward to unit test; no test suite exists yet.
- Continue extracting game logic into ViewModels (in progress for the larger game Fragments) to keep game rules testable independent of the view layer.
- Replace the Asset Preview section with real screenshots and screen recordings of the running app.

## 8. Getting Started

```bash
git clone https://github.com/PRADEEPERIYASAMY/FunLearnV2.git
cd FunLearnV2
```

1. Create a Firebase project; enable **Firestore**, **Realtime Database**, **Authentication** (email/password + phone), **Crashlytics**, and **ML Kit Text Recognition**.
2. Download `google-services.json` into `app/` (a placeholder already exists in this repo; replace it with your own project's file).
3. Open the repository root folder in Android Studio (Gradle + `com.google.gms.google-services` + Hilt + Navigation Safe Args plugins) and let Gradle sync.
   - The project uses **JitPack** (`https://jitpack.io`) as a Maven repository for some dependencies (see `build.gradle` root). Android Studio adds this automatically; no manual step needed.
4. Build:

```bash
./gradlew build
```

For a full walkthrough of Firebase service configuration, see [Firebase Setup](#11-firebase-setup). For build environment details, see [Local Development Guide](#10-local-development-guide).

## 9. Firebase Setup

This guide walks through configuring Firebase for a local development build of FunlearnV2. The app depends on five Firebase services: Authentication, Firestore, Realtime Database, Crashlytics, and ML Kit Text Recognition.

### Prerequisites

- A Google account
- Android Studio (Arctic Fox or later recommended)
- The repository cloned locally

### Step 1 — Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**.
2. Name the project (e.g. `FunlearnV2-Dev`). Analytics can be enabled or disabled — it does not affect core functionality.
3. Wait for the project to be provisioned.

### Step 2 — Register the Android App

1. In the Firebase Console, click the Android icon to add an Android app.
2. Enter the package name: `com.example.funlearnv2`
3. App nickname is optional. SHA-1 is required for phone authentication (see Step 5).
4. Click **Register app**.
5. Download `google-services.json` and place it at `app/google-services.json` in the repo, replacing the placeholder file already there.

> The placeholder `google-services.json` committed to this repository contains dummy values. It will not connect to any real Firebase project. Replace it with your own.

### Step 3 — Enable Authentication

1. In the Firebase Console, go to **Authentication** > **Sign-in method**.
2. Enable **Email/Password**.
3. Enable **Phone** (required for `PhoneVerificationFragment` and `ParentVerificationFragment`).
4. For phone authentication in debug builds, go to **Authentication** > **Sign-in method** > **Phone** and add a test phone number and verification code under **Phone numbers for testing**.

#### SHA-1 for Phone Auth

Phone authentication requires the app's signing certificate SHA-1 to be registered in the Firebase project.

For the debug keystore:

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

On Windows:

```bash
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Copy the SHA-1 fingerprint and add it under **Project settings** > **Your apps** > **SHA certificate fingerprints**.

### Step 4 — Set Up Firestore

1. Go to **Firestore Database** and click **Create database**.
2. Choose **Start in test mode** for local development (allows open reads/writes for 30 days — tighten rules before any production use).
3. Select a region close to you.

#### Firestore Collections

The app expects the following top-level collections:

| Collection | Used by | Key fields |
|------------|---------|-----------|
| `Users` | Auth, profile, roles | `uid`, `role` (`PARENT`/`CHILD`), `child_name`, `child_grade`, `parent_name`, `parent_grade` |
| `Messages` | Chat | `mode` (`PRIVATE`/`PUBLIC`/`GROUP`), `sender_id`, `receiver_id`, `text`, `timestamp` |
| `Comments` | Chat | `message_id`, `sender_id`, `text` |
| `Reactions` | Chat | `message_id`, `user_id`, `type` |
| `Requests` | Group chat | `sender_id`, `receiver_id`, `status` |
| `GroupDetails` | Group chat | `group_id`, `name`, `members` |
| `ClassRoom` | Classroom | `teacher_id`, `meet_url`, `resources` |
| `Questions` | Quiz | `resource_id`, `question`, `option_A`..`option_D`, `Answer` |
| `QuizResult` | Quiz | `user_id`, `resource_id`, `score`, `attempted`, `wrong` |
| `Orders` | Shop/rewards | `user_id`, `item_id`, `status` |

Collections are created automatically when the app first writes to them. You do not need to create them manually.

### Step 5 — Set Up Realtime Database

1. Go to **Realtime Database** and click **Create database**.
2. Choose **Start in test mode** for development.
3. Select a region.

Realtime Database is used for lightweight, frequently-updated data: online presence indicators and counters. The data structure is created on first write from the app.

### Step 6 — Enable ML Kit Text Recognition

ML Kit Text Recognition runs on-device and does not require a separate Firebase configuration step. The dependency `play-services-mlkit-text-recognition` downloads the model on first use.

If you want the model bundled with the APK (to avoid a first-run download), add the following to your `AndroidManifest.xml`:

```xml
<meta-data
    android:name="com.google.mlkit.vision.DEPENDENCIES"
    android:value="ocr" />
```

This is already present in the app manifest.

### Step 7 — Enable Crashlytics

1. In the Firebase Console, go to **Crashlytics** and click **Enable Crashlytics**.
2. No additional configuration is needed — the `google-services.json` and `firebase-crashlytics` plugin handle the rest.
3. To generate a test crash, call `throw RuntimeException("Test Crash")` from any Activity and confirm it appears in the Crashlytics dashboard.

### Step 8 — Sync and Build

1. Open the repo root in Android Studio.
2. Let Gradle sync complete (it will download all dependencies declared in `app/build.gradle`).
3. Build and run:

```bash
./gradlew build
```

Or run directly from Android Studio using the Run button.

### Firestore Security Rules (Production)

Before deploying to production, replace the permissive test rules with real rules. A starting point:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read and write their own document
    match /Users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Messages: authenticated users only
    match /Messages/{messageId} {
      allow read, write: if request.auth != null;
    }

    // Add rules per collection as the app matures
  }
}
```

> Start strict and open up. The test-mode default (allow all) is not safe for production.

### Realtime Database Security Rules (Production)

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

This restricts all reads and writes to authenticated users. Tighten per node as needed.

### Troubleshooting

**`google-services.json` errors at sync time**
Make sure the file is placed at `app/google-services.json`, not the repo root. The file must match the package name `com.example.funlearnv2`.

**Phone auth — SMS not received**
Add the device's test phone number in Firebase Console under Authentication > Sign-in method > Phone > Test phone numbers.

**ML Kit model not found**
Clean the build (`./gradlew clean`) and rebuild. On first launch, the model is downloaded; a network connection is needed.

**Crashlytics not reporting crashes**
Crashlytics is disabled during debug builds by default. To force-enable it for testing, add `FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true)` in `FunLearnApplication.kt`.

---

## 10. Local Development Guide

Everything you need to set up a local development environment for FunlearnV2 beyond what `git clone` and Android Studio handle automatically.

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Android Studio | Arctic Fox (2020.3.1) or later | Hedgehog or later recommended |
| JDK | 8 (Java 1.8) | Set in `compileOptions` and `kotlinOptions` |
| Android SDK | API 30 (compile + target) | API 23 minimum for device/emulator |
| Kotlin | Check `build.gradle` (root) for `kotlin_version` | kapt used for annotation processing |
| Gradle | Wrapper included — use `./gradlew` | Do not use a system Gradle installation |

### Initial Setup

```bash
git clone https://github.com/PRADEEPERIYASAMY/FunLearnV2.git
cd FunLearnV2
```

Then follow [docs/FIREBASE_SETUP.md](FIREBASE_SETUP.md) to configure Firebase before your first build.

### Building

```bash
# Debug build
./gradlew assembleDebug

# Release build (APK unsigned, requires signing config for distribution)
./gradlew assembleRelease

# Full build with tests
./gradlew build
```

On Windows, use `gradlew.bat` instead of `./gradlew`, or run via Android Studio's built-in Gradle panel.

### Running on a Device or Emulator

Use Android Studio's Run button, or:

```bash
./gradlew installDebug
```

The minimum supported API level is 23 (Android 6.0 Marshmallow). For emulators, an API 23+ AVD is required.

### Plugins and Build Configuration

```mermaid
flowchart LR
    SRC["Kotlin Source\n.kt files"]
    KAPT[kotlin-kapt\nAnnotation Processing]
    HILT_GEN["Hilt Generated Code\nDagger components"]
    GLIDE_GEN["Glide Generated\nGlideApp"]
    NAV_ARGS["Safe Args Generated\nDirections and Args classes"]
    KOTLIN[kotlin-android\nKotlin compilation]
    ANDROID["com.android.application\nDex and resource merge"]
    GMS["com.google.gms.google-services\nInjects Firebase config"]
    CRASHLYTICS["com.google.firebase.crashlytics\nInjects build ID"]
    HILT_PLUGIN["dagger.hilt.android.plugin\nbytecode transform"]
    APK[APK\ndebug / release]

    SRC --> KAPT
    KAPT --> HILT_GEN & GLIDE_GEN & NAV_ARGS
    SRC --> KOTLIN
    HILT_GEN & GLIDE_GEN & NAV_ARGS --> KOTLIN
    KOTLIN --> ANDROID --> GMS --> CRASHLYTICS --> HILT_PLUGIN --> APK

    classDef source fill:#37474F,stroke:#263238,color:#fff,font-weight:bold
    classDef kapt fill:#FFCA28,stroke:#f9a825,color:#000,font-weight:bold
    classDef generated fill:#FFF9C4,stroke:#FFCA28,color:#000
    classDef compile fill:#7F52FF,stroke:#5a3adb,color:#fff
    classDef android fill:#3DDC84,stroke:#2ba86a,color:#000
    classDef gms fill:#FFA000,stroke:#e65100,color:#000
    classDef crash fill:#EF5350,stroke:#b71c1c,color:#fff
    classDef hilt fill:#4285F4,stroke:#2c6fd1,color:#fff
    classDef artifact fill:#26A69A,stroke:#00796B,color:#fff,font-weight:bold

    class SRC source
    class KAPT kapt
    class HILT_GEN,GLIDE_GEN,NAV_ARGS generated
    class KOTLIN compile
    class ANDROID android
    class GMS gms
    class CRASHLYTICS crash
    class HILT_PLUGIN hilt
    class APK artifact
```

---

*All diagrams reflect the codebase as of the current `main` branch. Update this file when models, navigation graphs, or the architecture changes.*

---

Made with ❤️ by Pradeep Periyasamy

The project uses the following Gradle plugins — all are applied in `app/build.gradle`:

| Plugin | Purpose |
|--------|---------|
| `com.android.application` | Android app module |
| `kotlin-android` | Kotlin support |
| `kotlin-kapt` | Annotation processing (Hilt, Glide compiler) |
| `com.google.gms.google-services` | Firebase configuration |
| `dagger.hilt.android.plugin` | Hilt DI |
| `androidx.navigation.safeargs.kotlin` | Navigation Safe Args |
| `com.google.firebase.crashlytics` | Crashlytics build integration |

Plugin versions are declared in the root `build.gradle`.

### Key Build Flags

| Flag | Value | Notes |
|------|-------|-------|
| `minSdkVersion` | 23 | Android 6.0 |
| `targetSdkVersion` | 30 | Android 11 |
| `compileSdkVersion` | 30 | |
| `viewBinding` | true | All view access goes through generated binding classes |
| `multiDexEnabled` | true | Required due to method count exceeding 64K |

### Project Structure

```
FunLearnV2/
├── app/
│   ├── build.gradle              # App-level dependencies and build config
│   ├── google-services.json      # Firebase config (placeholder — replace with your own)
│   ├── proguard-rules.pro        # ProGuard rules for release builds
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/com/example/funlearnv2/
│           │   ├── FirebaseSource/    # Data-source layer
│           │   ├── models/            # Data models and DTOs
│           │   ├── repository/        # Repository layer
│           │   ├── viewmodels/        # ViewModels and action contracts
│           │   ├── utils/             # Extension helpers and utilities
│           │   ├── views/             # Activities, Fragments, adapters, widgets
│           │   └── FunLearnApplication.kt
│           └── res/
├── build.gradle                  # Root build file (plugin versions, classpath)
├── gradle.properties             # Gradle and project-wide properties
├── settings.gradle               # Module inclusion
└── docs/                         # Extended documentation
```

### Code Conventions

- **Language:** Kotlin throughout. No new Java files.
- **View access:** ViewBinding only. No `findViewById`.
- **Dependency injection:** Hilt. Do not construct Firebase clients, repositories, or ViewModels manually.
- **Async:** Kotlin Coroutines and Flow. No RxJava, no raw threads, no `AsyncTask`.
- **Image loading:** Glide only. Picasso was removed from V1 and is not re-introduced.
- **Navigation:** Navigation Component + Safe Args for all Fragment transitions within a host Activity. No `Intent` extras for passing typed data between Fragments.

### Running Lint

```bash
./gradlew lint
```

The lint report is generated at `app/build/reports/lint-results-debug.html`.

### Running Tests

```bash
# Unit tests
./gradlew test

# Instrumented tests (requires a connected device or running emulator)
./gradlew connectedAndroidTest
```

Note: as of the current state of the project, test coverage is minimal. `FloodFill` and `DataStoreRepository` are the best candidates for new unit tests since both are side-effect-isolated.

### Common Issues

**Gradle sync fails with `google-services.json` error**
The placeholder `google-services.json` will not cause a sync failure on its own, but building or running will fail without valid Firebase credentials. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

**kapt errors during build**
Ensure `kapt { correctErrorTypes true }` is present in `app/build.gradle` (it is). If kapt errors persist after a code change, try `./gradlew clean` before rebuilding.

**Navigation Safe Args not generating**
Clean and rebuild: `./gradlew clean assembleDebug`. If the generated `Directions` classes are missing, confirm the `androidx.navigation.safeargs.kotlin` plugin is applied in `app/build.gradle`.

**Hilt injection failures at runtime**
All Activities and Fragments using Hilt must extend `ComponentActivity` / `Fragment` (not the legacy support versions) and the Application class must be annotated with `@HiltAndroidApp`. Both are already configured in this project.

**MultiDex issues on API 21 and above**
`multiDexEnabled true` is set and `androidx.multidex:multidex` is included. The `FunLearnApplication` class inherits from `MultiDexApplication` indirectly via Hilt's generated Application. No additional configuration is needed.

### IDE Tips

- Enable **auto-import** for Kotlin in Android Studio to avoid manual import management.
- Use **Layout Inspector** (View > Tool Windows > Layout Inspector) to inspect the Fragment/View hierarchy at runtime.
- The Navigation graph is at `app/src/main/res/navigation/` — open it in the Navigation Editor for a visual overview of Fragment transitions per host Activity.

---

## 11. Contributing & Community

Contributions, bug reports, and feature requests are welcome.

- Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
- Review the [Code of Conduct](CODE_OF_CONDUCT.md) — all interactions in this project follow it.
- Report security issues privately via [SECURITY.md](SECURITY.md).
- Need help? See [SUPPORT.md](SUPPORT.md).
- Use the issue templates when filing bugs or feature requests.

This project is primarily a solo build. If you want to contribute, open an issue first to discuss scope before writing code.

Licensed under [MIT](LICENSE).


---

---

Made with ❤️ by Pradeep Periyasamy
