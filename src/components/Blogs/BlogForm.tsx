'use client'

import Button from '@/components/UI/Button'
import Input from '@/components/UI/Input'
import Textarea from '@/components/UI/Textarea'
import { Blog } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

interface BlogFormProps {
  mode: 'create' | 'edit'
  initialValues?: Pick<Blog, 'title' | 'content' | 'author' | 'id' | 'excerpt' | 'tags' | 'coverImage' | 'coverImageAlt' | 'contentImages'>
}

const BlogForm = ({ mode, initialValues }: BlogFormProps) => {
  const router = useRouter()
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [author, setAuthor] = useState(initialValues?.author ?? '')
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? '')
  const [tags, setTags] = useState(initialValues?.tags?.join(', ') ?? '')
  const [coverImage, setCoverImage] = useState(initialValues?.coverImage ?? '')
  const [coverImageAlt, setCoverImageAlt] = useState(initialValues?.coverImageAlt ?? '')
  const [contentImages, setContentImages] = useState(
    initialValues?.contentImages?.map((image) => `${image.src} | ${image.alt}`).join('\n') ?? '',
  )
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const response = await fetch(mode === 'create' ? '/api/blogs' : `/api/blogs/${initialValues?.id}`, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author, excerpt, tags, coverImage, coverImageAlt, contentImages, content }),
      })

      const data = (await response.json()) as { error?: string; message?: string; blog?: Blog }

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong while saving the blog.')
      }

      setSuccess(data.message || 'Blog saved successfully.')

      if (mode === 'create' && data.blog) {
        router.push(`/blog/${data.blog.slug}?message=${encodeURIComponent('Blog created successfully.')}`)
        router.refresh()
        return
      }

      if (mode === 'edit' && data.blog?.slug) {
        router.push(`/blog/${data.blog.slug}?message=${encodeURIComponent('Blog updated successfully.')}`)
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong while saving the blog.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-secondary border-border rounded-3xl border p-6 md:p-8">
      {error && <p className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      {success && (
        <p className="mb-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </p>
      )}

      <Input
        id="blog-title"
        label="Title"
        placeholder="Write a clear blog title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <Input
        id="blog-author"
        label="Author"
        placeholder="Author name"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
        required
      />

      <Textarea
        id="blog-excerpt"
        label="Excerpt"
        placeholder="Short summary for SEO and previews"
        rows={3}
        value={excerpt}
        onChange={(event) => setExcerpt(event.target.value)}
      />

      <Input
        id="blog-tags"
        label="Tags"
        placeholder="nextjs, seo, software development"
        value={tags}
        onChange={(event) => setTags(event.target.value)}
      />

      <Input
        id="blog-cover-image"
        label="Cover Image URL"
        placeholder="https://images.unsplash.com/..."
        value={coverImage}
        onChange={(event) => setCoverImage(event.target.value)}
      />

      <Input
        id="blog-cover-image-alt"
        label="Cover Image Alt Text"
        placeholder="Descriptive alt text for SEO and accessibility"
        value={coverImageAlt}
        onChange={(event) => setCoverImageAlt(event.target.value)}
      />

      <Textarea
        id="blog-content-images"
        label="Inline Content Images"
        placeholder="https://images.unsplash.com/... | Descriptive alt text&#10;https://images.unsplash.com/... | Another descriptive alt text"
        rows={4}
        value={contentImages}
        onChange={(event) => setContentImages(event.target.value)}
      />

      <Textarea
        id="blog-content"
        label="Content"
        placeholder="Write the full blog content"
        rows={10}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
      />

      <Button text={isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Blog' : 'Update Blog'} disabled={isSubmitting} />
    </form>
  )
}

export default BlogForm
