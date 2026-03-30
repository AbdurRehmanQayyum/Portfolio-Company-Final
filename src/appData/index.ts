// Data for portfolio
import {
  ExpressjsIcon,
  JavaScriptIcon,
  NestjsIcon,
  NextjsIcon,
  NodejsIcon,
  ReactIcon,
  SocketIcon,
  TailwindCSS,
  TypescriptIcon,
} from '../utils/icons'

// Project Data
export const projects = [
  {
    priority: 1,
    title: 'Enterprise Solution X',
    shortDescription:
      'A comprehensive ERP system designed for large-scale enterprises to streamline operations and enhance productivity. Built with scalability and security as core priorities.',
    cover:
      'https://images.unsplash.com/photo-1585282263861-f55e341878f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    livePreview: 'https://example.com/enterprise-x',
    type: 'Corporate Project 🏢',
    siteAge: 'Recent Launch',
  },
  {
    priority: 2,
    title: 'E-Commerce Platform Pro',
    shortDescription:
      'A high-performance e-commerce platform built for a global retail brand. Features advanced search, real-time inventory management, and seamless payment integration.',
    cover:
      'https://plus.unsplash.com/premium_photo-1663040328859-48bddaa9dfeb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    livePreview: 'https://example.com/ecommerce-pro',
    visitors: '50K+ Monthly Visitors',
    earned: 'High Conversion Rate',
  },
  {
    priority: 3,
    title: 'HealthTech Hub',
    shortDescription:
      'A secure and HIPAA-compliant platform for healthcare providers to manage patient data and facilitate telemedicine appointments across various specialties.',
    cover:
      'https://plus.unsplash.com/premium_photo-1661700152890-931fb04588e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    type: 'Healthcare Innovation 🏥',
    livePreview: 'https://example.com/healthtech',
    githubLink: '',
    githubStars: '',
    numberOfSales: '',
  },
  {
    priority: 4,
    title: 'FinTech Analytics',
    shortDescription:
      'A sophisticated data analytics dashboard for financial institutions to visualize market trends and perform risk assessments in real-time.',
    cover:
      'https://images.unsplash.com/photo-1527334919515-b8dee906a34b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    type: 'FinTech 🔥',
    livePreview: 'https://example.com/fintech-analytics',
    siteAge: 'Stable Version',
    visitors: 'Expert Users',
    githubLink: '',
    earned: '',
  },
]

// Service Data
export const serviceData = [
  {
    icon: JavaScriptIcon,
    title: 'Custom Software Development',
    shortDescription: 'Tailored software solutions designed to meet your specific business needs and goals.',
  },
  {
    icon: ReactIcon,
    title: 'Web Application Development',
    shortDescription: 'Modern, responsive, and high-performance web applications built with the latest technologies.',
  },
  {
    icon: NodejsIcon,
    title: 'Scalable Backend Systems',
    shortDescription: 'Robust and secure server-side architectures to support your growing business demands.',
  },
  {
    icon: NextjsIcon,
    title: 'Enterprise Digital Strategy',
    shortDescription: 'Expert consulting to help you navigate the digital landscape and optimize your operations.',
  },
  {
    icon: TypescriptIcon,
    title: 'Quality Assurance & Testing',
    shortDescription: 'Comprehensive testing to ensure your software is reliable, secure, and bug-free.',
  },
  {
    icon: TailwindCSS,
    title: 'UI/UX Design & Consulting',
    shortDescription: 'User-centric design solutions that enhance engagement and provide seamless experiences.',
  },
]

// Skill List
export const skillList = [
  {
    name: 'JavaScript',
    icon: JavaScriptIcon,
  },
  {
    name: 'TypeScript',
    icon: TypescriptIcon,
  },
  {
    name: 'React.js',
    icon: ReactIcon,
  },
  {
    name: 'Next.js',
    icon: NextjsIcon,
  },
  {
    name: 'Node.js',
    icon: NodejsIcon,
  },
  {
    name: 'Express.js',
    icon: ExpressjsIcon,
  },
  {
    name: 'Nest.js',
    icon: NestjsIcon,
  },
  {
    name: 'Socket.io',
    icon: SocketIcon,
  },
]

export const footerLinks = [
  { title: 'About', href: '#' },
  { title: 'Projects', href: '#projects' },
  { title: 'Testimonials', href: '#testimonials' },
  {
    title: 'Blogs',
    href: '/blog',
  },
  {
    title: 'Services',
    href: '#services',
  },
  {
    title: 'Contact',
    href: '#contact',
  },
]

export const themes = [
  {
    name: 'Light',
    colors: ['#fff', '#0d1a3b', '#dbe3f7', '#0d1a3b', '#5565e8'],
  },
  {
    name: 'Dark',
    colors: ['#011627', '#607b96', '#0d1a3b', '#5565e8', '#18f2e5'],
  },
  {
    name: 'Aqua',
    colors: ['#b2e4e8', '#004a55', '#00c1d4', '#004a55', '#ff6f61'],
  },
  {
    name: 'Retro',
    colors: ['#fff3e0', '#6d4c41', '#ffcc80', '#5d4037', '#ffab40'],
  },
]

export const languages = ['En', 'Es', 'Fr', 'De', 'Ru']
