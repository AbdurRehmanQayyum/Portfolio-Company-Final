'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteBlogButtonProps {
  blogId: string
}

const DeleteBlogButton = ({ blogId }: DeleteBlogButtonProps) => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this blog permanently?')

    if (!confirmed) {
      return
    }

    setError('')
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete the blog.')
      }

      router.push('/blog?message=Blog%20deleted%20successfully.')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete the blog.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="cursor-pointer rounded-lg border border-red-400/40 px-4 py-2 text-sm text-red-200 transition-colors duration-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60">
        {isDeleting ? 'Deleting...' : 'Delete Blog'}
      </button>
    </div>
  )
}

export default DeleteBlogButton
