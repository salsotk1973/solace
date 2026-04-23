import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface LabArticle {
  title: string
  slug: string
  category: 'calm-your-state' | 'think-clearly' | 'notice-whats-good'
  excerpt: string
  readingTime: number
  publishedAt: string
  featured: boolean
  toolCta?: { label: string; href: string; description?: string }
  content: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content/lab')

export function getAllArticles(): LabArticle[] {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'))
  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')
      const { data, content } = matter(raw)
      return { ...data, content } as LabArticle
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getFeaturedArticle(): LabArticle | null {
  return getAllArticles().find(a => a.featured) ?? null
}

export function getArticleBySlug(slug: string): LabArticle | null {
  return getAllArticles().find(a => a.slug === slug) ?? null
}

export function getArticlesByCategory(category: string): LabArticle[] {
  return getAllArticles().filter(a => a.category === category)
}
