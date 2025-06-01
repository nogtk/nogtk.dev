"use client";

import React from "react";
import { useEffect } from "react";
import tocbot from "tocbot";

export const TableOfContents: React.VFC = () => {
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
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-3">目次</h3>
        <nav className="toc space-y-1" />
      </div>
    </div>
  );
};
