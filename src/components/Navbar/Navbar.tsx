'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ThemeMenu from '../Theme/ThemeMenu'
import { BurgerIcon, CloseIcon } from '../../utils/icons'
import Logo from './Logo'

const navItems = [
  {
    label: '_home',
    href: '/',
  },
  {
    label: '_projects',
    href: '/#projects',
  },
  {
    label: '_services',
    href: '/#services',
  },
  {
    label: '_blogs',
    href: '/blog',
  },
  {
    label: '_contact',
    href: '/#contact',
  },
]

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsVisible(!isVisible)
  }

  return (
    <nav
      aria-label="Primary navigation"
      className={`border-border sticky top-0 z-50 h-16 border-b transition-all duration-300 ${
        isScrolled ? 'bg-primary/70 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md' : 'bg-primary'
      }`}>
      <div className="mx-auto flex h-full w-dvw max-w-[1200px] items-center justify-between px-4 py-1">
        {isVisible ? (
          <div className="text-primary-content md:hidden">_menu</div>
        ) : (
          <Link href="/">
            <div className="animate-fade-up text-primary-content relative flex items-center gap-3 transition-all duration-300 md:static">
              <Logo />
              <span className="text-primary-content">best_universal_solutions</span>
            </div>
          </Link>
        )}

        <div className="md:hidden">
          <button
            type="button"
            aria-label={isVisible ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isVisible}
            aria-controls="primary-navigation"
            onClick={toggleMenu}>
            {isVisible ? (
              <CloseIcon className="text-primary-content" />
            ) : (
              <BurgerIcon className="text-primary-content" />
            )}
          </button>
        </div>

        <ul
          id="primary-navigation"
          className={`${isVisible ? 'flex' : 'hidden'} animate-fade-in absolute top-16 left-0 z-10 h-dvh w-dvw flex-col md:static md:top-0 md:flex md:h-full md:w-[72%] md:flex-row lg:w-[70%] ${
            isScrolled ? 'bg-primary/70 backdrop-blur-md' : 'bg-primary'
          }`}>
          {navItems.map(({ label, href }) => (
            <li
              key={href}
              onClick={() => setIsVisible(false)}
              className="border-border flex items-center border-b px-4 text-2xl md:border-y-0 md:border-e md:text-base md:first:border-s lg:px-8">
              <Link
                href={href}
                className={`text-primary-content hover:text-neutral w-full py-7 transition-all duration-150 md:py-0 ${pathname === href ? 'text-neutral cursor-text' : ''}`}>
                {label}
              </Link>
            </li>
          ))}
          <li className="border-border flex items-center border-b px-4 md:ml-auto md:border-y-0 md:border-s md:border-e-0 md:ps-6 md:pe-0">
            <ThemeMenu variant="navbar" />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
