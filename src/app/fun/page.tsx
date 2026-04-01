const games = [
  {
    title: "Word Scramble",
    description: "Unscramble the letters to form a valid word before time runs out.",
    emoji: "🔤",
    tag: "Word",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    title: "Memory Match",
    description: "Flip cards and find matching pairs. Train your short-term memory.",
    emoji: "🃏",
    tag: "Memory",
    color: "bg-pink-50 border-pink-200",
  },
  {
    title: "Math Sprint",
    description: "Solve as many arithmetic problems as you can in 60 seconds.",
    emoji: "➕",
    tag: "Math",
    color: "bg-blue-50 border-blue-200",
  },
  {
    title: "Trivia Quiz",
    description: "Answer random trivia questions across science, history, and pop culture.",
    emoji: "🎯",
    tag: "Quiz",
    color: "bg-green-50 border-green-200",
  },
  {
    title: "Type Racer",
    description: "Type the given sentence as fast and accurately as possible.",
    emoji: "⌨️",
    tag: "Typing",
    color: "bg-purple-50 border-purple-200",
  },
  {
    title: "Emoji Puzzle",
    description: "Guess the movie, phrase, or word from a sequence of emojis.",
    emoji: "😂",
    tag: "Puzzle",
    color: "bg-orange-50 border-orange-200",
  },
];

export default function FunPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Fun Zone
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl">
          Take a break and play. Brain games, puzzles, and quick challenges to keep
          your mind sharp while having a good time.
        </p>
      </section>

      {/* Stats bar */}
      <div className="mb-10 flex gap-6 rounded-xl border border-gray-200 bg-gray-50 px-6 py-4">
        {[
          { label: "Games Available", value: games.length },
          { label: "Best Streak", value: "7 days" },
          { label: "Points Earned", value: "0" },
        ].map((stat) => (
          <div key={stat.label} className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Games grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <div
            key={game.title}
            className={`rounded-xl border p-6 flex flex-col gap-4 ${game.color}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{game.emoji}</span>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600 border border-gray-200">
                {game.tag}
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {game.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{game.description}</p>
            </div>
            <button className="mt-auto w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
              Play Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
