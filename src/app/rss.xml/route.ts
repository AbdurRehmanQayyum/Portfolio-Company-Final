import { getAllBlogs } from '@/lib/blogs'
import { absoluteUrl, siteConfig, truncateText } from '@/lib/seo'

export const revalidate = 3600

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export async function GET() {
  const blogs = await getAllBlogs()

  const rssItems = blogs
    .map((blog) => {
      const url = absoluteUrl(`/blog/${blog.slug}`)
      const description = escapeXml(blog.excerpt || truncateText(blog.content, 160))
      const content = escapeXml(blog.content)
      const image = blog.coverImage ? `<media:content url="${escapeXml(blog.coverImage)}" medium="image" />` : ''

      return `
        <item>
          <title>${escapeXml(blog.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>
          <author>${escapeXml(siteConfig.email)} (${escapeXml(blog.author)})</author>
          <description>${description}</description>
          ${image}
          <content:encoded><![CDATA[${content}]]></content:encoded>
        </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(siteConfig.name)} Blog</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${escapeXml('Technical articles, company updates, case studies, and software insights from Best Universal Solutions.')}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
