import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), '_posts')

// 技術名を推測する関数
const inferTechFromTitle = (title: string): string => {
  const titleLower = title.toLowerCase()
  if (titleLower.includes('django')) return 'django'
  if (titleLower.includes('docker')) return 'docker'
  if (titleLower.includes('kotlin')) return 'kotlin'
  if (titleLower.includes('rust')) return 'rust'
  if (titleLower.includes('python')) return 'python'
  return 'tech'
}

// 静的OG画像パスを生成
const getStaticOGImagePath = (slug: string): string => {
  return `/assets/og/${slug}.svg`
}

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  // coverImageが設定されていない場合、静的OG画像パスを設定
  if (fields.includes('coverImage') && !items['coverImage']) {
    items['coverImage'] = getStaticOGImagePath(realSlug)
  }

  return items
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
