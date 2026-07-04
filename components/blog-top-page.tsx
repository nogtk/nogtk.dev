import BlogTitle from "./blog-title";
import Post from "../interfaces/post";
import PostPreview from "./post-preview";

type Props = {
  posts: Post[];
};

export default function BlogTopPage({ posts }: Props) {
  const recentPosts = posts;

  return (
    <div className="bg-sol-base2 dark:bg-sol-base03 text-sol-base01 dark:text-sol-base1">
      <BlogTitle />
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <div className="mb-12">
            <p className="text-5xl font-bold leading-none text-sol-base02 dark:text-sol-base2 sm:text-6xl">
              nogtk.dev
            </p>
            <p className="mt-4 text-lg text-sol-base00 dark:text-sol-base0">
              技術のメモと、日々の記録
            </p>
          </div>
          <h2 className="mb-5 text-2xl font-bold text-sol-base02 dark:text-sol-base2">最新記事</h2>
          <div>
            {recentPosts.map((post) => (
              <PostPreview
                key={post.slug}
                title={post.title}
                date={post.date}
                slug={post.slug}
                excerpt={post.excerpt}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
