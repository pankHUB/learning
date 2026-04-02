export default function CVPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          CV Builder
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl">
          Craft a professional CV that stands out. Fill in your details and
          generate polished, ready-to-download resume in seconds.
        </p>
      </section>

      {/* Form */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-8">
          {/* Personal Info */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Personal Info
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="New York, USA"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Summary
            </h2>
            <textarea
              rows={4}
              placeholder="A brief summary of your professional background and goals..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none resize-none"
            />
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Experience
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    placeholder="Jan 2022"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    placeholder="Present"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your responsibilities and achievements..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Skills
            </h2>
            <input
              type="text"
              placeholder="e.g. React, TypeScript, Node.js, Python"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none"
            />
          </div>

          <button className="w-full rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
            Generate CV
          </button>
        </div>

        {/* Right: Preview */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 min-h-[600px]">
          <p className="text-sm text-gray-400 text-center mt-40">
            Your CV preview will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
