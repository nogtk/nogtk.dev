import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../../components/container";
import Layout from "../../components/layout";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import PostTitle from "../../components/post/post-fallback";
import Head from "next/head";
import markdownHtml from "../../lib/markdownHtml";
import type PostType from "../../interfaces/post";
import BlogTitle from "../../components/blog-title";
import Script from "next/script";
import { NextSeo } from "next-seo";
import { TableOfContents } from "../../components/post/toc";
import PostFallback from "../../components/post/post-fallback";
import PostContainer from "../../components/post/post-container";

type Props = {
  post: PostType;
};

export default function Post({ post }: Props) {
  const router = useRouter();
  const title = post.title;
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
                    url: `https://nogtk.dev/assets/og/${post.slug}.svg`,
                  },
                ],
              }}
            />
            <PostContainer post={post} />
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

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    "title",
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
