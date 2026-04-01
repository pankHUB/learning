const templates = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, text-first portfolio. Great for developers.",
    preview: "bg-white",
    accent: "bg-gray-900",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Large typography, strong visual hierarchy.",
    preview: "bg-gray-950",
    accent: "bg-yellow-400",
  },
  {
    id: "soft",
    name: "Soft",
    description: "Pastel tones, rounded corners, friendly feel.",
    preview: "bg-indigo-50",
    accent: "bg-indigo-500",
  },
];

export default function WebsitePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <section className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-500 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
          CV-powered
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Website Generator
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl">
          Turn your CV into a personal portfolio website in seconds. Fill in your
          details, pick a template, and generate a live site ready to share.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="space-y-8">
          {/* Import from CV */}
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500 mb-3">
              Already built your CV? Import it directly.
            </p>
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Import from CV Builder
            </button>
          </div>

          {/* Or fill manually */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Your Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title / Role
                </label>
                <input
                  type="text"
                  placeholder="Full-Stack Developer"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="A short intro about who you are and what you do..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Node.js..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    placeholder="github.com/johndoe"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    placeholder="linkedin.com/in/johndoe"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Template picker */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Choose Template
            </h2>
            <div className="space-y-3">
              {templates.map((t, i) => (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 p-4 hover:border-gray-400 transition-colors has-[:checked]:border-gray-900 has-[:checked]:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="template"
                    value={t.id}
                    defaultChecked={i === 0}
                    className="accent-gray-900"
                  />
                  {/* Mini preview */}
                  <div
                    className={`h-10 w-16 shrink-0 rounded-md ${t.preview} border border-gray-200 flex items-end p-1 gap-1`}
                  >
                    <div className={`h-1.5 w-6 rounded-sm ${t.accent}`} />
                    <div className="h-1 w-4 rounded-sm bg-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
            Generate Website
          </button>
        </div>

        {/* Right: Preview */}
        <div className="sticky top-8 rounded-xl border border-gray-200 overflow-hidden h-fit">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="mx-auto rounded-md bg-white border border-gray-200 px-4 py-1 text-xs text-gray-400 w-48 text-center">
              johndoe.brainloop.app
            </div>
          </div>
          {/* Preview body */}
          <div className="bg-white min-h-[500px] flex flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="h-16 w-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-32 rounded bg-gray-900 mx-auto" />
              <div className="h-3 w-24 rounded bg-gray-300 mx-auto" />
            </div>
            <div className="flex gap-2 mt-2">
              {["React", "TypeScript", "Node.js"].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-6 max-w-xs">
              Fill in your details and click Generate to see your live portfolio preview here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
