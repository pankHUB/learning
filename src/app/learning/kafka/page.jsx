"use client";
import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0a0f",
  surface: "#111118",
  surfaceHigh: "#1a1a24",
  border: "#2a2a3a",
  amber: "#f59e0b",
  amberDim: "#92400e",
  green: "#10b981",
  greenDim: "#064e3b",
  red: "#f87171",
  blue: "#60a5fa",
  purple: "#a78bfa",
  textPrimary: "#f0f0f5",
  textSecondary: "#8888aa",
  textDim: "#555570",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; }

  .kafka-root {
    background: ${COLORS.bg};
    color: ${COLORS.textPrimary};
    font-family: 'JetBrains Mono', monospace;
  }

  .app { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }

  .hero {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 48px;
    padding-bottom: 40px;
    border-bottom: 1px solid ${COLORS.border};
    position: relative;
  }
  .hero::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0;
    width: 120px; height: 2px;
    background: ${COLORS.amber};
  }
  .hero-badge {
    background: ${COLORS.amberDim};
    color: ${COLORS.amber};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    padding: 4px 10px;
    border-radius: 2px;
    text-transform: uppercase;
    white-space: nowrap;
    margin-top: 6px;
  }
  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 800;
    line-height: 1.1;
    color: ${COLORS.textPrimary};
    letter-spacing: -0.02em;
  }
  .hero h1 span { color: ${COLORS.amber}; }
  .hero p {
    margin-top: 10px;
    color: ${COLORS.textSecondary};
    font-size: 13px;
    line-height: 1.7;
    max-width: 600px;
  }

  .nav {
    display: flex;
    gap: 4px;
    margin-bottom: 32px;
    background: ${COLORS.surface};
    padding: 4px;
    border-radius: 6px;
    border: 1px solid ${COLORS.border};
    flex-wrap: wrap;
  }
  .nav-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    color: ${COLORS.textSecondary};
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.05em;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .nav-btn:hover { color: ${COLORS.textPrimary}; background: ${COLORS.surfaceHigh}; }
  .nav-btn.active {
    background: ${COLORS.amber};
    color: #000;
    font-weight: 700;
  }

  .card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
  }
  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: ${COLORS.textPrimary};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .card-title .dot {
    width: 8px; height: 8px;
    background: ${COLORS.amber};
    border-radius: 50%;
    flex-shrink: 0;
  }

  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media(max-width:640px) { .grid2 { grid-template-columns: 1fr; } }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  @media(max-width:640px) { .grid3 { grid-template-columns: 1fr; } }

  .concept-chip {
    background: ${COLORS.surfaceHigh};
    border: 1px solid ${COLORS.border};
    border-radius: 6px;
    padding: 16px;
    transition: border-color 0.2s;
    cursor: default;
  }
  .concept-chip:hover { border-color: ${COLORS.amber}; }
  .concept-chip .label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${COLORS.amber};
    margin-bottom: 6px;
  }
  .concept-chip .title {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: ${COLORS.textPrimary};
    margin-bottom: 6px;
  }
  .concept-chip .desc {
    font-size: 11px;
    color: ${COLORS.textSecondary};
    line-height: 1.6;
  }

  /* Partition Visualizer */
  .partition-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .partition-label {
    font-size: 10px;
    color: ${COLORS.textSecondary};
    width: 28px;
    flex-shrink: 0;
    letter-spacing: 0.05em;
  }
  .partition-track {
    flex: 1;
    height: 36px;
    background: ${COLORS.surfaceHigh};
    border: 1px solid ${COLORS.border};
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 0 6px;
  }
  .msg-block {
    height: 22px;
    min-width: 28px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.05em;
    flex-shrink: 0;
    transition: all 0.3s;
    animation: slideIn 0.3s ease-out;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .msg-new {
    box-shadow: 0 0 8px currentColor;
    animation: pulse 0.6s ease-out;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 12px currentColor; }
    100% { box-shadow: 0 0 0px transparent; }
  }

  /* Flow Diagram */
  .flow-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 24px 0;
    position: relative;
    overflow-x: auto;
  }
  .flow-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .flow-box {
    border: 1.5px solid;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    min-width: 80px;
  }
  .flow-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }
  .arrow-line {
    width: 40px;
    height: 1px;
    position: relative;
  }
  .arrow-line::after {
    content: '▶';
    position: absolute;
    right: -4px;
    top: -6px;
    font-size: 11px;
    color: ${COLORS.amber};
  }
  .packet {
    width: 8px; height: 8px;
    border-radius: 50%;
    position: absolute;
    top: -3.5px;
    animation: travel 1.4s ease-in-out infinite;
  }
  @keyframes travel {
    0% { left: 0; opacity: 1; }
    80% { left: 32px; opacity: 1; }
    100% { left: 36px; opacity: 0; }
  }

  /* Consumer Groups */
  .group-box {
    border: 1.5px solid;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 12px;
    transition: all 0.2s;
  }
  .group-header {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .consumer-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 6px;
  }
  .consumer-pill {
    background: ${COLORS.surfaceHigh};
    border: 1px solid ${COLORS.border};
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 10px;
    transition: all 0.2s;
  }
  .consumer-pill.active {
    border-color: ${COLORS.green};
    color: ${COLORS.green};
  }
  .consumer-pill.idle {
    border-color: ${COLORS.textDim};
    color: ${COLORS.textDim};
    text-decoration: line-through;
  }

  /* Offset table */
  .offset-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }
  .offset-table th {
    text-align: left;
    padding: 8px 12px;
    color: ${COLORS.textDim};
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-bottom: 1px solid ${COLORS.border};
    font-weight: 500;
  }
  .offset-table td {
    padding: 8px 12px;
    border-bottom: 1px solid ${COLORS.surfaceHigh};
    color: ${COLORS.textSecondary};
  }
  .offset-table td:first-child { color: ${COLORS.blue}; }
  .offset-table td:last-child { color: ${COLORS.green}; font-weight: 600; }
  .offset-table tr:last-child td { border-bottom: none; }

  /* Config explorer */
  .config-section { margin-bottom: 24px; }
  .config-section-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${COLORS.amber};
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid ${COLORS.amberDim};
  }
  .config-item {
    border: 1px solid ${COLORS.border};
    border-radius: 6px;
    margin-bottom: 6px;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .config-item:hover { border-color: ${COLORS.amber}40; }
  .config-item.expanded { border-color: ${COLORS.amber}80; }
  .config-key {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    cursor: pointer;
    background: ${COLORS.surfaceHigh};
  }
  .config-key code {
    font-size: 12px;
    color: ${COLORS.green};
    font-weight: 500;
  }
  .config-value-badge {
    font-size: 10px;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    padding: 2px 8px;
    border-radius: 3px;
    color: ${COLORS.amber};
  }
  .config-expand {
    font-size: 10px;
    color: ${COLORS.textDim};
    margin-left: 8px;
  }
  .config-detail {
    padding: 12px 14px;
    background: ${COLORS.bg};
    border-top: 1px solid ${COLORS.border};
    font-size: 11px;
    color: ${COLORS.textSecondary};
    line-height: 1.7;
  }
  .config-detail .impact {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 10px;
    padding: 3px 8px;
    border-radius: 3px;
    font-weight: 600;
  }
  .impact-high { background: #f8717120; color: ${COLORS.red}; }
  .impact-med { background: #f59e0b20; color: ${COLORS.amber}; }
  .impact-low { background: #10b98120; color: ${COLORS.green}; }

  /* Quiz */
  .quiz-q {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: ${COLORS.textPrimary};
    margin-bottom: 16px;
    line-height: 1.4;
  }
  .quiz-opts { display: flex; flex-direction: column; gap: 8px; }
  .quiz-opt {
    border: 1.5px solid ${COLORS.border};
    border-radius: 6px;
    padding: 12px 16px;
    cursor: pointer;
    font-size: 12px;
    color: ${COLORS.textSecondary};
    transition: all 0.15s;
    background: ${COLORS.surfaceHigh};
    text-align: left;
  }
  .quiz-opt:hover:not(.revealed) { border-color: ${COLORS.amber}60; color: ${COLORS.textPrimary}; }
  .quiz-opt.correct { border-color: ${COLORS.green}; color: ${COLORS.green}; background: ${COLORS.greenDim}40; }
  .quiz-opt.wrong { border-color: ${COLORS.red}; color: ${COLORS.red}; background: #f8717110; }
  .quiz-opt.revealed { cursor: default; }
  .quiz-explanation {
    margin-top: 14px;
    padding: 12px 14px;
    background: ${COLORS.surfaceHigh};
    border-left: 3px solid ${COLORS.green};
    border-radius: 0 6px 6px 0;
    font-size: 12px;
    color: ${COLORS.textSecondary};
    line-height: 1.7;
    animation: fadeIn 0.3s ease-out;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  .quiz-progress {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
  }
  .qp-dot {
    height: 4px;
    flex: 1;
    border-radius: 2px;
    background: ${COLORS.border};
    transition: background 0.3s;
  }
  .qp-dot.done { background: ${COLORS.green}; }
  .qp-dot.current { background: ${COLORS.amber}; }

  .btn {
    padding: 9px 20px;
    border: none;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.15s;
    text-transform: uppercase;
  }
  .btn-primary { background: ${COLORS.amber}; color: #000; }
  .btn-primary:hover { background: #fbbf24; }
  .btn-ghost {
    background: transparent;
    border: 1px solid ${COLORS.border};
    color: ${COLORS.textSecondary};
  }
  .btn-ghost:hover { border-color: ${COLORS.amber}; color: ${COLORS.amber}; }

  .tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .tag-amber { background: ${COLORS.amberDim}; color: ${COLORS.amber}; }
  .tag-green { background: ${COLORS.greenDim}; color: ${COLORS.green}; }
  .tag-blue { background: #1e3a5f; color: ${COLORS.blue}; }
  .tag-red { background: #3f1a1a; color: ${COLORS.red}; }

  .mono { font-family: 'JetBrains Mono', monospace; }

  .callout {
    border-left: 3px solid ${COLORS.amber};
    background: ${COLORS.amberDim}20;
    padding: 12px 16px;
    border-radius: 0 6px 6px 0;
    font-size: 12px;
    color: ${COLORS.textSecondary};
    line-height: 1.7;
    margin: 12px 0;
  }
  .callout strong { color: ${COLORS.amber}; font-weight: 600; }

  .scroll-fade {
    animation: fadeUp 0.4s ease-out both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const MSG_COLORS = [
  { bg: "#1a2f1a", color: "#4ade80", border: "#166534" },
  { bg: "#1a1f3a", color: "#60a5fa", border: "#1e3a5f" },
  { bg: "#2d1a1a", color: "#f87171", border: "#7f1d1d" },
  { bg: "#2d2a10", color: "#fbbf24", border: "#78350f" },
  { bg: "#1e1a2d", color: "#a78bfa", border: "#4c1d95" },
];

const CONFIGS = {
  producer: [
    {
      key: "acks",
      default: "all",
      desc: "How many broker acknowledgments the producer requires before considering a request complete. '0' = fire & forget, '1' = leader only, 'all' = all ISR replicas. Controls durability vs. latency tradeoff.",
      impact: "high",
      tip: "Use 'all' in production. Saves you from silent data loss during broker failover.",
    },
    {
      key: "enable.idempotence",
      default: "true",
      desc: "Ensures each message is delivered exactly once to a partition even if the producer retries. Automatically forces acks=all and enables sequence numbers per partition.",
      impact: "high",
      tip: "Always enable in production. Pairs with retries=MAX_INT for safe retry without duplicates.",
    },
    {
      key: "linger.ms",
      default: "5",
      desc: "Time to wait before sending a batch to allow more messages to accumulate. 0 = send immediately. Higher values increase throughput at the cost of latency.",
      impact: "med",
      tip: "0 for real-time, 5–20 for high-throughput pipelines.",
    },
    {
      key: "batch.size",
      default: "16384",
      desc: "Max bytes per batch per partition. Larger batches = fewer network requests = better throughput. Works together with linger.ms.",
      impact: "med",
      tip: "Increase to 65536 or 131072 for bulk pipelines.",
    },
    {
      key: "compression.type",
      default: "snappy",
      desc: "Compresses batches before sending. Options: none, gzip, snappy, lz4, zstd. snappy = good CPU/ratio balance. zstd = best compression. gzip = most compatible.",
      impact: "low",
      tip: "snappy is the pragmatic default. Use zstd if disk/bandwidth is a bottleneck.",
    },
  ],
  consumer: [
    {
      key: "group.id",
      default: '"my-service"',
      desc: "Identifies the consumer group. All instances with the same group.id share partition assignment. Different group.id = independent read cursor (fan-out). The single most important consumer config.",
      impact: "high",
      tip: "Use service name as group.id. NEVER share group.id across different services.",
    },
    {
      key: "auto.offset.reset",
      default: "earliest",
      desc: "What to do when no committed offset exists (new group or offset expired). 'earliest' = replay from beginning. 'latest' = only new messages. 'none' = throw exception.",
      impact: "high",
      tip: "earliest for new services that need full history, latest for event listeners that only care about new events.",
    },
    {
      key: "enable.auto.commit",
      default: "false",
      desc: "Auto-commits offset after auto.commit.interval.ms. Convenient but dangerous — commits before your processing finishes = message loss on crash. Disable for any critical processing.",
      impact: "high",
      tip: "Always false in production. Commit manually after successful processing.",
    },
    {
      key: "max.poll.interval.ms",
      default: "300000",
      desc: "Max time between poll() calls. If exceeded, Kafka assumes consumer is dead, triggers rebalance, and removes it from the group. The #1 source of unexpected rebalances.",
      impact: "high",
      tip: "Increase if processing is slow, or reduce max.poll.records to process fewer messages per batch.",
    },
    {
      key: "max.poll.records",
      default: "500",
      desc: "Max records returned per poll() call. Controls how much work you commit to between polls. Lower = more frequent commits, less reprocessing on failure.",
      impact: "med",
      tip: "Tune in tandem with max.poll.interval.ms. 50–100 for slow processing, 500–1000 for fast pipelines.",
    },
  ],
  broker: [
    {
      key: "min.insync.replicas",
      default: "2",
      desc: "Min number of replicas that must acknowledge a write when acks=all. If ISR drops below this, broker rejects writes with NotEnoughReplicasException. Critical for durability.",
      impact: "high",
      tip: "Golden rule: RF=3, min.insync.replicas=2. Tolerates 1 broker failure without data loss.",
    },
    {
      key: "log.retention.hours",
      default: "168",
      desc: "How long to retain log segments (7 days default). Messages are deleted after this regardless of whether all consumers have read them.",
      impact: "med",
      tip: "Monitor consumer lag. If a group lags longer than retention, it loses messages.",
    },
    {
      key: "log.segment.bytes",
      default: "1073741824",
      desc: "Size at which Kafka rolls to a new log segment file (1GB default). Smaller segments = more frequent rolls = finer-grained retention control.",
      impact: "low",
      tip: "Default is fine. Decrease only if you need faster cleanup of expired data.",
    },
    {
      key: "cleanup.policy",
      default: "delete",
      desc: "What to do with old log segments. 'delete' = remove after retention. 'compact' = keep latest value per key forever (useful for state/CDC topics). Can combine: 'delete,compact'.",
      impact: "med",
      tip: "Use 'compact' for changelog topics (Kafka Streams, CDC). 'delete' for event streams.",
    },
  ],
};

const QUIZ = [
  {
    q: "You have 3 partitions and want 2 independent services to each receive ALL messages. How should you configure this?",
    opts: [
      "Both services share the same group.id",
      "Each service uses a different group.id",
      "Use 6 partitions, 3 per service",
      "Configure acks=all on both consumers",
    ],
    answer: 1,
    explanation: "Different group.id = independent offset cursor = fan-out. Each service reads the full stream independently. Sharing a group.id would split messages between them.",
  },
  {
    q: "You have 6 partitions and 8 consumers in the same group.id. What happens?",
    opts: [
      "All 8 consumers share the work across 6 partitions equally",
      "Kafka automatically creates 2 more partitions",
      "6 consumers each own 1 partition, 2 consumers are idle",
      "Kafka rejects the connection of the extra consumers",
    ],
    answer: 2,
    explanation: "Partitions are the ceiling for parallelism. A partition can only be assigned to one consumer per group. Extra consumers above partition count sit idle.",
  },
  {
    q: "A consumer is being kicked out of its group repeatedly. What's the most likely cause?",
    opts: [
      "Wrong group.id configured",
      "Processing takes longer than max.poll.interval.ms",
      "acks is set to 0",
      "Too many partitions on the topic",
    ],
    answer: 1,
    explanation: "If poll() isn't called within max.poll.interval.ms, Kafka assumes the consumer is dead and triggers a rebalance. Fix: increase max.poll.interval.ms or reduce max.poll.records.",
  },
  {
    q: "For strong durability with replication.factor=3, what's the recommended min.insync.replicas?",
    opts: ["1", "2", "3", "Does not matter with acks=all"],
    answer: 1,
    explanation: "min.insync.replicas=2 with RF=3 means writes need 2 replicas to confirm. You can lose 1 broker and still accept writes. Setting it to 3 means any broker failure stops writes.",
  },
  {
    q: "Which producer setting prevents duplicate messages during retries after a network error?",
    opts: [
      "acks=all",
      "retries=0",
      "enable.idempotence=true",
      "compression.type=snappy",
    ],
    answer: 2,
    explanation: "enable.idempotence=true gives each producer instance a unique ID and assigns sequence numbers per partition. Broker deduplicates retries using these — exactly-once delivery per partition.",
  },
  {
    q: "What does auto.offset.reset=earliest do for a brand new consumer group?",
    opts: [
      "Reads only messages produced after the consumer started",
      "Throws an exception since there's no committed offset",
      "Replays from the very beginning of the topic's retained log",
      "Starts from the middle of the log",
    ],
    answer: 2,
    explanation: "'earliest' means: when no committed offset exists, start from the oldest available message in the partition. Perfect for new services that need full history replay.",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function PartitionVisualizer() {
  const [partitions, setPartitions] = useState([[], [], []]);
  const [msgCount, setMsgCount] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(null);

  const addMessage = () => {
    const key = ["order", "user", "payment", "event"][Math.floor(Math.random() * 4)];
    const partIdx = Math.abs(key.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 0)) % 3;
    const colorIdx = msgCount % MSG_COLORS.length;
    const msg = { id: msgCount, key, offset: partitions[partIdx].length, colorIdx, isNew: true };

    setPartitions(prev => {
      const next = prev.map(p => p.map(m => ({ ...m, isNew: false })));
      next[partIdx] = [...next[partIdx], msg];
      return next;
    });
    setMsgCount(c => c + 1);
  };

  const reset = () => {
    setPartitions([[], [], []]);
    setMsgCount(0);
  };

  useEffect(() => {
    if (autoPlay) {
      autoRef.current = setInterval(() => {
        const key = ["order", "user", "payment", "event"][Math.floor(Math.random() * 4)];
        const partIdx = Math.abs(key.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 0)) % 3;
        setMsgCount(c => {
          const colorIdx = c % MSG_COLORS.length;
          const msg = { id: c, key, offset: 0, colorIdx, isNew: true };
          setPartitions(prev => {
            const next = prev.map(p => p.map(m => ({ ...m, isNew: false })));
            msg.offset = next[partIdx].length;
            next[partIdx] = [...next[partIdx], msg];
            return next;
          });
          return c + 1;
        });
      }, 700);
    } else {
      clearInterval(autoRef.current);
    }
    return () => clearInterval(autoRef.current);
  }, [autoPlay]);

  return (
    <div className="card">
      <div className="card-title"><span className="dot" />Topic Partition Visualizer</div>
      <div className="callout">
        <strong>Key insight:</strong> Messages with the same <strong>key</strong> always route to the same partition (via key hash). This guarantees ordering per entity (e.g., all orders for a customer).
      </div>
      <div style={{ marginBottom: 16 }}>
        {partitions.map((msgs, i) => (
          <div className="partition-row" key={i}>
            <div className="partition-label">P{i}</div>
            <div className="partition-track">
              {msgs.slice(-14).map(m => {
                const c = MSG_COLORS[m.colorIdx];
                return (
                  <div
                    key={m.id}
                    className={`msg-block ${m.isNew ? "msg-new" : ""}`}
                    style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
                    title={`key: ${m.key} | offset: ${m.offset}`}
                  >
                    {m.offset}
                  </div>
                );
              })}
              {msgs.length === 0 && (
                <span style={{ fontSize: 10, color: COLORS.textDim }}>empty</span>
              )}
            </div>
            <span style={{ fontSize: 10, color: COLORS.textDim, width: 20, textAlign: "right" }}>
              {msgs.length}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={addMessage}>+ Produce Message</button>
        <button
          className="btn btn-ghost"
          onClick={() => setAutoPlay(a => !a)}
          style={autoPlay ? { borderColor: COLORS.red, color: COLORS.red } : {}}
        >
          {autoPlay ? "⏹ Stop" : "▶ Auto Play"}
        </button>
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
        <span style={{ fontSize: 10, color: COLORS.textDim, marginLeft: "auto" }}>
          {msgCount} messages produced
        </span>
      </div>
    </div>
  );
}

function FanoutVisualizer() {
  const [offsets, setOffsets] = useState({
    "email-service": 0,
    "inventory-service": 0,
    "analytics-service": 0,
  });
  const [total, setTotal] = useState(6);
  const [animGroup, setAnimGroup] = useState(null);

  const groups = [
    { id: "email-service", color: COLORS.blue, label: "email-service" },
    { id: "inventory-service", color: COLORS.green, label: "inventory-service" },
    { id: "analytics-service", color: COLORS.purple, label: "analytics-service" },
  ];

  const produce = () => setTotal(t => t + 1);

  const consume = (gid) => {
    setOffsets(prev => {
      if (prev[gid] >= total) return prev;
      return { ...prev, [gid]: prev[gid] + 1 };
    });
    setAnimGroup(gid);
    setTimeout(() => setAnimGroup(null), 500);
  };

  const resetGroup = (gid) => setOffsets(prev => ({ ...prev, [gid]: 0 }));

  return (
    <div className="card">
      <div className="card-title"><span className="dot" />Fan-out: Independent Offset Cursors</div>

      {/* Log */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Topic Log (single partition for simplicity)
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 32, height: 32, border: `1px solid ${COLORS.border}`,
                borderRadius: 4, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 10, fontWeight: 700,
                background: COLORS.surfaceHigh, color: COLORS.textSecondary,
                position: "relative",
              }}
            >
              {i}
            </div>
          ))}
          <div
            style={{
              width: 32, height: 32, border: `2px dashed ${COLORS.amber}60`,
              borderRadius: 4, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 16, color: COLORS.amber,
              cursor: "pointer",
            }}
            onClick={produce}
            title="Produce new message"
          >
            +
          </div>
        </div>
      </div>

      {/* Groups */}
      {groups.map(g => {
        const lag = total - offsets[g.id];
        return (
          <div
            key={g.id}
            className="group-box"
            style={{
              borderColor: animGroup === g.id ? g.color : COLORS.border,
              boxShadow: animGroup === g.id ? `0 0 12px ${g.color}30` : "none",
            }}
          >
            <div className="group-header" style={{ color: g.color }}>
              <span style={{ fontSize: 14 }}>▣</span>
              {g.label}
              <span className="tag" style={{ background: `${g.color}20`, color: g.color, marginLeft: "auto" }}>
                lag: {lag}
              </span>
            </div>

            {/* Progress bar */}
            <div style={{
              height: 6, background: COLORS.border, borderRadius: 3, marginBottom: 10, overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${total > 0 ? (offsets[g.id] / total) * 100 : 0}%`,
                background: g.color, borderRadius: 3, transition: "width 0.3s",
              }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: COLORS.textSecondary }}>
                committed offset: <span style={{ color: g.color, fontWeight: 700 }}>{offsets[g.id]}</span> / {total}
              </span>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 10, padding: "4px 12px" }}
                onClick={() => consume(g.id)}
                disabled={offsets[g.id] >= total}
              >
                poll() →
              </button>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 10, padding: "4px 12px" }}
                onClick={() => resetGroup(g.id)}
              >
                reset cursor
              </button>
            </div>
          </div>
        );
      })}

      <div className="callout" style={{ marginTop: 12 }}>
        <strong>Notice:</strong> Each group has its own offset cursor. Clicking <strong>poll()</strong> on one group doesn't affect others. Click <strong>reset cursor</strong> on analytics to simulate replaying history — other groups are unaffected.
      </div>
    </div>
  );
}

function ConsumerGroupScaling() {
  const [consumers, setConsumers] = useState(2);
  const partitions = 6;

  const assignments = (() => {
    const result = Array.from({ length: consumers }, () => []);
    for (let p = 0; p < partitions; p++) {
      if (p < consumers) result[p % consumers].push(p);
    }
    return result;
  })();

  const idleCount = Math.max(0, consumers - partitions);

  return (
    <div className="card">
      <div className="card-title"><span className="dot" />Consumer Group Scaling ({partitions} partitions)</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Consumers in group:</span>
        {[1, 2, 3, 6, 8].map(n => (
          <button
            key={n}
            className="btn"
            style={{
              padding: "6px 14px", fontSize: 11,
              background: consumers === n ? COLORS.amber : COLORS.surfaceHigh,
              color: consumers === n ? "#000" : COLORS.textSecondary,
              border: `1px solid ${consumers === n ? COLORS.amber : COLORS.border}`,
            }}
            onClick={() => setConsumers(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {Array.from({ length: consumers }).map((_, i) => (
          <div
            key={i}
            style={{
              border: `1.5px solid ${i >= partitions ? COLORS.textDim : COLORS.green}`,
              borderRadius: 6,
              padding: "8px 12px",
              minWidth: 90,
              opacity: i >= partitions ? 0.4 : 1,
            }}
          >
            <div style={{ fontSize: 10, color: i >= partitions ? COLORS.textDim : COLORS.green, fontWeight: 700, marginBottom: 6, letterSpacing: "0.05em" }}>
              {i >= partitions ? "IDLE" : "CONSUMER"} {i + 1}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {assignments[i]?.map(p => (
                <span key={p} className="tag tag-green" style={{ fontSize: 9 }}>P{p}</span>
              ))}
              {i >= partitions && <span style={{ fontSize: 10, color: COLORS.textDim }}>no partition</span>}
            </div>
          </div>
        ))}
      </div>

      {idleCount > 0 && (
        <div style={{ padding: "8px 12px", background: "#3f1a1a40", border: `1px solid ${COLORS.red}40`, borderRadius: 6, fontSize: 11, color: COLORS.red, marginBottom: 12 }}>
          ⚠ {idleCount} consumer{idleCount > 1 ? "s" : ""} idle — more consumers than partitions is wasteful. Max useful parallelism = partition count.
        </div>
      )}
      {consumers === partitions && (
        <div style={{ padding: "8px 12px", background: "#06443040", border: `1px solid ${COLORS.green}40`, borderRadius: 6, fontSize: 11, color: COLORS.green }}>
          ✓ Optimal — 1 consumer per partition. Maximum parallelism with no waste.
        </div>
      )}
      {consumers < partitions && (
        <div style={{ padding: "8px 12px", background: "#2d2a1040", border: `1px solid ${COLORS.amber}40`, borderRadius: 6, fontSize: 11, color: COLORS.amber }}>
          Consumers handling multiple partitions. Valid, but not max throughput.
        </div>
      )}
    </div>
  );
}

function ConfigExplorer() {
  const [section, setSection] = useState("producer");
  const [expanded, setExpanded] = useState(null);

  const sections = ["producer", "consumer", "broker"];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {sections.map(s => (
          <button
            key={s}
            className="btn"
            style={{
              padding: "7px 18px",
              background: section === s ? COLORS.amber : "transparent",
              color: section === s ? "#000" : COLORS.textSecondary,
              border: `1px solid ${section === s ? COLORS.amber : COLORS.border}`,
            }}
            onClick={() => { setSection(s); setExpanded(null); }}
          >
            {s}.config
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: "16px" }}>
        {CONFIGS[section].map((cfg, i) => {
          const isOpen = expanded === i;
          return (
            <div key={cfg.key} className={`config-item ${isOpen ? "expanded" : ""}`}>
              <div className="config-key" onClick={() => setExpanded(isOpen ? null : i)}>
                <code>{cfg.key}</code>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="config-value-badge">{cfg.default}</span>
                  <span className="config-expand">{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div className="config-detail">
                  <div>{cfg.desc}</div>
                  <div style={{ marginTop: 10, padding: "8px 10px", background: COLORS.surfaceHigh, borderRadius: 4, fontSize: 11, color: COLORS.amber }}>
                    💡 {cfg.tip}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span className={`impact impact-${cfg.impact}`}>
                      {cfg.impact === "high" ? "🔴 HIGH impact" : cfg.impact === "med" ? "🟡 MEDIUM impact" : "🟢 LOW impact"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OffsetTable() {
  const rows = [
    ["email-service", "orders", "P0", "4"],
    ["email-service", "orders", "P1", "6"],
    ["inventory-service", "orders", "P0", "5"],
    ["inventory-service", "orders", "P1", "5"],
    ["analytics-service", "orders", "P0", "2"],
    ["analytics-service", "orders", "P1", "2"],
  ];
  return (
    <div className="card">
      <div className="card-title"><span className="dot" />__consumer_offsets (internal topic)</div>
      <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 14, lineHeight: 1.6 }}>
        Kafka stores each group's committed offset in this internal topic, keyed by{" "}
        <code style={{ color: COLORS.amber, fontSize: 10 }}>(group.id, topic, partition)</code>.
        This is what makes independent cursors possible across groups.
      </div>
      <table className="offset-table">
        <thead>
          <tr>
            <th>group.id</th>
            <th>topic</th>
            <th>partition</th>
            <th>committed offset</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  const q = QUIZ[idx];

  const handleSelect = (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    setResults(r => [...r, optIdx === q.answer]);
  };

  const next = () => {
    if (idx < QUIZ.length - 1) {
      setIdx(i => i + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setResults([]);
    setDone(false);
  };

  if (done) {
    const score = results.filter(Boolean).length;
    return (
      <div className="card" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {score === QUIZ.length ? "🏆" : score >= QUIZ.length * 0.7 ? "🎯" : "📚"}
        </div>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.amber, marginBottom: 8 }}>
          {score}/{QUIZ.length}
        </div>
        <div style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 24 }}>
          {score === QUIZ.length
            ? "Perfect score! You've got Kafka."
            : score >= 4
            ? "Solid. A few concepts to revisit."
            : "Keep going — revisit the sections above."}
        </div>
        <button className="btn btn-primary" onClick={restart}>Retake Quiz</button>
      </div>
    );
  }

  return (
    <div className="card scroll-fade" key={idx}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 10, color: COLORS.textDim, letterSpacing: "0.1em" }}>
          QUESTION {idx + 1} / {QUIZ.length}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {QUIZ.map((_, i) => (
            <div
              key={i}
              className={`qp-dot ${i < idx ? "done" : i === idx ? "current" : ""}`}
              style={{ width: 40 }}
            />
          ))}
        </div>
      </div>

      <div className="quiz-q">{q.q}</div>
      <div className="quiz-opts">
        {q.opts.map((opt, i) => {
          let cls = "quiz-opt";
          if (selected !== null) {
            cls += " revealed";
            if (i === q.answer) cls += " correct";
            else if (i === selected) cls += " wrong";
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)}>
              <span style={{ color: COLORS.textDim, marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="quiz-explanation">
          {results[results.length - 1] ? "✓ Correct! " : "✗ Not quite. "}
          {q.explanation}
        </div>
      )}

      {selected !== null && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button className="btn btn-primary" onClick={next}>
            {idx < QUIZ.length - 1 ? "Next Question →" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}

function Architecture() {
  const concepts = [
    {
      label: "Storage",
      title: "Topic",
      desc: "Named feed of records. Logical unit — like a table but for streams. Split into partitions for parallelism.",
    },
    {
      label: "Parallelism",
      title: "Partition",
      desc: "Ordered, immutable append-only log. The unit of parallelism. Ordering guaranteed within a partition only.",
    },
    {
      label: "Infrastructure",
      title: "Broker",
      desc: "A Kafka server. Holds a subset of partitions. One broker is the leader per partition; others are followers.",
    },
    {
      label: "Durability",
      title: "Replication",
      desc: "Each partition is replicated across brokers. Leader handles all reads/writes. Followers sync passively.",
    },
    {
      label: "Write",
      title: "Producer",
      desc: "Publishes records to topics. Routes to partition via round-robin, key hash, or custom partitioner.",
    },
    {
      label: "Read",
      title: "Consumer Group",
      desc: "Each partition assigned to one consumer per group. Different groups = independent cursors (fan-out).",
    },
  ];

  return (
    <div>
      <div className="grid3" style={{ marginBottom: 20 }}>
        {concepts.map(c => (
          <div key={c.title} className="concept-chip">
            <div className="label">{c.label}</div>
            <div className="title">{c.title}</div>
            <div className="desc">{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Guarantees */}
      <div className="card">
        <div className="card-title"><span className="dot" />Delivery Guarantees</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { name: "At-most-once", color: COLORS.red, tag: "tag-red", desc: "acks=0. May lose messages, never duplicates. Fire-and-forget.", tradeoff: "Fastest, riskiest" },
            { name: "At-least-once", color: COLORS.amber, tag: "tag-amber", desc: "acks=1 or all + retries. No loss, may duplicate. Default production.", tradeoff: "Safe, needs idempotent consumers" },
            { name: "Exactly-once", color: COLORS.green, tag: "tag-green", desc: "enable.idempotence + transactions + read_committed. No loss, no dups.", tradeoff: "Safest, ~5-20% overhead" },
          ].map(g => (
            <div key={g.name} style={{ flex: "1 1 200px", border: `1px solid ${g.color}40`, borderRadius: 6, padding: 14 }}>
              <div style={{ color: g.color, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{g.name}</div>
              <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 8, lineHeight: 1.6 }}>{g.desc}</div>
              <span style={{ fontSize: 10, color: g.color, background: `${g.color}15`, padding: "2px 8px", borderRadius: 3 }}>{g.tradeoff}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "arch", label: "Architecture" },
  { id: "partitions", label: "Partitions" },
  { id: "fanout", label: "Fan-out" },
  { id: "scaling", label: "Scaling" },
  { id: "config", label: "Config" },
  { id: "quiz", label: "Quiz" },
];

export default function KafkaLearning() {
  const [tab, setTab] = useState("arch");

  return (
    <>
      <style>{css}</style>
      <div className="kafka-root">
      <div style={{ padding: "12px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
        <a href="/learning" style={{ fontSize: 12, color: COLORS.textSecondary, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
          ← Learning
        </a>
      </div>
      <div className="app">
        <div className="hero">
          <div>
            <div className="hero-badge">Distributed Systems</div>
          </div>
          <div>
            <h1>Apache <span>Kafka</span><br />Interactive Guide</h1>
            <p>
              From partitions to fan-out patterns — explore Kafka's core concepts interactively.
              Visualize message flow, tune configuration, and test your knowledge.
            </p>
          </div>
        </div>

        <nav className="nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="scroll-fade" key={tab}>
          {tab === "arch" && <Architecture />}
          {tab === "partitions" && <PartitionVisualizer />}
          {tab === "fanout" && (
            <>
              <FanoutVisualizer />
              <OffsetTable />
            </>
          )}
          {tab === "scaling" && <ConsumerGroupScaling />}
          {tab === "config" && <ConfigExplorer />}
          {tab === "quiz" && <Quiz />}
        </div>
      </div>
      </div>
    </>
  );
}