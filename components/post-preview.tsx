import Link from "next/link";

type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  category?: string;
  featured?: boolean;
};

const PostPreview = ({ title, date, excerpt, slug, coverImage, category, featured }: Props) => {
  const defaultImage = "https://placehold.co/600x400/E0E7FF/4A5568?text=記事画像";
  const imageUrl = coverImage || defaultImage;
  
  const categories = [
    { name: "カテゴリA", color: "blue" },
    { name: "カテゴリB", color: "yellow" },
    { name: "カテゴリC", color: "red" },
  ];
  
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const displayCategory = category || randomCategory.name;
  const categoryColor = randomCategory.color;

  const getCategoryClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-600 bg-blue-100";
      case "yellow":
        return "text-yellow-600 bg-yellow-100";
      case "red":
        return "text-red-600 bg-red-100";
      default:
        return "text-indigo-600 bg-indigo-100";
    }
  };

  if (featured) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Link href={`/posts/${slug}`}>
          <img src={imageUrl} className="w-full h-64 sm:h-80 md:h-96 object-cover" alt={title} />
        </Link>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2 text-gray-900 hover:text-blue-700 transition-colors">
            <Link href={`/posts/${slug}`}>{title}</Link>
          </h3>
          <p className="text-gray-600 text-sm mb-3">{date}</p>
          <p className="text-gray-700 leading-relaxed">{excerpt}</p>
          <Link href={`/posts/${slug}`} className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            続きを読む &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <Link href={`/posts/${slug}`}>
        <img src={imageUrl} className="w-full h-48 object-cover" alt={title} />
      </Link>
      <div className="p-6">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block ${getCategoryClasses(categoryColor)}`}>
          {displayCategory}
        </span>
        <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-700 transition-colors">
          <Link href={`/posts/${slug}`}>{title}</Link>
        </h3>
        <p className="text-gray-600 text-sm mb-3">{date}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">{excerpt}</p>
        <Link href={`/posts/${slug}`} className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
          続きを読む &rarr;
        </Link>
      </div>
    </div>
  );
};

export default PostPreview;
