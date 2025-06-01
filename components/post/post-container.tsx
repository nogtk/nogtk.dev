import Head from "next/head";
import { TableOfContents } from "./toc";
import Script from "next/script";
import PostType from "../../interfaces/post";
import PostTitle from "./post-title";
import PostBody from "./post-body";

type Props = {
  post: PostType;
};

const PostContainer = ({ post }: Props) => {
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16 flex-grow">
        <div className="flex flex-col xl:flex-row justify-center gap-8 xl:gap-12">
          <Head>
            <Script src="https://embed.zenn.studio/js/listen-embed-event.js" />
          </Head>
          <main className="w-full xl:max-w-3xl bg-white shadow-xl rounded-lg p-6 sm:p-8 md:p-10 order-2 xl:order-1">
            <div className="markdown-body">
              <PostTitle
                title={post.title}
                date={post.date}
              ></PostTitle>
              <PostBody content={post.content}></PostBody>
            </div>
          </main>
          <aside className="w-full xl:w-80 order-1 xl:order-2 xl:max-h-[calc(100vh-10rem)] overflow-y-auto">
            <div className="sticky top-20">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default PostContainer;
