import { deleteBlog, getBlogByIdentifier, updateBlog } from '@/lib/blogs'
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
  const payload: {
    title?: string
    content?: string
    author?: string
    excerpt?: string
    tags?: string[]
    coverImage?: string
    coverImageAlt?: string
    contentImages?: BlogContentImage[]
  } = {}

  if ('title' in body) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return { error: 'Title must be a non-empty string.' }
    }

    payload.title = body.title.trim()
  }

  if ('content' in body) {
    if (typeof body.content !== 'string' || !body.content.trim()) {
      return { error: 'Content must be a non-empty string.' }
    }

    payload.content = body.content.trim()
  }

  if ('author' in body) {
    if (typeof body.author !== 'string' || !body.author.trim()) {
      return { error: 'Author must be a non-empty string.' }
    }

    payload.author = body.author.trim()
  }

  if ('excerpt' in body) {
    if (typeof body.excerpt !== 'string') {
      return { error: 'Excerpt must be a string.' }
    }

    payload.excerpt = body.excerpt.trim()
  }

  if ('tags' in body) {
    if (typeof body.tags !== 'string') {
      return { error: 'Tags must be a comma-separated string.' }
    }

    payload.tags = body.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  if ('coverImage' in body) {
    if (typeof body.coverImage !== 'string') {
      return { error: 'Cover image must be a string URL.' }
    }

    payload.coverImage = body.coverImage.trim()
  }

  if ('coverImageAlt' in body) {
    if (typeof body.coverImageAlt !== 'string') {
      return { error: 'Cover image alt text must be a string.' }
    }

    payload.coverImageAlt = body.coverImageAlt.trim()
  }

  if ('contentImages' in body) {
    const contentImages = parseContentImages(body.contentImages)

    if (contentImages === null) {
      return { error: 'Inline content images must use the format: image URL | descriptive alt text.' }
    }

    payload.contentImages = contentImages
  }

  if (payload.coverImage && !('coverImageAlt' in body)) {
    return { error: 'Cover image alt text is required when a cover image is provided.' }
  }

  if (Object.keys(payload).length === 0) {
    return { error: 'At least one field is required to update a blog.' }
  }

  return payload
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const blog = await getBlogByIdentifier(id)

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found.' }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch the blog.' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = (await request.json()) as Record<string, unknown>
    const validatedPayload = validateBlogPayload(body)

    if ('error' in validatedPayload) {
      return NextResponse.json({ error: validatedPayload.error }, { status: 400 })
    }

    const blog = await updateBlog(id, validatedPayload)

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found.' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Blog updated successfully.', blog })
  } catch {
    return NextResponse.json({ error: 'Failed to update the blog.' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await deleteBlog(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Blog not found.' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Blog deleted successfully.' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete the blog.' }, { status: 500 })
  }
}
