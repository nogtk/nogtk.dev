import Container from "../components/container";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import Post from "../interfaces/post";
import BlogTopPage from "../components/blog-top-page";

type Props = {
  allPosts: Post[];
};

export default function Index({ allPosts }: Props) {
  return (
    <>
      <Layout>
        <Head>
          <title>{"nogtk.dev"}</title>
          <meta property="og:image" content="https://res.cloudinary.com/di1lterwq/image/upload/v1692798736/Frame_1_pt3mzq.png" />
          <meta name="twitter:image" content="https://res.cloudinary.com/di1lterwq/image/upload/v1692798736/Frame_1_pt3mzq.png" />
        </Head>
        <Container>
          <BlogTopPage posts={allPosts} />;
        </Container>
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts(["title", "date", "slug", "excerpt", "coverImage"]);

  return {
    props: { allPosts },
  };
};
