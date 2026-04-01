"use client";

import { useState, useEffect, useRef } from "react";

const theme = {
  bg: "#060912",
  bgCard: "#0d1117",
  bgCode: "#010409",
  border: "#1c2333",
  borderHover: "#326CE5",
  blue: "#326CE5",
  cyan: "#38bdf8",
  green: "#4ade80",
  yellow: "#fbbf24",
  purple: "#a78bfa",
  red: "#f87171",
  textPrimary: "#e6edf3",
  textSecondary: "#8b949e",
  textMuted: "#484f58",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${theme.bg};
    color: ${theme.textPrimary};
    font-family: 'Outfit', sans-serif;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${theme.bg}; }
  ::-webkit-scrollbar-thumb { background: #1c2333; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #326CE5; }

  .mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-blue {
    0%, 100% { box-shadow: 0 0 0 0 rgba(50,108,229,0.4); }
    50% { box-shadow: 0 0 0 8px rgba(50,108,229,0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .fade-in { animation: fadeInUp 0.5s ease forwards; }
  .card-hover {
    transition: all 0.25s ease;
    cursor: default;
  }
  .card-hover:hover {
    border-color: #326CE5 !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(50,108,229,0.12);
  }
  .nav-item {
    transition: all 0.18s ease;
    cursor: pointer;
    border-radius: 6px;
  }
  .nav-item:hover { background: rgba(50,108,229,0.1); }
  .nav-item.active { background: rgba(50,108,229,0.15); border-left: 2px solid #326CE5; }

  .cmd-block {
    position: relative;
  }
  .cmd-block::before {
    content: '$ ';
    color: #4ade80;
    font-family: 'JetBrains Mono', monospace;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.5px;
  }

  .gradient-text {
    background: linear-gradient(135deg, #326CE5, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .section-enter { animation: fadeInUp 0.4s ease forwards; }

  .flow-arrow {
    color: #484f58;
    font-size: 18px;
    line-height: 1;
  }
`;

// ─── REUSABLE COMPONENTS ────────────────────────────────────────────────────

const Badge = ({ children, color = theme.blue }) => (
  <span className="badge" style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
    {children}
  </span>
);

const CodeBlock = ({ children, title }) => (
  <div style={{ background: theme.bgCode, border: `1px solid ${theme.border}`, borderRadius: 10, overflow: "hidden", margin: "16px 0" }}>
    {title && (
      <div style={{ padding: "8px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f56","#ffbd2e","#27c93f"].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span className="mono" style={{ fontSize: 12, color: theme.textMuted }}>{title}</span>
      </div>
    )}
    <pre style={{ padding: "16px 20px", fontSize: 13, lineHeight: 1.8, color: "#c9d1d9", overflowX: "auto", fontFamily: "'JetBrains Mono', monospace" }}>
      {children}
    </pre>
  </div>
);

const Card = ({ children, style = {}, accent }) => (
  <div className="card-hover" style={{
    background: theme.bgCard,
    border: `1px solid ${accent ? accent + "44" : theme.border}`,
    borderRadius: 12,
    padding: 24,
    boxShadow: accent ? `0 0 0 1px ${accent}11, inset 0 1px 0 ${accent}11` : "none",
    ...style
  }}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title, subtitle, badge }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>{title}</h2>
      {badge && <Badge color={theme.blue}>{badge}</Badge>}
    </div>
    {subtitle && <p style={{ color: theme.textSecondary, fontSize: 15, lineHeight: 1.6, marginLeft: 40 }}>{subtitle}</p>}
  </div>
);

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto", margin: "16px 0" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
          {headers.map(h => (
            <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: theme.textMuted, fontWeight: 600, fontSize: 12, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: `1px solid ${theme.border}22`, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1c233333"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "12px 16px", color: j === 0 ? theme.cyan : theme.textSecondary, fontFamily: j === 0 ? "'JetBrains Mono', monospace" : "inherit", fontSize: j === 0 ? 13 : 14 }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FlowDiagram = ({ steps }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "20px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
    {steps.map((step, i) => (
      <div key={i}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 24 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${step.color || theme.blue}22`, border: `1px solid ${step.color || theme.blue}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: step.color || theme.blue, fontWeight: 700, flexShrink: 0 }}>
              {i + 1}
            </div>
            {i < steps.length - 1 && <div style={{ width: 1, height: 20, background: `${theme.border}` }} />}
          </div>
          <div style={{ paddingTop: 2 }}>
            <span style={{ color: step.color || theme.blue, fontWeight: 600 }}>{step.component}</span>
            <span style={{ color: theme.textMuted }}> — </span>
            <span style={{ color: theme.textSecondary }}>{step.action}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── SECTIONS ────────────────────────────────────────────────────────────────

const OverviewSection = () => (
  <div className="section-enter">
    <SectionTitle icon="☸️" title="What is Kubernetes?" subtitle="Container orchestration platform — manages where containers run, keeps them alive, scales them, and updates them without downtime." badge="Intro" />

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
      {[
        { icon: "💥", title: "Without K8s", items: ["Container crashes → app is down", "Traffic spike → app is slow", "Deploy → downtime", "10 services → manual chaos"], color: theme.red },
        { icon: "✅", title: "With K8s", items: ["Pod crashes → auto restarts", "Traffic spike → auto scales", "Deploy → zero downtime rolling update", "10 services → fully automated"], color: theme.green },
      ].map(col => (
        <Card key={col.title} accent={col.color}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>{col.icon}</span>
            <span style={{ fontWeight: 700, color: col.color }}>{col.title}</span>
          </div>
          {col.items.map(item => (
            <div key={item} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: col.color, marginTop: 2 }}>›</span>
              <span style={{ color: theme.textSecondary, fontSize: 14 }}>{item}</span>
            </div>
          ))}
        </Card>
      ))}
    </div>

    <Card>
      <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>THE MENTAL MODEL</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          ["🏢 Company HQ", "Control Plane"],
          ["🏗️ Office Buildings", "Worker Nodes"],
          ["👥 Departments", "Namespaces"],
          ["👷 Employees", "Pods"],
          ["📋 HR Policy Doc", "YAML Manifest"],
          ["👔 HR Manager", "Controller"],
        ].map(([real, k8s]) => (
          <div key={k8s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#0d1117", borderRadius: 8, border: `1px solid ${theme.border}` }}>
            <span style={{ fontSize: 13, color: theme.textSecondary }}>{real}</span>
            <span style={{ fontSize: 12, color: theme.cyan, fontFamily: "'JetBrains Mono', monospace" }}>{k8s}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const ClusterSection = () => (
  <div className="section-enter">
    <SectionTitle icon="🔵" title="The Cluster" subtitle="A group of machines working together — split into Control Plane (brain) and Worker Nodes (muscle)." badge="Architecture" />

    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 28, marginBottom: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2 }}>CLUSTER</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[
          { label: "CONTROL PLANE", subtitle: "The Brain", color: theme.blue, icon: "🧠", items: ["API Server", "etcd", "Controller Manager", "Scheduler"], desc: "Makes decisions. Never runs your app." },
          { label: "WORKER NODES", subtitle: "The Muscle", color: theme.green, icon: "💪", items: ["Kubelet", "Kube-proxy", "Container Runtime"], desc: "Runs your actual containers." },
        ].map(side => (
          <div key={side.label} style={{ border: `1px dashed ${side.color}44`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", align: "center", gap: 8, marginBottom: 12 }}>
              <span>{side.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: side.color, letterSpacing: 1, fontWeight: 600 }}>{side.label}</div>
                <div style={{ fontSize: 13, color: theme.textSecondary }}>{side.desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {side.items.map(item => (
                <div key={item} style={{ padding: "6px 12px", background: `${side.color}0d`, border: `1px solid ${side.color}22`, borderRadius: 6, fontSize: 13, color: side.color, fontFamily: "'JetBrains Mono', monospace" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    <Card>
      <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>FULL REQUEST FLOW</div>
      <FlowDiagram steps={[
        { component: "kubectl apply", action: "sends YAML to API Server (REST call)", color: theme.cyan },
        { component: "API Server → etcd", action: "stores desired state", color: theme.blue },
        { component: "Controller Manager", action: "notices gap between desired and actual", color: theme.purple },
        { component: "Scheduler", action: "picks best node for each pod", color: theme.yellow },
        { component: "API Server → etcd", action: "pod assigned to node", color: theme.blue },
        { component: "kubelet on Node", action: "sees assigned pod, starts container", color: theme.green },
        { component: "Container Runtime", action: "pulls image, runs container", color: theme.green },
        { component: "kubelet → API Server", action: "reports Running status", color: theme.green },
      ]} />
    </Card>
  </div>
);

const ControlPlaneSection = () => {
  const [active, setActive] = useState(0);

  const components = [
    {
      name: "API Server",
      icon: "🧠",
      color: theme.blue,
      tag: "kube-apiserver",
      tagline: "Single entry point for everything",
      description: "Every interaction with K8s — kubectl, CI/CD, internal components — goes through the API Server. Nothing talks to anything else directly.",
      points: [
        "Exposes a REST API — kubectl is just making HTTP calls",
        "Validates and authenticates every request",
        "Stateless — can be scaled horizontally",
        "Only component that reads/writes to etcd",
      ],
      analogy: "Reception desk of the entire cluster. Every request must check in here first.",
      code: `# Every kubectl command is an HTTP call
kubectl get pods -v=8
# GET https://api-server:6443/api/v1/namespaces/default/pods
# Authorization: Bearer eyJhbGc...
# Response: 200 OK { "items": [...] }`
    },
    {
      name: "etcd",
      icon: "📦",
      color: theme.cyan,
      tag: "etcd",
      tagline: "Single source of truth",
      description: "Every piece of cluster state lives here. Desired replicas, node list, deployment configs, health state — all of it.",
      points: [
        "Distributed key-value store (not a relational DB)",
        "Uses Raft consensus — consistent even if some nodes fail",
        "Only the API Server talks to etcd directly",
        "If etcd dies → cluster is blind. That's why backups are critical.",
      ],
      analogy: "Cluster's brain memory. Lose it → the brain forgets everything.",
      code: `# Data stored in etcd looks like:
Key:   /registry/deployments/default/my-api
Value: {
  replicas: 3,
  image: "my-api:v2",
  status: { readyReplicas: 3 }
}`
    },
    {
      name: "Controller Manager",
      icon: "👁️",
      color: theme.purple,
      tag: "kube-controller-manager",
      tagline: "Watches state, fixes drift",
      description: "Runs multiple controllers in one process. Each watches a specific resource type and reconciles desired vs actual state — forever.",
      points: [
        "Deployment Controller: ensures correct ReplicaSets",
        "ReplicaSet Controller: ensures correct Pod count",
        "Node Controller: detects when nodes go down",
        "Reconciliation loop runs forever — self-healing",
      ],
      analogy: "Automated ops engineer — checks if reality matches your YAML and fixes it if not.",
      code: `# The reconciliation loop (conceptually)
loop forever:
  desired = read from etcd    # what you declared
  actual  = observe cluster   # what's running

  if desired != actual:
    take action to fix it
    # e.g. pod crashed → create new one`
    },
    {
      name: "Scheduler",
      icon: "📅",
      color: theme.yellow,
      tag: "kube-scheduler",
      tagline: "Decides which node gets each pod",
      description: "When a new Pod appears (unscheduled), Scheduler evaluates all nodes in two phases — filtering then scoring — and picks the best one.",
      points: [
        "Filtering: removes nodes that can't run the pod (no resources, wrong labels, taints)",
        "Scoring: ranks remaining nodes by fit (resources, spread, zone)",
        "Does NOT start the container — just writes the decision to etcd",
        "Kubelet on the winning node does the actual work",
      ],
      analogy: "Automated staffing manager — looks at all workers, checks capacity, assigns the task.",
      code: `# Scheduling decision factors:
Filtering:
  ✓ Has enough CPU/memory?
  ✓ Matches node selectors/taints?
  ✓ Node is Ready?

Scoring:
  + Most free resources
  + Spreads pods evenly
  + Preferred availability zone`
    },
  ];

  const comp = components[active];

  return (
    <div className="section-enter">
      <SectionTitle icon="🧠" title="Control Plane" subtitle="Never runs your app. Only manages the cluster. 4 core components." badge="4 Components" />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {components.map((c, i) => (
          <button key={c.name} onClick={() => setActive(i)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${active === i ? c.color : theme.border}`, background: active === i ? `${c.color}15` : "transparent", color: active === i ? c.color : theme.textSecondary, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: active === i ? 600 : 400, transition: "all 0.18s" }}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <Card accent={comp.color} style={{ transition: "all 0.2s" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 36 }}>{comp.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>{comp.name}</h3>
              <Badge color={comp.color}>{comp.tag}</Badge>
            </div>
            <p style={{ color: comp.color, fontSize: 14, fontWeight: 500 }}>{comp.tagline}</p>
          </div>
        </div>

        <p style={{ color: theme.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>{comp.description}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>KEY POINTS</div>
            {comp.points.map(pt => (
              <div key={pt} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ color: comp.color, flexShrink: 0 }}>›</span>
                <span style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 1.5 }}>{pt}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>ANALOGY</div>
            <div style={{ padding: 16, background: `${comp.color}0a`, border: `1px solid ${comp.color}22`, borderRadius: 8, color: theme.textSecondary, fontSize: 14, lineHeight: 1.6, fontStyle: "italic" }}>
              "{comp.analogy}"
            </div>
          </div>
        </div>

        <CodeBlock title={comp.tag}>{comp.code}</CodeBlock>
      </Card>
    </div>
  );
};

const WorkerNodeSection = () => {
  const [active, setActive] = useState(0);

  const components = [
    {
      name: "kubelet",
      icon: "🤖",
      color: theme.green,
      tagline: "Node agent — takes orders, executes, reports back",
      description: "Runs on every worker node. It's the bridge between the Control Plane and what actually runs on the machine. Watches for pod assignments, starts containers, monitors health, reports status.",
      probes: [
        { name: "Liveness Probe", desc: "Is the app alive?", action: "Restarts container on failure", color: theme.red },
        { name: "Readiness Probe", desc: "Is it ready for traffic?", action: "Removes from Service on failure (no restart)", color: theme.yellow },
        { name: "Startup Probe", desc: "Has it finished booting?", action: "Pauses liveness/readiness until passing", color: theme.blue },
      ],
      code: `# Probe config example
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10   # wait before first check
  periodSeconds: 5          # check every 5s
  failureThreshold: 3       # restart after 3 fails

readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  periodSeconds: 3`
    },
    {
      name: "kube-proxy",
      icon: "🌐",
      color: theme.cyan,
      tagline: "Network traffic cop on each node",
      description: "Maintains network rules (iptables/IPVS) that route traffic from a Service to the correct pod. You never touch it directly — it's invisible plumbing that makes Service → Pod routing work.",
      probes: [
        { name: "ClusterIP", desc: "Internal only", action: "Service-to-service communication", color: theme.blue },
        { name: "NodePort", desc: "Exposes on node port", action: "Dev/testing use — avoid in prod", color: theme.yellow },
        { name: "LoadBalancer", desc: "Cloud LB provisioned", action: "AWS ELB / Azure LB / GCP LB", color: theme.green },
      ],
      code: `# Traffic flow via kube-proxy:

Request hits Service (stable IP)
         │
         ▼
kube-proxy intercepts (iptables rule)
         │
   round-robin to healthy pods
         ├── Pod 1 (Node A)
         ├── Pod 2 (Node B)
         └── Pod 3 (Node A)`
    },
    {
      name: "Container Runtime",
      icon: "📦",
      color: theme.purple,
      tagline: "The actual machine that runs containers",
      description: "K8s doesn't run containers directly — it delegates to a container runtime via CRI (Container Runtime Interface). The runtime talks to the OS kernel to create and manage containers.",
      probes: [
        { name: "containerd", desc: "Default in most clusters", action: "Used by EKS, AKS, GKE", color: theme.green },
        { name: "CRI-O", desc: "Lightweight alternative", action: "Default in OpenShift", color: theme.blue },
        { name: "Docker Engine", desc: "Legacy", action: "Deprecated in K8s 1.24+", color: theme.red },
      ],
      code: `# The chain:
kubelet
  └──► CRI (standard interface)
         └──► containerd
                └──► Linux kernel
                       ├── namespaces (isolation)
                       ├── cgroups (resource limits)
                       └──► your container running`
    },
  ];

  const comp = components[active];

  return (
    <div className="section-enter">
      <SectionTitle icon="💪" title="Worker Nodes" subtitle="Where your actual app runs. Each node has 3 components." badge="3 Components" />

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {components.map((c, i) => (
          <button key={c.name} onClick={() => setActive(i)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${active === i ? c.color : theme.border}`, background: active === i ? `${c.color}15` : "transparent", color: active === i ? c.color : theme.textSecondary, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: active === i ? 600 : 400, transition: "all 0.18s" }}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <Card accent={comp.color}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>{comp.icon}</span>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>{comp.name}</h3>
              <p style={{ color: comp.color, fontSize: 14 }}>{comp.tagline}</p>
            </div>
          </div>
          <p style={{ color: theme.textSecondary, lineHeight: 1.7 }}>{comp.description}</p>
        </div>

        <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>
          {active === 0 ? "HEALTH PROBES" : active === 1 ? "SERVICE TYPES" : "RUNTIMES"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {comp.probes.map(p => (
            <div key={p.name} style={{ padding: 14, background: `${p.color}0a`, border: `1px solid ${p.color}22`, borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: p.color, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 6 }}>{p.desc}</div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>{p.action}</div>
            </div>
          ))}
        </div>

        <CodeBlock title={comp.name}>{comp.code}</CodeBlock>
      </Card>
    </div>
  );
};

const KubectlSection = () => {
  const [activeGroup, setActiveGroup] = useState("reading");

  const groups = {
    reading: {
      label: "📋 Reading State",
      color: theme.blue,
      commands: [
        ["kubectl get pods", "list pods in current namespace"],
        ["kubectl get pods -n kube-system", "pods in specific namespace"],
        ["kubectl get pods -A", "pods in ALL namespaces"],
        ["kubectl get pods -o wide", "extra info: node, IP"],
        ["kubectl get pods -o yaml", "full raw YAML output"],
        ["kubectl get pods --watch", "live updates stream"],
        ["kubectl describe pod <name>", "detailed debug info"],
        ["kubectl describe node <name>", "node capacity + allocations"],
      ]
    },
    applying: {
      label: "🚀 Applying Changes",
      color: theme.green,
      commands: [
        ["kubectl apply -f deploy.yaml", "create or update (idempotent) ← always use this"],
        ["kubectl apply -f ./k8s/", "apply entire directory"],
        ["kubectl delete -f deploy.yaml", "delete what's in the file"],
        ["kubectl delete pod <name>", "delete pod (deployment recreates it)"],
        ["kubectl scale deployment my-api --replicas=5", "manual scale"],
      ]
    },
    debugging: {
      label: "🔍 Debugging",
      color: theme.yellow,
      commands: [
        ["kubectl logs <pod>", "current logs"],
        ["kubectl logs <pod> --previous", "logs from crashed container"],
        ["kubectl logs <pod> -f", "follow / stream logs"],
        ["kubectl logs <pod> -c <container>", "specific container in pod"],
        ["kubectl exec -it <pod> -- /bin/sh", "shell into container"],
        ["kubectl port-forward pod/<pod> 8080:3000", "localhost:8080 → pod:3000"],
        ["kubectl port-forward svc/<svc> 8080:80", "forward via service"],
      ]
    },
    rollouts: {
      label: "⚙️ Rollouts",
      color: theme.purple,
      commands: [
        ["kubectl rollout status deployment/my-api", "watch rollout progress"],
        ["kubectl rollout history deployment/my-api", "deployment history"],
        ["kubectl rollout undo deployment/my-api", "rollback one version"],
        ["kubectl rollout undo deployment/my-api --to-revision=3", "rollback to specific version"],
        ["kubectl rollout restart deployment/my-api", "rolling restart (zero downtime)"],
      ]
    },
  };

  const grp = groups[activeGroup];

  return (
    <div className="section-enter">
      <SectionTitle icon="⌨️" title="kubectl" subtitle="CLI tool that makes REST API calls to the API Server. Runs on your machine, not in the cluster." badge="CLI Tool" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card>
          <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>COMMAND ANATOMY</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
            {[
              { word: "kubectl", color: theme.blue, label: "binary" },
              { word: "<verb>", color: theme.green, label: "get, apply, delete" },
              { word: "<resource>", color: theme.yellow, label: "pod, deployment" },
              { word: "<name>", color: theme.purple, label: "my-pod" },
              { word: "<flags>", color: theme.cyan, label: "-n, -o, -l" },
            ].map(part => (
              <div key={part.word} style={{ textAlign: "center" }}>
                <div style={{ padding: "4px 10px", background: `${part.color}15`, border: `1px solid ${part.color}33`, borderRadius: 6, color: part.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, marginBottom: 4 }}>{part.word}</div>
                <div style={{ fontSize: 10, color: theme.textMuted }}>{part.label}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>CONTEXT MANAGEMENT</div>
          {[
            "kubectl config get-contexts",
            "kubectl config current-context",
            "kubectl config use-context prod",
          ].map(cmd => (
            <div key={cmd} style={{ padding: "8px 12px", background: theme.bgCode, borderRadius: 6, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: theme.cyan }}>
              $ {cmd}
            </div>
          ))}
          <div style={{ marginTop: 10, padding: "8px 12px", background: `${theme.red}0a`, border: `1px solid ${theme.red}22`, borderRadius: 6, fontSize: 12, color: theme.red }}>
            ⚠️ Always check your context before running destructive commands
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {Object.entries(groups).map(([key, g]) => (
            <button key={key} onClick={() => setActiveGroup(key)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${activeGroup === key ? g.color : theme.border}`, background: activeGroup === key ? `${g.color}15` : "transparent", color: activeGroup === key ? g.color : theme.textSecondary, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 13, transition: "all 0.18s" }}>
              {g.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {grp.commands.map(([cmd, desc]) => (
            <div key={cmd} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, padding: "10px 14px", borderRadius: 8, background: theme.bgCode, alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1c2333"}
              onMouseLeave={e => e.currentTarget.style.background = theme.bgCode}
            >
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: grp.color }}>$ {cmd}</code>
              <span style={{ fontSize: 12, color: theme.textMuted, whiteSpace: "nowrap" }}>— {desc}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: 14, background: `${theme.blue}0a`, border: `1px solid ${theme.blue}22`, borderRadius: 8 }}>
          <span style={{ fontSize: 13, color: theme.blue, fontFamily: "'JetBrains Mono', monospace" }}>$ kubectl apply -f deployment.yaml --dry-run=server</span>
          <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>Safety net — validates against the live cluster without making changes. Use before every production apply.</p>
        </div>
      </Card>
    </div>
  );
};

const KubeletSection = () => (
  <div className="section-enter">
    <SectionTitle icon="🤖" title="kubelet" subtitle="System daemon on every worker node. The bridge between Control Plane decisions and actual container execution." badge="Node Daemon" />

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
      <Card accent={theme.green}>
        <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 16 }}>KUBELET LOOP</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2 }}>
          {[
            { step: "1. Poll API Server", detail: "any new pods assigned?", color: theme.blue },
            { step: "2. Not started?", detail: "→ tell runtime to start", color: theme.green },
            { step: "3. Crashed?", detail: "→ restart (restartPolicy)", color: theme.red },
            { step: "4. Run probes", detail: "liveness + readiness", color: theme.yellow },
            { step: "5. Report status", detail: "→ API Server every ~10s", color: theme.purple },
          ].map(item => (
            <div key={item.step} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: `1px solid ${theme.border}22`, marginBottom: 8 }}>
              <span style={{ color: item.color }}>{item.step}</span>
              <span style={{ color: theme.textMuted, fontSize: 12 }}>{item.detail}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card accent={theme.blue}>
        <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 16 }}>NODE HEARTBEAT</div>
        <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
          kubelet sends a heartbeat to the API Server every ~10 seconds. If silent for ~40s → node marked <span style={{ color: theme.red }}>NotReady</span> → pods rescheduled elsewhere.
        </p>
        <CodeBlock>
{`{
  node: "worker-node-2",
  conditions: {
    Ready: true,
    MemoryPressure: false,
    DiskPressure: false
  },
  allocatable: {
    cpu: "3800m",
    memory: "6Gi"
  }
}`}
        </CodeBlock>
      </Card>
    </div>

    <Card>
      <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 20 }}>COMPARISON — kubectl vs kubelet</div>
      <Table
        headers={["", "kubectl", "kubelet"]}
        rows={[
          ["Lives on", "Your laptop / CI-CD", "Every worker node"],
          ["Is a", "CLI binary", "System daemon (always running)"],
          ["Talks to", "API Server (HTTPS)", "API Server (watches for pods)"],
          ["Used by", "You, automation scripts", "K8s internally — you never call it"],
          ["Does", "Read state, apply manifests, debug", "Start/stop pods, health probes, report status"],
          ["In managed K8s", "You always use it", "You never see it — it's there"],
        ]}
      />
    </Card>
  </div>
);

const BuildingBlocksSection = () => {
  const blocks = [
    { icon: "🟢", name: "Pod", color: theme.green, desc: "Smallest deployable unit. Wraps one (or more) containers. Gets its own IP but it's temporary — pods are ephemeral.", key: "You almost never manage Pods directly. Deployments do that." },
    { icon: "🟡", name: "Deployment", color: theme.yellow, desc: "Blueprint that declares desired state — e.g. 'keep 3 replicas of this pod running'. Handles rolling updates and rollbacks.", key: "Deployment = desired state manager for your pods." },
    { icon: "🔴", name: "Service", color: theme.red, desc: "Stable DNS name + IP that routes to healthy pods. Solves the problem of pods having temporary IPs.", key: "Without Service, pods can't reliably find each other." },
    { icon: "🟣", name: "Ingress", color: theme.purple, desc: "Single HTTP/S entry point routing external traffic to multiple services. Acts as a reverse proxy at the K8s level.", key: "Think: nginx/API gateway but for your entire cluster." },
    { icon: "⚙️", name: "ConfigMap", color: theme.cyan, desc: "Inject non-sensitive config (env vars, config files) into pods. Change config without rebuilding your image.", key: "Never bake env config into your Docker image." },
    { icon: "🔐", name: "Secret", color: theme.blue, desc: "Same as ConfigMap but for sensitive data — DB passwords, API keys. Base64 encoded (not encrypted by default).", key: "Use an external secrets manager (Vault, AWS SM) in prod." },
    { icon: "💾", name: "PersistentVolume", color: "#f97316", desc: "Storage that survives pod restarts. Backed by EBS, Azure Disk, etc. Claimed by pods via PersistentVolumeClaim (PVC).", key: "Containers are stateless. PV is how you add state." },
    { icon: "🗂️", name: "Namespace", color: "#ec4899", desc: "Virtual cluster inside a cluster. Isolate dev/staging/prod environments or teams within one physical cluster.", key: "Great for multi-env or multi-team setups." },
  ];

  return (
    <div className="section-enter">
      <SectionTitle icon="🧩" title="Core Building Blocks" subtitle="The fundamental resource types you'll work with in every K8s project." badge="8 Resources" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {blocks.map(b => (
          <Card key={b.name} accent={b.color}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{b.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</span>
            </div>
            <p style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>{b.desc}</p>
            <div style={{ padding: "8px 12px", background: `${b.color}0a`, border: `1px solid ${b.color}22`, borderRadius: 6, fontSize: 12, color: b.color }}>
              💡 {b.key}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CheatSheetSection = () => (
  <div className="section-enter">
    <SectionTitle icon="📋" title="Deploy Checklist" subtitle="Everything you need when someone says 'deploy this to K8s'" badge="Checklist" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
      {[
        { step: "01", label: "Docker Image", desc: "Built and pushed to a container registry (ECR, DockerHub, GCR)", color: theme.blue },
        { step: "02", label: "Deployment YAML", desc: "replicas, image, resource requests/limits, env vars", color: theme.green },
        { step: "03", label: "Service YAML", desc: "ClusterIP for internal, LoadBalancer for external traffic", color: theme.yellow },
        { step: "04", label: "Ingress Rule", desc: "Route external HTTP/S traffic to the right service", color: theme.purple },
        { step: "05", label: "ConfigMap / Secret", desc: "Environment-specific config and sensitive credentials", color: theme.cyan },
        { step: "06", label: "Health Probes", desc: "Liveness + Readiness probes on kubelet for self-healing", color: theme.red },
      ].map(item => (
        <div key={item.step} style={{ display: "flex", gap: 16, padding: 18, background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 10, transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.background = `${item.color}08`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.bgCard; }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: `${item.color}44`, flexShrink: 0, lineHeight: 1 }}>{item.step}</div>
          <div>
            <div style={{ fontWeight: 600, color: item.color, marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 13, color: theme.textSecondary }}>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>

    <Card>
      <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>WHAT K8S HANDLES AUTOMATICALLY</div>
      <Table
        headers={["Situation", "K8s Response"]}
        rows={[
          ["Pod crashes", "Controller Manager detects → kubelet restarts it"],
          ["Node dies", "Pods rescheduled on healthy nodes automatically"],
          ["Traffic spike (HPA)", "New pods spawned, load distributed"],
          ["New deployment pushed", "Rolling update — old pods replaced gradually"],
          ["Bad deployment", "kubectl rollout undo — instant rollback"],
          ["Container not ready", "kubelet removes it from Service until healthy"],
        ]}
      />
    </Card>
  </div>
);

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

const navItems = [
  { id: "overview", label: "Overview", icon: "☸️" },
  { id: "cluster", label: "Cluster Architecture", icon: "🔵" },
  { id: "control-plane", label: "Control Plane", icon: "🧠" },
  { id: "worker-nodes", label: "Worker Nodes", icon: "💪" },
  { id: "kubectl", label: "kubectl", icon: "⌨️" },
  { id: "kubelet", label: "kubelet vs kubectl", icon: "🤖" },
  { id: "building-blocks", label: "Building Blocks", icon: "🧩" },
  { id: "cheatsheet", label: "Deploy Checklist", icon: "📋" },
];

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function K8sGuide() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef(null);

  const sectionMap = {
    "overview": <OverviewSection />,
    "cluster": <ClusterSection />,
    "control-plane": <ControlPlaneSection />,
    "worker-nodes": <WorkerNodeSection />,
    "kubectl": <KubectlSection />,
    "kubelet": <KubeletSection />,
    "building-blocks": <BuildingBlocksSection />,
    "cheatsheet": <CheatSheetSection />,
  };

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo(0, 0);
  }, [activeSection]);

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ display: "flex", height: "100vh", background: theme.bg, overflow: "hidden" }}>

        {/* SIDEBAR */}
        <div style={{ width: sidebarOpen ? 260 : 60, flexShrink: 0, background: "#0a0e1a", borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", transition: "width 0.25s ease", overflow: "hidden" }}>

          {/* Logo */}
          <div style={{ padding: "20px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #326CE5, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, animation: "float 3s ease-in-out infinite" }}>☸️</div>
            {sidebarOpen && (
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: theme.textPrimary }}>K8s Guide</div>
                <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>v1.29 • Interactive</div>
              </div>
            )}
          </div>

          {/* Back link */}
          {sidebarOpen && (
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${theme.border}` }}>
              <a href="/learning" style={{ fontSize: 12, color: theme.textMuted, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = theme.blue}
                onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
              >
                ← Learning Hub
              </a>
            </div>
          )}

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
            {navItems.map(item => (
              <div key={item.id} className={`nav-item ${activeSection === item.id ? "active" : ""}`} onClick={() => setActiveSection(item.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", marginBottom: 2, color: activeSection === item.id ? theme.blue : theme.textSecondary, borderLeft: activeSection === item.id ? `2px solid ${theme.blue}` : "2px solid transparent" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span style={{ fontSize: 13, fontWeight: activeSection === item.id ? 600 : 400, whiteSpace: "nowrap" }}>{item.label}</span>}
              </div>
            ))}
          </nav>

          {/* Toggle */}
          <div style={{ padding: "12px 8px", borderTop: `1px solid ${theme.border}` }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: "100%", padding: "8px", background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.textMuted, cursor: "pointer", fontSize: 14, transition: "all 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = theme.blue}
              onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
            >
              {sidebarOpen ? "◀ Collapse" : "▶"}
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "40px 48px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }} key={activeSection}>
            {sectionMap[activeSection]}
          </div>

          {/* Nav footer */}
          <div style={{ maxWidth: 860, margin: "48px auto 0", paddingTop: 24, borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between" }}>
            {(() => {
              const idx = navItems.findIndex(n => n.id === activeSection);
              const prev = navItems[idx - 1];
              const next = navItems[idx + 1];
              return (
                <>
                  {prev ? (
                    <button onClick={() => setActiveSection(prev.id)} style={{ padding: "10px 20px", background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.textSecondary, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, transition: "all 0.18s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = theme.blue; e.currentTarget.style.color = theme.blue; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textSecondary; }}>
                      ← {prev.icon} {prev.label}
                    </button>
                  ) : <div />}
                  {next ? (
                    <button onClick={() => setActiveSection(next.id)} style={{ padding: "10px 20px", background: `${theme.blue}15`, border: `1px solid ${theme.blue}44`, borderRadius: 8, color: theme.blue, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, fontWeight: 600, transition: "all 0.18s" }}
                      onMouseEnter={e => e.currentTarget.style.background = `${theme.blue}25`}
                      onMouseLeave={e => e.currentTarget.style.background = `${theme.blue}15`}>
                      {next.icon} {next.label} →
                    </button>
                  ) : <div />}
                </>
              );
            })()}
          </div>
          <div style={{ height: 60 }} />
        </div>
      </div>
    </>
  );
}
