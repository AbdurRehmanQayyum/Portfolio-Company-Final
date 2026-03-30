import { ImageResponse } from 'next/og'
import { getBlogByIdentifier } from '@/lib/blogs'
import { siteConfig, truncateText } from '@/lib/seo'

export const runtime = 'nodejs'

export const alt = 'Blog post preview'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const blog = await getBlogByIdentifier(id)

  const title = blog?.title || `${siteConfig.name} Blog`
  const excerpt = blog?.excerpt || truncateText(blog?.content || siteConfig.description, 140)
  const author = blog?.author || siteConfig.name
  const tags = blog?.tags?.slice(0, 3) || []

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #011627 0%, #02263d 55%, #0d1a3b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '999px',
                background: '#18f2e5',
                display: 'flex',
              }}
            />
            <span style={{ fontSize: 28, color: '#b9d3e6' }}>{siteConfig.name}</span>
          </div>
          <span style={{ fontSize: 24, color: '#18f2e5' }}>Blog Post</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h1
            style={{
              fontSize: 68,
              lineHeight: 1.05,
              margin: 0,
              fontWeight: 700,
              display: 'flex',
            }}>
            {truncateText(title, 85)}
          </h1>
          <p
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              margin: 0,
              color: '#c7d8e6',
              display: 'flex',
            }}>
            {truncateText(excerpt, 150)}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: 22, color: '#7fa4bb' }}>Author</span>
            <span style={{ fontSize: 32, fontWeight: 600 }}>{author}</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '45%' }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '999px',
                  padding: '10px 18px',
                  fontSize: 20,
                  color: '#d6e7f3',
                  display: 'flex',
                }}>
                #{tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
