import DateFormatter from "./date-formatter";
import Link from "next/link";

type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
};

const PostPreview = ({ title, date, excerpt, slug }: Props) => {
  return (
    <>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <Link
          as={`/posts/${slug}`}
          href="/posts/[slug]"
          className="hover:underline:none"
        >
          <div className="p-5">
            <h3 className="text-xl leading-6 font-bold text-gray-900">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-500">{excerpt}</p>
            <div className="mt-3">
              <span className="text-sm text-gray-500">{date}</span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default PostPreview;
