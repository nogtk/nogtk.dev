import markdownToHtml from "zenn-markdown-html"

export default function markdownHtml(markdown: string) {
  return markdownToHtml(markdown, {
    embedOrigin: 'https://embed.zenn.studio'
  })
}
