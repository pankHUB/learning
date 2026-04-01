import { useState, useEffect, useRef } from "react";

const PHASES = [
  {
    id: "timers",
    label: "TIMERS",
    tag: "01",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.4)",
    desc: "Executes setTimeout / setInterval callbacks whose threshold has elapsed",
    code: "setTimeout(() => {}, 0)\nsetInterval(() => {}, 100)",
    log: "[TIMERS] setTimeout(0) threshold met → fires callback",
  },
  {
    id: "pending",
    label: "PENDING CB",
    tag: "02",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.4)",
    desc: "I/O callbacks deferred from previous loop (e.g. TCP ECONNREFUSED errors)",
    code: "// OS deferred error\nsocket.on('error', cb) // next tick",
    log: "[PENDING CB] TCP ECONNREFUSED deferred → executing now",
  },
  {
    id: "idle",
    label: "IDLE / PREPARE",
    tag: "03",
    color: "#6b7280",
    glow: "rgba(107,114,128,0.3)",
    desc: "Internal libuv bookkeeping. Not accessible from userland JavaScript.",
    code: "// libuv internal only\n// not exposed to JS",
    log: "[IDLE] libuv internal preparation...",
  },
  {
    id: "poll",
    label: "POLL",
    tag: "04",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.4)",
    desc: "Retrieves new I/O events. Blocks here if queue is empty & no timers pending.",
    code: "fs.readFile('./data.json', (err, data) => {\n  // executes HERE\n})",
    log: "[POLL] fs.readFile complete → executing I/O callback",
  },
  {
    id: "check",
    label: "CHECK",
    tag: "05",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.4)",
    desc: "setImmediate() callbacks execute here — always after I/O, before next timer.",
    code: "setImmediate(() => {\n  // runs after POLL\n})",
    log: "[CHECK] setImmediate → guaranteed after I/O phase",
  },
  {
    id: "close",
    label: "CLOSE CB",
    tag: "06",
    color: "#34d399",
    glow: "rgba(52,211,153,0.4)",
    desc: "Cleanup callbacks: socket.on('close', ...) and similar teardown handlers.",
    code: "socket.on('close', () => {\n  // cleanup here\n})",
    log: "[CLOSE CB] socket destroyed → cleanup callback fired",
  },
];

const SPEED = 1400;

