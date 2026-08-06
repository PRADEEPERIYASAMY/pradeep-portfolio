<header>
<span style="display:block; font-family:'IBM Plex Mono',monospace; font-size:0.75rem; letter-spacing:0.15em; color:#60a5fa; text-transform:uppercase; margin-bottom:0.5rem;">
    Algorithms Deep-Dive
</span>
<h1>Engineering the Grind: 1,000+ DSA Problems in C++</h1>
<div class="article-meta">
    <span><i class="far fa-calendar"></i> May 2026</span>
    <span class="dot">•</span>
    <span><i class="far fa-clock"></i> 4 min read</span>
    <span class="dot">•</span>
    <span class="tag">C++17</span>
    <span class="tag">Graph Theory</span>
    <span class="tag">Dynamic Programming</span>
    <span class="tag">System Design</span>
    <span class="dot">•</span>
    <a href="https://github.com/PRADEEPERIYASAMY/cpp-codes" target="_blank">
        <i class="fab fa-github"></i> View Source
    </a>
</div>
</header>

Write the recursive solution to Longest Common Subsequence the way it's taught — call yourself on the subproblem, then call yourself again — and it's correct on paper and useless in practice: the same overlapping subproblems get recomputed exponentially many times, and a input that should take microseconds instead times out. That gap between "the recursive definition is correct" and "the recursive *implementation* is usable" is what two months and 1,072 problems were actually spent closing — not learning algorithms in the abstract, but learning to see, on sight, when a correct-looking solution is about to time out.

*Volume doesn't teach you new algorithms — you already know Dijkstra's after the fifth time you write it. It teaches you the reflex of recognizing, from the shape of a problem alone, which of the algorithms you already know actually applies.*

## Deconstructing Graph Algorithms

Graph theory is often where standard data structures stop and real algorithm design begins. I didn't want to just memorize BFS/DFS; I wanted to understand the structural analysis of graphs from the ground up.

In the `basic/graph/` directory, I implemented the classics, but I made sure to implement the competing algorithms side-by-side to understand their trade-offs.

**Bellman-Ford exists because Dijkstra lies on negative weights.** Dijkstra's greedy choice — always expand the closest unvisited node — assumes a shorter path can never appear later. A negative edge breaks that assumption outright: a path that looked longer can become shorter once a negative edge is added to it, and Dijkstra has already moved on and won't reconsider. Bellman-Ford's answer is blunt but correct — relax every edge, V-1 times, no shortcuts — trading Dijkstra's near-linear speed for a guarantee that holds even when the graph lies about distances.

Kosaraju's and Tarjan's algorithms solve the identical problem — finding strongly connected components — via genuinely different mechanisms: Kosaraju's needs two full DFS passes (one on the graph, one on its transpose) and is easier to reason about; Tarjan's does it in a single pass using a low-link value, which is faster but noticeably harder to get right on a whiteboard. Implementing both wasn't redundant — it was the fastest way to understand why the harder single-pass version is worth the extra complexity. 

By implementing cycle detection (directed and undirected), articulation points, and bridges, I learned how to analyze the skeleton of a network, rather than just traversing it.

## Unlocking Dynamic Programming

Dynamic Programming (DP) is notorious for being difficult to grasp because the state transitions are often invisible. The only way to get comfortable with DP is volume.

The DP section of this repository is the largest, containing over 90 problems broken down into recognizable patterns:
- **Classic State Transitions:** 0/1 Knapsack, Coin Change, Edit Distance, and Matrix Chain Multiplication.
- **String & Sequence DP:** Longest Palindromic Subsequence, regex/wildcard matching, and Word Break.
- **2D / Interval DP:** The classic Egg Dropping puzzle, Burst Balloons, and optimal Binary Search Trees.
- **Combinatorial DP:** Catalan numbers, counting BSTs, and Bitmask DP.

Writing these out locally in C++ forced me to think deeply about state memoization and tabulation. The transition from writing a naive recursive solution that times out to an $O(N^2)$ tabulated solution is the core skill that this section built.

## Pattern Recognition & System Design

After building the basics by topic, I did a second full pass organized purely by **interview pattern** rather than topic (e.g., sliding window, two-pointer, backtracking, greedy). This forced a shift in my thinking: instead of knowing I was in the "Graphs" folder and therefore needing to write a graph algorithm, I had to recognize the underlying structure of the problem first.

Alongside this, I tackled foundational System Design problems locally.

**LRU cache eviction is a two-structure problem disguised as a one-structure problem.** A hash map alone gives O(1) lookup but no ordering — you can't cheaply find "the least recently used" entry. A linked list alone gives you ordering — move-to-front is trivial — but finding a specific key means an O(n) walk. Neither structure alone hits O(1) for both operations; the standard LRU implementation is a hash map holding *pointers into* a doubly linked list, so a lookup is O(1) and a move-to-front, once you have the pointer, is also O(1). It's the same "wrong tool alone, right tools combined" lesson that runs through good system design generally.

## Honest Trade-offs & What's Next

Since this is explicitly a practice archive rather than a cohesive software system, the trade-offs are about scope rather than technical debt:

1. **No shared test harness.** Each file is self-contained and hand-verified against its own test cases at the time; there's no unified suite that re-validates all 1,072 solutions today, so correctness here is a historical snapshot, not a continuously-verified one.
2. **Breadth over depth, by design.** A LeetCode-style curated profile shows depth on fewer, harder problems with tracked difficulty and acceptance history; this repo shows the opposite — raw breadth across topics, which is the more useful signal for "did this person build real intuition across the whole field," not "can they solve today's hard problem."

<div class="article-cta">
    <p>View the full archive of 1,000+ algorithms implemented in C++.</p>
    <div class="cta-links">
        <a href="https://github.com/PRADEEPERIYASAMY/cpp-codes" target="_blank"><i class="fab fa-github"></i> View Source</a>
        <a href="../index.html#projects"><i class="fas fa-layer-group"></i> More Projects</a>
        <a href="https://linkedin.com/in/pradeep-periyasamy-b385181a0" target="_blank"><i class="fab fa-linkedin"></i> Let's Connect</a>
    </div>
</div>
