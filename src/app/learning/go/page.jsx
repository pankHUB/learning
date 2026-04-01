"use client";
import { useState, useEffect, useRef } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg0: "#08090c", bg1: "#0e1117", bg2: "#141920", bg3: "#1a2030",
  border: "#1e2736", borderHover: "rgba(0,173,216,0.35)",
  teal: "#00ADD8", tealDim: "rgba(0,173,216,0.1)", tealGlow: "rgba(0,173,216,0.06)",
  tealText: "rgba(0,173,216,0.85)",
  text0: "#edf2fa", text1: "#8a96aa", text2: "#4a5668",
  orange: "#f97316", green: "#22c55e", yellow: "#eab308",
  red: "#ef4444", purple: "#a78bfa", pink: "#f472b6",
};

// ─── SYNTAX HIGHLIGHTER ───────────────────────────────────────────────────────
function highlightGo(raw) {
  if (!raw) return "";
  const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = raw.split("\n");
  const keywords = /\b(func|return|if|else|for|range|switch|case|default|break|continue|fallthrough|defer|go|select|chan|map|struct|interface|type|var|const|import|package|nil|true|false|make|new|append|copy|delete|len|cap|close|panic|recover|print|println|error|string|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64|bool|byte|rune|any)\b/g;
  const colors = {
    kw: "#ff79c6", str: "#f1fa8c", num: "#bd93f9", cmt: "#555f73",
    builtin: "#8be9fd", fn: "#50fa7b", type2: "#8be9fd",
  };
  const processLine = (line) => {
    const esc = escape(line);
    if (/^\s*(\/\/)/.test(line)) return `<span style="color:${colors.cmt};font-style:italic">${esc}</span>`;
    let result = esc;
    result = result.replace(/(&quot;[^&]*&quot;|&#39;[^&]*&#39;|`[^`]*`)/g, (m) => `<span style="color:${colors.str}">${m}</span>`);
    result = result.replace(/(\/\/[^\n]*)/g, (m) => `<span style="color:${colors.cmt};font-style:italic">${m}</span>`);
    result = result.replace(keywords, (m) => {
      const typeWords = ["string","int","int8","int16","int32","int64","uint","uint8","uint16","uint32","uint64","float32","float64","bool","byte","rune","any","error"];
      const builtins = ["make","new","append","copy","delete","len","cap","close","panic","recover","print","println","nil","true","false"];
      if (typeWords.includes(m)) return `<span style="color:${colors.type2}">${m}</span>`;
      if (builtins.includes(m)) return `<span style="color:${colors.builtin}">${m}</span>`;
      return `<span style="color:${colors.kw}">${m}</span>`;
    });
    result = result.replace(/\b(\d+\.?\d*)\b/g, (m) => `<span style="color:${colors.num}">${m}</span>`);
    result = result.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, (match, name) => {
      const skip = ["if","for","switch","func","return","make","new","append","copy","delete","len","cap","close","panic","recover"];
      if (skip.includes(name)) return match;
      return `<span style="color:${colors.fn}">${name}</span>(`;
    });
    return result;
  };
  return lines.map(processLine).join("\n");
}

function highlightBash(raw) {
  if (!raw) return "";
  const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return raw.split("\n").map(line => {
    const esc = escape(line);
    if (line.trim().startsWith("#")) return `<span style="color:#555f73;font-style:italic">${esc}</span>`;
    return esc
      .replace(/\b(go|export|PATH|GOOS|GOARCH)\b/g, `<span style="color:#ff79c6">$1</span>`)
      .replace(/(["'].*?["'])/g, `<span style="color:#f1fa8c">$1</span>`)
      .replace(/\b(build|run|test|fmt|vet|doc|mod|env|tidy|init|download)\b/g, `<span style="color:#50fa7b">$1</span>`)
      .replace(/-[a-zA-Z]+/g, m => `<span style="color:#8be9fd">${m}</span>`);
  }).join("\n");
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function CodeBlock({ lang = "go", label, children }) {
  const [copied, setCopied] = useState(false);
  const raw = children?.trim() || "";
  const highlighted = lang === "bash" ? highlightBash(raw) : highlightGo(raw);
  return (
    <div style={{ margin: "14px 0 20px", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.border}`, background: T.bg2 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 14px", borderBottom: `1px solid ${T.border}` }}>
        <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.text2, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label || lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(raw); setCopied(true); setTimeout(() => setCopied(false), 1800); }} style={{
          background: "none", border: `1px solid ${copied ? T.green : T.border}`,
          color: copied ? T.green : T.text2, fontFamily: "JetBrains Mono,monospace",
          fontSize: 9, padding: "2px 8px", borderRadius: 3, cursor: "pointer",
          letterSpacing: "0.06em", textTransform: "uppercase", transition: "all .15s",
        }}>{copied ? "copied!" : "copy"}</button>
      </div>
      <pre style={{ margin: 0, padding: "14px 18px 18px", background: "transparent", fontFamily: "JetBrains Mono,monospace", fontSize: 12.5, lineHeight: 1.7, overflowX: "auto", color: "#cdd6f4" }}>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

function Callout({ type = "info", children }) {
  const styles = {
    info:   { bg: "rgba(0,173,216,0.06)",  border: T.teal,   text: T.tealText },
    warn:   { bg: "rgba(234,179,8,0.06)",  border: T.yellow, text: "rgba(234,179,8,0.85)" },
    danger: { bg: "rgba(239,68,68,0.06)",  border: T.red,    text: "rgba(239,68,68,0.85)" },
    tip:    { bg: "rgba(34,197,94,0.06)",  border: T.green,  text: "rgba(34,197,94,0.85)" },
  };
  const icons = { info: "ℹ", warn: "△", danger: "!", tip: "✓" };
  const s = styles[type];
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 16px", margin: "16px 0", borderRadius: 6, background: s.bg, borderLeft: `3px solid ${s.border}` }}>
      <span style={{ color: s.border, flexShrink: 0, fontSize: 13, paddingTop: 1 }}>{icons[type]}</span>
      <div style={{ color: s.text, fontSize: 13, lineHeight: 1.65, fontWeight: 300 }}>{children}</div>
    </div>
  );
}

function SectionHeader({ num, title, pills = [] }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11, color: T.teal, opacity: 0.45, paddingTop: 7, flexShrink: 0 }}>{num}</span>
      <div>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 700, color: T.text0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{title}</h2>
        {pills.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
            {pills.map(p => (
              <span key={p} style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, padding: "2px 7px", borderRadius: 3, background: T.tealDim, color: T.teal, border: `1px solid rgba(0,173,216,0.2)` }}>{p}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function H3({ children }) {
  return (
    <h3 style={{ fontFamily: "Syne,sans-serif", fontSize: 16, fontWeight: 600, color: T.text0, margin: "26px 0 10px", letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ display: "block", width: 3, height: 14, background: T.teal, borderRadius: 2, flexShrink: 0 }} />
      {children}
    </h3>
  );
}

function P({ children, style }) {
  return <p style={{ color: T.text1, fontSize: 13.5, lineHeight: 1.75, marginBottom: 12, fontWeight: 300, ...style }}>{children}</p>;
}

function IC({ children }) {
  return (
    <code style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.82em", color: T.teal, background: T.tealDim, padding: "1px 5px", borderRadius: 3, border: `1px solid rgba(0,173,216,0.15)` }}>{children}</code>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto", margin: "16px 0", borderRadius: 7, border: `1px solid ${T.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{ background: T.bg2, color: T.text2, fontFamily: "JetBrains Mono,monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", padding: "9px 14px", textAlign: "left", fontWeight: 500, borderBottom: `1px solid ${T.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : "none" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "9px 14px", color: j === 0 ? T.teal : T.text1, fontFamily: j === 0 ? "JetBrains Mono,monospace" : "inherit", fontSize: j === 0 ? 12 : 13, fontWeight: 300, verticalAlign: "top", lineHeight: 1.5 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TwoCol({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "14px 0" }}>{children}</div>;
}

function MiniCard({ label, value, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? T.tealGlow : T.bg2, border: `1px solid ${hovered ? T.teal : T.border}`, borderRadius: 7, padding: "14px 16px", transition: "all .2s", cursor: "default" }}>
      <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 15, color: T.teal, fontWeight: 500 }}>{value}</div>
      {desc && <div style={{ fontSize: 11.5, color: T.text2, marginTop: 6, lineHeight: 1.45, fontWeight: 300 }}>{desc}</div>}
    </div>
  );
}

function MentalModelCard({ topic, model }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? T.tealDim : T.bg1, border: `1px solid ${hovered ? T.teal : T.border}`, borderRadius: 8, padding: "15px 16px", transition: "all .2s", cursor: "default", transform: hovered ? "translateY(-1px)" : "none" }}>
      <div style={{ fontFamily: "Syne,sans-serif", fontSize: 13.5, fontWeight: 600, color: T.text0, marginBottom: 7 }}>{topic}</div>
      <div style={{ fontSize: 12, color: T.text1, lineHeight: 1.55, fontWeight: 300 }}>{model}</div>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "s1",  num: "01", label: "Environment Setup",  group: "Toolchain" },
  { id: "s2",  num: "02", label: "go CLI",              group: null },
  { id: "s3",  num: "03", label: "Types & Variables",   group: "Language" },
  { id: "s4",  num: "04", label: "Functions",           group: null },
  { id: "s5",  num: "05", label: "Arrays & Slices",     group: null },
  { id: "s6",  num: "06", label: "Maps",                group: null },
  { id: "s7",  num: "07", label: "Structs & Methods",   group: null },
  { id: "s8",  num: "08", label: "Pointers",            group: null },
  { id: "s9",  num: "09", label: "Control Flow",        group: null },
  { id: "s10", num: "◈",  label: "Mental Models",       group: "Reference" },
];

const MENTAL_MODELS = [
  { topic: "Zero Values",    model: "Every variable is valid at declaration. No undefined state — uninitialized is not a thing in Go." },
  { topic: ":= Short Decl", model: "Function scope only. Needs at least one new variable on the left side of the assignment." },
  { topic: "Slice = View",   model: "A ptr+len+cap header into a backing array. Mutations share. Appends past cap create a new array." },
  { topic: "Map Safety",     model: "Always init before writing. Use comma-ok to check existence. Not concurrency-safe by default." },
  { topic: "Receivers",      model: "Pointer if mutating or large struct. Value otherwise. Be consistent within a type — all or none." },
  { topic: "defer",          model: "LIFO. Args evaluated eagerly at defer site. Only place recover() works — use for cleanup always." },
  { topic: "for is while",   model: "One loop construct. `for cond {}` is your while. Range covers slices, maps, strings, channels." },
  { topic: "Error Returns",  model: "Explicit (value, error) everywhere. No exceptions. Handle errors close to where they occur." },
  { topic: "Embedding",      model: "Composition, not inheritance. Dog has Animal's behavior but is not an Animal. Model with has-a." },
];

const SIDEBAR_W = 248;
// Global header ≈ 53px + back bar = 41px
const TOP_OFFSET = 94;

export default function GoFundamentals() {
  const [activeId, setActiveId] = useState("s1");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0);
      let current = "s1";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && scrollY >= el.offsetTop - 120) current = item.id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: T.bg0, color: T.text0, fontFamily: "DM Sans,sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; background: ${T.bg0}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
      `}</style>

      {/* Back button bar */}
      <div style={{ position: "fixed", top: 53, left: 0, right: 0, height: 41, background: T.bg1, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 24px", zIndex: 200 }}>
        <a href="/learning" style={{ color: T.text2, textDecoration: "none", fontSize: 13, display: "flex", alignItems: "center", gap: 6, fontFamily: "DM Sans,sans-serif" }}>← Learning</a>
      </div>

      {/* Fixed Sidebar */}
      <nav style={{ position: "fixed", top: TOP_OFFSET, left: 0, width: SIDEBAR_W, height: `calc(100vh - ${TOP_OFFSET}px)`, background: T.bg1, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", zIndex: 100, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 18px 14px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.teal, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 12, color: "#000", flexShrink: 0 }}>Go</div>
            <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 14, color: T.text0 }}>Field Reference</span>
          </div>
          <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.text2, letterSpacing: "0.06em" }}>go fundamentals · v1.22+</div>
          <div style={{ height: 2, background: T.border, borderRadius: 2, marginTop: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: T.teal, borderRadius: 2, transition: "width .15s ease" }} />
          </div>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {(() => {
            let lastGroup = null;
            return NAV_ITEMS.map(item => {
              const showGroup = item.group && item.group !== lastGroup;
              if (item.group) lastGroup = item.group;
              const isActive = activeId === item.id;
              return (
                <div key={item.id}>
                  {showGroup && (
                    <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.text2, textTransform: "uppercase", letterSpacing: "0.12em", padding: "13px 18px 5px" }}>{item.group}</div>
                  )}
                  <button onClick={() => scrollTo(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 18px", background: isActive ? T.tealGlow : "none", border: "none", borderLeft: `2px solid ${isActive ? T.teal : "transparent"}`, color: isActive ? T.teal : T.text1, fontSize: 12.5, fontFamily: "DM Sans,sans-serif", fontWeight: isActive ? 500 : 400, cursor: "pointer", textAlign: "left", transition: "all .15s" }}>
                    <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: isActive ? T.teal : T.text2, width: 18, textAlign: "right", flexShrink: 0 }}>{item.num}</span>
                    {item.label}
                  </button>
                </div>
              );
            });
          })()}
        </div>

        {/* Footer tags */}
        <div style={{ padding: "12px 18px", borderTop: `1px solid ${T.border}`, flexShrink: 0, display: "flex", flexWrap: "wrap", gap: 5 }}>
          {["go1.22+", "modules", "idiomatic"].map(t => (
            <span key={t} style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, padding: "2px 6px", borderRadius: 3, background: T.bg2, color: T.text2, border: `1px solid ${T.border}` }}>{t}</span>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main style={{ marginLeft: SIDEBAR_W, maxWidth: 860 + SIDEBAR_W, paddingLeft: 52, paddingRight: 52, paddingTop: TOP_OFFSET + 56, paddingBottom: 120 }}>

        {/* HERO */}
        <div style={{ marginBottom: 64, paddingBottom: 44, borderBottom: `1px solid ${T.border}`, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: -52, width: 380, height: 280, background: "radial-gradient(ellipse at top left, rgba(0,173,216,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11, color: T.teal, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "block", width: 22, height: 1, background: T.teal }} />
            Go Language · Complete Reference
          </div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: 46, fontWeight: 800, lineHeight: 1.1, color: T.text0, marginBottom: 18, letterSpacing: "-0.03em" }}>
            Go <span style={{ color: T.teal }}>Fundamentals</span><br />Field Guide
          </h1>
          <p style={{ fontSize: 15, color: T.text1, maxWidth: 520, lineHeight: 1.7, fontWeight: 300 }}>
            Consolidated reference — toolchain, module system, core language semantics, and idiomatic patterns. Built for engineers coming from other stacks.
          </p>
          <div style={{ display: "flex", gap: 28, marginTop: 26 }}>
            {[["9","Sections"],["40+","Code Examples"],["v1.22","Go Version"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 700, color: T.teal }}>{n}</div>
                <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.text2, letterSpacing: "0.05em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* S1: ENV */}
        <section id="s1" style={{ marginBottom: 64, scrollMarginTop: 100 }}>
          <SectionHeader num="01" title="Toolchain & Environment" pills={["GOPATH","go.mod","go.sum","go mod init","go env"]} />
          <H3>Install & Path Setup</H3>
          <P>Go installs to <IC>/usr/local/go</IC>. Add the binary to your <IC>PATH</IC> and verify.</P>
          <CodeBlock lang="bash" label="bash">
{`export PATH=$PATH:/usr/local/go/bin
go version  # go version go1.22.0 linux/amd64`}
          </CodeBlock>
          <H3>GOPATH vs Go Modules</H3>
          <P><strong>GOPATH (pre-1.11 — legacy)</strong> was a global single workspace. All projects and dependencies lived under <IC>$GOPATH/src/</IC>. You couldn't have two projects depend on different versions of the same library.</P>
          <P><strong>Go Modules (1.11+, default since 1.16)</strong> replaced it entirely. Each project is self-contained — work anywhere on your filesystem.</P>
          <TwoCol>
            <CodeBlock lang="bash" label="GOPATH era">
{`$GOPATH/src/github.com/you/app/
# forced directory structure
# shared deps — version conflicts`}
            </CodeBlock>
            <CodeBlock lang="bash" label="Modules era">
{`~/projects/myapp/
# work anywhere
# per-project deps + versions`}
            </CodeBlock>
          </TwoCol>
          <Callout type="info">
            <strong>GOPATH still exists</strong> (defaults to <IC>~/go</IC>). Its only modern job: cache downloaded modules in <IC>$GOPATH/pkg/mod/</IC> and store installed binaries in <IC>$GOPATH/bin/</IC>.
          </Callout>
          <H3>go.mod & go.sum</H3>
          <P><IC>go.mod</IC> is your manifest — declares the module path, Go version, and direct dependencies. <IC>go.sum</IC> is the lockfile with cryptographic hashes for every dependency. Commit <strong>both</strong> to version control.</P>
          <CodeBlock lang="go" label="go.mod">
{`module github.com/you/myapp

go 1.22

require (
    github.com/gofiber/fiber/v2 v2.52.0
)`}
          </CodeBlock>
          <CodeBlock lang="bash" label="bash — module commands">
{`go mod init github.com/you/myapp  # create go.mod
go mod tidy                        # resolve deps, sync go.mod + go.sum
go mod download                    # pre-fetch deps to module cache`}
          </CodeBlock>
          <H3>go env</H3>
          <CodeBlock lang="bash">
{`go env GOPATH       # module cache + bin  (~/.go)
go env GOROOT       # Go installation dir
go env GOMODCACHE   # where downloaded modules live
go env GOPROXY      # proxy (default: proxy.golang.org)

# persist a setting globally
go env -w GONOSUMCHECK="*.internal.corp"`}
          </CodeBlock>
        </section>

        {/* S2: CLI */}
        <section id="s2" style={{ marginBottom: 64, scrollMarginTop: 100 }}>
          <SectionHeader num="02" title="go CLI Fundamentals" pills={["go build","go run","go test","go fmt","go vet","go doc"]} />
          <DataTable
            headers={["Command", "Purpose", "Key Flags"]}
            rows={[
              ["go build",    "Compile to binary (main) or check compilation (lib)", "-o, GOOS, GOARCH"],
              ["go run",      "Compile + execute in one step — dev only",            "—"],
              ["go test",     "Run tests in *_test.go files",                        "-v -race -cover -bench -run"],
              ["go fmt",      "Format code — the law, not a style guide",            "—"],
              ["go vet",      "Static analysis for real correctness bugs",           "—"],
              ["go doc",      "Print documentation from source",                     "-all"],
              ["go mod tidy", "Sync dependencies to go.mod + go.sum",               "—"],
            ]}
          />
          <CodeBlock lang="bash" label="bash — daily commands">
{`# Build
go build ./...                     # build everything
go build -o server ./cmd/server/   # named binary
GOOS=linux GOARCH=amd64 go build . # cross-compile

# Test
go test ./...              # all tests
go test -v -race ./...     # verbose + race detector (always in CI)
go test -run TestLogin .   # filter by pattern
go test -cover ./...       # coverage report
go test -bench=. ./...     # benchmarks

# Analysis
go fmt ./...
go vet ./...
go doc fmt.Println
go doc -all net/http`}
          </CodeBlock>
          <Callout type="tip">
            <strong>Always run with <IC>-race</IC> in CI.</strong> Go's concurrency model makes data races easy to introduce and nearly impossible to debug without it.
          </Callout>
        </section>

        {/* S3: TYPES */}
        <section id="s3" style={{ marginBottom: 64, scrollMarginTop: 100 }}>
          <SectionHeader num="03" title="Types, Variables & Zero Values" pills={["var","const",":=","zero values"]} />
          <P>Every type has a <strong>zero value</strong> — the default when declared without initialization. No undefined state, no uninitialized memory surprises.</P>
          <DataTable
            headers={["Type", "Zero Value", "Notes"]}
            rows={[
              ["int, int8, int32, int64",         "0",                       "int is platform-sized (32 or 64-bit)"],
              ["float32, float64",                 "0.0",                     "—"],
              ["string",                           '""',                      "immutable byte sequence"],
              ["bool",                             "false",                   "—"],
              ["pointer, slice, map, func, chan",  "nil",                     "nil ≠ empty — see each section"],
              ["struct",                           "each field → zero value", "recursively initialized"],
            ]}
          />
          <H3>Declaration Styles</H3>
          <CodeBlock lang="go">
{`var x int = 10      // explicit type + value
var x = 10          // inferred: int
x := 10             // short — function scope ONLY, needs 1 new var on left

const Pi = 3.14159  // compile-time constant
const MaxRetries = 3

// Type conversions are always explicit — no implicit coercion
var a int32 = 42
var b int64 = int64(a)

var (
    host string = "localhost"
    port int    = 8080
)`}
          </CodeBlock>
          <Callout type="warn">
            <IC>:=</IC> is function scope only, and at least one variable on the left must be new. <IC>int</IC> and <IC>int32</IC> are different types even if same size — always convert explicitly.
          </Callout>
        </section>

        {/* S4: FUNCTIONS */}
        <section id="s4" style={{ marginBottom: 64, scrollMarginTop: 100 }}>
          <SectionHeader num="04" title="Functions & Multiple Returns" pills={["func","defer","multiple returns","variadic","first-class"]} />
          <P>Functions are first-class values. The <strong>(result, error)</strong> return pattern replaces exceptions — error handling is visible, explicit, and local.</P>
          <CodeBlock lang="go" label="go — idiomatic patterns">
{`// Multiple returns — the (value, error) pattern
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

result, err := divide(10, 3)
if err != nil { return err }

// Named return values
func minMax(nums []int) (min, max int) {
    min, max = nums[0], nums[0]
    for _, v := range nums[1:] {
        if v < min { min = v }
        if v > max { max = v }
    }
    return  // bare return — returns min and max
}

// Variadic
func sum(nums ...int) int {
    total := 0
    for _, n := range nums { total += n }
    return total
}
sum(1, 2, 3)
nums := []int{1, 2, 3}
sum(nums...)  // spread slice into variadic args

// First-class functions
fn := func(x int) int { return x * 2 }
apply := func(f func(int) int, v int) int { return f(v) }
apply(fn, 5) // 10`}
          </CodeBlock>
          <H3>defer — Mechanics</H3>
          <P>Schedules a call to run when the surrounding function returns. Arguments evaluated <strong>immediately</strong>; execution deferred. Multiple defers run <strong>LIFO</strong>.</P>
          <CodeBlock lang="go">
{`func processFile(path string) error {
    f, err := os.Open(path)
    if err != nil { return err }
    defer f.Close()  // runs on return — even on error path
    return nil
}

// LIFO order
defer fmt.Println("1")
defer fmt.Println("2")
defer fmt.Println("3")
// Output: 3 → 2 → 1

// Arg evaluation GOTCHA
x := 10
defer fmt.Println(x)               // captures x=10 NOW → prints 10
x = 20
defer func() { fmt.Println(x) }() // closure: ref → prints 20

// Panic recovery — ONLY works inside a deferred function
defer func() {
    if r := recover(); r != nil {
        log.Printf("recovered: %v", r)
    }
}()`}
          </CodeBlock>
          <Callout type="warn">
            <strong>defer has overhead.</strong> In tight hot loops, call cleanup explicitly. Use it everywhere else — the clarity and safety guarantee are worth it.
          </Callout>
        </section>

        {/* S5: SLICES */}
        <section id="s5" style={{ marginBottom: 64, scrollMarginTop: 100 }}>
          <SectionHeader num="05" title="Arrays, Slices & Internals" pills={["make","append","copy","slice header","cap"]} />
          <P>A slice is <strong>not an array</strong>. It's a three-field struct (pointer, len, cap) that points into an underlying array. This is foundational to understanding Go memory.</P>
          <CodeBlock lang="go" label="go — slice internals">
{`// Slice header: struct { ptr *T; len int; cap int }

s := []int{1, 2, 3, 4, 5}
sub := s[1:3]                       // {2, 3} — shares SAME backing array
fmt.Println(len(sub), cap(sub))     // 2, 4
sub[0] = 99                         // modifies s[1] too — same memory!

// make: pre-allocate when you know the size
s := make([]int, 5)                 // len=5, cap=5
s := make([]int, 0, 100)            // len=0, cap=100 — no realloc for first 100`}
          </CodeBlock>
          <H3>append — How Growth Works</H3>
          <CodeBlock lang="go">
{`s := make([]int, 0, 3)
s = append(s, 1, 2, 3) // len=3, cap=3
s = append(s, 4)        // len=4, cap=6 — NEW backing array

// ALWAYS reassign — append may return a new header
s = append(s, value)   // correct
append(s, value)        // ❌ result silently discarded

// Append slice onto another
a = append(a, b...)`}
          </CodeBlock>
          <H3>copy & Slice Tricks</H3>
          <CodeBlock lang="go">
{`// True independence
clone := append([]int{}, original...)
clone := make([]int, len(original))
copy(clone, original)

// Delete at index i — order preserved
s = append(s[:i], s[i+1:]...)

// Delete at index i — faster, order not preserved
s[i] = s[len(s)-1]
s = s[:len(s)-1]

// Reverse in place
for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
    s[i], s[j] = s[j], s[i]
}`}
          </CodeBlock>
          <Callout type="danger">
            <strong>Shared backing array trap.</strong> Two slices from the same source share memory. If cap allows, <IC>append</IC> to one can silently overwrite the other. Always <IC>copy</IC> when you need true independence.
          </Callout>
        </section>

        {/* S6: MAPS */}
        <section id="s6" style={{ marginBottom: 64, scrollMarginTop: 100 }}>
          <SectionHeader num="06" title="Maps" pills={["map","delete","ok idiom","nil map panic"]} />
          <CodeBlock lang="go">
{`// Init — always init before writing
m := map[string]int{}              // empty map literal
m := make(map[string]int)          // equivalent
m := map[string]int{"a": 1}        // with values

// Nil map — reads safely, panics on write
var m map[string]int               // nil
_ = m["key"]                       // ok — returns 0
m["key"] = 1                       // PANIC: assignment to nil map

// Comma-ok idiom
v, ok := m["key"]
if !ok { /* key doesn't exist */ }

// Delete — always safe
delete(m, "key")

// Iteration order is RANDOMIZED — sort explicitly when order matters
keys := make([]string, 0, len(m))
for k := range m { keys = append(keys, k) }
sort.Strings(keys)
for _, k := range keys { fmt.Println(k, m[k]) }`}
          </CodeBlock>
          <Callout type="danger">
            <strong>Maps are not concurrency-safe.</strong> Any concurrent write (or read + write) causes a runtime panic. Use <IC>sync.RWMutex</IC> or <IC>sync.Map</IC> for shared state across goroutines.
          </Callout>
        </section>

        {/* S7: STRUCTS */}
        <section id="s7" style={{ marginBottom: 64, scrollMarginTop: 100 }}>
          <SectionHeader num="07" title="Structs & Methods" pills={["struct","methods","embedding","value receiver","pointer receiver"]} />
          <CodeBlock lang="go" label="go — structs">
{`type User struct {
    ID      int
    Name    string
    Email   string
    IsAdmin bool
}

// Always use named field init — positional breaks on struct changes
u := User{ID: 1, Name: "Alice", Email: "alice@example.com"}`}
          </CodeBlock>
          <H3>Value vs Pointer Receivers</H3>
          <CodeBlock lang="go">
{`type Counter struct{ count int }

// Value receiver — copy, cannot mutate original
func (c Counter) Value() int { return c.count }

// Pointer receiver — operates on original
func (c *Counter) Increment() { c.count++ }

c := Counter{}
c.Increment()          // Go auto-takes address: (&c).Increment()
fmt.Println(c.Value()) // 1`}
          </CodeBlock>
          <DataTable
            headers={["Use value receiver when", "Use pointer receiver when"]}
            rows={[
              ["Method doesn't mutate state",    "Method modifies the struct"],
              ["Struct is small (a few scalars)", "Struct is large — avoid copying"],
              ["Immutability is desired",         "Nil checks are needed"],
              ["—",                               "Any other method uses pointer receiver (be consistent)"],
            ]}
          />
          <H3>Struct Embedding — Composition over Inheritance</H3>
          <CodeBlock lang="go">
{`type Animal struct{ Name string }
func (a Animal) Speak() string { return a.Name + " makes a sound" }

type Dog struct {
    Animal         // embedded — NOT a named field
    Breed string
}

d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Husky"}
d.Speak()         // promoted method — calls Animal.Speak
d.Name            // promoted field — same as d.Animal.Name

// Override
func (d Dog) Speak() string { return d.Name + " barks" }`}
          </CodeBlock>
          <Callout type="info">
            Embedding is <strong>composition, not inheritance.</strong> <IC>Dog</IC> is not an <IC>Animal</IC> in the type system — it has Animal's behavior. Model types as "has-a" not "is-a". Go has no class hierarchy.
          </Callout>
        </section>

        {/* S8: POINTERS */}
        <section id="s8" style={{ marginBottom: 64, scrollMarginTop: 100 }}>
          <SectionHeader num="08" title="Pointers" pills={["&","*","nil","value semantics","escape analysis"]} />
          <CodeBlock lang="go" label="go — pointer basics">
{`x := 42
p := &x         // p is *int — address of x
*p = 100        // dereference — write through pointer
fmt.Println(x)  // 100

func increment(n *int) { *n++ }
x := 5
increment(&x)   // x is now 6

// new vs &T{}
p := new(int)          // *int → zero value (0)
u := &User{Name: "A"}  // idiomatic pointer to struct

// nil pointer dereference
var p *int
*p = 5          // PANIC

// Optional fields
type Config struct {
    Timeout *time.Duration  // nil means "use default"
}`}
          </CodeBlock>
          <H3>When to Use Pointers</H3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, margin: "14px 0" }}>
            <MiniCard label="Mutation"       value="*T" desc="Function needs to modify the caller's value" />
            <MiniCard label="Large structs"  value="*T" desc="Avoid expensive copies on every function call" />
            <MiniCard label="Optional value" value="*T" desc="nil signals 'not set' — no native Optional type" />
            <MiniCard label="Small scalars"  value="T"  desc="int, bool, small structs — value semantics, no GC pressure" />
          </div>
          <Callout type="info">
            <strong>Escape analysis.</strong> The compiler decides stack vs heap. Pointers often force heap allocation, adding GC pressure. For small, short-lived values, prefer value semantics.
          </Callout>
        </section>

        {/* S9: CONTROL FLOW */}
        <section id="s9" style={{ marginBottom: 64, scrollMarginTop: 100 }}>
          <SectionHeader num="09" title="Control Flow" pills={["for","switch","if","defer","range"]} />
          <H3>for — The Only Loop</H3>
          <P>Go has no <IC>while</IC> or <IC>do-while</IC>. <IC>for</IC> covers every looping pattern.</P>
          <CodeBlock lang="go">
{`for i := 0; i < 10; i++ {}    // classic
for condition {}                // while-style
for {}                          // infinite

// Range
for i, v := range slice {}     // index + value
for i := range slice {}        // index only
for _, v := range slice {}     // value only
for k, v := range m {}         // map
for i, r := range "hello" {}   // string: runes not bytes
for v := range ch {}            // channel: exits when closed

// Labeled break — escape nested loops
outer:
for i := 0; i < 5; i++ {
    for j := 0; j < 5; j++ {
        if i+j == 6 { break outer }
    }
}`}
          </CodeBlock>
          <H3>if — Init Statement</H3>
          <CodeBlock lang="go">
{`// err scoped to the if block only
if err := doSomething(); err != nil {
    return err
}
// err is NOT accessible here — tight scoping is idiomatic`}
          </CodeBlock>
          <H3>switch — More Powerful Than C</H3>
          <P>No fall-through by default. Conditionless switch replaces long if-else chains.</P>
          <CodeBlock lang="go">
{`switch x {
case 1:
case 2, 3:    // multiple values in one case
default:
}

// Conditionless — replaces if/else chains
switch {
case x < 0:   fmt.Println("negative")
case x == 0:  fmt.Println("zero")
default:       fmt.Println("positive")
}

// Type switch — essential for interface{} / any
switch v := i.(type) {
case int:     fmt.Printf("int: %d\n", v)
case string:  fmt.Printf("string: %s\n", v)
case error:   fmt.Printf("error: %v\n", v)
default:       fmt.Printf("unknown: %T\n", v)
}`}
          </CodeBlock>
        </section>

        {/* S10: MENTAL MODELS */}
        <section id="s10" style={{ marginBottom: 64, scrollMarginTop: 100, paddingTop: 44, borderTop: `2px solid ${T.teal}` }}>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 700, color: T.text0, letterSpacing: "-0.02em", marginBottom: 6 }}>Mental Models — Summary</h2>
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11, color: T.text2, marginBottom: 24 }}>The key abstractions to internalize</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {MENTAL_MODELS.map(({ topic, model }) => (
              <MentalModelCard key={topic} topic={topic} model={model} />
            ))}
          </div>
          <div style={{ height: 1, background: T.border, margin: "44px 0 20px" }} />
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.text2, textAlign: "center", letterSpacing: "0.07em" }}>
            GO FUNDAMENTALS FIELD GUIDE · v1.22+ · IDIOMATIC GO
          </p>
        </section>

      </main>
    </div>
  );
}
