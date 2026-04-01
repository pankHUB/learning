"use client";
import { useState } from "react";
import EventLoop from "./EventLoop";

const concepts = [
  {
    id: "01",
    title: "Event Loop & Libuv Internals",
    tag: "Core Runtime",
    color: "#00ff88",
    tldr: "The heartbeat of Node.js — not just 'non-blocking I/O' but a precise phase-based execution model.",
    depth: `Node.js runs on a single thread but handles concurrency via the Event Loop backed by libuv. The loop has 6 phases: timers → pending callbacks → idle/prepare → poll → check → close callbacks. Understanding phase order is critical for debugging subtle timing bugs.`,
    phases: [
      { name: "timers", desc: "Executes setTimeout / setInterval callbacks whose threshold has elapsed" },
      { name: "pending callbacks", desc: "I/O callbacks deferred to next loop (e.g. TCP errors)" },
      { name: "idle / prepare", desc: "Internal use by libuv" },
      { name: "poll", desc: "Retrieves new I/O events. Blocks here if queue is empty & no timers pending" },
      { name: "check", desc: "setImmediate() callbacks execute here" },
      { name: "close callbacks", desc: "Cleanup: socket.on('close', ...) etc." },
    ],
    microtasks: "process.nextTick() and Promise microtasks run between EVERY phase transition — not at the end of the loop.",
    code: `// Execution order trap — classic 4yr interview question
setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('nextTick'));

// Output: nextTick → Promise → setTimeout* → setImmediate
// *setTimeout vs setImmediate order is NON-DETERMINISTIC outside I/O context

// Inside I/O callback — order becomes deterministic
fs.readFile('file', () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  // Always: immediate → timeout (poll phase already passed)
});`,
    usecase: "Debugging a background job that fired 'too late' despite setTimeout(fn, 0) — understanding poll-phase blocking reveals the root cause.",
  },
  {
    id: "02",
    title: "Worker Threads & CPU-bound Tasks",
    tag: "Concurrency",
    color: "#ff6b35",
    tldr: "Break free from the single-thread ceiling for CPU-heavy operations without spawning full processes.",
    depth: `Worker Threads share the same V8 instance but run in isolated contexts with their own event loop. Unlike child_process, they share memory via SharedArrayBuffer and communicate via MessageChannel. Critical for crypto operations, image processing, ML inference, or any task that would block the main thread for >10ms.`,
    phases: [
      { name: "SharedArrayBuffer", desc: "True shared memory between main thread and workers — no serialization overhead" },
      { name: "Atomics", desc: "Synchronization primitives (lock, wait, notify) for shared memory access" },
      { name: "MessageChannel", desc: "Bidirectional communication with structured clone algorithm" },
      { name: "workerData", desc: "Initial data passed to worker at spawn time" },
      { name: "Worker Pool", desc: "libuv's own thread pool (default 4) handles fs, crypto, dns — separate from your workers" },
    ],
    microtasks: "UV_THREADPOOL_SIZE env var (max 1024) controls libuv's internal pool. Your Worker Threads are separate and don't compete with it.",
    code: `// worker-pool.js — reusable worker pool pattern
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { availableParallelism } from 'os';

// If this file is run as a worker
if (!isMainThread) {
  const result = heavyCpuTask(workerData.input);
  parentPort.postMessage({ result });
}

class WorkerPool {
  constructor(size = availableParallelism()) {
    this.queue = [];
    this.workers = Array.from({ length: size }, () => this._createWorker());
  }

  _createWorker() {
    const worker = new Worker(new URL(import.meta.url));
    worker.on('message', ({ result }) => {
      const { resolve } = worker._task;
      worker._task = null;
      resolve(result);
      this._drainQueue(worker);
    });
    return worker;
  }

  run(input) {
    return new Promise((resolve, reject) => {
      const idle = this.workers.find(w => !w._task);
      if (idle) {
        idle._task = { resolve, reject };
        idle.postMessage({ input });
      } else {
        this.queue.push({ input, resolve, reject });
      }
    });
  }
}

// Usage in Express/Fastify handler
app.post('/process', async (req, res) => {
  const result = await pool.run(req.body.data); // non-blocking!
  res.json({ result });
});`,
    usecase: "A Fintech platform needs to run real-time risk scoring (CPU-heavy ML computation) per transaction without degrading API latency for other requests.",
  },
  {
    id: "03",
    title: "Streams & Backpressure",
    tag: "I/O Performance",
    color: "#a78bfa",
    tldr: "Process data pipelines without loading everything into memory — and handle the producer/consumer speed mismatch.",
    depth: `Streams are Node's answer to processing large datasets (logs, file uploads, DB cursors) efficiently. But the real trap is backpressure: when a Readable produces data faster than a Writable can consume it, buffers overflow causing OOM. The highWaterMark and .write() return value are your control signals.`,
    phases: [
      { name: "Readable", desc: "Source of data. Two modes: flowing (data event) and paused (read() call)" },
      { name: "Writable", desc: "Destination. .write() returns false when internal buffer exceeds highWaterMark" },
      { name: "Transform", desc: "Both readable and writable — perfect for encoding, compression, parsing" },
      { name: "pipeline()", desc: "Proper way to chain streams — handles error propagation and cleanup" },
      { name: "highWaterMark", desc: "Buffer size threshold (bytes for binary, objects for objectMode). Default 16KB" },
    ],
    microtasks: "stream.pipeline() (promisified) is always preferred over .pipe() — pipe() doesn't propagate errors and leaks on failure.",
    code: `import { pipeline, Transform } from 'stream';
import { createReadStream, createWriteStream } from 'fs';
import { createGzip } from 'zlib';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

// Custom Transform: parse NDJSON stream line by line
class NDJSONParser extends Transform {
  constructor() {
    super({ objectMode: true }); // output objects, not buffers
    this._buffer = '';
  }
  _transform(chunk, _, callback) {
    this._buffer += chunk.toString();
    const lines = this._buffer.split('\\n');
    this._buffer = lines.pop(); // keep incomplete line
    for (const line of lines) {
      if (line.trim()) this.push(JSON.parse(line));
    }
    callback();
  }
  _flush(callback) {
    if (this._buffer.trim()) this.push(JSON.parse(this._buffer));
    callback();
  }
}

// Manual backpressure — when pipeline() isn't enough
async function copyWithBackpressure(src, dest) {
  for await (const chunk of src) {
    const ok = dest.write(chunk);
    if (!ok) {
      // Pause producer until consumer drains
      await new Promise(resolve => dest.once('drain', resolve));
    }
  }
  dest.end();
}

// Stream a 10GB log file, parse, gzip, write — constant memory usage
await pipelineAsync(
  createReadStream('events.ndjson'),
  new NDJSONParser(),
  new Transform({
    objectMode: true,
    transform(obj, _, cb) { cb(null, JSON.stringify(obj) + '\\n'); }
  }),
  createGzip(),
  createWriteStream('events.gz')
);`,
    usecase: "Streaming 50GB of MongoDB export through a transform pipeline to S3 — memory stays flat at ~30MB regardless of file size.",
  },
  {
    id: "04",
    title: "Cluster Module & Zero-Downtime Deploys",
    tag: "Scalability",
    color: "#fbbf24",
    tldr: "Utilize all CPU cores and deploy new code without dropping a single request.",
    depth: `Node is single-threaded but your server isn't limited to one core. Cluster forks worker processes sharing the same port. The master process distributes connections (round-robin on Linux). The real skill is orchestrating zero-downtime deploys: gracefully cycling workers while the master stays alive.`,
    phases: [
      { name: "cluster.fork()", desc: "Spawns a child process running the same script — workers share server handle" },
      { name: "IPC Channel", desc: "Master-worker communication via process.send() / process.on('message')" },
      { name: "SIGHUP", desc: "Traditional signal for config reload — trigger graceful restart" },
      { name: "Graceful shutdown", desc: "Stop accepting new connections, drain existing ones, then exit" },
      { name: "disconnect()", desc: "Detaches worker from IPC + server handle. Worker exits after draining" },
    ],
    microtasks: "In production, prefer PM2 cluster mode or Kubernetes HPA over raw cluster module — but knowing internals helps you debug process recycling issues.",
    code: `import cluster from 'cluster';
import { availableParallelism } from 'os';
import process from 'process';

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  console.log(\`Master \${process.pid} spawning \${numCPUs} workers\`);
  
  // Spawn initial workers
  for (let i = 0; i < numCPUs; i++) cluster.fork();

  // Auto-restart dead workers
  cluster.on('exit', (worker, code, signal) => {
    if (!worker.exitedAfterDisconnect) {
      console.log(\`Worker \${worker.process.pid} died — restarting\`);
      cluster.fork();
    }
  });

  // Zero-downtime rolling restart on SIGHUP
  process.on('SIGHUP', () => {
    console.log('Rolling restart initiated...');
    const workers = Object.values(cluster.workers);
    
    const restartNext = (index) => {
      if (index >= workers.length) return;
      const worker = workers[index];
      
      // Fork new worker first, THEN kill old one
      const newWorker = cluster.fork();
      newWorker.once('listening', () => {
        worker.disconnect(); // graceful — drains existing connections
        worker.once('exit', () => restartNext(index + 1));
      });
    };
    restartNext(0);
  });

} else {
  // Worker process — your actual HTTP server
  const app = express();
  const server = app.listen(3000);

  process.on('SIGTERM', () => {
    server.close(() => process.exit(0)); // drain then exit cleanly
  });
}`,
    usecase: "Deploy new code to a payment API during peak hours — rolling restart ensures no transaction is dropped mid-flight.",
  },
  {
    id: "05",
    title: "AsyncLocalStorage (Async Context)",
    tag: "Observability",
    color: "#34d399",
    tldr: "Thread-local storage for async code — propagate request context (traceId, userId) without passing it through every function.",
    depth: `AsyncLocalStorage (based on AsyncResource internally) maintains context across async boundaries — Promise chains, setTimeout, EventEmitters. It's how APM tools like Datadog and OpenTelemetry automatically inject trace IDs. Before this, devs passed context objects explicitly everywhere or used CLS (continuation-local-storage), which was fragile.`,
    phases: [
      { name: "AsyncLocalStorage", desc: "Creates a store that flows through the async execution tree" },
      { name: ".run(store, fn)", desc: "Binds a value to all async operations spawned within fn" },
      { name: ".getStore()", desc: "Retrieves the store from anywhere in the same async context" },
      { name: "AsyncResource", desc: "Lower-level primitive — bind callbacks to a specific async context" },
      { name: "AsyncResource.bind()", desc: "Static method to bind a function to current context — useful for EventEmitters" },
    ],
    microtasks: "AsyncLocalStorage has near-zero overhead since Node 16. Before that, it used legacy async_hooks which had measurable perf impact.",
    code: `import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

// Singleton — import this across your whole app
export const requestContext = new AsyncLocalStorage();

// Middleware — establish context at request boundary
app.use((req, res, next) => {
  const store = {
    traceId: req.headers['x-trace-id'] || randomUUID(),
    userId: null, // populated after auth middleware
    startTime: Date.now(),
  };
  
  // All async code triggered by this request inherits this store
  requestContext.run(store, next);
});

// Auth middleware — mutate existing store
app.use(authMiddleware);
function authMiddleware(req, res, next) {
  const store = requestContext.getStore();
  store.userId = req.user?.id; // modifies in place — visible everywhere
  next();
}

// Deep in your service layer — no prop drilling needed
class OrderService {
  async createOrder(data) {
    const { traceId, userId } = requestContext.getStore();
    
    // Automatically tagged in all logs
    logger.info('Creating order', { traceId, userId, ...data });
    
    await db.orders.insert({ ...data, createdBy: userId });
    await this.notificationService.send(userId, 'order_created');
    // notificationService also has access to traceId automatically
  }
}

// Logger utility — reads context without being passed it
export const logger = {
  info(msg, meta = {}) {
    const ctx = requestContext.getStore() ?? {};
    console.log(JSON.stringify({ 
      level: 'info', msg, 
      traceId: ctx.traceId,
      ...meta 
    }));
  }
};`,
    usecase: "Distributed tracing across microservices — traceId propagates through DB queries, Redis calls, and downstream HTTP calls automatically.",
  },
  {
    id: "06",
    title: "Custom EventEmitter Patterns",
    tag: "Architecture",
    color: "#f472b6",
    tldr: "EventEmitter is not just for simple pub/sub — it's the foundation of Node's entire architecture and unlocks powerful reactive patterns.",
    depth: `Most devs use EventEmitter superficially. At senior level, you should know: memory leak prevention (listener limits), error event contract, once() for one-shot listeners, EventEmitter.captureRejections, and how to build type-safe typed emitters for complex domain events.`,
    phases: [
      { name: "error event", desc: "If emitted with no listener, Node THROWS — always handle 'error' on emitters you don't control" },
      { name: "maxListeners", desc: "Default 10. Exceed it → memory leak warning. Set to 0 for unlimited (with care)" },
      { name: "captureRejections", desc: "Node 12+: async listener rejections route to error event instead of unhandledRejection" },
      { name: "once()", desc: "Auto-removes listener after first emit. Avoids manual removeListener" },
      { name: "rawListeners()", desc: "Returns wrappers including once-wrapped fns — useful for debugging listener leaks" },
    ],
    microtasks: "EventEmitter is synchronous — listeners run in registration order, synchronously, in the same tick. If you need async fan-out, you manage that yourself.",
    code: `import { EventEmitter } from 'events';

// Type-safe EventEmitter pattern (production grade)
class OrderEventBus extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
    this.setMaxListeners(50); // adjust for your subscriber count
  }

  // Typed emit helpers — prevents magic string typos
  emitOrderCreated(order) { this.emit('order:created', order); }
  emitOrderFailed(order, error) { this.emit('order:failed', order, error); }

  onOrderCreated(fn) { this.on('order:created', fn); return this; }
  onOrderFailed(fn) { this.on('order:failed', fn); return this; }
  
  // Always handle errors
  ['Symbol.for nodejs.rejection'](err) {
    console.error('Async listener rejected', err);
  }
}

export const orderBus = new OrderEventBus();

// Publisher — OrderService
class OrderService {
  async create(data) {
    const order = await db.orders.insert(data);
    orderBus.emitOrderCreated(order);
    return order;
  }
}

// Subscribers — decoupled, added anywhere
orderBus.onOrderCreated(async (order) => {
  await emailService.sendConfirmation(order);
});

orderBus.onOrderCreated(async (order) => {
  await inventoryService.reserve(order.items);
});

// One-shot: audit only the FIRST order this session
orderBus.once('order:created', (order) => {
  analytics.trackFirstOrder(order.userId);
});

// Debugging listener leaks
console.log(orderBus.rawListeners('order:created').length);`,
    usecase: "Domain event system in a monolith — OrderService, InventoryService, NotificationService stay fully decoupled while reacting to the same domain events.",
  },
  {
    id: "07",
    title: "Memory Management & Heap Profiling",
    tag: "Performance",
    color: "#60a5fa",
    tldr: "V8's garbage collector doesn't catch everything — know how to find and fix Node.js memory leaks in production.",
    depth: `Node.js uses V8's generational GC: new space (short-lived objects, minor GC) and old space (survived objects, major GC). Memory leaks typically come from: closures holding references, forgotten event listeners, global caches without eviction, and circular references that prevent GC. Knowing how to use --inspect, heap snapshots, and clinic.js is what separates senior devs.`,
    phases: [
      { name: "New Space", desc: "~1-8MB. Short-lived objects. Minor GC (Scavenge) is fast — runs frequently" },
      { name: "Old Space", desc: "Survived 2+ GC cycles. Major GC (Mark-Sweep-Compact) is expensive — causes pauses" },
      { name: "Heap Snapshot", desc: "v8.writeHeapSnapshot() or DevTools — capture object graph at a point in time" },
      { name: "WeakRef / WeakMap", desc: "Hold references without preventing GC — perfect for caches" },
      { name: "FinalizationRegistry", desc: "Callback when a weakly-held object is GC'd — useful for cleanup" },
    ],
    microtasks: "--max-old-space-size flag sets old space limit (default ~1.4GB on 64-bit). Monitor process.memoryUsage().heapUsed in your metrics.",
    code: `import v8 from 'v8';
import { WeakRef, FinalizationRegistry } from 'globalThis'; // Node 14+

// Anti-pattern 1: Event listener leak
class DataProcessor extends EventEmitter {
  start() {
    // BUG: adds listener every call, never removed
    someExternalEmitter.on('data', this.handleData.bind(this));
  }
  // FIX:
  start() {
    this._boundHandler = this.handleData.bind(this);
    someExternalEmitter.on('data', this._boundHandler);
  }
  stop() {
    someExternalEmitter.off('data', this._boundHandler);
  }
}

// Anti-pattern 2: Unbounded cache (classic leak)
const cache = new Map(); // grows forever
app.get('/user/:id', async (req, res) => {
  if (!cache.has(req.params.id)) {
    cache.set(req.params.id, await db.findUser(req.params.id));
  }
  res.json(cache.get(req.params.id));
});

// FIX: WeakRef-based cache (GC can reclaim entries)
const weakCache = new Map();
const registry = new FinalizationRegistry((key) => {
  weakCache.delete(key); // cleanup map entry when value is GC'd
});

function cacheSet(key, value) {
  const ref = new WeakRef(value);
  weakCache.set(key, ref);
  registry.register(value, key);
}
function cacheGet(key) {
  return weakCache.get(key)?.deref(); // undefined if GC'd
}

// Heap snapshot in production (triggered by endpoint or signal)
process.on('SIGUSR2', () => {
  const filename = v8.writeHeapSnapshot();
  console.log(\`Heap snapshot: \${filename}\`);
});

// Monitor heap continuously
setInterval(() => {
  const { heapUsed, heapTotal } = process.memoryUsage();
  metrics.gauge('nodejs.heap.used', heapUsed);
  if (heapUsed / heapTotal > 0.9) {
    logger.warn('Heap pressure: >90% used', { heapUsed, heapTotal });
  }
}, 30_000);`,
    usecase: "A long-running Node microservice slowly crashes every 48h — heap snapshots at intervals reveal a Map in middleware that accumulates request metadata permanently.",
  },
  {
    id: "08",
    title: "Graceful Shutdown & Signal Handling",
    tag: "Production Ops",
    color: "#fb923c",
    tldr: "How your service dies is as important as how it lives — botched shutdowns lose data, drop requests, and corrupt state.",
    depth: `In Kubernetes/Docker environments, SIGTERM is sent before SIGKILL. You have a window (terminationGracePeriodSeconds, default 30s) to: stop accepting new connections, drain in-flight requests, flush logs/metrics, release DB connections, and commit any buffered writes. Get this wrong and you corrupt jobs, lose messages, or violate at-most-once semantics.`,
    phases: [
      { name: "SIGTERM", desc: "Kubernetes sends this first — your cue to start graceful shutdown" },
      { name: "SIGINT", desc: "Ctrl+C in development — same graceful shutdown path" },
      { name: "server.close()", desc: "Stops accepting new connections but waits for in-flight to complete" },
      { name: "keepAliveTimeout", desc: "Long-lived connections prevent server.close() from finishing — must track and destroy" },
      { name: "process.exitCode", desc: "Set before exit() — ensures non-zero code on partial failure" },
    ],
    microtasks: "Add a hard-kill timer: if graceful shutdown takes >25s, force exit. Kubernetes will SIGKILL at 30s anyway — uncontrolled kill is worse.",
    code: `class GracefulShutdown {
  constructor(server, options = {}) {
    this.server = server;
    this.timeout = options.timeout ?? 25_000;
    this.connections = new Set();
    this._track();
    this._bindSignals();
  }

  _track() {
    // Track all open connections so we can force-close on timeout
    this.server.on('connection', (socket) => {
      this.connections.add(socket);
      socket.on('close', () => this.connections.delete(socket));
    });
  }

  _bindSignals() {
    const handler = (signal) => {
      console.log(\`\${signal} received — starting graceful shutdown\`);
      this.shutdown();
    };
    process.once('SIGTERM', handler);
    process.once('SIGINT', handler);
  }

  async shutdown() {
    // 1. Stop health check — tell load balancer we're going down
    this.isShuttingDown = true;

    // 2. Stop accepting new connections
    await new Promise(resolve => this.server.close(resolve));

    // 3. Drain async tasks (Kafka consumers, job queues, etc.)
    await Promise.allSettled([
      kafkaConsumer.disconnect(),
      jobQueue.close(),
      db.pool.end(),
    ]);

    console.log('Graceful shutdown complete');
    process.exit(0);
  }

  // Hard kill safety net
  startKillTimer() {
    setTimeout(() => {
      console.error('Shutdown timeout — forcing exit');
      this.connections.forEach(s => s.destroy());
      process.exit(1);
    }, this.timeout).unref(); // .unref() prevents this timer from keeping process alive
  }
}

// Health endpoint — Kubernetes readiness probe
app.get('/health', (req, res) => {
  if (graceful.isShuttingDown) {
    res.status(503).json({ status: 'shutting_down' });
  } else {
    res.json({ status: 'ok' });
  }
});`,
    usecase: "Kafka consumer node getting SIGTERM during a batch commit — graceful shutdown ensures the offset is committed before exit, preventing duplicate processing after restart.",
  },
  {
    id: "09",
    title: "Module System Deep Dive (ESM vs CJS)",
    tag: "Tooling",
    color: "#c084fc",
    tldr: "The ESM/CJS interop story is messy — understanding it prevents hours of 'cannot use import statement' and dual-package nightmares.",
    depth: `Node supports both CommonJS (require/module.exports) and ESM (import/export). They have fundamentally different loading semantics: CJS is synchronous and dynamic, ESM is asynchronous and static (enables tree-shaking). Interop has sharp edges: ESM can import CJS but not vice versa (without dynamic import). Native ESM also lacks __dirname, __filename, require.`,
    phases: [
      { name: "Static analysis", desc: "ESM imports are resolved before execution — enables dead code elimination" },
      { name: "Top-level await", desc: "ESM modules can use await at top level — CJS cannot" },
      { name: "Live bindings", desc: "ESM exports are live — mutations in the exporting module are visible to importers" },
      { name: "Dual packages", desc: "Publish both CJS and ESM with exports map — conditional exports in package.json" },
      { name: "__dirname in ESM", desc: "Use import.meta.url + fileURLToPath() — no __dirname by default" },
    ],
    microtasks: "JSON imports require assert { type: 'json' } in ESM. TypeScript compiles to CJS by default — set module: NodeNext for proper ESM output.",
    code: `// package.json — dual package setup
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",   // ESM consumers
      "require": "./dist/cjs/index.cjs", // CJS consumers
      "types": "./dist/types/index.d.ts"
    }
  },
  "main": "./dist/cjs/index.cjs" // legacy fallback
}

// ESM — getting __dirname equivalent
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Top-level await — ESM only, powerful for init
const config = await fetchRemoteConfig(); // at module level!
export const db = await createDbPool(config.database);

// Live binding trap
// counter.mjs
export let count = 0;
export const increment = () => count++;

// main.mjs
import { count, increment } from './counter.mjs';
console.log(count); // 0
increment();
console.log(count); // 1 — live binding, reflects mutation!
// In CJS: you'd get 0 twice (copied value, not live reference)

// Conditional dynamic import — load ESM from CJS
async function loadESMModule() {
  // CJS files can't statically import ESM, but can do this:
  const { someFunction } = await import('./esm-only-package.mjs');
  return someFunction();
}

// JSON import (ESM)
import data from './config.json' assert { type: 'json' };`,
    usecase: "Publishing an npm library that works in both Next.js (ESM) and legacy Express apps (CJS) — conditional exports in package.json serves the right format to each.",
  },
  {
    id: "10",
    title: "Diagnostics & Performance Profiling",
    tag: "Debugging",
    color: "#2dd4bf",
    tldr: "Know how to identify CPU hotspots, I/O bottlenecks, and GC pressure in production without restarting the process.",
    depth: `Node 16+ ships with built-in diagnostics: --cpu-prof, --heap-prof, perf_hooks, and the Diagnostics Channel API. For production, you need non-invasive profiling that doesn't require restarts. V8 sampling profiler adds ~2-5% overhead — acceptable for live diagnosis. Flame graphs from clinic.js or 0x visualize exactly where CPU time is spent.`,
    phases: [
      { name: "--cpu-prof", desc: "Generate V8 CPU profile on exit — open in Chrome DevTools > Performance" },
      { name: "perf_hooks", desc: "performance.measure() for custom high-res timing. PerformanceObserver for hooks" },
      { name: "Diagnostics Channel", desc: "Node 15+ publish/subscribe for instrumentation without monkey-patching" },
      { name: "clinic.js", desc: "clinic doctor / flame / bubbleprof — production-safe profiling suite" },
      { name: "v8.startupSnapshot", desc: "Serialize heap state and restore in new process — faster cold start" },
    ],
    microtasks: "Never use console.time() in production for perf measurement — performance.now() is monotonic and has nanosecond resolution. console.time has coarser resolution.",
    code: `import { performance, PerformanceObserver } from 'perf_hooks';
import diagnosticsChannel from 'diagnostics_channel';

// High-res custom timing
async function tracedDbQuery(sql, params) {
  const mark = \`db:\${sql.slice(0, 20)}\`;
  performance.mark(\`\${mark}:start\`);
  
  try {
    return await db.query(sql, params);
  } finally {
    performance.mark(\`\${mark}:end\`);
    performance.measure(mark, \`\${mark}:start\`, \`\${mark}:end\`);
  }
}

// PerformanceObserver — collect all measures
const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 100) { // slow query threshold
      logger.warn('Slow operation', { name: entry.name, ms: entry.duration });
      metrics.histogram('db.query.duration', entry.duration);
    }
  }
});
obs.observe({ entryTypes: ['measure'] });

// Diagnostics Channel — instrument without monkey-patching
// Publisher (e.g. your HTTP client wrapper)
const requestChannel = diagnosticsChannel.channel('http.client.request');
const responseChannel = diagnosticsChannel.channel('http.client.response');

function instrumentedFetch(url, options) {
  requestChannel.publish({ url, options });
  return fetch(url, options).then(res => {
    responseChannel.publish({ url, status: res.status });
    return res;
  });
}

// Subscriber (e.g. APM / tracing library)
diagnosticsChannel.subscribe('http.client.request', ({ url }) => {
  currentSpan?.addEvent('http.request', { url });
});

// Runtime CPU profiling via signal (no restart needed)
import v8Profiler from 'v8-profiler-next';
process.on('SIGUSR1', () => {
  v8Profiler.startProfiling('on-demand', true);
  setTimeout(() => {
    const profile = v8Profiler.stopProfiling('on-demand');
    profile.export().pipe(fs.createWriteStream(\`cpu-\${Date.now()}.cpuprofile\`));
  }, 10_000); // 10s sample
});`,
    usecase: "Production API degrading every morning at 9AM — SIGUSR1-triggered CPU profile reveals a specific route's regex validation is O(n²) on large payloads.",
  },
];

