import markdownStyles from "./markdown-styles.module.css";
import { TableOfContents } from "./toc";

type Props = {
  title: string;
  date: string;
  content: string;
};

const PostBody = ({ title, date, content }: Props) => {
  return (
    <main>
      <div className="max-w-2xl lg:max-w-4xl mx-auto py-6 sm:px-6 lg:px-10">
        <div className="px-4 py-6 sm:px-0">
          <div className="rounded-lg bg-white shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mt-5">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <h2 className="text-3xl leading-12 font-bold text-gray-900">
                      {title}
                    </h2>
                    <div className="mt-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {date}
                      </span>
                    </div>
                    <div className="znc markdown-body">
                      <div
                        className={markdownStyles["markdown"]}
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PostBody;
