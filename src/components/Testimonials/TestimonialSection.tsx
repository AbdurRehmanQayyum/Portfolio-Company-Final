'use client'

import { Testimonial } from '@/lib/types'
import { useRef, useState } from 'react'
import SectionHeading from '../SectionHeading/SectionHeading'
import TestimonialCard from './TestimonialCard'

interface TestimonialSectionProps {
  testimonials: Testimonial[]
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ testimonials }) => {
  const [activeCard, setActiveCard] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToCard = (index: number) => {
    if (!testimonials.length) {
      return
    }

    const nextIndex = (index + testimonials.length) % testimonials.length
    const targetCard = containerRef.current?.children.item(nextIndex)

    setActiveCard(nextIndex)
    targetCard?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    })
  }

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading">
      <SectionHeading
        id="testimonials-heading"
        title="// Testimonials"
        subtitle="Don't just take our word for it - see what actual users of our service have to say about their experience."
      />

      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="button"
          aria-label="Show previous testimonial"
          onClick={() => scrollToCard(activeCard - 1)}
          className="border-border text-neutral hover:bg-accent/10 inline-flex size-11 items-center justify-center rounded-full border transition-colors duration-200">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8">
            <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Show next testimonial"
          onClick={() => scrollToCard(activeCard + 1)}
          className="border-border text-neutral hover:bg-accent/10 inline-flex size-11 items-center justify-center rounded-full border transition-colors duration-200">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8">
            <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div ref={containerRef} className="hide-scrollbar my-8 flex gap-8 overflow-x-auto scroll-smooth">
        {testimonials.map((testimonial, idx) => (
          <TestimonialCard
            key={idx}
            testimonial={testimonial}
            handleActiveCard={() => {
              setActiveCard(idx)
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-1 sm:hidden">
        {testimonials.map((_, idx) => (
          <div
            key={idx}
            className={`${idx === activeCard ? 'bg-accent size-[12px]' : 'size-[10px] bg-white/50'} rounded-full`}
          />
        ))}
      </div>
    </section>
  )
}

export default TestimonialSection
