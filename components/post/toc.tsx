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
    <div className="rounded-lg bg-white shadow-lg overflow-hidden">
      <div className="toc-container p-4 sm:p-6">
        <div className="text-center text-xl font-semibold mb-4">目次</div>
        <div className="toc" />
      </div>
    </div>
  );
};
