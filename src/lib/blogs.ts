import { Blog, BlogContentImage } from '@/lib/types'
import { promises as fs } from 'fs'
import path from 'path'

const blogsDirectory = path.join(process.cwd(), 'content', 'blogs')

const ensureBlogsDirectory = async () => {
  await fs.mkdir(blogsDirectory, { recursive: true })
}

const getBlogFilePath = (id: string) => path.join(blogsDirectory, `${id}.json`)

const sortBlogsByDate = (blogs: Blog[]) =>
  blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const authorSlugify = (author: string) => slugify(author)

const buildExcerpt = (content: string) => {
  const normalizedContent = content.replace(/\s+/g, ' ').trim()
  return normalizedContent.length > 160 ? `${normalizedContent.slice(0, 157).trimEnd()}...` : normalizedContent
}

const normalizeTags = (tags?: string[]) =>
  tags?.map((tag) => tag.trim()).filter(Boolean).slice(0, 10) || []

const normalizeContentImages = (images?: BlogContentImage[]) =>
  images
    ?.map((image) => ({
      src: image.src.trim(),
      alt: image.alt.trim(),
    }))
    .filter((image) => image.src && image.alt)
    .slice(0, 6) || []

const normalizeBlog = (blog: Blog): Blog => ({
  ...blog,
  slug: blog.slug || slugify(blog.title || blog.id),
  excerpt: blog.excerpt?.trim() || buildExcerpt(blog.content),
  tags: normalizeTags(blog.tags),
  coverImage: blog.coverImage?.trim() || '',
  coverImageAlt: blog.coverImageAlt?.trim() || `${blog.title} cover image`,
  contentImages: normalizeContentImages(blog.contentImages),
})

const createUniqueSlug = async (title: string, existingBlogs?: Blog[], excludedId?: string) => {
  const blogs = existingBlogs || (await getAllBlogs())
  const baseSlug = slugify(title) || 'blog-post'
  const usedSlugs = new Set(blogs.filter((blog) => blog.id !== excludedId).map((blog) => blog.slug))

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug
  }

  let counter = 2
  while (usedSlugs.has(`${baseSlug}-${counter}`)) {
    counter += 1
  }

  return `${baseSlug}-${counter}`
}

export const getAllBlogs = async (): Promise<Blog[]> => {
  await ensureBlogsDirectory()
  const fileNames = await fs.readdir(blogsDirectory)

  const blogs = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map(async (fileName) => {
        const filePath = path.join(blogsDirectory, fileName)
        const fileContents = await fs.readFile(filePath, 'utf8')
        return normalizeBlog(JSON.parse(fileContents) as Blog)
      }),
  )

  return sortBlogsByDate(blogs)
}

export const getBlogById = async (id: string): Promise<Blog | null> => {
  try {
    await ensureBlogsDirectory()
    const fileContents = await fs.readFile(getBlogFilePath(id), 'utf8')
    return normalizeBlog(JSON.parse(fileContents) as Blog)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }

    throw error
  }
}

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const blogs = await getAllBlogs()
  return blogs.find((blog) => blog.slug === slug) || null
}

export const getBlogByIdentifier = async (identifier: string): Promise<Blog | null> => {
  const byId = await getBlogById(identifier)

  if (byId) {
    return byId
  }

  return getBlogBySlug(identifier)
}

export const getBlogsByAuthorSlug = async (authorSlug: string): Promise<Blog[]> => {
  const blogs = await getAllBlogs()
  return blogs.filter((blog) => authorSlugify(blog.author) === authorSlug)
}

export const tagSlugify = (tag: string) => slugify(tag)

export const getBlogsByTagSlug = async (tagSlug: string): Promise<Blog[]> => {
  const blogs = await getAllBlogs()
  return blogs.filter((blog) => blog.tags?.some((tag) => tagSlugify(tag) === tagSlug))
}

