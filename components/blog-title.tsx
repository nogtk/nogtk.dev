import Link from "next/link";

const BlogTitle = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-white dark:text-gray-100">
            <Link href="/">nogtk.dev</Link>
          </h1>
          <nav className="flex space-x-6">
            <Link 
              href="/" 
              className="text-white hover:text-blue-200 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/me" 
              className="text-white hover:text-blue-200 font-medium transition-colors"
            >
              About Me
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default BlogTitle;
