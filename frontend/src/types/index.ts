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

export interface Project {
  slug: string
  name: string
  description: string
  stack: string[]
  githubUrl: string
  liveUrl: string | null
  problem: string
  architecture: string
  whatILearned: string
}

export interface ContactPayload {
  name: string
  email: string
  message: string
  /** Honeypot field - must stay empty for real submissions. */
  company?: string
}

export interface ContactResponse {
  success: boolean
  detail: string
}
