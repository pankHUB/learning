export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Welcome to Brainloop
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          Build your CV, generate a portfolio website, track your learning, and
          have fun — all in one place.
        </p>
      </section>

      {/* Website Generator — Top Spotlight */}
      <section className="rounded-2xl border border-gray-200 bg-gray-950 overflow-hidden mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: copy */}
          <div className="p-10 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-400 mb-6 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
              CV-powered
            </div>
            <h2 className="text-3xl font-bold text-white leading-tight">
              Turn your CV into a <br />
              <span className="text-gray-400">portfolio website</span>
            </h2>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-sm">
              Fill in your details once, pick a template, and get a live personal
              site ready to share — in seconds.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href="/website"
                className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Generate Website
              </a>
              <a
                href="/cv"
                className="rounded-md border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors"
              >
                Build CV first
              </a>
            </div>
          </div>

          {/* Right: browser mockup */}
          <div className="flex items-center justify-center p-8 bg-gray-900 border-l border-gray-800">
            <div className="w-full max-w-xs rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2.5 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="mx-auto rounded bg-gray-700 px-3 py-0.5 text-xs text-gray-500">
                  you.brainloop.app
                </div>
              </div>
              {/* Page preview */}
              <div className="bg-white px-6 py-8 flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="h-3.5 w-28 rounded bg-gray-900" />
                <div className="h-2.5 w-20 rounded bg-gray-300" />
                <div className="flex gap-1.5 mt-1">
                  {["React", "TypeScript", "Node"].map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-gray-200 px-2 py-0.5 text-[9px] text-gray-500"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-2 space-y-1.5 w-full">
                  <div className="h-2 w-full rounded bg-gray-100" />
                  <div className="h-2 w-4/5 rounded bg-gray-100" />
                  <div className="h-2 w-3/5 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other features grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
        {[
          {
            href: "/cv",
            emoji: "📄",
            title: "CV Builder",
            description: "Craft a professional CV with a live preview.",
          },
          {
            href: "/learning",
            emoji: "📚",
            title: "Learning Hub",
            description: "Track topics, open deep dives, measure progress.",
          },
        ].map((f) => (
          <a
            key={f.href}
            href={f.href}
            className="rounded-xl border border-gray-200 p-6 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
          >
            <span className="text-2xl">{f.emoji}</span>
            <h3 className="mt-3 text-sm font-semibold text-gray-900">{f.title}</h3>
            <p className="mt-1 text-xs text-gray-500">{f.description}</p>
            <span className="mt-4 inline-block text-xs text-gray-400 group-hover:text-gray-700 transition-colors">
              Open →
            </span>
          </a>
        ))}
      </section>
    </div>
  );
}
