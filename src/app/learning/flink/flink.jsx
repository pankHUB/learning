import { useState, useEffect, useRef } from "react";

const NODES = {
  marketFeed: {
    id: "marketFeed",
    label: "Market Feed",
    sublabel: "WebSocket / Broker API",
    x: 60, y: 200,
    color: "#f59e0b",
    group: "source",
    detail: {
      title: "Market Data Feed",
      description: "Raw tick-by-tick data arrives from exchange feeds or broker WebSocket APIs. Produces events for every trade, quote, and open interest change.",
      stats: ["~50,000 events/sec during market hours", "Multiple symbols in parallel", "Sub-millisecond latency"],
      tech: ["NSE/BSE Feed", "Broker WebSocket", "FIX Protocol"]
    }
  },
  userApp: {
    id: "userApp",
    label: "User App",
    sublabel: "Set Alerts via REST",
    x: 60, y: 380,
    color: "#818cf8",
    group: "source",
    detail: {
      title: "User Application",
      description: "Users configure price, volume, and OI thresholds via your REST API. Changes are persisted to PostgreSQL and streamed to Kafka as rule change events.",
      stats: ["5 lakh+ users", "3–5 alerts per user", "Millions of active rules"],
      tech: ["FastAPI / Node.js", "PostgreSQL", "REST API"]
    }
  },
  kafka: {
    id: "kafka",
    label: "Kafka Cluster",
    sublabel: "stock.prices · stock.volume · stock.OI · user.rules",
    x: 280, y: 290,
    color: "#22d3ee",
    group: "kafka",
    detail: {
      title: "Kafka Cluster",
      description: "Central nervous system. Topics are partitioned by stock symbol so Flink's keyed processing aligns perfectly — no network shuffle needed.",
      stats: ["Topics: stock.prices, stock.volume, stock.OI, user.rule.changes, alerts.triggered", "Partitioned by symbol", "Replication factor: 3"],
      tech: ["Apache Kafka", "Kafka Connect", "Schema Registry"]
    }
  },
  flinkJob: {
    id: "flinkJob",
    label: "Flink Job",
    sublabel: "Stateful Stream Processing",
    x: 530, y: 290,
    color: "#34d399",
    group: "flink",
    detail: {
      title: "Flink Job",
      description: "The core processing engine. Reads from multiple Kafka topics, normalizes events, keys by symbol, evaluates rules against broadcast state, applies dedup timers, and emits alerts.",
      stats: ["Parallelism = N (scales horizontally)", "RocksDB state backend", "Exactly-once semantics via checkpointing"],
      tech: ["Apache Flink", "Broadcast State Pattern", "Flink Timers", "Keyed Streams"]
    }
  },
  alertsTopic: {
    id: "alertsTopic",
    label: "alerts.triggered",
    sublabel: "Kafka Output Topic",
    x: 760, y: 290,
    color: "#fb7185",
    group: "kafka",
    detail: {
      title: "alerts.triggered Topic",
      description: "Flink's only output. Contains matched alert events with userId, symbol, alertType, triggered value, and timestamp. Downstream services consume independently.",
      stats: ["Could be millions/min in volatile markets", "Decouples Flink from notification logic", "Replay-safe for recovery"],
      tech: ["Kafka Topic", "JSON / Avro schema"]
    }
  },
  alertRouter: {
    id: "alertRouter",
    label: "Alert Router",
    sublabel: "Dedup · Route · Throttle",
    x: 980, y: 290,
    color: "#c084fc",
    group: "service",
    detail: {
      title: "Alert Router Service",
      description: "Consumes alerts.triggered, deduplicates using Redis TTL keys, applies per-user rate limits, and routes to the correct notification queue based on user preferences.",
      stats: ["Redis TTL dedup: 15min per alert key", "Max 1 alert/stock/type/user per window", "Routes based on user preference"],
      tech: ["Node.js / FastAPI", "Redis", "Consumer Group"]
    }
  },
  email: {
    id: "email",
    label: "Email Queue",
    sublabel: "AWS SES",
    x: 1160, y: 180,
    color: "#f59e0b",
    group: "notify",
    detail: {
      title: "Email Notification",
      description: "Email alerts with rich formatting — chart snapshots, price context, user's threshold vs current value. Rate-limited to avoid spam.",
      stats: ["Async worker pool", "Retry on failure", "Template rendering"],
      tech: ["AWS SES", "Queue Workers", "HTML Templates"]
    }
  },
  push: {
    id: "push",
    label: "Push Notification",
    sublabel: "FCM / APNs",
    x: 1160, y: 290,
    color: "#34d399",
    group: "notify",
    detail: {
      title: "Push Notification",
      description: "Mobile and web push alerts. Fastest channel — sub-second delivery. Used for urgent threshold breaches.",
      stats: ["< 1s delivery", "Mobile + Web", "Batch-capable"],
      tech: ["Firebase FCM", "APNs", "Web Push"]
    }
  },
  sms: {
    id: "sms",
    label: "SMS",
    sublabel: "AWS SNS",
    x: 1160, y: 400,
    color: "#fb7185",
    group: "notify",
    detail: {
      title: "SMS Notification",
      description: "SMS alerts for users who prefer it. Higher cost so typically reserved for premium tiers or critical thresholds.",
      stats: ["Fallback channel", "Premium tier only", "Global delivery"],
      tech: ["AWS SNS", "Twilio fallback"]
    }
  }
};

