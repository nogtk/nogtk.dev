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
        <div className="flex justify-center mx-32">
          <Head>
            <Script src="https://embed.zenn.studio/js/listen-embed-event.js" />
          </Head>
          <main>
            {/* 1024px の時は max-w-xl がちょうどいいが、今はそれを無視しておく */}
            <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-10">
              <div className="px-4 py-6 sm:px-0">
                <div className="rounded-lg bg-white shadow-lg overflow-hidden">
                  <div className="p-4 sm:p-6 lg:p-8">
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
            </div>
          </main>
          <aside className="w-full lg:w-1/3">
            <div className="sticky top-12 mt-12">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
};

export default PostContainer;
