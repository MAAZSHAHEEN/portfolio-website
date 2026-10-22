export interface Education {
  degree: string
  institution: string
  startYear: number
  endYear: number
}

export interface LookingFor {
  roles: string[]
  fields: string[]
  locations: string[]
}

export interface Profile {
  name: string
  title: string
  tagline: string
  bio: string
  location: string
  availability: string
  email: string
  github: string
  linkedin: string
  resumeUrl: string
  lookingFor: LookingFor
  education: Education[]
}

export interface SkillGroup {
  group: string
  items: string[]
}

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface Project {
  slug: string
  name: string
  status: string
  description: string
  stack: string[]
  githubUrl: string | null
  liveUrl: string | null
  liveLabel: string | null
  links: ProjectLink[]
  image: ProjectImage | null
  highlights: string[]
  problem: string
  architecture: string
  whatILearned: string
}

export interface SiteData {
  profile: Profile
  skills: SkillGroup[]
  projects: Project[]
}
