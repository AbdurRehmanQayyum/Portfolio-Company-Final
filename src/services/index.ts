import { Project, Testimonial } from '@/lib/types'
import { promises as fs } from 'fs'
import path from 'path'

// Function to read project file
const readProjectFile = async (filePath: string): Promise<Project> => {
  const projectData = await fs.readFile(filePath, 'utf8')
  return JSON.parse(projectData)
}

// Function to get all projects
const getAllProjects = async (): Promise<Project[]> => {
  try {
    const projectsPath = path.join(process.cwd(), '/content/projects')
    const projectsName = await fs.readdir(projectsPath)

    const projects = await Promise.all(
      projectsName.map(async (projectName) => {
        const filePath = path.join(projectsPath, projectName)
        const projectDetails = await readProjectFile(filePath)
        return projectDetails
      }),
    )

    // Sort projects by priority
    projects.sort((a, b) => a.priority - b.priority)

    return projects
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
    return []
  }
}

const getAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const testimonialsPath = path.join(process.cwd(), '/content/testimonials')
    const testimonialsName = await fs.readdir(testimonialsPath)

    const testimonials = await Promise.all(
      testimonialsName.map(async (testimonialName, index) => {
        const filePath = path.join(testimonialsPath, testimonialName)
        const testimonialDetails = await fs.readFile(filePath, 'utf8')
        const testimonial = JSON.parse(testimonialDetails)

        return {
          name: testimonial.name,
          title: testimonial.title || testimonial.position || '',
          feedback: testimonial.feedback || testimonial.comment || '',
          image: testimonial.image || `https://i.pravatar.cc/160?img=${index + 11}`,
          stars: testimonial.stars || 5,
          createdAt: testimonial.createdAt || new Date(2025, 0, index + 1).toISOString(),
        } satisfies Testimonial
      }),
    )

    // Sort testimonials by date
    testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return testimonials
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
    return []
  }
}

export { getAllProjects, getAllTestimonials }
