import type { MetadataRoute } from 'next'
import { authorSlugify, getAllAuthorSlugs, getAllBlogs, getAllTagSlugs, tagSlugify } from '@/lib/blogs'
import { absoluteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getAllBlogs()
  const authorSlugs = await getAllAuthorSlugs()
  const tagSlugs = await getAllTagSlugs()
  const latestBlogUpdate =
    blogs.length > 0 ? new Date(Math.max(...blogs.map((blog) => new Date(blog.updatedAt).getTime()))) : new Date('2026-03-30T00:00:00.000Z')

  return [
    {
      url: absoluteUrl('/'),
      lastModified: latestBlogUpdate,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: absoluteUrl('/blog'),
      lastModified: latestBlogUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogs.map((blog) => ({
      url: absoluteUrl(`/blog/${blog.slug}`),
      lastModified: new Date(blog.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...authorSlugs.map((authorSlug) => ({
      url: absoluteUrl(`/blog/authors/${authorSlug}`),
      lastModified: new Date(
        Math.max(
          ...blogs
            .filter((blog) => authorSlug === authorSlugify(blog.author))
            .map((blog) => new Date(blog.updatedAt).getTime()),
        ),
      ),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...tagSlugs.map((tagSlug) => ({
      url: absoluteUrl(`/blog/tags/${tagSlug}`),
      lastModified: new Date(
        Math.max(
          ...blogs
            .filter((blog) => blog.tags?.some((tag) => tagSlug === tagSlugify(tag)))
            .map((blog) => new Date(blog.updatedAt).getTime()),
        ),
      ),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