const EDGES = [
  { from: "marketFeed", to: "kafka", label: "tick events" },
  { from: "userApp", to: "kafka", label: "rule changes" },
  { from: "kafka", to: "flinkJob", label: "consume streams" },
  { from: "flinkJob", to: "alertsTopic", label: "emit alerts" },
  { from: "alertsTopic", to: "alertRouter", label: "consume" },
  { from: "alertRouter", to: "email", label: "" },
  { from: "alertRouter", to: "push", label: "" },
  { from: "alertRouter", to: "sms", label: "" },
];

const FLINK_STEPS = [
  { id: "union", label: "1. Union + Normalize", color: "#22d3ee", desc: "Merge stock.prices, stock.volume, stock.OI into a single normalized stream with a common schema {symbol, eventType, value, timestamp}." },
  { id: "key", label: "2. Key by Symbol", color: "#34d399", desc: "Partition stream by stock symbol. All AAPL events → same operator instance. Ensures state locality — no cross-node lookups." },
  { id: "broadcast", label: "3. Broadcast State", color: "#a78bfa", desc: "User rules are broadcast to ALL operator instances. Each operator has a full copy of rules for its symbols. Rule updates arrive as a side stream." },
  { id: "eval", label: "4. Evaluate Rules", color: "#fb923c", desc: "For each event, scan rules for that symbol. Check price/volume/OI thresholds. O(users_watching_symbol) per event — not O(total_users)." },
  { id: "dedup", label: "5. Dedup + Timer", color: "#f472b6", desc: "Track last_alert_sent_at in keyed state. Use Flink Timers to reset the cooldown after 15 minutes. Prevents alert spam during volatile moves." },
  { id: "emit", label: "6. Emit to Kafka", color: "#fb7185", desc: "Write matched alerts to alerts.triggered Kafka topic. Exactly-once guaranteed via Kafka transactions + Flink checkpointing (Chandy-Lamport)." },
];

function getNodeCenter(node, SCALE = 1) {
  return { x: node.x * SCALE + 70, y: node.y * SCALE / 1 };
}

