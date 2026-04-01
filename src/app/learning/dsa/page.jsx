"use client";
import { useState, useEffect } from "react";

const PLAN = [
  {
    phase: "Phase 1: Foundation Refresh & Advanced Patterns",
    phaseColor: "#3b82f6",
    weeks: [
      {
        week: "Week 1",
        topic: "Advanced Array / String Techniques",
        questions: [
          { id: "a1", title: "Minimum Window Substring", difficulty: "Hard", note: "Multi-pointer sliding window with frequency map" },
          { id: "a2", title: "Longest Substring with At Most K Distinct Characters", difficulty: "Medium", note: "Variable window optimization" },
          { id: "a3", title: "Subarrays with K Different Integers", difficulty: "Hard", note: "At most K trick" },
          { id: "a4", title: "Trapping Rain Water", difficulty: "Hard", note: "Two pointer with max tracking" },
          { id: "a5", title: "Maximum Sum of 3 Non-Overlapping Subarrays", difficulty: "Hard", note: "Prefix tracking with DP" },
        ],
      },
      {
        week: "Week 1",
        topic: "Hash Maps & Sets Beyond Basics",
        questions: [
          { id: "b1", title: "LRU Cache", difficulty: "Medium", note: "HashMap + Doubly LinkedList" },
          { id: "b2", title: "Insert Delete GetRandom O(1)", difficulty: "Medium", note: "HashMap + ArrayList sync" },
          { id: "b3", title: "All O'one Data Structure", difficulty: "Hard", note: "Multi-level hashmap with DLL" },
          { id: "b4", title: "Substring with Concatenation of All Words", difficulty: "Hard", note: "Sliding window + frequency hash" },
          { id: "b5", title: "Longest Consecutive Sequence", difficulty: "Medium", note: "Set with intelligent iteration" },
        ],
      },
      {
        week: "Week 1",
        topic: "Stack / Queue Advanced Applications",
        questions: [
          { id: "c1", title: "Largest Rectangle in Histogram", difficulty: "Hard", note: "Monotonic stack classic" },
          { id: "c2", title: "Maximal Rectangle", difficulty: "Hard", note: "Histogram extension" },
          { id: "c3", title: "Sliding Window Maximum", difficulty: "Hard", note: "Monotonic deque" },
          { id: "c4", title: "Basic Calculator II/III", difficulty: "Hard", note: "Stack for expression evaluation" },
          { id: "c5", title: "Remove K Digits", difficulty: "Medium", note: "Monotonic stack for lexicographic order" },
        ],
      },
      {
        week: "Week 2",
        topic: "Trees Beyond Traversals",
        questions: [
          { id: "d1", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", note: "Tree DP with global state" },
          { id: "d2", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", note: "Multiple approaches" },
          { id: "d3", title: "Lowest Common Ancestor of Binary Tree", difficulty: "Medium", note: "Path tracking variations" },
          { id: "d4", title: "Binary Tree Cameras", difficulty: "Hard", note: "Greedy tree DP" },
          { id: "d5", title: "Recover Binary Search Tree", difficulty: "Medium", note: "Morris traversal application" },
        ],
      },
      {
        week: "Week 2",
        topic: "Graph Algorithms Deep Dive",
        questions: [
          { id: "e1", title: "Word Ladder II", difficulty: "Hard", note: "BFS + backtracking" },
          { id: "e2", title: "Alien Dictionary", difficulty: "Hard", note: "Topological sort with graph building" },
          { id: "e3", title: "Network Delay Time", difficulty: "Medium", note: "Dijkstra's algorithm" },
          { id: "e4", title: "Swim in Rising Water", difficulty: "Hard", note: "Binary search + BFS or Union-Find" },
          { id: "e5", title: "Critical Connections in a Network", difficulty: "Hard", note: "Tarjan's algorithm for bridges" },
        ],
      },
    ],
  },
  {
    phase: "Phase 2: Advanced Topics",
    phaseColor: "#a78bfa",
    weeks: [
      {
        week: "Week 3",
        topic: "DP Pattern Recognition",
        questions: [
          { id: "f1", title: "Longest Increasing Subsequence", difficulty: "Medium", note: "Multiple approaches (DP + Binary Search)" },
          { id: "f2", title: "Edit Distance", difficulty: "Medium", note: "Classic 2D DP with space optimization" },
          { id: "f3", title: "Maximal Square", difficulty: "Medium", note: "2D grid DP" },
          { id: "f4", title: "Distinct Subsequences", difficulty: "Hard", note: "String DP with optimization" },
          { id: "f5", title: "Interleaving String", difficulty: "Medium", note: "2D to 1D space optimization" },
        ],
      },
      {
        week: "Week 3",
        topic: "Advanced DP",
        questions: [
          { id: "g1", title: "Partition to K Equal Sum Subsets", difficulty: "Medium", note: "Bitmask DP" },
          { id: "g2", title: "Tree Diameter Variations", difficulty: "Hard", note: "Tree DP" },
          { id: "g3", title: "Count Numbers with Unique Digits", difficulty: "Medium", note: "Digit DP intro" },
          { id: "g4", title: "Number of Digit One", difficulty: "Hard", note: "Digit DP mastery" },
          { id: "g5", title: "Best Time to Buy and Sell Stock with Cooldown", difficulty: "Medium", note: "State machine DP" },
        ],
      },
      {
        week: "Week 4",
        topic: "Binary Search Mastery",
        questions: [
          { id: "h1", title: "Median of Two Sorted Arrays", difficulty: "Hard", note: "Binary search on partitions" },
          { id: "h2", title: "Koko Eating Bananas", difficulty: "Medium", note: "Binary search on answer" },
          { id: "h3", title: "Split Array Largest Sum", difficulty: "Hard", note: "Binary search + greedy validation" },
          { id: "h4", title: "Find K-th Smallest Pair Distance", difficulty: "Hard", note: "Binary search + two pointer" },
          { id: "h5", title: "Minimum Number of Days to Make m Bouquets", difficulty: "Medium", note: "BS on days" },
        ],
      },
      {
        week: "Week 4",
        topic: "Greedy & Game Theory",
        questions: [
          { id: "i1", title: "Jump Game II", difficulty: "Medium", note: "Greedy with range tracking" },
          { id: "i2", title: "Meeting Rooms II", difficulty: "Medium", note: "Interval scheduling with min heap" },
          { id: "i3", title: "Non-overlapping Intervals", difficulty: "Medium", note: "Greedy interval selection" },
          { id: "i4", title: "Stone Game II", difficulty: "Medium", note: "Minimax with DP" },
          { id: "i5", title: "Predict the Winner", difficulty: "Medium", note: "Game theory DP" },
        ],
      },
      {
        week: "Week 4",
        topic: "Backtracking Optimization",
        questions: [
          { id: "j1", title: "N-Queens II", difficulty: "Hard", note: "Backtracking with bit manipulation pruning" },
          { id: "j2", title: "Sudoku Solver", difficulty: "Hard", note: "Constraint propagation" },
          { id: "j3", title: "Word Search II", difficulty: "Hard", note: "Trie + backtracking with pruning" },
          { id: "j4", title: "Palindrome Partitioning II", difficulty: "Hard", note: "Backtracking + DP combination" },
          { id: "j5", title: "Expression Add Operators", difficulty: "Hard", note: "Backtracking with state management" },
        ],
      },
    ],
  },
  {
    phase: "Phase 3: Additional Critical Topics",
    phaseColor: "#10b981",
    weeks: [
      {
        week: "Week 5",
        topic: "Advanced Tree Structures",
        questions: [
          { id: "k1", title: "Count of Smaller Numbers After Self", difficulty: "Hard", note: "Binary Indexed Tree or Merge Sort" },
          { id: "k2", title: "Range Sum Query 2D - Mutable", difficulty: "Hard", note: "Segment Tree 2D" },
          { id: "k3", title: "The Skyline Problem", difficulty: "Hard", note: "Sweep line + TreeMap/Multiset" },
          { id: "k4", title: "Design In-Memory File System", difficulty: "Hard", note: "Trie with metadata" },
          { id: "k5", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", note: "Foundation + variations" },
        ],
      },
      {
        week: "Week 5",
        topic: "Bit Manipulation",
        questions: [
          { id: "l1", title: "Maximum XOR of Two Numbers in Array", difficulty: "Medium", note: "Trie on bits" },
          { id: "l2", title: "Single Number III", difficulty: "Medium", note: "XOR partitioning" },
          { id: "l3", title: "Concatenated Words", difficulty: "Hard", note: "Trie + DP" },
          { id: "l4", title: "Counting Bits", difficulty: "Medium", note: "DP with bit analysis" },
          { id: "l5", title: "Bitwise AND of Numbers Range", difficulty: "Medium", note: "Common prefix finding" },
        ],
      },
      {
        week: "Week 5",
        topic: "System Design Related (Coding Focus)",
        questions: [
          { id: "m1", title: "LFU Cache", difficulty: "Hard", note: "Multi-level data structure design" },
          { id: "m2", title: "Design Search Autocomplete System", difficulty: "Hard", note: "Trie + heap" },
          { id: "m3", title: "Design Twitter", difficulty: "Medium", note: "OOD with heap merge" },
          { id: "m4", title: "Design Hit Counter", difficulty: "Medium", note: "Time-series with circular buffer" },
          { id: "m5", title: "Snapshot Array", difficulty: "Medium", note: "Binary search + sparse storage" },
        ],
      },
      {
        week: "Week 6",
        topic: "Mixed Hard Problems",
        questions: [
          { id: "n1", title: "Regular Expression Matching", difficulty: "Hard", note: "DP with pattern matching" },
          { id: "n2", title: "Wildcard Matching", difficulty: "Hard", note: "DP variant" },
          { id: "n3", title: "Merge k Sorted Lists", difficulty: "Hard", note: "Heap with linked lists" },
          { id: "n4", title: "Reverse Nodes in k-Group", difficulty: "Hard", note: "Linked list pointer manipulation" },
          { id: "n5", title: "First Missing Positive", difficulty: "Hard", note: "In-place hash using array indices" },
        ],
      },
      {
        week: "Week 6",
        topic: "Google Style",
        tag: "Google",
        questions: [
          { id: "o1", title: "Valid Number", difficulty: "Hard", note: "State machine/parsing" },
          { id: "o2", title: "Minimum Window Subsequence", difficulty: "Hard", note: "Two pointer advanced" },
          { id: "o3", title: "Merge Intervals", difficulty: "Medium", note: "Must solve perfectly" },
          { id: "o4", title: "Decode Ways II", difficulty: "Hard", note: "DP with modular arithmetic" },
          { id: "o5", title: "Campus Bikes II", difficulty: "Medium", note: "State space search with pruning" },
        ],
      },
      {
        week: "Week 6",
        topic: "Meta Style",
        tag: "Meta",
        questions: [
          { id: "p1", title: "Valid Palindrome III", difficulty: "Hard", note: "DP for k deletions" },
          { id: "p2", title: "Binary Tree Vertical Order Traversal", difficulty: "Medium", note: "BFS with coordinate tracking" },
          { id: "p3", title: "Remove Invalid Parentheses", difficulty: "Hard", note: "BFS or backtracking" },
          { id: "p4", title: "Exclusive Time of Functions", difficulty: "Medium", note: "Stack for nested intervals" },
          { id: "p5", title: "Accounts Merge", difficulty: "Medium", note: "Union-Find with strings" },
        ],
      },
      {
        week: "Week 6",
        topic: "Amazon Style",
        tag: "Amazon",
        questions: [
          { id: "q1", title: "Reorganize String", difficulty: "Medium", note: "Greedy with heap" },
          { id: "q2", title: "K Closest Points to Origin", difficulty: "Medium", note: "QuickSelect or heap" },
          { id: "q3", title: "Copy List with Random Pointer", difficulty: "Medium", note: "HashMap iteration" },
          { id: "q4", title: "Number of Islands II", difficulty: "Hard", note: "Online Union-Find" },
          { id: "q5", title: "Word Break II", difficulty: "Hard", note: "DP + backtracking" },
        ],
      },
    ],
  },
];

const ALL_QUESTIONS = PLAN.flatMap(p => p.weeks.flatMap(w => w.questions));
const TOTAL = ALL_QUESTIONS.length;

const DIFFICULTY_COLOR = {
  Hard: { bg: "#3f1a1a", text: "#f87171", border: "#7f1d1d" },
  Medium: { bg: "#2d2a10", text: "#fbbf24", border: "#78350f" },
};

const TAG_COLOR = {
  Google: { bg: "#1e3a5f", text: "#60a5fa" },
  Meta: { bg: "#1e1a3a", text: "#a78bfa" },
  Amazon: { bg: "#1a2f1a", text: "#4ade80" },
};

export default function DSAPage() {
  const [done, setDone] = useState({});
  const [filter, setFilter] = useState("All");
  const [expandedPhases, setExpandedPhases] = useState({ 0: true, 1: false, 2: false });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("dsa-progress") || "{}");
      setDone(saved);
    } catch {}
  }, []);

  const toggle = (id) => {
    setDone(prev => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem("dsa-progress", JSON.stringify(next));
      return next;
    });
  };

  const doneCount = Object.values(done).filter(Boolean).length;
  const percent = Math.round((doneCount / TOTAL) * 100);

  const togglePhase = (i) =>
    setExpandedPhases(prev => ({ ...prev, [i]: !prev[i] }));

  const filters = ["All", "Hard", "Medium", "Google", "Meta", "Amazon"];

  const matchesFilter = (q, week) => {
    if (filter === "All") return true;
    if (filter === "Hard" || filter === "Medium") return q.difficulty === filter;
    return week.tag === filter;
  };

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100%", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@700;800&display=swap');
        .q-row { transition: background 0.15s; }
        .q-row:hover { background: rgba(255,255,255,0.04); }
        .q-check { cursor: pointer; transition: all 0.15s; }
        .q-check:hover { opacity: 0.8; }
        .phase-toggle { cursor: pointer; transition: background 0.15s; }
        .phase-toggle:hover { background: rgba(255,255,255,0.04); }
        .filter-btn { cursor: pointer; transition: all 0.15s; font-family: inherit; }
      `}</style>

      {/* Back */}
      <div style={{ padding: "12px 24px", borderBottom: "1px solid #1e1e2e" }}>
        <a href="/learning" style={{ fontSize: 12, color: "#4a4a6a", textDecoration: "none" }}>← Learning</a>
      </div>

      {/* Header */}
      <div style={{ padding: "32px 24px 24px", borderBottom: "1px solid #1e1e2e", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 8 }}>
          45-Day Plan
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#f0f0f5", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          DSA Practice — Top 5 per Topic
        </h1>
        <p style={{ fontSize: 12, color: "#555570", lineHeight: 1.6, margin: "0 0 24px" }}>
          {TOTAL} questions across 3 phases · Track your progress below
        </p>

        {/* Overall progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, height: 8, background: "#1e1e2e", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${percent}%`,
              background: `linear-gradient(90deg, #3b82f6, #a78bfa)`,
              borderRadius: 4, transition: "width 0.4s ease",
            }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", flexShrink: 0 }}>
            {doneCount}<span style={{ color: "#555570" }}>/{TOTAL}</span>
          </div>
          <div style={{ fontSize: 12, color: percent === 100 ? "#10b981" : "#555570", flexShrink: 0, minWidth: 40 }}>
            {percent}%
          </div>
        </div>

        {/* Phase mini bars */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {PLAN.map((phase, pi) => {
            const phaseQs = phase.weeks.flatMap(w => w.questions);
            const phaseDone = phaseQs.filter(q => done[q.id]).length;
            const phasePct = Math.round((phaseDone / phaseQs.length) * 100);
            return (
              <div key={pi} style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: phase.phaseColor, letterSpacing: "0.1em", marginBottom: 4, textTransform: "uppercase" }}>
                  P{pi + 1} · {phasePct}%
                </div>
                <div style={{ height: 3, background: "#1e1e2e", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${phasePct}%`, background: phase.phaseColor, borderRadius: 2, transition: "width 0.4s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
          {filters.map(f => (
            <button
              key={f}
              className="filter-btn"
              onClick={() => setFilter(f)}
              style={{
                padding: "4px 12px", borderRadius: 4, border: `1px solid ${filter === f ? "#3b82f6" : "#1e2d3d"}`,
                background: filter === f ? "rgba(59,130,246,0.15)" : "transparent",
                color: filter === f ? "#60a5fa" : "#555570",
                fontSize: 11, letterSpacing: "0.08em",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Phases */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 24px 48px" }}>
        {PLAN.map((phase, pi) => {
          const phaseQs = phase.weeks.flatMap(w => w.questions);
          const phaseDone = phaseQs.filter(q => done[q.id]).length;
          const isOpen = expandedPhases[pi];

          return (
            <div key={pi} style={{ marginBottom: 12, border: "1px solid #1e1e2e", borderRadius: 10, overflow: "hidden" }}>
              {/* Phase header */}
              <div
                className="phase-toggle"
                onClick={() => togglePhase(pi)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 20px", background: "#111118", borderLeft: `3px solid ${phase.phaseColor}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, color: phase.phaseColor, fontWeight: 700 }}>
                    {isOpen ? "▼" : "▶"}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f5", fontFamily: "'Syne', sans-serif" }}>
                    {phase.phase}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 80, height: 4, background: "#1e1e2e", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.round((phaseDone / phaseQs.length) * 100)}%`, background: phase.phaseColor, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#555570", fontFamily: "monospace" }}>
                    {phaseDone}/{phaseQs.length}
                  </span>
                </div>
              </div>

              {isOpen && phase.weeks.map((week, wi) => {
                const weekQs = week.questions.filter(q => matchesFilter(q, week));
                if (weekQs.length === 0) return null;
                const weekDone = week.questions.filter(q => done[q.id]).length;

                return (
                  <div key={wi} style={{ borderTop: "1px solid #1e1e2e" }}>
                    {/* Week/topic header */}
                    <div style={{ padding: "10px 20px", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 9, color: "#555570", letterSpacing: "0.1em", textTransform: "uppercase" }}>{week.week}</span>
                        <span style={{ color: "#2a2a3a" }}>·</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#8888aa" }}>{week.topic}</span>
                        {week.tag && (
                          <span style={{
                            fontSize: 9, padding: "2px 7px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.08em",
                            background: TAG_COLOR[week.tag]?.bg, color: TAG_COLOR[week.tag]?.text,
                          }}>
                            {week.tag}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 10, color: weekDone === week.questions.length ? "#10b981" : "#555570" }}>
                        {weekDone}/{week.questions.length}
                        {weekDone === week.questions.length && " ✓"}
                      </span>
                    </div>

                    {/* Questions */}
                    {weekQs.map((q, qi) => {
                      const dc = DIFFICULTY_COLOR[q.difficulty];
                      const isDone = !!done[q.id];
                      return (
                        <div
                          key={q.id}
                          className="q-row"
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 14,
                            padding: "12px 20px",
                            borderTop: "1px solid #12121a",
                            opacity: isDone ? 0.5 : 1,
                          }}
                        >
                          {/* Checkbox */}
                          <div
                            className="q-check"
                            onClick={() => toggle(q.id)}
                            style={{
                              width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                              border: `1.5px solid ${isDone ? "#10b981" : "#2a2a3a"}`,
                              background: isDone ? "#10b981" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            {isDone && <span style={{ fontSize: 10, color: "#000", fontWeight: 700 }}>✓</span>}
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{
                                fontSize: 13, fontWeight: 500,
                                color: isDone ? "#555570" : "#e2e8f0",
                                textDecoration: isDone ? "line-through" : "none",
                              }}>
                                {q.title}
                              </span>
                              <span style={{
                                fontSize: 9, padding: "2px 6px", borderRadius: 3, fontWeight: 700,
                                background: dc.bg, color: dc.text, border: `1px solid ${dc.border}`,
                              }}>
                                {q.difficulty}
                              </span>
                            </div>
                            <div style={{ fontSize: 11, color: "#555570", marginTop: 3, lineHeight: 1.5 }}>
                              {q.note}
                            </div>
                          </div>

                          {/* Index */}
                          <span style={{ fontSize: 10, color: "#2a2a3a", flexShrink: 0, marginTop: 2, fontFamily: "monospace" }}>
                            {String(qi + 1).padStart(2, "0")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Practice strategy */}
        <div style={{ marginTop: 24, border: "1px solid #1e2d3d", borderRadius: 10, padding: "20px", background: "rgba(59,130,246,0.05)" }}>
          <div style={{ fontSize: 10, color: "#3b82f6", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            Practice Strategy per Question
          </div>
          {[
            ["01", "Attempt blind (20–30 min)", "Don't look at hints"],
            ["02", "If stuck: read pattern, retry", "20 more minutes"],
            ["03", "Study optimal solution", "Understand why it's optimal"],
            ["04", "Code from scratch", "Without looking at solution"],
            ["05", "Review alternatives", "Learn 2–3 different approaches"],
            ["06", "Revisit after 3 days", "Can you solve it again?"],
          ].map(([num, step, sub]) => (
            <div key={num} style={{ display: "flex", gap: 14, marginBottom: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 10, color: "#3b82f6", fontFamily: "monospace", flexShrink: 0, marginTop: 1 }}>{num}</span>
              <div>
                <div style={{ fontSize: 12, color: "#8888aa" }}>{step}</div>
                <div style={{ fontSize: 11, color: "#555570" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
