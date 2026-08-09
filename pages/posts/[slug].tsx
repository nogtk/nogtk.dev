import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../../components/container";
import Layout from "../../components/layout";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import markdownHtml from "../../lib/markdownHtml";
import type PostType from "../../interfaces/post";
import BlogTitle from "../../components/blog-title";
import Head from "next/head";
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
            <Head>
              <title>{`${title} | nogtk.dev`}</title>
              <meta key="description" name="description" content={post.excerpt} />
              <meta key="og:title" property="og:title" content={title} />
              <meta key="og:description" property="og:description" content={post.excerpt} />
              <meta key="og:url" property="og:url" content={`https://nogtk.dev/posts/${post.slug}`} />
              <meta key="og:type" property="og:type" content="article" />
              <meta key="article:published_time" property="article:published_time" content={post.date} />
              <meta key="article:author" property="article:author" content="https://twitter.com/_nogtk_" />
              <meta key="og:image" property="og:image" content={ogImageUrl} />
              <meta key="og:image:width" property="og:image:width" content="1200" />
              <meta key="og:image:height" property="og:image:height" content="630" />
              <meta key="og:image:type" property="og:image:type" content="image/png" />
              <meta key="og:image:alt" property="og:image:alt" content={title} />
              <meta key="twitter:image" name="twitter:image" content={ogImageUrl} />
              <meta key="twitter:image:alt" name="twitter:image:alt" content={title} />
            </Head>
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
  const content = await markdownHtml(post.content || "");

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
