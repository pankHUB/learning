import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Brainloop
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link href="/cv" className="hover:text-gray-900 transition-colors">
            CV Builder
          </Link>
          <Link href="/website" className="hover:text-gray-900 transition-colors">
            Website
          </Link>
          <Link href="/learning" className="hover:text-gray-900 transition-colors">
            Learning
          </Link>
          <Link href="/interview-prep" className="hover:text-gray-900 transition-colors">
            Interview Prep
          </Link>
        </nav>
      </div>
    </header>
  );
}
