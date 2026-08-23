# C++ DSA Practice — Graphs, Dynamic Programming & System Design

![C++](https://img.shields.io/badge/language-C%2B%2B-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Problems](https://img.shields.io/badge/problems-1%2C072-orange)

A structured collection of **1,072 Data Structures & Algorithms problems** solved in C++,
built incrementally over **100+ commits** during a focused DSA practice phase
(March–April 2022). It spans graph algorithms, 90+ dynamic programming problems,
system design fundamentals, and competitive programming — the foundation that my
[current LeetCode practice](https://leetcode.com/u/PradeepPeriyasamy-1510-nitt/)
builds on.

> **Note for reviewers:** This repo predates my transition to LeetCode. It's kept
> public and pinned because it demonstrates depth across algorithmic topics
> (multiple shortest-path algorithms, both MST algorithms, both SCC algorithms,
> etc.) that a curated LeetCode profile alone doesn't show. The **1,072 file count**
> is verified via `find . -name "*.cpp" | wc -l` against the full local checkout —
> not an estimate. See [Current Practice](#-current-practice--where-to-look-next)
> for my active work.

---

## Table of Contents
- [Highlights at a Glance](#-highlights-at-a-glance)
- [Graph Algorithms](#-graph-algorithms-basicgraph)
- [Dynamic Programming](#-dynamic-programming-basicdp-frazdp-top_500dp)
- [System Design](#-system-design-frazdesign)
- [Matrix Problems](#-matrix-problems-top_500matrix)
- [Binary Search](#-binary-search-binarysearcheasy-frazbinarysearch)
- [Competitive Programming](#-competitive-programming-codechefpractice)
- [Pattern-Based Practice](#-pattern-based-practice-fraz)
- [Repository Structure](#-repository-structure)
- [Current Practice](#-current-practice--where-to-look-next)
- [About This Repo](#-about-this-repo)

---

## Highlights at a Glance

| Area | Notable Implementations |
|---|---|
| **Total Problems Solved** | **1,072 `.cpp` files** across 53 folders (verified exact count) |
| **Shortest Paths** | Dijkstra's (plain + min-cost variant), Bellman-Ford (negative weights), DAG shortest path via topological sort |
| **Minimum Spanning Tree** | Kruskal's (via Disjoint Set/Union-Find), Prim's |
| **Strongly Connected Components** | Kosaraju's **and** Tarjan's algorithm |
| **Graph Structure Analysis** | Articulation points, bridges, cycle detection (directed & undirected), mother vertex, connected components |
| **Dynamic Programming** | 90+ problems: Knapsack variants, LCS/LIS, Edit Distance, Interval DP, Combinatorics, Bitmask DP |
| **System Design** | LRU/LFU Cache, Browser History, Underground Transit System, Median from Data Stream |

---

## Graph Algorithms (`basic/graph/`)
The most advanced section of the repo.
- **Shortest paths:** Dijkstra's algorithm (plain + min-cost path variant), Bellman-Ford (handles negative weights), shortest path in a DAG via topological sort
- **Minimum Spanning Tree:** Kruskal's (via Disjoint Set/Union-Find) and Prim's algorithms
- **Strongly Connected Components:** Kosaraju's algorithm and Tarjan's algorithm (both implemented)
- **Graph structure analysis:** Articulation points, bridges, cycle detection (directed and undirected, via DFS and topological sort), mother vertex, connected components
- **Traversal-based problems:** BFS/DFS on grids (island counting, rotting oranges, nearest-1 distance, region area), knight's tour on n×n board
- **Representation:** Adjacency list and adjacency matrix implementations from scratch

## Dynamic Programming (`basic/dp/`, `fraz/dp/`, `top_500/dp/`)
The largest section — 90+ problems.
- **Classic patterns:** 0/1 Knapsack, Unbounded Knapsack, Coin Change (min coins + count combinations), LCS (2-string and 3-string variants), LIS, Edit Distance, Matrix Chain Multiplication
- **String DP:** Palindrome partitioning, longest palindromic subsequence, regex matching, wildcard pattern matching, word break (+ word break II), smallest common supersequence
- **Interval/2D DP:** Egg dropping puzzle (+ super egg drop), burst balloons, optimal binary search tree, minimum cost to cut a stick, box stacking
- **Array/Subsequence DP:** Maximum subarray (Kadane's), maximum product subarray, longest increasing/arithmetic subsequence, subset sum, partition problems
- **Combinatorial DP:** Catalan numbers, nCr, counting BSTs, ways to reach a score, ugly numbers / super ugly numbers, bitmasking + DP

## System Design (`fraz/design/`)
- **LRU Cache** and **LFU Cache** — classic cache-eviction design problems
- Design Browser History, Design Underground System (transit tracking), Median from Data Stream, Tweet Counts Per Frequency

## Matrix Problems (`top_500/matrix/`)
- Matrix rotation (90°, in-place variants), spiral/zigzag traversal, flood fill, island counting in 2D grids, boolean matrix problems, shortest path in binary matrix, largest square sub-matrix of 1s (DP-based)

## Binary Search (`binarySearch/easy/`, `fraz/binarySearch/`)
Applied binary search beyond plain lookup — "search on answer" style problems (minimize max distance, room allocation, resource distribution).

## Competitive Programming (`codechef/practice/`)
Problems solved directly from CodeChef practice sets.

## Pattern-Based Practice (`fraz/`)
A second full pass organized by **interview pattern** rather than topic — sliding window, two-pointer, backtracking, greedy, hash tables, heaps — reflecting a shift toward pattern-recognition-based problem solving (closer to how interview prep is typically structured today).

---

## Repository Structure

```
cpp-codes/
├── basic/          Foundational DS&A by topic (arrays, trees, graphs, DP,
│                   recursion, sorting, searching, stacks/queues, strings,
│                   bit manipulation, math)
├── fraz/           Second practice pass, organized by interview pattern
│                   (two-pointer, sliding window, backtracking, greedy,
│                   design, dp, binarySearch)
├── top_500/        Practice from a curated "Top 500" problem list
│                   (arrays, dp, greedy, matrix, backtracking, linked
│                   lists, stacks/queues, strings)
├── binarySearch/   Focused binary search practice (easy tier)
├── codechef/       Competitive programming practice from CodeChef
└── practice/       General ad-hoc practice (arrays, queues, stacks)
```

**Total: 1,072 `.cpp` files across 53 folders** — each file is a self-contained
solution and can be compiled independently:
```bash
g++ -std=c++17 -O2 filename.cpp -o solution && ./solution
```

---

## Current Practice — Where to Look Next

This repository reflects my **earliest, foundational DSA practice** (2022) —
solving problems in C++ and periodically committing progress as I worked
through topics one at a time.

**Active DSA / interview preparation has since moved to LeetCode**, where
problems, patterns, and progress are tracked more systematically:

🔗 **[LeetCode Profile — PradeepPeriyasamy](https://leetcode.com/u/PradeepPeriyasamy-1510-nitt/)**
🔗 **[Portfolio](https://pradeeperiyasamy.github.io/pradeep-portfolio/)**

This repo remains pinned as an accurate, unedited record of where that
practice started — the graph algorithms, DP patterns, and design problems
solved here built the foundation my current practice builds on.

## About This Repo

This is a learning/practice archive, not a production codebase. Code reflects
iterative, topic-by-topic problem-solving rather than production software
engineering practices — no test suite or CI, by design, since each file is an
independent algorithmic exercise rather than a deployable system. Some
filenames/comments retain informal phrasing from when they were originally
written in 2022.

## License

MIT — see [LICENSE](LICENSE).
