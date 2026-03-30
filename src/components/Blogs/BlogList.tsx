import { Blog } from '@/lib/types'
import { authorSlugify, tagSlugify } from '@/lib/blogs'
import Image from 'next/image'
import Link from 'next/link'

interface BlogListProps {
  blogs: Blog[]
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(date))

const BlogList = ({ blogs }: BlogListProps) => {
  if (blogs.length === 0) {
    return (
      <div className="bg-secondary border-border rounded-3xl border p-8 text-center">
        <h2 className="text-neutral text-2xl font-semibold">No blogs yet</h2>
        <p className="text-tertiary-content mt-3">Create the first blog post to start publishing updates and insights.</p>
        <Link
          href="/blog/new"
          className="bg-accent text-secondary mt-6 inline-flex rounded-lg px-5 py-3 text-sm font-medium">
          Add New Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {blogs.map((blog) => (
        <article key={blog.id} className="bg-secondary border-border rounded-3xl border p-6 md:p-8">
          {blog.coverImage && (
            <div className="mb-5 overflow-hidden rounded-2xl">
              <Image
                src={blog.coverImage}
                alt={blog.coverImageAlt || `${blog.title} cover image`}
                width={1200}
                height={630}
                className="h-[220px] w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-tertiary-content text-sm">
                By{' '}
                <Link
                  href={`/blog/authors/${authorSlugify(blog.author)}`}
                  className="text-accent underline underline-offset-4">
                  {blog.author}
                </Link>{' '}
                | {formatDate(blog.createdAt)}
              </p>
              <h2 className="text-neutral mt-2 text-2xl font-semibold">{blog.title}</h2>
            </div>
            <Link
              href={`/blog/${blog.slug}`}
              className="text-accent inline-flex text-sm font-medium underline underline-offset-4">
              Read full blog
            </Link>
          </div>
          <p className="text-tertiary-content mt-4 line-clamp-3 whitespace-pre-line">{blog.excerpt || blog.content}</p>
          {!!blog.tags?.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tagSlugify(tag)}`}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition-colors duration-200 hover:border-accent hover:text-accent">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

export default BlogList
