import React from "react";

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

type Props = {
  items: TocItem[];
  compact?: boolean;
};

const TocList = ({ items }: { items: TocItem[] }) => {
  return (
    <ol className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className={item.level >= 3 ? "pl-4" : undefined}>
          <a
            href={`#${item.id}`}
            className="block border-l-2 border-transparent pl-3 text-sm leading-relaxed text-sol-base00 transition-colors hover:border-sol-blue hover:text-sol-blue dark:text-sol-base0"
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
};

export const TableOfContents: React.FC<Props> = ({ items, compact = false }) => {
  if (items.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <details className="my-8 border-y border-sol-base2 py-4 dark:border-sol-base02">
        <summary className="cursor-pointer text-base font-bold text-sol-base02 dark:text-sol-base2">
          目次
        </summary>
        <nav className="mt-4" aria-label="目次">
          <TocList items={items} />
        </nav>
      </details>
    );
  }

  return (
    <nav className="border-l border-sol-base2 py-1 pl-4 dark:border-sol-base02" aria-label="目次">
      <div className="mb-3 text-sm font-bold text-sol-base02 dark:text-sol-base2">目次</div>
      <TocList items={items} />
    </nav>
  );
};
