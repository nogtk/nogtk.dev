import Link from "next/link";

const BlogTitle = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white dark:text-gray-100 text-center">
          <Link href="/">nogtk.dev</Link>
        </h1>
      </div>
    </header>
  );
};

export default BlogTitle;