export default function NodeJSConcepts() {
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState("overview");

  const current = concepts[active];

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', 'Fira Code', monospace", background: "#0a0a0f", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Space+Grotesk:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2d2d3d; border-radius: 2px; }
        .concept-item { cursor: pointer; transition: all 0.15s ease; border-left: 2px solid transparent; }
        .concept-item:hover { background: rgba(255,255,255,0.04); }
        .concept-item.active { border-left-color: var(--accent); background: rgba(255,255,255,0.06); }
        .tab-btn { cursor: pointer; transition: all 0.15s; border: none; background: transparent; font-family: inherit; }
        .tab-btn:hover { opacity: 0.8; }
        .phase-row { border-bottom: 1px solid rgba(255,255,255,0.05); padding: 10px 0; }
        .phase-row:last-child { border-bottom: none; }
        pre { overflow-x: auto; font-size: 12px; line-height: 1.7; }
        .glow { box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.15); }
      `}</style>

      {/* Back button */}
      <div style={{ padding: "10px 32px", borderBottom: "1px solid #1e1e2e" }}>
        <a href="/learning" style={{ fontSize: 12, color: "#4a4a6a", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
          ← Learning
        </a>
      </div>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e1e2e", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#4a4a6a", marginBottom: 4, textTransform: "uppercase" }}>Senior Level</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -0.5 }}>
            Node.js — 10 Concepts at Depth
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#4a4a6a", textAlign: "right" }}>
          <div>4+ YOE Reference</div>
          <div style={{ color: "#2d2d4a" }}>───────────</div>
          <div style={{ color: current.color }}>{concepts[active].tag}</div>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 163px)" }}>
        {/* Sidebar */}
        <div style={{ width: 260, borderRight: "1px solid #1e1e2e", overflowY: "auto", flexShrink: 0 }}>
          {concepts.map((c, i) => (
            <div
              key={i}
              className={`concept-item ${i === active ? "active" : ""}`}
              style={{ "--accent": c.color, padding: "14px 16px" }}
              onClick={() => { setActive(i); setTab("overview"); }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, color: i === active ? c.color : "#2d2d4a", fontWeight: 600, minWidth: 20 }}>{c.id}</span>
                <div>
                  <div style={{ fontSize: 12, color: i === active ? "#fff" : "#8888aa", fontWeight: i === active ? 600 : 400, lineHeight: 1.3 }}>{c.title}</div>
                  <div style={{ fontSize: 10, color: i === active ? c.color : "#3a3a5a", marginTop: 2 }}>{c.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: current.color, textTransform: "uppercase", marginBottom: 8 }}>{current.tag} · {current.id}</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -0.5, marginBottom: 10 }}>{current.title}</h2>
              <p style={{ fontSize: 13, color: "#8888aa", lineHeight: 1.6, maxWidth: 600 }}>{current.tldr}</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #1e1e2e", paddingBottom: 0 }}>
            {["overview", "internals", "code", "usecase", "visualizer"].map(t => (
              <button
                key={t}
                className="tab-btn"
                onClick={() => setTab(t)}
                style={{
                  padding: "8px 16px",
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: tab === t ? current.color : "#4a4a6a",
                  borderBottom: `2px solid ${tab === t ? current.color : "transparent"}`,
                  marginBottom: -1,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {tab === "overview" && (
            <div>
              <div style={{ background: "#0f0f1a", border: "1px solid #1e1e2e", borderRadius: 8, padding: "20px 24px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: current.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Deep Dive</div>
                <p style={{ fontSize: 13, color: "#c0c0d8", lineHeight: 1.8 }}>{current.depth}</p>
              </div>
              <div style={{ background: "#0f0f1a", border: `1px solid ${current.color}22`, borderRadius: 8, padding: "16px 20px", borderLeft: `3px solid ${current.color}` }}>
                <div style={{ fontSize: 11, color: current.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Key Insight</div>
                <p style={{ fontSize: 13, color: "#a0a0c0", lineHeight: 1.7 }}>{current.microtasks}</p>
              </div>
            </div>
          )}

          {/* Tab: Internals */}
          {tab === "internals" && (
            <div style={{ background: "#0f0f1a", border: "1px solid #1e1e2e", borderRadius: 8, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, color: current.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Internal Mechanics</div>
              {current.phases.map((p, i) => (
                <div key={i} className="phase-row" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 180, fontSize: 12, color: current.color, fontWeight: 600, paddingTop: 1 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: "#8888aa", lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Code */}
          {tab === "code" && (
            <div style={{ background: "#080810", border: "1px solid #1e1e2e", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", background: "#0f0f1a", borderBottom: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#4a4a6a", letterSpacing: 1 }}>example.mjs</span>
                <span style={{ fontSize: 10, color: current.color }}>Node.js</span>
              </div>
              <pre style={{ padding: "20px 24px", color: "#c0c8e8" }}>
                <code>{current.code}</code>
              </pre>
            </div>
          )}

          {/* Tab: Visualizer */}
          {tab === "visualizer" && <EventLoop />}

          {/* Tab: Usecase */}
          {tab === "usecase" && (
            <div>
              <div style={{ background: "#0f0f1a", border: "1px solid #1e1e2e", borderRadius: 8, padding: "24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle, ${current.color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ fontSize: 11, color: current.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Real-World Scenario</div>
                <p style={{ fontSize: 14, color: "#d0d0e8", lineHeight: 1.8 }}>{current.usecase}</p>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #1e1e2e" }}>
                  <span style={{ fontSize: 11, color: "#4a4a6a" }}>Concept applied: </span>
                  <span style={{ fontSize: 11, color: current.color }}>{current.title}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}