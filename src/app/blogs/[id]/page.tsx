import type { Metadata } from 'next'
import BlogTableOfContents from '@/components/Blogs/BlogTableOfContents'
import DeleteBlogButton from '@/components/Blogs/DeleteBlogButton'
import RelatedPosts from '@/components/Blogs/RelatedPosts'
import JsonLd from '@/components/SEO/JsonLd'
import { getAuthorProfile } from '@/lib/authors'
import { extractFaqsFromSections, getReadingTime, parseBlogArticle, parseInlineImage } from '@/lib/blog-content'
import { authorSlugify, getAllBlogs, getBlogByIdentifier, getRelatedBlogs, tagSlugify } from '@/lib/blogs'
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata, buildPageTitle, siteConfig, truncateText } from '@/lib/seo'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export const revalidate = 3600

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map((blog) => ({ id: blog.slug }))
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const blog = await getBlogByIdentifier(id)

  if (!blog) {
    return {
      title: 'Blog Not Found',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const description = blog.excerpt || truncateText(blog.content, 160)
  const socialImage = blog.coverImage || absoluteUrl(`/blog/${blog.slug}/opengraph-image`)

  return buildMetadata({
    title: blog.title,
    description,
    path: `/blog/${blog.slug}`,
    keywords: [blog.title, `${blog.author} article`, 'software development blog post', 'company insights article', ...(blog.tags || [])],
    type: 'article',
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: blog.coverImageAlt || `${blog.title} article preview`,
      },
    ],
  })
}

const BlogDetailPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ message?: string }>
}) => {
  const { id } = await params
  const { message } = await searchParams
  const blog = await getBlogByIdentifier(id)

  if (!blog) {
    notFound()
  }

  if (id !== blog.slug) {
    redirect(`/blog/${blog.slug}`)
  }

  const description = blog.excerpt || truncateText(blog.content, 160)
  const socialImage = blog.coverImage || absoluteUrl(`/blog/${blog.slug}/opengraph-image`)
  const authorProfile = getAuthorProfile(blog.author)
  const relatedBlogs = await getRelatedBlogs(blog)
  const readingTime = getReadingTime(blog.content)
  const { headings, sections, hierarchyWarnings } = parseBlogArticle(blog.content, blog.contentImages)
  const faqs = extractFaqsFromSections(sections)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${absoluteUrl(`/blog/${blog.slug}`)}#article`,
        headline: blog.title,
        description,
        articleBody: blog.content,
        datePublished: blog.createdAt,
        dateModified: blog.updatedAt,
        url: absoluteUrl(`/blog/${blog.slug}`),
        mainEntityOfPage: absoluteUrl(`/blog/${blog.slug}`),
        wordCount: readingTime.words,
        timeRequired: `PT${readingTime.minutes}M`,
        image: [
          {
            '@type': 'ImageObject',
            url: socialImage,
            caption: blog.coverImageAlt || blog.title,
          },
        ],
        keywords: blog.tags?.join(', '),
        author: {
          '@type': 'Person',
          name: authorProfile.name,
          url: absoluteUrl(`/blog/authors/${authorProfile.slug}`),
          description: authorProfile.bio,
          sameAs: authorProfile.sameAs,
        },
        publisher: {
          '@id': `${absoluteUrl('/')}#organization`,
        },
        inLanguage: siteConfig.language,
      },
      {
        '@type': 'WebPage',
        '@id': `${absoluteUrl(`/blog/${blog.slug}`)}#webpage`,
        url: absoluteUrl(`/blog/${blog.slug}`),
        name: buildPageTitle(blog.title),
        description,
        isPartOf: {
          '@id': `${absoluteUrl('/')}#website`,
        },
        breadcrumb: {
          '@id': `${absoluteUrl(`/blog/${blog.slug}`)}#breadcrumb`,
        },
      },
      {
        ...buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: blog.title, path: `/blog/${blog.slug}` },
        ]),
        '@id': `${absoluteUrl(`/blog/${blog.slug}`)}#breadcrumb`,
      },
      ...(faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  }

  return (
    <main id="main-content" className="mx-auto min-h-[calc(100dvh-4rem)] max-w-[1200px] px-4 py-12">
      <JsonLd data={articleJsonLd} />
      <div className="mx-auto max-w-[900px]">
        <Link href="/blog" prefetch className="text-accent text-sm underline underline-offset-4">
          Back to blogs
        </Link>

        {message && (
          <p className="mt-6 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </p>
        )}

        {hierarchyWarnings.length > 0 && (
          <div className="mt-6 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            {hierarchyWarnings[0]}
          </div>
        )}

        <article className="mt-6">
          <header className="bg-secondary border-border rounded-3xl border p-6 md:p-8">
            <p className="text-tertiary-content text-sm">
              By{' '}
              <Link href={`/blog/authors/${authorSlugify(blog.author)}`} className="text-accent underline underline-offset-4">
                {authorProfile.name}
              </Link>{' '}
              | Published {formatDate(blog.createdAt)} | Updated {formatDate(blog.updatedAt)} | {readingTime.label}
            </p>
            <h1 className="text-neutral mt-3 text-4xl font-bold">{blog.title}</h1>
            {blog.excerpt && <p className="text-tertiary-content mt-4 text-lg leading-8">{blog.excerpt}</p>}
            {!!blog.tags?.length && (
              <div className="mt-5 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tags/${tagSlugify(tag)}`}
                    prefetch
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition-colors duration-200 hover:border-accent hover:text-accent">
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            {blog.coverImage && (
              <div className="mt-6 overflow-hidden rounded-2xl">
                <Image
                  src={blog.coverImage}
                  alt={blog.coverImageAlt || `${blog.title} cover image`}
                  width={1200}
                  height={630}
                  priority
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div className="space-y-8">
              {sections.map((section, index) =>
                section.id === 'article-overview' ? (
                  <section key={`${section.id}-${index}`} className="space-y-5">
                    {section.paragraphs.map((paragraph, paragraphIndex) => {
                      const inlineImage = parseInlineImage(paragraph)

                      return inlineImage ? (
                        <div key={`${section.id}-${paragraphIndex}`} className="overflow-hidden rounded-2xl">
                          <Image
                            src={inlineImage.src}
                            alt={inlineImage.alt}
                            width={1200}
                            height={675}
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="h-auto w-full object-cover"
                          />
                        </div>
                      ) : (
                        <p key={`${section.id}-${paragraphIndex}`} className="text-tertiary-content text-base leading-8">
                          {paragraph}
                        </p>
                      )
                    })}
                  </section>
                ) : (
                  <section key={section.id} aria-labelledby={section.id} className="space-y-5">
                    {section.level === 2 ? (
                      <h2 id={section.id} className="text-neutral text-2xl font-bold">
                        {section.title}
                      </h2>
                    ) : (
                      <h3 id={section.id} className="text-neutral text-xl font-semibold">
                        {section.title}
                      </h3>
                    )}
                    {section.paragraphs.map((paragraph, paragraphIndex) => {
                      const inlineImage = parseInlineImage(paragraph)

                      return inlineImage ? (
                        <div key={`${section.id}-${paragraphIndex}`} className="overflow-hidden rounded-2xl">
                          <Image
                            src={inlineImage.src}
                            alt={inlineImage.alt}
                            width={1200}
                            height={675}
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="h-auto w-full object-cover"
                          />
                        </div>
                      ) : (
                        <p key={`${section.id}-${paragraphIndex}`} className="text-tertiary-content text-base leading-8">
                          {paragraph}
                        </p>
                      )
                    })}
                  </section>
                ),
              )}

              <section aria-labelledby="continue-reading-heading" className="bg-secondary border-border rounded-3xl border p-6">
                <h2 id="continue-reading-heading" className="text-neutral text-2xl font-bold">
                  Continue Exploring
                </h2>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <Link href="/blog" className="text-accent underline underline-offset-4">
                    Browse all blog posts
                  </Link>
                  <Link href={`/blog/authors/${authorProfile.slug}`} className="text-accent underline underline-offset-4">
                    More from {authorProfile.name}
                  </Link>
                  {blog.tags?.[0] && (
                    <Link href={`/blog/tags/${tagSlugify(blog.tags[0])}`} className="text-accent underline underline-offset-4">
                      More {blog.tags[0]} articles
                    </Link>
                  )}
                  <Link href="/#services" className="text-accent underline underline-offset-4">
                    Explore our services
                  </Link>
                  <Link href="/#projects" className="text-accent underline underline-offset-4">
                    View project portfolio
                  </Link>
                </div>
              </section>

              <RelatedPosts blogs={relatedBlogs} />
            </div>

            <div className="space-y-6">
              <BlogTableOfContents headings={headings} />
              <div className="bg-secondary border-border rounded-2xl border p-5">
                <h2 className="text-neutral text-lg font-semibold">Article Details</h2>
                <ul className="text-tertiary-content mt-4 space-y-3 text-sm">
                  <li>Published: {formatDate(blog.createdAt)}</li>
                  <li>Updated: {formatDate(blog.updatedAt)}</li>
                  <li>Reading time: {readingTime.label}</li>
                  <li>Word count: {readingTime.words}</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/blog/${blog.slug}/edit`} className="bg-accent text-secondary inline-flex w-fit rounded-lg px-5 py-3 font-medium">
            Edit Blog
          </Link>
          <DeleteBlogButton blogId={blog.slug} />
        </div>
      </div>
    </main>
  )
}

export default BlogDetailPage
