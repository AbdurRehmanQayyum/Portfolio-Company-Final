'use client'

import { useEffect, useState } from 'react'

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 240)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="bg-accent text-primary hover:bg-accent/85 fixed right-6 bottom-20 z-50 inline-flex size-12 items-center justify-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-200 md:right-11 md:bottom-28">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2">
        <path d="M6 15L12 9L18 15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

export default BackToTopButton