export const getAllAuthorSlugs = async () => {
  const blogs = await getAllBlogs()
  return Array.from(new Set(blogs.map((blog) => authorSlugify(blog.author))))
}

export const getAllTagSlugs = async () => {
  const blogs = await getAllBlogs()
  return Array.from(new Set(blogs.flatMap((blog) => blog.tags?.map((tag) => tagSlugify(tag)) || [])))
}

export const getRelatedBlogs = async (currentBlog: Blog, limit = 3) => {
  const blogs = await getAllBlogs()

  return blogs
    .filter((blog) => blog.id !== currentBlog.id)
    .map((blog) => {
      const sharedTags = (blog.tags || []).filter((tag) => currentBlog.tags?.includes(tag)).length
      const sameAuthor = blog.author === currentBlog.author ? 1 : 0
      return {
        blog,
        score: sharedTags * 2 + sameAuthor,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.blog.createdAt).getTime() - new Date(a.blog.createdAt).getTime())
    .slice(0, limit)
    .map((item) => item.blog)
}

export const createBlog = async (
  input: Pick<Blog, 'title' | 'content' | 'author'> &
    Partial<Pick<Blog, 'excerpt' | 'tags' | 'coverImage' | 'coverImageAlt' | 'contentImages'>>,
): Promise<Blog> => {
  await ensureBlogsDirectory()
  const existingBlogs = await getAllBlogs()

  const timestamp = new Date().toISOString()
  const blog: Blog = {
    id: crypto.randomUUID(),
    slug: await createUniqueSlug(input.title, existingBlogs),
    title: input.title,
    content: input.content,
    author: input.author,
    excerpt: input.excerpt?.trim() || buildExcerpt(input.content),
    tags: normalizeTags(input.tags),
    coverImage: input.coverImage?.trim() || '',
    coverImageAlt: input.coverImageAlt?.trim() || `${input.title} cover image`,
    contentImages: normalizeContentImages(input.contentImages),
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  await fs.writeFile(getBlogFilePath(blog.id), JSON.stringify(blog, null, 2), 'utf8')

  return blog
}

export const updateBlog = async (
  id: string,
  input: Partial<Pick<Blog, 'title' | 'content' | 'author' | 'excerpt' | 'tags' | 'coverImage' | 'coverImageAlt' | 'contentImages'>>,
): Promise<Blog | null> => {
  const existingBlog = await getBlogByIdentifier(id)

  if (!existingBlog) {
    return null
  }

  const allBlogs = await getAllBlogs()
  const nextTitle = input.title ?? existingBlog.title

  const updatedBlog: Blog = normalizeBlog({
    ...existingBlog,
    ...input,
    slug: nextTitle !== existingBlog.title ? await createUniqueSlug(nextTitle, allBlogs, existingBlog.id) : existingBlog.slug,
    excerpt:
      input.excerpt !== undefined
        ? input.excerpt.trim()
        : input.content
          ? buildExcerpt(input.content)
          : existingBlog.excerpt,
    tags: input.tags !== undefined ? normalizeTags(input.tags) : existingBlog.tags,
    coverImage: input.coverImage !== undefined ? input.coverImage.trim() : existingBlog.coverImage,
    coverImageAlt:
      input.coverImageAlt !== undefined
        ? input.coverImageAlt.trim()
        : input.title !== undefined
          ? `${input.title} cover image`
          : existingBlog.coverImageAlt,
    contentImages: input.contentImages !== undefined ? normalizeContentImages(input.contentImages) : existingBlog.contentImages,
    updatedAt: new Date().toISOString(),
  })

  await fs.writeFile(getBlogFilePath(existingBlog.id), JSON.stringify(updatedBlog, null, 2), 'utf8')

  return updatedBlog
}

export const deleteBlog = async (id: string): Promise<boolean> => {
  try {
    const existingBlog = await getBlogByIdentifier(id)

    if (!existingBlog) {
      return false
    }

    await fs.unlink(getBlogFilePath(existingBlog.id))
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false
    }

    throw error
  }
}
