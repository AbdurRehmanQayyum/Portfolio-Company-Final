import { Blog } from '@/lib/types'
import Link from 'next/link'

interface RelatedPostsProps {
  blogs: Blog[]
}

const RelatedPosts = ({ blogs }: RelatedPostsProps) => {
  if (!blogs.length) {
    return null
  }

  return (
    <section aria-labelledby="related-posts-heading" className="mt-10">
      <h2 id="related-posts-heading" className="text-neutral text-2xl font-bold">
        Related Posts
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {blogs.map((blog) => (
          <article key={blog.id} className="bg-secondary border-border rounded-2xl border p-5">
            <p className="text-tertiary-content text-sm">{blog.author}</p>
            <h3 className="text-neutral mt-2 text-lg font-semibold">
              <Link href={`/blog/${blog.slug}`} className="hover:text-accent transition-colors duration-200">
                {blog.title}
              </Link>
            </h3>
            <p className="text-tertiary-content mt-3 text-sm leading-7">{blog.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
