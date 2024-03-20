// this code is workaround.
// ref: https://github.com/vercel/next.js/issues/59136

import { getAllPosts } from "../../lib/api";

function getSitemap() {
  const baseURL = "https://nogtk.dev";

  const staticPaths = [
    {
      url: baseURL,
      lastModified: new Date(),
    },
  ];

  const posts = getAllPosts(["slug", "date"]);
  const dynamicPaths = posts.map((post) => {
    return {
      url: `${baseURL}/posts/${post.slug}`,
      lastModified: new Date(post.date),
    };
  });

  const map = [...staticPaths, ...dynamicPaths];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${map
      .map(
        (item) => `
            <url>
              <loc>${item.url}</loc>
              <lastmod>${item.lastModified.toISOString()}</lastmod>
            </url>
          `
      )
      .join("")}
    </urlset>
  `;
}

export async function GET() {
  return new Response(getSitemap(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
