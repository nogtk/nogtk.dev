import Head from "next/head";
import { TableOfContents, TocItem } from "./toc";
import Script from "next/script";
import PostType from "../../interfaces/post";
import PostTitle from "./post-title";
import PostBody from "./post-body";

type Props = {
  post: PostType;
  tocItems: TocItem[];
};

const PostContainer = ({ post, tocItems }: Props) => {
  return (
    <>
      <article className="grow mb-32 bg-sol-base2 dark:bg-sol-base03 min-h-screen">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,760px)] lg:items-start lg:justify-center lg:gap-10 lg:px-8 xl:max-w-[1240px]">
          <Head>
            <Script src="https://embed.zenn.studio/js/listen-embed-event.js" />
          </Head>
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <TableOfContents items={tocItems} />
          </aside>
          <main>
            <div className="rounded-lg bg-sol-base3 shadow-sm ring-1 ring-sol-base2 dark:bg-sol-base02 dark:ring-sol-base02">
              <div className="px-5 py-7 sm:px-8 lg:px-10">
                <PostTitle title={post.title} date={post.date}></PostTitle>
                <div className="lg:hidden">
                  <TableOfContents items={tocItems} compact />
                </div>
                <PostBody content={post.content}></PostBody>
              </div>
            </div>
          </main>
        </div>
      </article>
    </>
  );
};

export default PostContainer;
