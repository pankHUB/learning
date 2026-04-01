export default function InterviewPrepPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Interview Prep
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl">
          Deep-dive question banks, curated by topic. Understand concepts at
          every level — from the simple analogy to the production edge case.
        </p>
      </section>

      {/* Question Banks */}
      <section className="mb-12">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Question Banks
        </h2>
        <a
          href="/interview-prep/python"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">🐍</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Python Interview Questions
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Core · Advanced · Performance · Async · Data Structures · Practical
              </p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">
            →
          </span>
        </a>
        <a
          href="/interview-prep/fastapi"
          className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 hover:border-gray-400 hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                FastAPI × ML Systems
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Async I/O · Streaming · Model lifecycle · Dynamic batching · API versioning
              </p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-sm">
            →
          </span>
        </a>
      </section>
    </div>
  );
}
