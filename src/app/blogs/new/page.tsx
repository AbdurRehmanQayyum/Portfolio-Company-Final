import type { Metadata } from 'next'
import BlogForm from '@/components/Blogs/BlogForm'
import JsonLd from '@/components/SEO/JsonLd'
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata, siteConfig } from '@/lib/seo'
import Link from 'next/link'

export const metadata: Metadata = buildMetadata({
  title: 'Create Blog',
  description: 'Create a new blog post for the Best Universal Solutions website.',
  path: '/blog/new',
  noIndex: true,
})

const NewBlogPage = () => {
  const newBlogJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${absoluteUrl('/blog/new')}#webpage`,
        url: absoluteUrl('/blog/new'),
        name: `Create Blog | ${siteConfig.name}`,
        description: 'Create a new blog post for the Best Universal Solutions website.',
        isPartOf: {
          '@id': `${absoluteUrl('/')}#website`,
        },
      },
      buildBreadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'Create Blog', path: '/blog/new' },
      ]),
    ],
  }

  return (
    <main id="main-content" className="mx-auto min-h-[calc(100dvh-4rem)] max-w-[900px] px-4 py-12">
      <JsonLd data={newBlogJsonLd} />
      <div className="mb-8">
        <Link href="/blog" className="text-accent text-sm underline underline-offset-4">
          Back to blogs
        </Link>
        <h1 className="text-neutral mt-4 text-4xl font-bold">Create a new blog post</h1>
        <p className="text-tertiary-content mt-3">Add a title, author, and full content, then publish it instantly to the blog list.</p>
      </div>

      <BlogForm mode="create" />
    </main>
  )
}

export default NewBlogPage
