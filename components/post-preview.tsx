import Link from "next/link";

type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  featured?: boolean;
};

const PostPreview = ({ title, date, excerpt, slug, coverImage, featured }: Props) => {
  const defaultImage = "https://placehold.co/600x400/E0E7FF/4A5568?text=記事画像";
  const ogImageUrl = `/assets/og/${slug}.svg`;
  const imageUrl = ogImageUrl;

  if (featured) {
    return (
      <Link href={`/posts/${slug}`} className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img src={imageUrl} className="w-full h-64 sm:h-80 md:h-96 object-cover" alt={title} />
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2 text-gray-900 hover:text-blue-700 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{date}</p>
          <p className="text-gray-700 leading-relaxed">{excerpt}</p>
          <span className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            続きを読む &rarr;
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/posts/${slug}`} className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img src={imageUrl} className="w-full h-48 object-cover" alt={title} />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-700 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{date}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">{excerpt}</p>
        <span className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
          続きを読む &rarr;
        </span>
      </div>
    </Link>
  );
};

export default PostPreview;
