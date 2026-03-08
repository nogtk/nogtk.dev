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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section>
          <h2 className="text-3xl font-bold text-sol-base02 dark:text-sol-base2 mb-8">最新記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <PostPreview
                key={post.slug}
                title={post.title}
                date={post.date}
                slug={post.slug}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
              />
            ))}
          </div>

        </section>
      </main>
    </div>
  );
}
