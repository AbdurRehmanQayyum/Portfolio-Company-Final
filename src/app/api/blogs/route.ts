import { createBlog, getAllBlogs } from '@/lib/blogs'
import { BlogContentImage } from '@/lib/types'
import { NextResponse } from 'next/server'

const parseContentImages = (value: unknown): BlogContentImage[] | null => {
  if (typeof value !== 'string') {
    return []
  }

  const images = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [src, ...altParts] = line.split('|')
      return {
        src: src?.trim() || '',
        alt: altParts.join('|').trim(),
      }
    })

  if (images.some((image) => !image.src || !image.alt)) {
    return null
  }

  return images
}

const validateBlogPayload = (body: Record<string, unknown>) => {
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const content = typeof body.content === 'string' ? body.content.trim() : ''
  const author = typeof body.author === 'string' ? body.author.trim() : ''
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : ''
  const coverImage = typeof body.coverImage === 'string' ? body.coverImage.trim() : ''
  const coverImageAlt = typeof body.coverImageAlt === 'string' ? body.coverImageAlt.trim() : ''
  const contentImages = parseContentImages(body.contentImages)
  const tags =
    typeof body.tags === 'string'
      ? body.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

  if (!title || !content || !author) {
    return {
      error: 'Title, content, and author are required.',
    }
  }

  if (coverImage && !coverImageAlt) {
    return {
      error: 'Cover image alt text is required when a cover image is provided.',
    }
  }

  if (contentImages === null) {
    return {
      error: 'Inline content images must use the format: image URL | descriptive alt text.',
    }
  }

  return {
    title,
    content,
    author,
    excerpt,
    coverImage,
    coverImageAlt,
    contentImages,
    tags,
  }
}

export async function GET() {
  try {
    const blogs = await getAllBlogs()
    return NextResponse.json(blogs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blogs.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const validatedPayload = validateBlogPayload(body)

    if ('error' in validatedPayload) {
      return NextResponse.json({ error: validatedPayload.error }, { status: 400 })
    }

    const blog = await createBlog(validatedPayload)

    return NextResponse.json(
      {
        message: 'Blog created successfully.',
        blog,
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Failed to create blog.' }, { status: 500 })
  }
}
