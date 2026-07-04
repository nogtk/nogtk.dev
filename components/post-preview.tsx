import Link from "next/link";

type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
};

const PostPreview = ({ title, date, excerpt, slug }: Props) => {
  return (
    <Link
      href={`/posts/${slug}`}
      className="group block border-t border-sol-base1/40 py-7 transition-colors last:border-b hover:border-sol-blue dark:border-sol-base01/50"
    >
      <article className="grid gap-3 md:grid-cols-[9rem_1fr_auto] md:items-start md:gap-8">
        <time className="text-sm font-medium text-sol-base00 dark:text-sol-base0 md:pt-1">
          {date}
        </time>
        <div>
          <h3 className="text-2xl font-bold leading-snug text-sol-base02 transition-colors group-hover:text-sol-blue dark:text-sol-base2">
            {title}
          </h3>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-sol-base01 dark:text-sol-base1">
            {excerpt}
          </p>
        </div>
        <span className="text-sm font-semibold text-sol-blue transition-transform group-hover:translate-x-1 md:pt-2">
          読む &rarr;
        </span>
      </article>
    </Link>
  );
};

export default PostPreview;
