export default function LearningPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Learning Hub
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl">
          Track your progress, explore new topics, and level up your skills one
          step at a time.
        </p>
      </section>

      {/* Deep Dive Pages */}
      <section className="mb-12">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Deep Dives</h2>
        <a
          href="/learning/react"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">⚛</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">React Deep Dive</p>
              <p className="text-xs text-gray-500 mt-0.5">Virtual DOM · Fiber · Hooks · Patterns · Performance · Testing</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
        <a
          href="/learning/api"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">API Decision Framework</p>
              <p className="text-xs text-gray-500 mt-0.5">Polling · Long Polling · SSE · WebSocket · Webhooks · gRPC · Message Queue</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
        <a
          href="/learning/kafka"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🟡</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Apache Kafka Interactive Guide</p>
              <p className="text-xs text-gray-500 mt-0.5">Architecture · Partitions · Fan-out · Scaling · Config · Quiz</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
        <a
          href="/learning/nodejscocept"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🟢</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Node.js Concepts</p>
              <p className="text-xs text-gray-500 mt-0.5">Event Loop · Libuv · Streams · Clustering · Performance</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
        <a
          href="/learning/flink"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🔵</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Apache Flink</p>
              <p className="text-xs text-gray-500 mt-0.5">Stream Processing · Windowing · State · Fault Tolerance · Event Time</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
        <a
          href="/learning/dsa"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🧩</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">DSA Practice — 45-Day Plan</p>
              <p className="text-xs text-gray-500 mt-0.5">85 questions · Arrays · Trees · DP · Graphs · Google · Meta · Amazon</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
        <a
          href="/learning/python"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🐍</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Python Deep Dive</p>
              <p className="text-xs text-gray-500 mt-0.5">Metaprogramming · Decorators · Generators · Context Managers · Async · __slots__</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
        <a
          href="/learning/javascript"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🟨</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">JavaScript Deep Dive</p>
              <p className="text-xs text-gray-500 mt-0.5">Closures · Promises · Event Loop · Debounce · Memoization · Event Emitter</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
        <a
          href="/learning/go"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🐹</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Go Fundamentals</p>
              <p className="text-xs text-gray-500 mt-0.5">Toolchain · Types · Slices · Maps · Structs · Pointers · Control Flow</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
        <a
          href="/learning/k8s"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">☸️</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Kubernetes Guide</p>
              <p className="text-xs text-gray-500 mt-0.5">Cluster · Control Plane · Worker Nodes · kubectl · Building Blocks · Deploy Checklist</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
        <a
          href="/learning/nextjs-deployment"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🚀</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Next.js Deployment on AWS EC2</p>
              <p className="text-xs text-gray-500 mt-0.5">EC2 Setup · Server Config · PM2 · Nginx · GitHub Actions · CI/CD</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">→</span>
        </a>
      </section>
    </div>
  );
}
