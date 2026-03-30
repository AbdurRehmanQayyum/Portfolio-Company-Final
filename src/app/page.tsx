import type { Metadata } from 'next'
import { skillList } from '@/appData'
import JsonLd from '@/components/SEO/JsonLd'
import ContactSection from '@/components/Contact/ContactSection'
import Hero from '@/components/Hero/Hero'
import ProjectSection from '@/components/Projects/ProjectSection'
import ServiceSection from '@/components/Services/ServiceSection'
import Skills from '@/components/Skills/Skills'
import TestimonialSection from '@/components/Testimonials/TestimonialSection'
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata, defaultOgImage, siteConfig, truncateText } from '@/lib/seo'
import { getAllProjects, getAllTestimonials } from '@/services'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Custom Software Development, Web Apps, and IT Consulting',
  description:
    'Explore Best Universal Solutions for custom software development, enterprise web apps, UI/UX design, QA, and strategic IT consulting for growing companies.',
  path: '/',
  keywords: ['portfolio website development company', 'enterprise web app portfolio', 'software agency case studies'],
  images: [
    {
      url: defaultOgImage,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} portfolio homepage`,
    },
  ],
})

export default async function Home() {
  const projects = await getAllProjects()
  const testimonials = await getAllTestimonials()

  const homepageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${absoluteUrl('/')}#website`,
        url: absoluteUrl('/'),
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: 'en',
        publisher: {
          '@id': `${absoluteUrl('/')}#organization`,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${absoluteUrl('/')}#webpage`,
        url: absoluteUrl('/'),
        name: siteConfig.title,
        isPartOf: {
          '@id': `${absoluteUrl('/')}#website`,
        },
        about: {
          '@id': `${absoluteUrl('/')}#organization`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: defaultOgImage,
        },
        description: siteConfig.description,
        breadcrumb: {
          '@id': `${absoluteUrl('/')}#breadcrumb`,
        },
      },
      {
        '@type': 'Service',
        serviceType: 'Software Development and IT Consulting',
        provider: {
          '@id': `${absoluteUrl('/')}#organization`,
        },
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Software services',
          itemListElement: [
            'Custom Software Development',
            'Web Application Development',
            'Scalable Backend Systems',
            'Enterprise Digital Strategy',
            'Quality Assurance & Testing',
            'UI/UX Design & Consulting',
          ].map((name) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name,
            },
          })),
        },
      },
      {
        '@type': 'ItemList',
        name: 'Featured projects',
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: project.title,
            description: truncateText(project.shortDescription, 160),
            image: project.cover,
            url: project.livePreview || absoluteUrl('/#projects'),
          },
        })),
      },
      {
        ...buildBreadcrumbJsonLd([{ name: 'Home', path: '/' }]),
        '@id': `${absoluteUrl('/')}#breadcrumb`,
      },
      ...testimonials.map((testimonial) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: testimonial.name,
        },
        reviewBody: testimonial.feedback,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: testimonial.stars,
          bestRating: 5,
        },
        itemReviewed: {
          '@type': 'Organization',
          '@id': `${absoluteUrl('/')}#organization`,
          name: siteConfig.name,
        },
      })),
    ],
  }

  return (
    <main id="main-content">
      <JsonLd data={homepageJsonLd} />
      <Hero />
      <Skills skills={skillList} />
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem]">
        <ProjectSection projects={projects} />
        <ServiceSection />
        <TestimonialSection testimonials={testimonials} />
        <ContactSection />
      </div>
    </main>
  )
}
