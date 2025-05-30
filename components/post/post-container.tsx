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
      <article className="flex-grow mb-32">
        <div className="flex flex-col xl:flex-row justify-center xl:mx-32">
          <Head>
            <Script src="https://embed.zenn.studio/js/listen-embed-event.js" />
          </Head>
          <main className="order-2 xl:order-1">
            {/* 1024px の時は max-w-xl がちょうどいいが、今はそれを無視しておく */}
            <div className="w-full xl:max-w-4xl mx-auto py-6 px-0 sm:px-6 lg:px-10">
                <div className="rounded-lg bg-white shadow-lg overflow-hidden">
                  <div className="p-0 sm:p-6 lg:p-8">
                    <div className="mt-5">
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <PostTitle
                            title={post.title}
                            date={post.date}
                          ></PostTitle>
                          <PostBody content={post.content}></PostBody>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </main>
          <aside className="w-full xl:w-1/3 order-1 xl:order-2 lg:mx-auto">
            <div className="sticky top-12 xl:mt-12 mx-4 xl:mx-0 xl:mt-12">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
};

export default PostContainer;
