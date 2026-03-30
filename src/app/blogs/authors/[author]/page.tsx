import type { Metadata } from 'next'
import BlogList from '@/components/Blogs/BlogList'
import JsonLd from '@/components/SEO/JsonLd'
import { getAuthorProfile } from '@/lib/authors'
import { authorSlugify, getAllAuthorSlugs, getBlogsByAuthorSlug } from '@/lib/blogs'
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata, defaultOgImage, siteConfig } from '@/lib/seo'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateStaticParams() {
  const authors = await getAllAuthorSlugs()
  return authors.map((author) => ({ author }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ author: string }>
}): Promise<Metadata> {
  const { author } = await params
  const blogs = await getBlogsByAuthorSlug(author)

  if (!blogs.length) {
    return {
      title: 'Author Not Found',
      robots: { index: false, follow: false },
    }
  }

  const authorProfile = getAuthorProfile(blogs[0].author)
  const description = `Read blog posts by ${authorProfile.name} on ${siteConfig.name}, including software insights, company updates, and technical articles.`

  return buildMetadata({
    title: `${authorProfile.name} Articles`,
    description,
    path: `/blog/authors/${authorProfile.slug}`,
    type: 'profile',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${authorProfile.name} author archive`,
      },
    ],
  })
}

const AuthorPage = async ({
  params,
}: {
  params: Promise<{ author: string }>
}) => {
  const { author } = await params
  const blogs = await getBlogsByAuthorSlug(author)

  if (!blogs.length) {
    notFound()
  }

  const authorProfile = getAuthorProfile(blogs[0].author)
  const authorName = authorProfile.name
  const authorSlug = authorSlugify(authorName)
  const authorJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${absoluteUrl(`/blog/authors/${authorSlug}`)}#author`,
        name: authorName,
        url: absoluteUrl(`/blog/authors/${authorSlug}`),
        description: authorProfile.bio,
        jobTitle: authorProfile.role,
        sameAs: authorProfile.sameAs,
        worksFor: {
          '@id': `${absoluteUrl('/')}#organization`,
        },
      },
      {
        '@type': 'CollectionPage',
        '@id': `${absoluteUrl(`/blog/authors/${authorSlug}`)}#webpage`,
        url: absoluteUrl(`/blog/authors/${authorSlug}`),
        name: `${authorName} Articles | ${siteConfig.name}`,
        about: {
          '@id': `${absoluteUrl(`/blog/authors/${authorSlug}`)}#author`,
        },
      },
      buildBreadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: authorName, path: `/blog/authors/${authorSlug}` },
      ]),
    ],
  }

  return (
    <main id="main-content" className="mx-auto min-h-[calc(100dvh-4rem)] max-w-[1200px] px-4 py-12">
      <JsonLd data={authorJsonLd} />
      <Link href="/blog" className="text-accent text-sm underline underline-offset-4">
        Back to blogs
      </Link>
      <div className="mb-10 mt-6 max-w-3xl">
        <p className="text-accent text-sm font-semibold uppercase tracking-[0.25em]">Author Archive</p>
        <h1 className="text-neutral mt-3 text-4xl font-bold">{authorName}</h1>
        <p className="text-tertiary-content mt-4 text-lg">{authorProfile.bio}</p>
      </div>
      <BlogList blogs={blogs} />
    </main>
  )
}

export default AuthorPage
