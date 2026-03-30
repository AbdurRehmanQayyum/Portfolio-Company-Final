import { AuthorProfile } from '@/lib/author-types'
import { authorSlugify } from '@/lib/blogs'

const authorProfiles: Record<string, Omit<AuthorProfile, 'slug'>> = {
  [authorSlugify('Best Universal Solutions')]: {
    name: 'Best Universal Solutions',
    role: 'Editorial Team',
    bio: 'The Best Universal Solutions editorial team publishes company updates, software engineering insights, digital product thinking, and technical articles.',
    sameAs: [
      'https://github.com/best-universal-solutions',
      'https://linkedin.com/company/best-universal-solutions',
      'https://x.com/best_univ_sol',
      'https://facebook.com/bestuniversalsolutions',
    ],
  },
  [authorSlugify('Abdur Rehman')]: {
    name: 'Abdur Rehman',
    role: 'Founder & Lead Consultant',
    bio: 'Abdur Rehman writes about software delivery, technical SEO, scalable web architecture, and digital product strategy at Best Universal Solutions.',
    sameAs: ['https://linkedin.com/company/best-universal-solutions', 'https://x.com/best_univ_sol'],
  },
}

export const getAuthorProfile = (authorName: string): AuthorProfile => {
  const slug = authorSlugify(authorName)
  const profile = authorProfiles[slug]

  return {
    slug,
    name: authorName,
    role: profile?.role || 'Author',
    bio: profile?.bio || `${authorName} writes articles published on the ${'Best Universal Solutions'} blog.`,
    sameAs: profile?.sameAs || [],
  }
}
