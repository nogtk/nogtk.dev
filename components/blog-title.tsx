import Link from "next/link";
import { useState } from "react";

const BlogTitle = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-sol-base3 shadow-sm sticky top-0 z-50 border-b border-sol-base2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-sol-base02 hover:text-sol-blue transition-colors">
              nogtk.dev
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-sol-base00 hover:text-sol-blue transition-colors">
              ホーム
            </Link>
            <Link href="/" className="text-sol-base00 hover:text-sol-blue transition-colors">
              記事一覧
            </Link>
            <Link href="/me" className="text-sol-base00 hover:text-sol-blue transition-colors">
              プロフィール
            </Link>
          </nav>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-sol-base00 hover:text-sol-blue focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-sol-base3 shadow-lg">
          <Link href="/" className="block px-4 py-3 text-sol-base00 hover:bg-sol-base2 hover:text-sol-blue transition-colors">
            ホーム
          </Link>
          <Link href="/" className="block px-4 py-3 text-sol-base00 hover:bg-sol-base2 hover:text-sol-blue transition-colors">
            記事一覧
          </Link>
          <Link href="/me" className="block px-4 py-3 text-sol-base00 hover:bg-sol-base2 hover:text-sol-blue transition-colors">
            プロフィール
          </Link>
        </div>
      )}
    </header>
  );
};

export default BlogTitle;
