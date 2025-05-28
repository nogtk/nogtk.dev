import BlogTitle from "./blog-title";
import Post from "../interfaces/post";
import PostPreview from "./post-preview";

/*
 *
 * v0 by Vercel.
 * @see https://v0.dev/t/JJtTf33Umyx
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
type Props = {
  posts: Post[];
};

export default function BlogTopPage({ posts }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      <BlogTitle />
      <main>
        <div className="max-w-7xl mx-auto py-6 px-0 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white shadow-lg overflow-hidden">
              <div className="p-2 sm:p-6 lg:p-8">
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <PostPreview
                      key={post.slug}
                      title={post.title}
                      date={post.date}
                      slug={post.slug}
                      excerpt={post.excerpt}
                    />
                  ))}
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
