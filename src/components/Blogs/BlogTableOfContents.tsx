interface BlogTableOfContentsProps {
  headings: Array<{
    id: string
    title: string
    level: 2 | 3
  }>
}

const BlogTableOfContents = ({ headings }: BlogTableOfContentsProps) => {
  if (!headings.length) {
    return null
  }

  return (
    <aside className="bg-secondary border-border rounded-2xl border p-5">
      <h2 className="text-neutral text-lg font-semibold">On This Page</h2>
      <nav aria-label="Blog table of contents" className="mt-4">
        <ul className="space-y-3">
          {headings.map((heading) => (
            <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
              <a
                href={`#${heading.id}`}
                className="text-tertiary-content hover:text-accent text-sm transition-colors duration-200">
                {heading.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default BlogTableOfContents
