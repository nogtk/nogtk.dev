import markdownHtml from "zenn-markdown-html"

export default async function markdownToHtml(markdown: string) {
  return markdownHtml(markdown)
}
