import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Brainloop</h3>
            <p className="mt-2 text-sm text-gray-500">
              Building great things with Next.js.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Links</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-gray-900 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Brainloop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
