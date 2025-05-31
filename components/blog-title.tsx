import Link from "next/link";
import { useState } from "react";

const BlogTitle = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              nogtk.dev
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              ホーム
            </Link>
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              記事一覧
            </Link>
            <Link href="/me" className="text-gray-600 hover:text-blue-600 transition-colors">
              プロフィール
            </Link>
          </nav>
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
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
          <Link href="/" className="block px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors">
            ホーム
          </Link>
          <Link href="/" className="block px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors">
            記事一覧
          </Link>
          <Link href="/me" className="block px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors">
            プロフィール
          </Link>
        </div>
      )}
    </header>
  );
};

export default BlogTitle;
