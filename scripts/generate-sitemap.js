const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), '_posts');
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

function getAllPosts() {
  const files = fs.readdirSync(POSTS_DIR);
  
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(POSTS_DIR, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      const slug = file.replace(/\.md$/, '');
      
      return {
        slug,
        date: data.date
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generateSitemap() {
  const posts = getAllPosts();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nogtk.dev</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nogtk.dev/me</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts
    .map((post) => {
      return `
  <url>
    <loc>https://nogtk.dev/posts/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log('✅ Sitemap generated successfully!');
}

generateSitemap();