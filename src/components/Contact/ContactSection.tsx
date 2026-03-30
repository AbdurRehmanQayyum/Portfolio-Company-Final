import { MsgIcon, PhoneIcon } from '@/utils/icons'
import ContactForm from './ContactForm'

const ContactSection = () => {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-secondary my-8 grid grid-cols-1 gap-16 rounded-4xl p-8 md:my-16 md:grid-cols-2 md:gap-8 lg:gap-12">
      <div className="flex flex-col justify-between gap-8">
        <div>
          <h3 id="contact-heading" className="text-neutral text-3xl font-bold">
            Get In Touch
          </h3>
          <p className="text-accent mt-3 text-2xl font-bold md:text-3xl">Ready for Your Next Project?</p>
          <p className="text-neutral mt-8">
            Partner with Best Universal Solutions for cutting-edge software and IT consulting. Let's build something great together.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-neutral text-lg font-bold">Contact Information</p>
          <a
            href="mailto:contact@bestuniversalsolutions.com"
            className="text-neutral hover:text-accent flex items-center gap-1 font-light transition-colors duration-300">
            <MsgIcon /> contact@bestuniversalsolutions.com
          </a>
          <a
            href="tel:+1 800 123 4567"
            className="text-neutral hover:text-accent flex items-center gap-1 font-light transition-colors duration-300">
            <PhoneIcon /> +1 800 123 4567
          </a>
        </div>
      </div>

      <ContactForm />
    </section>
  )
}

export default ContactSection
