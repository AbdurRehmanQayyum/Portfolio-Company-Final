import { slugify } from '@/lib/blogs'
import { BlogContentImage } from '@/lib/types'

export interface BlogHeading {
  id: string
  title: string
  level: 2 | 3
}

export interface BlogFaq {
  question: string
  answer: string
}

export interface BlogContentSection {
  id: string
  title: string
  level: 2 | 3
  paragraphs: string[]
}

const DEFAULT_SECTION_ID = 'article-overview'
const AUTO_INLINE_IMAGE_WORD_TARGET = 320

const normalizeLines = (content: string) =>
  content
    .split(/\r?\n/)
    .map((line) => line.trim())

export const extractHeadingsFromContent = (content: string): BlogHeading[] =>
  normalizeLines(content)
    .filter((line) => line.startsWith('## ') || line.startsWith('### '))
    .map((line) => ({
      id: slugify(line.replace(/^##+\s+/, '')),
      title: line.replace(/^##+\s+/, ''),
      level: line.startsWith('### ') ? 3 : 2,
    }))

export const parseBlogContent = (content: string) => {
  const lines = normalizeLines(content)
  const sections: BlogContentSection[] = []
  const hierarchyWarnings: string[] = []

  // Keep the article title as the page H1 and start parsed article sections from H2/H3.
  let currentSection: BlogContentSection = {
    id: DEFAULT_SECTION_ID,
    title: 'Overview',
    level: 2,
    paragraphs: [],
  }

  let previousHeadingLevel: 2 | 3 = 2

  for (const line of lines) {
    if (!line) {
      continue
    }

    if (line.startsWith('## ') || line.startsWith('### ')) {
      const level = line.startsWith('### ') ? 3 : 2
      const title = line.replace(/^##+\s+/, '')

      if (level === 3 && previousHeadingLevel === 2 && !sections.length && !currentSection.paragraphs.length) {
        hierarchyWarnings.push('The article starts with an H3-level section. Prefer starting with an H2.')
      }

      if (currentSection.paragraphs.length || currentSection.id !== DEFAULT_SECTION_ID) {
        sections.push(currentSection)
      }

      currentSection = {
        id: slugify(title),
        title,
        level,
        paragraphs: [],
      }
      previousHeadingLevel = level
      continue
    }

    currentSection.paragraphs.push(line)
  }

  if (currentSection.paragraphs.length || currentSection.id !== DEFAULT_SECTION_ID) {
    sections.push(currentSection)
  }

  const headings = sections
    .filter((section) => section.id !== DEFAULT_SECTION_ID)
    .map((section) => ({
      id: section.id,
      title: section.title,
      level: section.level,
    }))

  return {
    headings,
    sections,
    hierarchyWarnings,
  }
}

export const parseInlineImage = (value: string) => {
  const match = value.match(/^!\[(.+)\]\((https?:\/\/[^\s)]+)\)$/)

  if (!match) {
    return null
  }

  return {
    alt: match[1].trim(),
    src: match[2].trim(),
  }
}

const countWords = (value: string) => value.split(/\s+/).filter(Boolean).length

const toInlineImageMarkdown = (image: BlogContentImage) => `![${image.alt}](${image.src})`

const injectAutomaticInlineImages = (sections: BlogContentSection[], contentImages: BlogContentImage[]) => {
  if (!contentImages.length) {
    return sections
  }

  let imageIndex = 0
  let wordsSinceLastImage = 0

  // Auto-place configured content images after substantial reading intervals
  // so long-form posts keep visual breaks without editors hand-inserting markdown.
  return sections.map((section) => {
    const paragraphs: string[] = []

    section.paragraphs.forEach((paragraph) => {
      const manualInlineImage = parseInlineImage(paragraph)

      paragraphs.push(paragraph)

      if (manualInlineImage) {
        wordsSinceLastImage = 0
        return
      }

      wordsSinceLastImage += countWords(paragraph)

      if (imageIndex < contentImages.length && wordsSinceLastImage >= AUTO_INLINE_IMAGE_WORD_TARGET) {
        paragraphs.push(toInlineImageMarkdown(contentImages[imageIndex]))
        imageIndex += 1
        wordsSinceLastImage = 0
      }
    })

    return {
      ...section,
      paragraphs,
    }
  })
}

export const parseBlogArticle = (content: string, contentImages: BlogContentImage[] = []) => {
  const parsedContent = parseBlogContent(content)

  return {
    ...parsedContent,
    sections: injectAutomaticInlineImages(parsedContent.sections, contentImages),
  }
}

export const extractFaqsFromSections = (sections: BlogContentSection[]): BlogFaq[] => {
  const faqs: BlogFaq[] = []

  sections.forEach((section, index) => {
    const isFaqContainer = section.level === 2 && /faq|frequently asked questions/i.test(section.title)

    if (!isFaqContainer) {
      return
    }

    for (let i = index + 1; i < sections.length; i += 1) {
      const nextSection = sections[i]

      if (nextSection.level === 2) {
        break
      }

      if (nextSection.level === 3 && nextSection.paragraphs.length > 0) {
        faqs.push({
          question: nextSection.title,
          answer: nextSection.paragraphs.join(' '),
        })
      }
    }
  })

  return faqs
}

export const getReadingTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 180))

  return {
    words,
    minutes,
    label: `${minutes} min read`,
  }
}
