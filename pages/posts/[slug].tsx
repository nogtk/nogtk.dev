import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../../components/container";
import Layout from "../../components/layout";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import markdownHtml from "../../lib/markdownHtml";
import type PostType from "../../interfaces/post";
import BlogTitle from "../../components/blog-title";
import { NextSeo } from "next-seo";
import type { TocItem } from "../../components/post/toc";
import PostFallback from "../../components/post/post-fallback";
import PostContainer from "../../components/post/post-container";

type Props = {
  post: PostType;
  tocItems: TocItem[];
};

export default function Post({ post, tocItems }: Props) {
  const router = useRouter();
  const title = post.title;
  const ogImageUrl = `https://nogtk.dev/assets/og/${post.slug}.png`;
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout>
      <Container>
        <BlogTitle />
        {router.isFallback ? (
          <PostFallback>Loading…</PostFallback>
        ) : (
          <>
            <NextSeo
              title={title}
              description={post.excerpt}
              openGraph={{
                title: title,
                url: `https://nogtk.dev/posts/${post.slug}`,
                type: "article",
                article: {
                  publishedTime: post.date,
                  authors: ["https://twitter.com/_nogtk_"],
                },
                images: [
                  {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    type: "image/png",
                    alt: title,
                  },
                ],
              }}
              additionalMetaTags={[
                {
                  name: "twitter:image",
                  content: ogImageUrl,
                },
                {
                  name: "twitter:image:alt",
                  content: title,
                },
              ]}
            />
            <PostContainer post={post} tocItems={tocItems} />
          </>
        )}
      </Container>
    </Layout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

const decodeHtml = (value: string): string => {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

const extractTocItems = (html: string): TocItem[] => {
  const headingRegex = /<h([2-4])\s+[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html)) !== null) {
    const [, level, id, content] = match;
    const text = decodeHtml(content.replace(/<[^>]+>/g, "").trim());
    if (text) {
      items.push({
        id,
        text,
        level: Number(level),
      });
    }
  }

  return items;
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    "title",
    "excerpt",
    "date",
    "slug",
    "content",
    "ogImage",
  ]);
  const content = markdownHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
      tocItems: extractTocItems(content),
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
