import type { Metadata } from 'next'
import BlogList from '@/components/Blogs/BlogList'
import JsonLd from '@/components/SEO/JsonLd'
import { getAllTagSlugs, getBlogsByTagSlug, tagSlugify } from '@/lib/blogs'
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata, defaultOgImage, siteConfig } from '@/lib/seo'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600

const humanizeTag = (tag: string) =>
  tag
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export async function generateStaticParams() {
  const tags = await getAllTagSlugs()
  return tags.map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  const blogs = await getBlogsByTagSlug(tag)

  if (!blogs.length) {
    return {
      title: 'Tag Not Found',
      robots: { index: false, follow: false },
    }
  }

  const tagName = humanizeTag(tag)
  const description = `Read ${tagName} articles on ${siteConfig.name}, including technical posts, company updates, and software insights.`

  return buildMetadata({
    title: `${tagName} Articles`,
    description,
    path: `/blog/tags/${tagSlugify(tagName)}`,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${tagName} tag archive`,
      },
    ],
  })
}

const TagPage = async ({
  params,
}: {
  params: Promise<{ tag: string }>
}) => {
  const { tag } = await params
  const blogs = await getBlogsByTagSlug(tag)

  if (!blogs.length) {
    notFound()
  }

  const tagName = humanizeTag(tag)
  const tagJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${absoluteUrl(`/blog/tags/${tag}`)}#webpage`,
        url: absoluteUrl(`/blog/tags/${tag}`),
        name: `${tagName} Articles | ${siteConfig.name}`,
        description: `Read ${tagName} articles on ${siteConfig.name}.`,
      },
      buildBreadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: tagName, path: `/blog/tags/${tag}` },
      ]),
    ],
  }

  return (
    <main id="main-content" className="mx-auto min-h-[calc(100dvh-4rem)] max-w-[1200px] px-4 py-12">
      <JsonLd data={tagJsonLd} />
      <Link href="/blog" className="text-accent text-sm underline underline-offset-4">
        Back to blogs
      </Link>
      <div className="mb-10 mt-6 max-w-3xl">
        <p className="text-accent text-sm font-semibold uppercase tracking-[0.25em]">Tag Archive</p>
        <h1 className="text-neutral mt-3 text-4xl font-bold">{tagName}</h1>
        <p className="text-tertiary-content mt-4 text-lg">
          Browse all blog posts tagged with {tagName} on {siteConfig.name}.
        </p>
      </div>
      <BlogList blogs={blogs} />
    </main>
  )
}

export default TagPage
