import type { Metadata } from 'next'

const parseSiteUrl = (value?: string) => {
  if (!value) {
    return null
  }

  const normalizedValue = value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`

  try {
    return new URL(normalizedValue)
  } catch {
    return null
  }
}

export const siteUrl =
  parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
  parseSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  parseSiteUrl(process.env.VERCEL_URL) ||
  new URL('http://localhost:3000')

export const siteConfig = {
  name: 'Best Universal Solutions',
  legalName: 'Best Universal Solutions',
  shortName: 'BUS',
  title: 'Best Universal Solutions | Software Development Agency & IT Consulting',
  description:
    'Best Universal Solutions helps companies launch scalable web platforms, custom software, enterprise systems, and digital products with expert engineering, UI/UX design, QA, and IT consulting.',
  shortDescription: 'Software development agency delivering web apps, custom platforms, and IT consulting.',
  locale: 'en_US',
  language: 'en',
  category: 'technology',
  email: 'contact@bestuniversalsolutions.com',
  phone: '+1 800 123 4567',
  location: 'Silicon Valley, CA, USA',
  founder: {
    name: 'Abdur Rehman',
    role: 'Founder & Lead Consultant',
    description:
      'Abdur Rehman leads Best Universal Solutions with a focus on scalable software delivery, technical SEO, and high-performance digital platforms.',
  },
  keywords: [
    'software development agency',
    'custom software development',
    'web application development',
    'enterprise software solutions',
    'IT consulting company',
    'Next.js development agency',
    'React development services',
    'backend development services',
    'UI UX design services',
    'quality assurance testing',
  ] as string[],
  sameAs: [
    'https://github.com/best-universal-solutions',
    'https://linkedin.com/company/best-universal-solutions',
    'https://codepen.io/best-universal-solutions',
    'https://x.com/best_univ_sol',
    'https://instagram.com/best-universal-solutions',
    'https://facebook.com/bestuniversalsolutions',
  ],
} as const

export const absoluteUrl = (path = '/') => new URL(path, siteUrl).toString()

export const defaultOgImage = absoluteUrl('/opengraph-image.png')
export const defaultTwitterImage = absoluteUrl('/twitter-image.png')
export const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION
export const bingVerification = process.env.NEXT_PUBLIC_BING_VERIFICATION || process.env.BING_VERIFICATION

export const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`
}

export const buildPageTitle = (title: string) => `${title} | ${siteConfig.name}`

export const buildMetadata = ({
  title,
  description,
  path,
  keywords = [],
  images,
  type = 'website',
  noIndex = false,
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>
  type?: 'website' | 'article' | 'profile'
  noIndex?: boolean
}): Metadata => ({
  // Centralize the metadata shape so portfolio, blog, author, and tag pages stay consistent.
  title,
  description,
  keywords: [...siteConfig.keywords, ...keywords],
  alternates: {
    canonical: absoluteUrl(path),
  },
  robots: {
    index: !noIndex,
    follow: !noIndex,
    googleBot: {
      index: !noIndex,
      follow: !noIndex,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl(path),
    type,
    images: images || [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${title} preview`,
      },
    ],
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    images: (images || [{ url: defaultTwitterImage }]).map((image) => image.url),
  },
})

export const buildBreadcrumbJsonLd = (items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${absoluteUrl('/')}#organization`,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/icon1.png'),
  image: defaultOgImage,
  description: siteConfig.description,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  sameAs: siteConfig.sameAs,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: siteConfig.email,
      telephone: siteConfig.phone,
      areaServed: ['US', 'PK', 'GB', 'CA', 'AU'],
      availableLanguage: ['English'],
    },
  ],
}

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${absoluteUrl('/')}#person`,
  name: siteConfig.founder.name,
  description: siteConfig.founder.description,
  jobTitle: siteConfig.founder.role,
  worksFor: {
    '@id': `${absoluteUrl('/')}#organization`,
  },
}