function EdgeLine({ from, to, label, animated }) {
  const f = NODES[from];
  const t = NODES[to];
  const fx = f.x + 90, fy = f.y + 22;
  const tx = t.x - 10, ty = t.y + 22;
  const mx = (fx + tx) / 2;

  return (
    <g>
      <defs>
        <marker id={`arrow-${from}-${to}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={animated ? "#34d399" : "#334155"} />
        </marker>
      </defs>
      <path
        d={`M${fx},${fy} C${mx},${fy} ${mx},${ty} ${tx},${ty}`}
        fill="none"
        stroke={animated ? "#34d399" : "#1e3a4a"}
        strokeWidth={animated ? 2 : 1.5}
        strokeDasharray={animated ? "6 3" : "none"}
        markerEnd={`url(#arrow-${from}-${to})`}
        style={animated ? { animation: "dash 1s linear infinite" } : {}}
      />
      {label && (
        <text x={mx} y={(fy + ty) / 2 - 6} textAnchor="middle" fill="#475569" fontSize="9" fontFamily="'JetBrains Mono', monospace">
          {label}
        </text>
      )}
    </g>
  );
}

function NodeBox({ node, selected, onClick, pulse }) {
  const groupColors = {
    source: "#1e293b",
    kafka: "#0f2a35",
    flink: "#0a2218",
    service: "#1a1030",
    notify: "#1e2030",
  };
  const bg = groupColors[node.group] || "#1e293b";

  return (
    <g
      transform={`translate(${node.x}, ${node.y - 18})`}
      onClick={() => onClick(node)}
      style={{ cursor: "pointer" }}
    >
      <rect
        x={0} y={0} width={160} height={54}
        rx={8}
        fill={bg}
        stroke={selected ? node.color : pulse ? node.color + "66" : "#1e3a4a"}
        strokeWidth={selected ? 2.5 : pulse ? 1.5 : 1}
        style={pulse ? { animation: "pulseBox 1.5s ease-in-out infinite" } : {}}
      />
      {selected && <rect x={0} y={0} width={4} height={54} rx={2} fill={node.color} />}
      <circle cx={16} cy={16} r={5} fill={node.color} opacity={0.9} />
      <text x={28} y={20} fill={node.color} fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
        {node.label}
      </text>
      <text x={8} y={40} fill="#475569" fontSize="9" fontFamily="'JetBrains Mono', monospace">
        {node.sublabel.length > 26 ? node.sublabel.slice(0, 24) + "…" : node.sublabel}
      </text>
    </g>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("architecture");
  const [flinkStep, setFlinkStep] = useState(0);
  const [simRunning, setSimRunning] = useState(false);
  const [packets, setPackets] = useState([]);
  const [simStep, setSimStep] = useState(0);
  const intervalRef = useRef(null);

  const SIM_PATH = ["marketFeed", "kafka", "flinkJob", "alertsTopic", "alertRouter", "email"];

  useEffect(() => {
    if (simRunning) {
      intervalRef.current = setInterval(() => {
        setSimStep(s => {
          const next = (s + 1) % (SIM_PATH.length - 1);
          return next;
        });
        setPackets(prev => {
          const newP = { id: Date.now(), step: 0 };
          return [...prev.slice(-4), newP];
        });
      }, 900);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [simRunning]);

  const handleNodeClick = (node) => {
    setSelected(selected?.id === node.id ? null : node);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050d14",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes dash { to { stroke-dashoffset: -18; } }
        @keyframes pulseBox { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a1520; } ::-webkit-scrollbar-thumb { background: #1e3a4a; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 32px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "11px", color: "#34d399", letterSpacing: "3px", marginBottom: "4px" }}>SYSTEM ARCHITECTURE</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: "#f0f9ff", letterSpacing: "-0.5px" }}>
            Flink Stock Alert Pipeline
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["architecture", "flink-internals", "scale"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "6px 14px", borderRadius: "6px", border: "none", cursor: "pointer",
              fontSize: "10px", fontFamily: "inherit", letterSpacing: "1px",
              background: activeTab === tab ? "#34d399" : "#0f1f2e",
              color: activeTab === tab ? "#050d14" : "#64748b",
              fontWeight: activeTab === tab ? 700 : 400,
              transition: "all 0.2s"
            }}>
              {tab.toUpperCase().replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Architecture Tab */}
      {activeTab === "architecture" && (
        <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <div style={{ padding: "8px 32px", display: "flex", gap: "12px", alignItems: "center" }}>
              <button onClick={() => setSimRunning(r => !r)} style={{
                padding: "5px 14px", borderRadius: "20px", border: `1px solid ${simRunning ? "#34d399" : "#1e3a4a"}`,
                background: simRunning ? "#0a2218" : "transparent", color: simRunning ? "#34d399" : "#475569",
                fontSize: "10px", cursor: "pointer", fontFamily: "inherit"
              }}>
                {simRunning ? "⏹ Stop Simulation" : "▶ Simulate Data Flow"}
              </button>
              <span style={{ fontSize: "10px", color: "#334155" }}>← Click any node to inspect</span>
            </div>

            <svg width="100%" height="520" viewBox="0 0 1350 530" preserveAspectRatio="xMidYMid meet">
              {/* Group labels */}
              {[
                { label: "SOURCES", x: 20, y: 120, color: "#f59e0b" },
                { label: "KAFKA", x: 248, y: 120, color: "#22d3ee" },
                { label: "FLINK", x: 490, y: 120, color: "#34d399" },
                { label: "OUTPUT", x: 720, y: 120, color: "#fb7185" },
                { label: "ROUTING", x: 930, y: 120, color: "#c084fc" },
                { label: "NOTIFY", x: 1130, y: 120, color: "#f59e0b" },
              ].map(g => (
                <text key={g.label} x={g.x} y={g.y} fill={g.color} fontSize="9" fontFamily="'JetBrains Mono'" opacity={0.5} letterSpacing="2">
                  {g.label}
                </text>
              ))}

              {/* Edges */}
              {EDGES.map(e => (
                <EdgeLine key={`${e.from}-${e.to}`} {...e} animated={simRunning} />
              ))}

              {/* Nodes */}
              {Object.values(NODES).map(node => (
                <NodeBox
                  key={node.id}
                  node={node}
                  selected={selected?.id === node.id}
                  onClick={handleNodeClick}
                  pulse={simRunning}
                />
              ))}
            </svg>

            {/* Legend */}
            <div style={{ padding: "0 32px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {[
                { color: "#f59e0b", label: "Data Source" },
                { color: "#22d3ee", label: "Kafka" },
                { color: "#34d399", label: "Flink" },
                { color: "#fb7185", label: "Output" },
                { color: "#c084fc", label: "Service" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                  <span style={{ fontSize: "9px", color: "#475569" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div style={{
            width: selected ? "320px" : "0",
            overflow: "hidden",
            transition: "width 0.3s ease",
            borderLeft: "1px solid #0f2030",
            background: "#070f18"
          }}>
            {selected && (
              <div style={{ padding: "24px", animation: "fadeIn 0.2s ease", width: "320px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: selected.color }} />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: selected.color }}>{selected.detail.title}</span>
                  <button onClick={() => setSelected(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: "16px" }}>×</button>
                </div>
                <p style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.7", marginBottom: "20px" }}>
                  {selected.detail.description}
                </p>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "9px", color: "#334155", letterSpacing: "2px", marginBottom: "10px" }}>KEY STATS</div>
                  {selected.detail.stats.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ color: selected.color, fontSize: "10px", marginTop: "2px" }}>→</span>
                      <span style={{ fontSize: "10px", color: "#64748b", lineHeight: "1.5" }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: "9px", color: "#334155", letterSpacing: "2px", marginBottom: "10px" }}>TECH STACK</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {selected.detail.tech.map(t => (
                      <span key={t} style={{
                        padding: "3px 8px", borderRadius: "4px",
                        background: selected.color + "15", color: selected.color,
                        fontSize: "9px", border: `1px solid ${selected.color}30`
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flink Internals Tab */}
      {activeTab === "flink-internals" && (
        <div style={{ padding: "24px 32px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ fontSize: "10px", color: "#475569", marginBottom: "24px" }}>
            What happens inside the Flink job — step by step
          </div>
          <div style={{ display: "flex", gap: "0" }}>
            {/* Step selector */}
            <div style={{ width: "260px", borderRight: "1px solid #0f2030", paddingRight: "20px" }}>
              {FLINK_STEPS.map((step, i) => (
                <div
                  key={step.id}
                  onClick={() => setFlinkStep(i)}
                  style={{
                    padding: "12px 14px", marginBottom: "4px", borderRadius: "8px", cursor: "pointer",
                    background: flinkStep === i ? step.color + "15" : "transparent",
                    border: `1px solid ${flinkStep === i ? step.color + "40" : "transparent"}`,
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: flinkStep === i ? step.color : "#0f1f2e",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", color: flinkStep === i ? "#050d14" : "#334155", fontWeight: 700,
                      flexShrink: 0
                    }}>{i + 1}</div>
                    <span style={{ fontSize: "11px", color: flinkStep === i ? step.color : "#475569" }}>
                      {step.label.replace(/^\d+\. /, "")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Step detail */}
            <div style={{ flex: 1, paddingLeft: "32px" }}>
              {(() => {
                const step = FLINK_STEPS[flinkStep];
                return (
                  <div style={{ animation: "fadeIn 0.2s ease" }}>
                    <div style={{ fontSize: "22px", fontFamily: "'Syne', sans-serif", fontWeight: 800, color: step.color, marginBottom: "12px" }}>
                      {step.label}
                    </div>
                    <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.8", maxWidth: "580px", marginBottom: "32px" }}>
                      {step.desc}
                    </p>

                    {/* Visual for each step */}
                    {flinkStep === 0 && (
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        {["stock.prices", "stock.volume", "stock.OI"].map(t => (
                          <div key={t} style={{ padding: "10px 16px", borderRadius: "8px", background: "#0a1e2e", border: "1px solid #1e3a4a", fontSize: "10px", color: "#22d3ee" }}>{t}</div>
                        ))}
                        <div style={{ color: "#334155", fontSize: "18px" }}>→</div>
                        <div style={{ padding: "10px 16px", borderRadius: "8px", background: "#0a2218", border: "1px solid #34d39940", fontSize: "10px", color: "#34d399" }}>
                          {`{ symbol, eventType, value, ts }`}
                        </div>
                      </div>
                    )}
                    {flinkStep === 1 && (
                      <div style={{ display: "flex", gap: "16px" }}>
                        {["AAPL →", "MSFT →", "RELIANCE →"].map((sym, i) => (
                          <div key={i} style={{ padding: "14px", borderRadius: "8px", background: "#0a1e2e", border: "1px solid #1e3a4a" }}>
                            <div style={{ fontSize: "11px", color: "#34d399", marginBottom: "6px" }}>{sym}</div>
                            <div style={{ fontSize: "9px", color: "#475569" }}>Operator {i + 1}</div>
                            <div style={{ fontSize: "9px", color: "#334155", marginTop: "4px" }}>All {sym.replace(" →", "")} events</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {flinkStep === 2 && (
                      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <div style={{ padding: "14px", borderRadius: "8px", background: "#0a1e2e", border: "1px solid #a78bfa40", minWidth: "180px" }}>
                          <div style={{ fontSize: "10px", color: "#a78bfa", marginBottom: "8px" }}>Broadcast State</div>
                          {["user_1: AAPL > 200", "user_2: AAPL < 150", "user_3: MSFT OI > 50K", "...5 lakh rules"].map((r, i) => (
                            <div key={i} style={{ fontSize: "9px", color: "#334155", marginBottom: "4px" }}>→ {r}</div>
                          ))}
                        </div>
                        <div style={{ color: "#334155", fontSize: "18px", marginTop: "20px" }}>⊕</div>
                        <div style={{ padding: "14px", borderRadius: "8px", background: "#0a1e2e", border: "1px solid #22d3ee40" }}>
                          <div style={{ fontSize: "10px", color: "#22d3ee", marginBottom: "8px" }}>Market Event</div>
                          <div style={{ fontSize: "9px", color: "#475569" }}>AAPL price = 201</div>
                        </div>
                        <div style={{ color: "#334155", fontSize: "18px", marginTop: "20px" }}>→</div>
                        <div style={{ padding: "14px", borderRadius: "8px", background: "#0a2010", border: "1px solid #34d39940" }}>
                          <div style={{ fontSize: "10px", color: "#34d399", marginBottom: "8px" }}>Matched</div>
                          <div style={{ fontSize: "9px", color: "#475569" }}>user_1 alert ✓</div>
                        </div>
                      </div>
                    )}
                    {flinkStep === 3 && (
                      <div style={{ background: "#0a1e2e", borderRadius: "8px", padding: "16px", border: "1px solid #1e3a4a", fontFamily: "monospace", fontSize: "11px", color: "#64748b", maxWidth: "520px" }}>
                        <div style={{ color: "#475569", marginBottom: "8px" }}>// Per-symbol rule evaluation</div>
                        <div><span style={{ color: "#fb923c" }}>for</span> rule <span style={{ color: "#fb923c" }}>in</span> <span style={{ color: "#22d3ee" }}>rules[event.symbol]</span>:</div>
                        <div style={{ paddingLeft: "20px" }}><span style={{ color: "#fb923c" }}>if</span> <span style={{ color: "#a78bfa" }}>rule.matches</span>(event.value):</div>
                        <div style={{ paddingLeft: "40px" }}><span style={{ color: "#34d399" }}>emit_alert</span>(rule.userId, event)</div>
                      </div>
                    )}
                    {flinkStep === 4 && (
                      <div style={{ display: "flex", gap: "16px" }}>
                        <div style={{ padding: "14px", borderRadius: "8px", background: "#0a1e2e", border: "1px solid #f472b640" }}>
                          <div style={{ fontSize: "10px", color: "#f472b6", marginBottom: "8px" }}>Keyed State</div>
                          <div style={{ fontSize: "9px", color: "#475569" }}>last_alert: 14:32:01</div>
                          <div style={{ fontSize: "9px", color: "#475569" }}>cooldown: 15 min</div>
                          <div style={{ fontSize: "9px", color: "#34d399", marginTop: "6px" }}>Timer resets at 14:47</div>
                        </div>
                        <div style={{ padding: "14px", borderRadius: "8px", background: "#0a1e2e", border: "1px solid #1e3a4a" }}>
                          <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "8px" }}>Result</div>
                          <div style={{ fontSize: "9px", color: "#fb7185" }}>Duplicate? → DROP</div>
                          <div style={{ fontSize: "9px", color: "#34d399" }}>First alert? → PASS</div>
                        </div>
                      </div>
                    )}
                    {flinkStep === 5 && (
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ padding: "14px", borderRadius: "8px", background: "#0a1e2e", border: "1px solid #34d39940" }}>
                          <div style={{ fontSize: "10px", color: "#34d399", marginBottom: "8px" }}>Flink Checkpoint</div>
                          <div style={{ fontSize: "9px", color: "#475569" }}>Chandy-Lamport barriers</div>
                          <div style={{ fontSize: "9px", color: "#475569" }}>State → S3/HDFS</div>
                          <div style={{ fontSize: "9px", color: "#34d399", marginTop: "4px" }}>Exactly-once ✓</div>
                        </div>
                        <div style={{ color: "#334155", fontSize: "18px" }}>→</div>
                        <div style={{ padding: "14px", borderRadius: "8px", background: "#0a1e2e", border: "1px solid #fb718540" }}>
                          <div style={{ fontSize: "10px", color: "#fb7185", marginBottom: "8px" }}>alerts.triggered</div>
                          <div style={{ fontSize: "9px", color: "#475569" }}>userId: user_1</div>
                          <div style={{ fontSize: "9px", color: "#475569" }}>symbol: AAPL</div>
                          <div style={{ fontSize: "9px", color: "#475569" }}>type: PRICE</div>
                          <div style={{ fontSize: "9px", color: "#475569" }}>value: 201.50</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Scale Tab */}
      {activeTab === "scale" && (
        <div style={{ padding: "24px 32px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ fontSize: "10px", color: "#475569", marginBottom: "24px" }}>Scaling challenges and how the architecture handles them</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {[
              {
                title: "State Explosion",
                problem: "5 lakh users × 5 rules = 25M active rules in memory",
                solution: "Partition by symbol, not user. Each operator only holds rules for its assigned symbols.",
                metric: "Memory per operator ∝ symbols assigned, not total users",
                color: "#22d3ee"
              },
              {
                title: "Rule Updates at Runtime",
                problem: "User changes threshold — can't restart Flink",
                solution: "user.rule.changes Kafka topic consumed as a side stream. State updated live within milliseconds.",
                metric: "Zero downtime rule updates",
                color: "#34d399"
              },
              {
                title: "Alert Deduplication",
                problem: "Price oscillates around threshold → millions of duplicate alerts",
                solution: "Flink Timers set 15-min cooldown in keyed state. Redis TTL as secondary guard in Alert Router.",
                metric: "Max 1 alert per user/symbol/type per 15 min",
                color: "#a78bfa"
              },
              {
                title: "Horizontal Scale",
                problem: "Market opens → 50K events/sec spike",
                solution: "Increase Flink parallelism. Kafka partitions by symbol align with Flink keyed partitions — no shuffle cost.",
                metric: "Linear scale-out, add TaskManagers",
                color: "#fb923c"
              },
              {
                title: "Large State on Disk",
                problem: "Heap memory not enough for millions of rule states",
                solution: "Switch to RocksDB state backend. State spills to disk, only hot entries in memory. Minor latency tradeoff.",
                metric: "State size: unlimited (disk-bound)",
                color: "#f472b6"
              },
              {
                title: "Notification Backpressure",
                problem: "Volatile session → 10M alerts/min, email provider rate-limited",
                solution: "Separate queues per channel (email, push, SMS). Each scales independently. Flink decoupled via Kafka.",
                metric: "Flink throughput unaffected by slow email delivery",
                color: "#fb7185"
              }
            ].map(card => (
              <div key={card.title} style={{
                padding: "20px", borderRadius: "10px",
                background: "#070f18",
                border: `1px solid ${card.color}20`
              }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: card.color, marginBottom: "10px" }}>{card.title}</div>
                <div style={{ fontSize: "9px", color: "#334155", marginBottom: "8px", letterSpacing: "1px" }}>PROBLEM</div>
                <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "14px", lineHeight: "1.6" }}>{card.problem}</div>
                <div style={{ fontSize: "9px", color: "#334155", marginBottom: "8px", letterSpacing: "1px" }}>SOLUTION</div>
                <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "14px", lineHeight: "1.6" }}>{card.solution}</div>
                <div style={{ padding: "8px 10px", borderRadius: "6px", background: card.color + "10", border: `1px solid ${card.color}20` }}>
                  <span style={{ fontSize: "9px", color: card.color }}>✓ {card.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}