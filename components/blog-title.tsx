import Link from "next/link";
import { useState } from "react";

const SunIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const BlogTitle = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light';
    return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <header className="bg-sol-base3 dark:bg-sol-base03 shadow-sm sticky top-0 z-50 border-b border-sol-base2 dark:border-sol-base02">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-sol-base02 dark:text-sol-base2 hover:text-sol-blue transition-colors">
              nogtk.dev
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sol-base00 dark:text-sol-base0 hover:text-sol-blue transition-colors">
              ホーム
            </Link>
            <Link href="/" className="text-sol-base00 dark:text-sol-base0 hover:text-sol-blue transition-colors">
              記事一覧
            </Link>
            <Link href="/me" className="text-sol-base00 dark:text-sol-base0 hover:text-sol-blue transition-colors">
              プロフィール
            </Link>
            <button
              onClick={toggleTheme}
              className="text-sol-base00 dark:text-sol-base0 hover:text-sol-blue transition-colors focus:outline-none"
              aria-label="テーマを切り替える"
              suppressHydrationWarning
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </nav>
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="text-sol-base00 dark:text-sol-base0 hover:text-sol-blue focus:outline-none"
              aria-label="テーマを切り替える"
              suppressHydrationWarning
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-sol-base00 dark:text-sol-base0 hover:text-sol-blue focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-sol-base3 dark:bg-sol-base03 shadow-lg">
          <Link href="/" className="block px-4 py-3 text-sol-base00 dark:text-sol-base0 hover:bg-sol-base2 dark:hover:bg-sol-base02 hover:text-sol-blue transition-colors">
            ホーム
          </Link>
          <Link href="/" className="block px-4 py-3 text-sol-base00 dark:text-sol-base0 hover:bg-sol-base2 dark:hover:bg-sol-base02 hover:text-sol-blue transition-colors">
            記事一覧
          </Link>
          <Link href="/me" className="block px-4 py-3 text-sol-base00 dark:text-sol-base0 hover:bg-sol-base2 dark:hover:bg-sol-base02 hover:text-sol-blue transition-colors">
            プロフィール
          </Link>
        </div>
      )}
    </header>
  );
};

export default BlogTitle;