export default function EventLoop() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [iteration, setIteration] = useState(1);
  const [hovered, setHovered] = useState(null);
  const logRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setActive((prev) => {
          const next = (prev + 1) % PHASES.length;
          if (next === 0) setIteration((i) => i + 1);
          const phase = PHASES[next];
          setLogs((l) => [
            ...l.slice(-30),
            { text: phase.log, color: phase.color, time: Date.now() },
          ]);
          return next;
        });
      }, SPEED);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleStep = () => {
    const next = (active + 1) % PHASES.length;
    if (next === 0) setIteration((i) => i + 1);
    setActive(next);
    setLogs((l) => [
      ...l.slice(-30),
      { text: PHASES[next].log, color: PHASES[next].color, time: Date.now() },
    ]);
  };

  const reset = () => {
    setRunning(false);
    setActive(0);
    setLogs([]);
    setIteration(1);
  };

  const current = PHASES[active];
  const displayPhase = hovered !== null ? PHASES[hovered] : current;

  return (
    <div style={{
      background: "#09090b",
      color: "#e4e4e7",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      display: "flex",
      flexDirection: "column",
      padding: "20px 16px",
      gap: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        .el-phase-node { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); cursor: pointer; }
        .el-phase-node:hover { transform: scale(1.06); }
        .el-pulse-ring { animation: elPulseRing 1.2s ease-out infinite; }
        @keyframes elPulseRing {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.7); }
        }
        .el-log-line { animation: elFadeIn 0.25s ease; }
        @keyframes elFadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .el-ctrl-btn {
          transition: all 0.15s ease; cursor: pointer; border: none; outline: none;
        }
        .el-ctrl-btn:hover { opacity: 0.8; transform: translateY(-1px); }
        .el-ctrl-btn:active { transform: translateY(0); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
        <span style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.2em" }}>NODE.JS</span>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "#fafafa" }}>
          EVENT LOOP
        </h2>
        <span style={{
          marginLeft: "auto", fontSize: "11px", color: "#52525b",
          border: "1px solid #27272a", padding: "2px 8px", borderRadius: "4px",
        }}>
          ITERATION #{String(iteration).padStart(3, "0")}
        </span>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Left — Wheel + Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: "0 0 300px", minWidth: 260 }}>
          <div style={{
            background: "#111113", border: "1px solid #1c1c1f", borderRadius: "16px",
            padding: "20px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="240" height="240" viewBox="0 0 280 280">
              <circle cx="140" cy="140" r="105" fill="none" stroke="#1c1c1f" strokeWidth="2" />
              <circle cx="140" cy="140" r="55" fill="none" stroke="#1c1c1f" strokeWidth="1" strokeDasharray="4 4" />

              {PHASES.map((phase, i) => {
                const angle = (i / PHASES.length) * 2 * Math.PI - Math.PI / 2;
                const r = 105;
                const cx = 140 + r * Math.cos(angle);
                const cy = 140 + r * Math.sin(angle);
                const isActive = active === i;
                const isHov = hovered === i;

                return (
                  <g
                    key={phase.id}
                    className="el-phase-node"
                    onClick={() => !running && setActive(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {isActive && running && (
                      <circle cx={cx} cy={cy} r="22" fill="none" stroke={phase.color}
                        strokeWidth="2" className="el-pulse-ring"
                        style={{ filter: `drop-shadow(0 0 6px ${phase.glow})` }}
                      />
                    )}
                    <circle
                      cx={cx} cy={cy} r="18"
                      fill={isActive ? phase.color : isHov ? "#1c1c1f" : "#111113"}
                      stroke={isActive || isHov ? phase.color : "#27272a"}
                      strokeWidth={isActive ? 0 : 1.5}
                      style={{ filter: isActive ? `drop-shadow(0 0 12px ${phase.glow})` : "none", transition: "all 0.25s ease" }}
                    />
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9"
                      fontFamily="JetBrains Mono, monospace" fontWeight="700"
                      fill={isActive ? "#09090b" : phase.color}
                      style={{ transition: "all 0.25s ease" }}
                    >
                      {phase.tag}
                    </text>
                    {(() => {
                      const lx = 140 + 138 * Math.cos(angle);
                      const ly = 140 + 138 * Math.sin(angle);
                      return (
                        <text x={lx} y={ly + 3} textAnchor="middle" fontSize="7"
                          fontFamily="JetBrains Mono, monospace" fontWeight="600"
                          letterSpacing="0.08em"
                          fill={isActive ? phase.color : "#52525b"}
                          style={{ transition: "all 0.25s ease" }}
                        >
                          {phase.label}
                        </text>
                      );
                    })()}
                  </g>
                );
              })}

              <circle cx="140" cy="140" r="40" fill="#0d0d0f" stroke="#1c1c1f" strokeWidth="1.5" />
              <text x="140" y="136" textAnchor="middle" fontSize="8" fill="#52525b" fontFamily="JetBrains Mono, monospace" letterSpacing="0.15em">libuv</text>
              <text x="140" y="150" textAnchor="middle" fontSize="9" fill={current.color}
                fontFamily="JetBrains Mono, monospace" fontWeight="700"
                style={{ filter: `drop-shadow(0 0 6px ${current.glow})` }}>
                {current.tag}
              </text>
            </svg>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="el-ctrl-btn" onClick={() => setRunning((r) => !r)} style={{
              flex: 1, padding: "10px", borderRadius: "8px",
              background: running ? "#1c1c1f" : current.color,
              color: running ? current.color : "#09090b",
              fontSize: "11px", fontFamily: "JetBrains Mono, monospace",
              fontWeight: "700", letterSpacing: "0.1em",
              border: running ? `1px solid ${current.color}` : "none",
            }}>
              {running ? "⏸ PAUSE" : "▶ RUN"}
            </button>
            <button className="el-ctrl-btn" onClick={handleStep} disabled={running} style={{
              flex: 1, padding: "10px", borderRadius: "8px", background: "#1c1c1f",
              color: running ? "#3f3f46" : "#a1a1aa",
              fontSize: "11px", fontFamily: "JetBrains Mono, monospace",
              fontWeight: "700", letterSpacing: "0.1em",
              border: "1px solid #27272a", cursor: running ? "not-allowed" : "pointer",
            }}>
              → STEP
            </button>
            <button className="el-ctrl-btn" onClick={reset} style={{
              padding: "10px 14px", borderRadius: "8px", background: "#1c1c1f",
              color: "#52525b", fontSize: "11px", fontFamily: "JetBrains Mono, monospace",
              fontWeight: "700", border: "1px solid #27272a",
            }}>
              ↺
            </button>
          </div>

          {/* Mini phase grid */}
          <div style={{
            background: "#111113", border: "1px solid #1c1c1f", borderRadius: "16px",
            padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px",
          }}>
            {PHASES.map((phase, i) => (
              <div key={phase.id} className="el-phase-node"
                onClick={() => !running && setActive(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 8px", borderRadius: "6px",
                  background: active === i ? `${phase.color}11` : "transparent",
                  border: `1px solid ${active === i ? phase.color + "44" : "#1c1c1f"}`,
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%", background: phase.color,
                  flexShrink: 0, boxShadow: active === i ? `0 0 6px ${phase.glow}` : "none",
                  transition: "all 0.2s ease",
                }} />
                <span style={{ fontSize: "8px", fontWeight: "700", color: active === i ? phase.color : "#52525b", letterSpacing: "0.08em" }}>
                  {phase.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Detail + Log */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: 200 }}>
          {/* Phase detail */}
          <div style={{
            background: "#111113", border: `1px solid ${displayPhase.color}33`,
            borderRadius: "16px", padding: "20px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: `linear-gradient(90deg, transparent, ${displayPhase.color}, transparent)`,
              transition: "all 0.3s ease",
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "9px", fontWeight: "700", letterSpacing: "0.15em",
                color: displayPhase.color, border: `1px solid ${displayPhase.color}55`,
                padding: "3px 8px", borderRadius: "4px", background: `${displayPhase.color}11`,
              }}>
                PHASE {displayPhase.tag}
              </span>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#fafafa", letterSpacing: "-0.01em" }}>
                {displayPhase.label}
              </span>
              {hovered === null && (
                <span style={{
                  marginLeft: "auto", width: "7px", height: "7px", borderRadius: "50%",
                  background: running ? displayPhase.color : "#3f3f46",
                  boxShadow: running ? `0 0 8px ${displayPhase.glow}` : "none",
                  transition: "all 0.3s ease",
                }} />
              )}
            </div>
            <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#a1a1aa", lineHeight: 1.6 }}>
              {displayPhase.desc}
            </p>
            <div style={{ background: "#09090b", border: "1px solid #1c1c1f", borderRadius: "8px", padding: "12px 14px" }}>
              <div style={{ fontSize: "9px", color: "#3f3f46", letterSpacing: "0.15em", marginBottom: "8px" }}>EXAMPLE</div>
              <pre style={{ margin: 0, fontSize: "11px", color: displayPhase.color, lineHeight: 1.7, fontFamily: "JetBrains Mono, monospace" }}>
                {displayPhase.code}
              </pre>
            </div>
          </div>

          {/* Execution log */}
          <div style={{
            background: "#09090b", border: "1px solid #1c1c1f", borderRadius: "16px",
            padding: "16px", display: "flex", flexDirection: "column", minHeight: "160px",
          }}>
            <div style={{ fontSize: "9px", color: "#3f3f46", letterSpacing: "0.2em", marginBottom: "10px" }}>
              EXECUTION LOG
            </div>
            <div ref={logRef} style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
              {logs.length === 0 && (
                <span style={{ fontSize: "11px", color: "#27272a" }}>// press RUN or STEP to begin...</span>
              )}
              {logs.map((log, i) => (
                <div key={i} className="el-log-line" style={{
                  fontSize: "10.5px", color: log.color,
                  fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5,
                  opacity: 0.7 + 0.3 * (i / logs.length),
                }}>
                  <span style={{ color: "#3f3f46", marginRight: "8px" }}>›</span>
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
