import Image from 'next/image'

interface ServiceCardTypes {
  icon: string
  title: string
  shortDescription: string
}

const ServiceCard: React.FC<ServiceCardTypes> = ({ title, shortDescription, icon }) => {
  return (
    <div className="bg-secondary border-border hover:border-accent/60 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)] group flex flex-col items-center rounded-[14px] border p-5 transition-all duration-300 hover:-translate-y-1">
      <Image src={icon} alt={title} className="my-1 size-14 transition-transform duration-300 group-hover:scale-110" />
      <h5 className="text-accent mt-2 mb-5 text-center text-base font-semibold transition-transform duration-300 group-hover:-translate-y-0.5">{title}</h5>
      <div className="bg-primary rounded-2xl p-4 transition-colors duration-300 group-hover:bg-white/6">
        <p className="text-primary-content text-center text-sm font-normal">{shortDescription}</p>
      </div>
    </div>
  )
}

export default ServiceCard
