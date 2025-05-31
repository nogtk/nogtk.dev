import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-300">
              © 2024 nogtk.dev. All rights reserved.
            </p>
          </div>
          <nav className="flex space-x-6">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/me" 
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              About Me
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;