import { footerLinks, languages } from '@/appData'
import { socials } from '@/appData/personal'
import Link from 'next/link'
import Logo from '../Navbar/Logo'

const Footer = () => {
  return (
    <footer className="bg-secondary relative flex min-h-[560px] flex-col justify-between gap-20 overflow-hidden px-4 py-14 md:p-14">
      <div className="relative z-20 grid grid-cols-1 items-start gap-20 md:grid-cols-2 md:gap-12">
        <div>
          <h2 className="mb-8 flex items-center gap-2">
            <Logo width={30} height={24} />
            <span className="text-neutral text-lg font-medium">Best Universal Solutions</span>
          </h2>
          <p className="text-tertiary-content">
            Best Universal Solutions provides top-tier software development, web design, and IT consulting services for businesses worldwide.
          </p>
          <Link href="/#contact" className="text-neutral mt-4 inline-flex items-center gap-2 text-xs hover:underline">
            Contact our team <span className="bg-neutral inline-block size-[10px] rounded-full" />
          </Link>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-8">
          {footerLinks.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-tertiary-content hover:text-neutral transition-colors duration-300 hover:underline">
              {link.title}.
            </Link>
          ))}
        </nav>
      </div>

      <div className="relative z-20 flex flex-col-reverse gap-20 md:grid md:grid-cols-2 md:gap-12">
        <div className="grid grid-cols-2 gap-4">
          <ul className="flex flex-col gap-4">
            {socials.map((item, index) => (
              <li key={index} className="cursor-pointer bg-transparent">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral transition-color hover:text-neutral/50 h-full w-full duration-300">
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-tertiary-content flex flex-col self-end text-right text-xs md:text-center">
            <span>&copy; 2026 Copyright</span>
            <span>All rights reserved</span>
          </p>
        </div>

        <div className="flex flex-col justify-between gap-[200px] md:flex-row md:gap-8">
          <div className="space-y-10 md:self-end">
            <div className="flex flex-col">
              <h3 className="text-neutral mb-4 text-lg font-medium">Contact Us</h3>
              <a
                href="mailto:contact@bestuniversalsolutions.com"
                className="text-tertiary-content hover:text-neutral text-sm font-light transition-colors duration-300">
                contact@bestuniversalsolutions.com
              </a>
              <a
                href="tel:+1 800 123 4567"
                className="text-tertiary-content hover:text-neutral text-sm font-light transition-colors duration-300">
                +92 328613305
              </a>
            </div>
            <div>
              <h3 className="text-neutral mb-4 text-lg font-medium">Location</h3>
              <address className="text-tertiary-content flex flex-col text-sm font-light">
                <span>123 Tech Avenue</span>
                <span>Hallroad, Lahore, Pakistan</span>
              </address>
            </div>
          </div>

          <div className="md:self-end">
            <p className="text-neutral mb-8 text-sm md:text-right">Languages</p>
            <div className="flex gap-8 md:gap-4 lg:gap-8">
              {languages.map((language, idx) => (
                <span key={language} className={idx === 0 ? 'text-neutral' : 'text-tertiary-content'}>
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral/4 absolute top-1/2 -right-[40%] z-0 h-[120dvw] w-[120dvw] -translate-y-1/2 rounded-full p-14 md:top-0 md:-right-[255px] md:-bottom-[450px] md:size-[1030px] md:-translate-y-0 md:p-20">
        <div className="bg-neutral/4 size-full rounded-full p-14 md:p-20">
          <div className="bg-neutral/5 size-full rounded-full" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
