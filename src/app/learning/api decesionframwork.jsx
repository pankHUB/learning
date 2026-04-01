import { useState } from "react";

const techniques = [
  {
    id: "short-polling",
    name: "Short Polling",
    tag: "PULL",
    tagColor: "#f59e0b",
    complexity: 1,
    latency: 4,
    serverLoad: 5,
    infraCost: 1,
    summary: "Client repeatedly requests data on a fixed interval.",
    protocol: "HTTP",
    direction: "Client → Server",
    bestFit: [
      "Low-frequency status checks (every 30s+)",
      "Internal dashboards where stale data is acceptable",
      "Systems with no persistent connection support",
      "Simple admin panels, cron-style UI refreshes",
    ],
    useCases: [
      "Deployment status page polling every 60s",
      "Background sync for non-critical data",
      "Checking if a slow export/report is ready",
      "Legacy system integrations with no webhook support",
    ],
    pitfalls: [
      "Most responses return empty — pure wasted bandwidth",
      "Latency ceiling = interval size (5s interval = 5s max delay)",
      "Thundering herd: all clients fire at the same moment",
      "DB gets hammered even when nothing has changed",
      "Doesn't scale — 10k clients = 10k req/s at 1s interval",
    ],
    avoid: [
      "Chat or messaging",
      "Financial tickers or live feeds",
      "Anything requiring <2s latency",
    ],
    example: `// Frontend
const poll = () => {
  setInterval(async () => {
    const res = await fetch('/api/job-status');
    const { status } = await res.json();
    if (status === 'done') clearInterval(poll);
    setStatus(status);
  }, 5000); // every 5s
};

// Backend (Express)
app.get('/api/job-status', (req, res) => {
  const job = jobQueue.get(req.query.id);
  res.json({ status: job.status });
});`,
    tip: "Add jitter to interval (Math.random() * 1000) to spread out requests and avoid thundering herd.",
  },
  {
    id: "long-polling",
    name: "Long Polling",
    tag: "PULL",
    tagColor: "#f59e0b",
    complexity: 3,
    latency: 2,
    serverLoad: 3,
    infraCost: 2,
    summary: "Server holds the request open until data arrives or timeout hits.",
    protocol: "HTTP",
    direction: "Client → Server (held open)",
    bestFit: [
      "Environments where WebSockets are blocked (strict firewalls)",
      "Notification delivery with low-to-medium traffic",
      "Fallback strategy when SSE/WS aren't available",
      "Simple real-time feel without persistent connection infra",
    ],
    useCases: [
      "Facebook Chat (used this for years before WS)",
      "Help desk ticket notifications",
      "Queue position updates ('You are #4 in line')",
      "Approval workflow alerts",
    ],
    pitfalls: [
      "One open connection per client — ties up server threads without async I/O",
      "Complex to implement correctly on the server side",
      "Race conditions on reconnect — can miss events",
      "Proxies/load balancers may time out long-held connections",
      "Not truly real-time — still a request/response cycle",
    ],
    avoid: [
      "High message frequency (multiple/sec)",
      "Large user concurrency without async server",
      "When SSE can do the job instead",
    ],
    example: `// Backend (FastAPI async — critical for this pattern)
@app.get("/api/notifications")
async def long_poll(last_id: str, request: Request):
    timeout = 30  # seconds
    start = time.time()
    while time.time() - start < timeout:
        events = await db.get_events_after(last_id)
        if events:
            return {"events": events}
        await asyncio.sleep(0.5)  # yield, don't block
    return {"events": []}  # timeout — client re-fires

// Frontend
const longPoll = async (lastId) => {
  const res = await fetch(\`/api/notifications?last_id=\${lastId}\`);
  const { events } = await res.json();
  if (events.length) processEvents(events);
  longPoll(events.at(-1)?.id ?? lastId); // immediately re-fire
};`,
    tip: "You NEED async I/O (Node, FastAPI async, Go goroutines). Sync servers will exhaust thread pools fast.",
  },
  {
    id: "sse",
    name: "Server-Sent Events",
    tag: "PUSH",
    tagColor: "#10b981",
    complexity: 2,
    latency: 1,
    serverLoad: 2,
    infraCost: 2,
    summary: "Single persistent HTTP connection. Server streams events down whenever it wants.",
    protocol: "HTTP (text/event-stream)",
    direction: "Server → Client only",
    bestFit: [
      "LLM token streaming (the ChatGPT model)",
      "Live notifications and activity feeds",
      "Real-time logs, build output, deployment progress",
      "Stock/price tickers where client doesn't send back",
      "Anywhere you'd reach for WebSockets but only need one direction",
    ],
    useCases: [
      "Streaming AI responses token-by-token",
      "CI/CD pipeline live log output",
      "Live sports scores display",
      "Order/shipment status push updates",
      "Social feed new post notifications",
    ],
    pitfalls: [
      "Server → client only — client still uses fetch for sends",
      "HTTP/1.1 browsers limit to 6 connections per domain (HTTP/2 removes this)",
      "Proxies that buffer responses break streaming — need chunked transfer",
      "No built-in backpressure — fast server can overwhelm slow client",
      "Harder to implement binary data (text/newline based protocol)",
    ],
    avoid: [
      "Bidirectional high-frequency messaging",
      "When you need binary frames (use WebSocket instead)",
      "Behind proxies that don't support streaming",
    ],
    example: `// Backend (FastAPI streaming)
@app.get("/api/stream")
async def stream_events(request: Request):
    async def event_generator():
        async for token in llm.stream(prompt):
            if await request.is_disconnected():
                break
            yield f"data: {json.dumps({'token': token})}\\n\\n"
    return StreamingResponse(
        event_generator(), media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

// Frontend (EventSource API)
const es = new EventSource('/api/stream');
es.onmessage = ({ data }) => {
  const { token } = JSON.parse(data);
  setOutput(prev => prev + token);
};
es.onerror = () => es.close();`,
    tip: "Set 'X-Accel-Buffering: no' header to prevent Nginx from buffering your stream silently.",
  },
  {
    id: "websocket",
    name: "WebSocket",
    tag: "PUSH",
    tagColor: "#10b981",
    complexity: 5,
    latency: 1,
    serverLoad: 2,
    infraCost: 5,
    summary: "Full TCP tunnel over HTTP upgrade. Both sides push frames at any time with ~2 byte overhead.",
    protocol: "WS / WSS",
    direction: "Bidirectional",
    bestFit: [
      "Collaborative real-time editing (Figma, Notion, Docs)",
      "Multiplayer games — game state sync",
      "Live chat with high message frequency",
      "Trading platforms, live order books",
      "Cursor/presence tracking (who's online, where they're looking)",
    ],
    useCases: [
      "Figma multiplayer cursors and edits",
      "Slack / Discord messaging",
      "Live coding environments (Replit, CodeSandbox)",
      "Bidding/auction systems",
      "Real-time collaborative whiteboards",
    ],
    pitfalls: [
      "Stateful — client is pinned to a server instance. Scales poorly without pub/sub layer",
      "Needs Redis pub/sub or message bus for multi-instance deployments",
      "Load balancers need sticky sessions or WS-aware config",
      "No built-in request/response semantics — you build your own message protocol",
      "Reconnection logic, heartbeats, and backoff are all on you",
      "AWS API Gateway WS support is complex and expensive",
      "Debugging is harder — no browser Network tab for WS frames (use wscat)",
    ],
    avoid: [
      "When only server → client push is needed (use SSE)",
      "Simple CRUD with occasional updates",
      "Behind load balancers not configured for sticky sessions",
    ],
    example: `// Backend (Node.js with ws + Redis pub/sub for multi-instance)
const wss = new WebSocketServer({ server });
const redis = new Redis();
const subscriber = new Redis();

wss.on('connection', (ws, req) => {
  const userId = authenticate(req);
  subscriber.subscribe(\`user:\${userId}\`);
  
  subscriber.on('message', (_, msg) => ws.send(msg));
  
  ws.on('message', async (raw) => {
    const msg = JSON.parse(raw);
    // publish so any server instance delivers to recipient
    await redis.publish(\`user:\${msg.to}\`, JSON.stringify(msg));
  });
  
  // Heartbeat — detect dead connections
  ws.isAlive = true;
  ws.on('pong', () => ws.isAlive = true);
});

setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);`,
    tip: "Never skip heartbeats. Without ping/pong, dead connections silently accumulate and leak memory.",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    tag: "EVENT",
    tagColor: "#8b5cf6",
    complexity: 2,
    latency: 1,
    serverLoad: 1,
    infraCost: 1,
    summary: "Third-party calls YOUR server when an event happens. Inverted polling.",
    protocol: "HTTP POST",
    direction: "External Server → Your Server",
    bestFit: [
      "Payment events (Stripe, Razorpay charge.succeeded)",
      "CI/CD triggers (GitHub push → deploy pipeline)",
      "Third-party integrations (Twilio SMS received, Slack commands)",
      "Any async event you'd otherwise poll a third-party API for",
      "Event-driven microservice integration",
    ],
    useCases: [
      "Stripe payment confirmation → provision user account",
      "GitHub PR merged → trigger deploy workflow",
      "Twilio incoming SMS → parse and respond",
      "Shopify order placed → update inventory system",
      "DocuSign document signed → unlock feature in your app",
    ],
    pitfalls: [
      "Providers WILL retry on failure — you'll receive duplicates. Must be idempotent",
      "Never process heavy work in handler — you'll time out and trigger retries",
      "Forgetting to verify HMAC signature = security hole (replay attacks)",
      "No webhook = no event. You need a fallback polling reconciliation job",
      "Hard to test locally — use ngrok or Stripe CLI to tunnel",
      "Order of delivery not guaranteed across retries",
    ],
    avoid: [
      "Real-time client UI updates (wrong layer — use WS/SSE for that)",
      "When you need guaranteed exactly-once delivery without extra infra",
    ],
    example: `// Backend webhook handler (Express + Stripe)
app.post('/webhooks/stripe',
  express.raw({ type: 'application/json' }), // raw body for sig verification
  async (req, res) => {
    // 1. Verify signature — NEVER skip this
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET);
    } catch {
      return res.status(400).send('Bad signature');
    }

    // 2. Return 200 IMMEDIATELY — then process async
    res.json({ received: true });

    // 3. Idempotency check
    const alreadyProcessed = await db.events.findOne({ stripeId: event.id });
    if (alreadyProcessed) return;
    await db.events.insert({ stripeId: event.id });

    // 4. Enqueue — don't process inline
    await queue.add('stripe-event', { event });
  }
);`,
    tip: "Store every received event ID in a DB and check before processing. Stripe retries for 3 days.",
  },
  {
    id: "grpc-streaming",
    name: "gRPC Streaming",
    tag: "STREAM",
    tagColor: "#06b6d4",
    complexity: 5,
    latency: 1,
    serverLoad: 1,
    infraCost: 3,
    summary: "Binary framed streams over HTTP/2 with typed protobuf contracts. 4 modes: unary, server stream, client stream, bidirectional.",
    protocol: "HTTP/2 + Protobuf",
    direction: "Bidirectional (configurable)",
    bestFit: [
      "Internal microservice-to-microservice communication",
      "IoT telemetry ingestion (high volume, binary efficient)",
      "ML model inference pipelines",
      "High-throughput typed streaming between services",
      "When you need a contract-first typed API",
    ],
    useCases: [
      "Kubernetes internal service mesh communication",
      "Real-time sensor data from IoT devices to processing service",
      "Streaming ML inference results between internal services",
      "Video transcoding progress streaming service-to-service",
      "Internal audit log streaming pipeline",
    ],
    pitfalls: [
      "Not browser-native — requires grpc-web proxy (Envoy) for browser clients",
      "Proto schema changes need coordination across all services",
      "Harder to debug than REST — binary protocol, no curl",
      "Overkill for client-facing APIs or simple internal calls",
      "Steep learning curve: proto files, generated stubs, streaming semantics",
    ],
    avoid: [
      "Public-facing browser clients (use REST/GraphQL instead)",
      "Simple CRUD services with no performance requirements",
      "Small teams where protobuf overhead slows iteration",
    ],
    example: `// proto definition
service PriceService {
  rpc WatchPrices(SubscribeRequest) returns (stream PriceUpdate);
}

// Go server
func (s *Server) WatchPrices(req *pb.SubscribeRequest, stream pb.PriceService_WatchPricesServer) error {
  ticker := time.NewTicker(100 * time.Millisecond)
  for {
    select {
    case <-ticker.C:
      price := getPrice(req.Symbol)
      if err := stream.Send(&pb.PriceUpdate{Price: price}); err != nil {
        return err // client disconnected
      }
    case <-stream.Context().Done():
      return nil
    }
  }
}

// Go client
stream, _ := client.WatchPrices(ctx, &pb.SubscribeRequest{Symbol: "BTC"})
for {
  update, err := stream.Recv()
  if err == io.EOF { break }
  fmt.Println(update.Price)
}`,
    tip: "Use server streaming for one-to-many data push, bidirectional only when client sends back frequently.",
  },
  {
    id: "message-queue",
    name: "Message Queue / Event Streaming",
    tag: "ASYNC",
    tagColor: "#ef4444",
    complexity: 4,
    latency: 3,
    serverLoad: 1,
    infraCost: 4,
    summary: "Producers write events to a broker (Kafka/SQS/RabbitMQ). Consumers process independently. Decouples services entirely.",
    protocol: "AMQP / Kafka protocol / SQS API",
    direction: "Async, decoupled",
    bestFit: [
      "Decoupling services that shouldn't know about each other",
      "Heavy background processing (email, PDF gen, ML jobs)",
      "Event sourcing and audit log systems",
      "Buffering traffic spikes — queue absorbs burst, workers drain at pace",
      "Fan-out: one event → multiple consumers",
    ],
    useCases: [
      "Order placed → [email service, inventory service, analytics service] all consume",
      "User signup → welcome email job enqueued → worker sends async",
      "Payment processed → webhook handler enqueues → worker provisions account",
      "Image upload → resize/thumbnail job queue → multiple workers",
      "Log aggregation pipeline (Kafka as the backbone)",
    ],
    pitfalls: [
      "Not for real-time client UI — consumers are async, latency is seconds+",
      "Message ordering only guaranteed within a Kafka partition",
      "Dead letter queue (DLQ) management is operationally complex",
      "Exactly-once delivery is very hard — plan for at-least-once + idempotency",
      "Kafka is heavy infra — SQS or Redis queues for smaller scale",
      "Schema evolution (Avro/Protobuf) requires governance as you scale",
    ],
    avoid: [
      "Client-facing real-time features (wrong tool entirely)",
      "Simple synchronous request/response flows",
      "Early-stage apps where infra complexity isn't justified",
    ],
    example: `// Producer (after webhook received)
await sqs.sendMessage({
  QueueUrl: process.env.ORDER_QUEUE_URL,
  MessageBody: JSON.stringify({ orderId, event: 'payment.succeeded' }),
  MessageDeduplicationId: stripeEventId, // idempotency
  MessageGroupId: customerId,           // ordering per customer
}).promise();

// Consumer (separate worker service)
const processOrder = async () => {
  const { Messages } = await sqs.receiveMessage({
    QueueUrl: process.env.ORDER_QUEUE_URL,
    WaitTimeSeconds: 20, // long poll — don't burn API calls
  }).promise();

  for (const msg of Messages ?? []) {
    const { orderId } = JSON.parse(msg.Body);
    await fulfillOrder(orderId);          // heavy work here
    await sqs.deleteMessage({            // ack — only after success
      QueueUrl: process.env.ORDER_QUEUE_URL,
      ReceiptHandle: msg.ReceiptHandle,
    }).promise();
  }
};`,
    tip: "Delete the message ONLY after successful processing. If your worker crashes mid-job, SQS re-delivers it.",
  },
];

