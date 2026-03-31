import type { Metadata } from 'next'
import './globals.css'

import JsonLd from '@/components/SEO/JsonLd'
import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'
import BackToTopButton from '@/components/UI/BackToTopButton'
import {
  absoluteUrl,
  bingVerification,
  defaultOgImage,
  defaultTwitterImage,
  googleSiteVerification,
  organizationJsonLd,
  personJsonLd,
  siteConfig,
  siteUrl,
} from '@/lib/seo'
import { Fira_Code } from 'next/font/google'

const firaCode = Fira_Code({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: siteConfig.category,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: absoluteUrl('/'),
    types: {
      'application/rss+xml': absoluteUrl('/rss.xml'),
    },
  },
  authors: [{ name: siteConfig.name, url: absoluteUrl('/') }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  referrer: 'origin-when-cross-origin',
  verification: {
    google: googleSiteVerification,
    other: bingVerification
      ? {
          'msvalidate.01': bingVerification,
        }
      : undefined,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon1.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon2.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/icon1.png', sizes: '512x512', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} website preview`,
      },
    ],
  },
  twitter: {
    title: siteConfig.title,
    description: siteConfig.description,
    card: 'summary_large_image',
    creator: '@best_univ_sol',
    site: '@best_univ_sol',
    images: [defaultTwitterImage],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${firaCode.className}`} suppressHydrationWarning>
        <a
          href="#main-content"
          className="bg-accent text-primary sr-only fixed top-4 left-4 z-[100] rounded-md px-4 py-2 focus:not-sr-only">
          Skip to main content
        </a>
        <JsonLd data={[organizationJsonLd, personJsonLd]} />
        <header>
          <Navbar />
        </header>
        {children}
        <BackToTopButton />
        <Footer />
      </body>
    </html>
  )
}
