"use client";

import React from "react";
import { useEffect } from "react";
import tocbot from "tocbot";

export const TableOfContents: React.FC = () => {
  useEffect(() => {
    tocbot.init({
      tocSelector: ".toc",
      contentSelector: ".markdown-body",
      headingSelector: "h2, h3, h4",
      scrollSmooth: true,
    });

    return () => tocbot.destroy();
  }, []);

  return (
    <div className="rounded-lg bg-sol-base3 dark:bg-sol-base03 shadow-lg overflow-hidden border border-sol-base2 dark:border-sol-base02">
      <div className="toc-container p-4 sm:p-6">
        <div className="text-center text-xl font-semibold mb-4 dark:text-sol-base1">目次</div>
        <div className="toc" />
      </div>
    </div>
  );
};
