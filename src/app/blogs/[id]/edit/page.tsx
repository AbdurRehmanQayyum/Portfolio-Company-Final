import type { Metadata } from 'next'
import BlogForm from '@/components/Blogs/BlogForm'
import JsonLd from '@/components/SEO/JsonLd'
import { getAllBlogs, getBlogByIdentifier } from '@/lib/blogs'
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata, siteConfig, truncateText } from '@/lib/seo'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export const revalidate = 3600

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map((blog) => ({ id: blog.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const blog = await getBlogByIdentifier(id)

  if (!blog) {
    return {
      title: 'Edit Blog',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return buildMetadata({
    title: `Edit ${blog.title}`,
    description: `Edit the blog post "${blog.title}" on the ${siteConfig.name} website.`,
    path: `/blog/${blog.slug}/edit`,
    noIndex: true,
  })
}

const EditBlogPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const blog = await getBlogByIdentifier(id)

  if (!blog) {
    notFound()
  }

  if (id !== blog.slug) {
    redirect(`/blog/${blog.slug}/edit`)
  }

  const editBlogJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${absoluteUrl(`/blog/${blog.slug}/edit`)}#webpage`,
        url: absoluteUrl(`/blog/${blog.slug}/edit`),
        name: `Edit ${blog.title} | ${siteConfig.name}`,
        description: truncateText(blog.content, 160),
        isPartOf: {
          '@id': `${absoluteUrl('/')}#website`,
        },
      },
      buildBreadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: blog.title, path: `/blog/${blog.slug}` },
        { name: 'Edit', path: `/blog/${blog.slug}/edit` },
      ]),
    ],
  }

  return (
    <main id="main-content" className="mx-auto min-h-[calc(100dvh-4rem)] max-w-[900px] px-4 py-12">
      <JsonLd data={editBlogJsonLd} />
      <div className="mb-8">
        <Link href={`/blog/${blog.slug}`} className="text-accent text-sm underline underline-offset-4">
          Back to blog
        </Link>
        <h1 className="text-neutral mt-4 text-4xl font-bold">Edit blog post</h1>
        <p className="text-tertiary-content mt-3">Update the title, author, or content and save the changes.</p>
      </div>

      <BlogForm
        mode="edit"
        initialValues={{
          id: blog.id,
          title: blog.title,
          author: blog.author,
          excerpt: blog.excerpt,
          tags: blog.tags,
          coverImage: blog.coverImage,
          coverImageAlt: blog.coverImageAlt,
          contentImages: blog.contentImages,
          content: blog.content,
        }}
      />
    </main>
  )
}

export default EditBlogPage
