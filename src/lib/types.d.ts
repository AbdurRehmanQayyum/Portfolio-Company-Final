export interface Project {
  title: string
  shortDescription: string
  priority: number
  cover: string
  livePreview?: string
  githubLink?: string
  visitors?: string
  earned?: string
  githubStars?: string
  ratings?: string
  numberOfSales?: string
  type: string
  siteAge?: string
}

export interface Blog {
  id: string
  slug: string
  title: string
  content: string
  author: string
  excerpt?: string
  tags?: string[]
  coverImage?: string
  coverImageAlt?: string
  contentImages?: BlogContentImage[]
  createdAt: string
  updatedAt: string
}

export interface BlogContentImage {
  src: string
  alt: string
}

export interface Heading {
  id: string
  title: string
  items: Heading[]
}

export interface Testimonial {
  name: string
  title?: string
  feedback: string
  image: string
  stars: number
  createdAt: string
}
