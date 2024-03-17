/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://nogtk.dev',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/404"],
  outDir: './public'
};