const TAGS = ["ALL", "PULL", "PUSH", "EVENT", "STREAM", "ASYNC"];

const MetricBar = ({ value, max = 5, color }) => (
  <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
    {Array.from({ length: max }).map((_, i) => (
      <div
        key={i}
        style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          background: i < value ? color : "rgba(255,255,255,0.08)",
          transition: "background 0.2s",
        }}
      />
    ))}
  </div>
);

const CodeBlock = ({ code }) => (
  <pre
    style={{
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      borderRadius: 6,
      padding: "14px 16px",
      overflow: "auto",
      fontSize: 11.5,
      lineHeight: 1.65,
      color: "#a8c6e8",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      margin: "12px 0 0 0",
      maxHeight: 340,
    }}
  >
    <code>{code}</code>
  </pre>
);

const ScoreRow = ({ label, value, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
    <span style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
    <MetricBar value={value} color={color} />
  </div>
);

export default function DecisionFramework() {
  const [activeTag, setActiveTag] = useState("ALL");
  const [selected, setSelected] = useState(techniques[0]);
  const [showCode, setShowCode] = useState(false);
  const [activeSection, setActiveSection] = useState("bestfit");

  const filtered = activeTag === "ALL" ? techniques : techniques.filter(t => t.tag === activeTag);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c10",
      fontFamily: "'DM Mono', 'JetBrains Mono', monospace",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #151d28",
        padding: "20px 28px 16px",
        background: "linear-gradient(180deg, #0d1520 0%, #080c10 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: "#3b82f6", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            ARCH // DECISION MATRIX
          </span>
          <span style={{ fontSize: 10, color: "#1e3a5f" }}>v2.0</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
          Real-Time & Data Sync
          <span style={{ color: "#3b82f6" }}> Technique Framework</span>
        </h1>
        <p style={{ margin: "6px 0 16px", fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
          When to use each pattern — use cases, pitfalls, best fit, and production examples
        </p>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: "4px 12px",
                borderRadius: 4,
                border: `1px solid ${activeTag === tag ? "#3b82f6" : "#1e2d3d"}`,
                background: activeTag === tag ? "rgba(59,130,246,0.15)" : "transparent",
                color: activeTag === tag ? "#60a5fa" : "#475569",
                fontSize: 10,
                letterSpacing: "0.12em",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left: technique list */}
        <div style={{
          width: 220,
          borderRight: "1px solid #151d28",
          overflowY: "auto",
          flexShrink: 0,
        }}>
          {filtered.map(t => (
            <div
              key={t.id}
              onClick={() => { setSelected(t); setShowCode(false); setActiveSection("bestfit"); }}
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #0f1923",
                cursor: "pointer",
                background: selected.id === t.id ? "rgba(59,130,246,0.08)" : "transparent",
                borderLeft: `3px solid ${selected.id === t.id ? t.tagColor : "transparent"}`,
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: selected.id === t.id ? "#e2e8f0" : "#94a3b8" }}>
                  {t.name}
                </span>
                <span style={{
                  fontSize: 9,
                  padding: "2px 5px",
                  borderRadius: 3,
                  background: `${t.tagColor}22`,
                  color: t.tagColor,
                  letterSpacing: "0.1em",
                }}>
                  {t.tag}
                </span>
              </div>
              <div style={{ fontSize: 10, color: "#334155", lineHeight: 1.4 }}>
                {t.protocol}
              </div>
            </div>
          ))}
        </div>

        {/* Right: detail panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* Title row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 18, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                  {selected.name}
                </h2>
                <span style={{
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 4,
                  background: `${selected.tagColor}22`,
                  color: selected.tagColor,
                  letterSpacing: "0.1em",
                  border: `1px solid ${selected.tagColor}44`,
                }}>
                  {selected.tag}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: "#64748b", lineHeight: 1.5 }}>
                {selected.summary}
              </p>
            </div>
          </div>

          {/* Protocol + direction chips */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { label: "Protocol", value: selected.protocol },
              { label: "Direction", value: selected.direction },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: "4px 10px",
                background: "#0d1520",
                border: "1px solid #1e2d3d",
                borderRadius: 4,
                fontSize: 11,
              }}>
                <span style={{ color: "#3b4f63" }}>{label}: </span>
                <span style={{ color: "#94a3b8" }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {/* Metrics */}
            <div style={{
              background: "#0a1219",
              border: "1px solid #151d28",
              borderRadius: 8,
              padding: "14px 16px",
            }}>
              <div style={{ fontSize: 10, color: "#3b4f63", letterSpacing: "0.15em", marginBottom: 12, textTransform: "uppercase" }}>
                Characteristics
              </div>
              <ScoreRow label="Complexity" value={selected.complexity} color="#f59e0b" />
              <ScoreRow label="Latency (lower=better)" value={selected.latency} color="#ef4444" />
              <ScoreRow label="Server Load" value={selected.serverLoad} color="#8b5cf6" />
              <ScoreRow label="Infra Cost" value={selected.infraCost} color="#06b6d4" />
            </div>

            {/* Avoid when */}
            <div style={{
              background: "#0a1219",
              border: "1px solid #151d28",
              borderRadius: 8,
              padding: "14px 16px",
            }}>
              <div style={{ fontSize: 10, color: "#3b4f63", letterSpacing: "0.15em", marginBottom: 12, textTransform: "uppercase" }}>
                ✕ Avoid When
              </div>
              {selected.avoid.map((a, i) => (
                <div key={i} style={{
                  fontSize: 11.5,
                  color: "#64748b",
                  marginBottom: 6,
                  paddingLeft: 10,
                  borderLeft: "2px solid #ef444444",
                  lineHeight: 1.4,
                }}>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* Section tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 0, borderBottom: "1px solid #151d28" }}>
            {[
              { id: "bestfit", label: "Best Fit" },
              { id: "usecases", label: "Use Cases" },
              { id: "pitfalls", label: "Pitfalls" },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderBottom: `2px solid ${activeSection === s.id ? "#3b82f6" : "transparent"}`,
                  background: "transparent",
                  color: activeSection === s.id ? "#60a5fa" : "#3b4f63",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "0.05em",
                  transition: "all 0.15s",
                  marginBottom: -1,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Section content */}
          <div style={{
            background: "#0a1219",
            border: "1px solid #151d28",
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            padding: "14px 16px",
            marginBottom: 16,
          }}>
            {(activeSection === "bestfit" ? selected.bestFit :
              activeSection === "usecases" ? selected.useCases :
              selected.pitfalls
            ).map((item, i) => (
              <div key={i} style={{
                display: "flex",
                gap: 10,
                marginBottom: 8,
                fontSize: 12,
                lineHeight: 1.5,
                color: activeSection === "pitfalls" ? "#f87171" : "#94a3b8",
              }}>
                <span style={{
                  color: activeSection === "pitfalls" ? "#ef444466" : "#1e4a8a",
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  {activeSection === "pitfalls" ? "⚠" : "→"}
                </span>
                {item}
              </div>
            ))}
          </div>

          {/* Pro tip */}
          <div style={{
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 6,
            padding: "10px 14px",
            marginBottom: 16,
            display: "flex",
            gap: 10,
          }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
            <span style={{ fontSize: 12, color: "#7dd3fc", lineHeight: 1.5 }}>
              <strong style={{ color: "#60a5fa" }}>Pro tip: </strong>{selected.tip}
            </span>
          </div>

          {/* Code toggle */}
          <button
            onClick={() => setShowCode(v => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              background: showCode ? "rgba(59,130,246,0.12)" : "#0d1520",
              border: `1px solid ${showCode ? "rgba(59,130,246,0.3)" : "#1e2d3d"}`,
              borderRadius: 6,
              color: showCode ? "#60a5fa" : "#475569",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "0.05em",
              transition: "all 0.15s",
            }}
          >
            <span>{showCode ? "▼" : "▶"}</span>
            {showCode ? "Hide" : "Show"} production example
          </button>

          {showCode && <CodeBlock code={selected.example} />}
        </div>
      </div>

      {/* Bottom decision bar */}
      <div style={{
        borderTop: "1px solid #151d28",
        padding: "10px 28px",
        background: "#0d1520",
        display: "flex",
        gap: 6,
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 10, color: "#3b4f63", marginRight: 4, letterSpacing: "0.1em" }}>QUICK PICK:</span>
        {[
          { q: "Real-time bidirectional?", a: "WebSocket" },
          { q: "Server→client push only?", a: "SSE" },
          { q: "Third-party events?", a: "Webhooks" },
          { q: "Internal service streams?", a: "gRPC" },
          { q: "Async heavy processing?", a: "Message Queue" },
          { q: "Fire-and-forget simple?", a: "Short Polling" },
        ].map(({ q, a }) => (
          <div key={q} style={{
            padding: "3px 10px",
            background: "#0a1219",
            border: "1px solid #1e2d3d",
            borderRadius: 4,
            fontSize: 10,
            color: "#475569",
          }}>
            {q} <span style={{ color: "#60a5fa" }}>{a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}