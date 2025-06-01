import Link from "next/link";
import { useState } from "react";

const BlogTitle = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-slate-900 hover:text-sky-600 transition-colors duration-150">
              nogtk.dev
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-600 hover:text-sky-600 transition-colors duration-150 font-medium">
              ホーム
            </Link>
            <Link href="/" className="text-slate-600 hover:text-sky-600 transition-colors duration-150 font-medium">
              記事一覧
            </Link>
            <Link href="/me" className="text-slate-600 hover:text-sky-600 transition-colors duration-150 font-medium">
              プロフィール
            </Link>
          </nav>
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-sky-600 focus:outline-none p-2 rounded-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <Link href="/" className="block px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition-colors">
            ホーム
          </Link>
          <Link href="/" className="block px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition-colors">
            記事一覧
          </Link>
          <Link href="/me" className="block px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition-colors">
            プロフィール
          </Link>
        </div>
      )}
    </header>
  );
};

export default BlogTitle;
