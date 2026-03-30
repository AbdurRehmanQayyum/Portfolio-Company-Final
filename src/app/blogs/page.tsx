import type { Metadata } from 'next'
import BlogList from '@/components/Blogs/BlogList'
import JsonLd from '@/components/SEO/JsonLd'
import { getAllBlogs } from '@/lib/blogs'
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata, defaultOgImage, siteConfig, truncateText } from '@/lib/seo'
import Link from 'next/link'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Blog Insights, Technical Articles, and Company Updates',
  description:
    'Read the Best Universal Solutions blog for software engineering insights, product updates, case studies, digital strategy articles, and company news.',
  path: '/blog',
  keywords: ['software development blog', 'company tech blog', 'engineering articles', 'digital strategy insights'],
  images: [
    {
      url: defaultOgImage,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} blog overview`,
    },
  ],
})

const BlogsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) => {
  const blogs = await getAllBlogs()
  const { message } = await searchParams
  const blogIndexJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${absoluteUrl('/blog')}#blog`,
        url: absoluteUrl('/blog'),
        name: `${siteConfig.name} Blog`,
        description:
          'Technical articles, company updates, case studies, engineering insights, and digital strategy content from Best Universal Solutions.',
        publisher: {
          '@id': `${absoluteUrl('/')}#organization`,
        },
        inLanguage: 'en',
        blogPost: blogs.map((blog) => ({
          '@type': 'BlogPosting',
          '@id': `${absoluteUrl(`/blog/${blog.slug}`)}#article`,
          headline: blog.title,
          author: {
            '@type': 'Person',
            name: blog.author,
          },
          datePublished: blog.createdAt,
          dateModified: blog.updatedAt,
          url: absoluteUrl(`/blog/${blog.slug}`),
          image: blog.coverImage || absoluteUrl(`/blog/${blog.slug}/opengraph-image`),
          keywords: blog.tags?.join(', '),
          description: blog.excerpt || truncateText(blog.content, 160),
        })),
      },
      buildBreadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
      ]),
    ],
  }

  return (
    <main id="main-content" className="mx-auto min-h-[calc(100dvh-4rem)] max-w-[1200px] px-4 py-12">
      <JsonLd data={blogIndexJsonLd} />
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.25em]">Company Blog</p>
          <h1 className="text-neutral mt-3 text-4xl font-bold">Insights, launches, and engineering updates</h1>
          <p className="text-tertiary-content mt-4 text-lg">
            Read technical articles, product updates, case studies, and search-optimized insights from Best Universal Solutions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
        <Link href="/blog/new" prefetch className="bg-accent text-secondary inline-flex w-fit rounded-lg px-5 py-3 font-medium">
          Add New Blog
        </Link>
          <Link href="/rss.xml" className="text-accent inline-flex items-center rounded-lg border border-white/10 px-5 py-3 text-sm font-medium">
            RSS Feed
          </Link>
        </div>
      </div>

      {message && (
        <p className="mb-6 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </p>
      )}

      <BlogList blogs={blogs} />
    </main>
  )
}

export default BlogsPage
