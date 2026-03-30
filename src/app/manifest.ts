import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.shortDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#011627',
    theme_color: '#18f2e5',
    categories: ['business', 'technology'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon2.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon1.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
