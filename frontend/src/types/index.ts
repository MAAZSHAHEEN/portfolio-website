export interface Education {
  degree: string
  institution: string
  startYear: number
  endYear: number
}

export interface LookingFor {
  roles: string[]
  locations: string[]
}

export interface Profile {
  name: string
  title: string
  tagline: string
  bio: string
  location: string
  timezone: string
  availability: string
  email: string
  github: string
  linkedin: string
  resumeUrl: string
  resumeUpdated?: string | null
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

export interface DiagramNode {
  label: string
  detail: string
  kind: 'client' | 'service' | 'db' | 'cache'
  connectsTo?: string | null
}

export interface Diagram {
  flow: DiagramNode[]
  aside?: DiagramNode[]
  caption: string
}

export interface DataTable {
  name: string
  columns: string
  note?: string | null
}

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  auth: boolean
  summary: string
}

export interface ApiExample {
  title: string
  request: string
  response: string
  caption?: string | null
}

export interface StatusCode {
  code: number
  meaning: string
  example: string
}

export interface Decision {
  title: string
  body: string
}

export interface Testing {
  summary: string
  items?: string[]
  ciUrl?: string | null
  ciLabel?: string | null
}

export interface Project {
  slug: string
  name: string
  kind: string
  featured?: boolean
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
  users?: string | null
  role?: string | null
  features?: string[]
  architecture: string
  diagram?: Diagram | null
  dataModel?: DataTable[]
  endpoints?: Endpoint[]
  example?: ApiExample | null
  statusCodes?: StatusCode[]
  decisions?: Decision[]
  security?: string[]
  testing?: Testing | null
  deployment?: string[]
  limits?: string[]
  whatILearned: string
}

export interface AdditionalProject {
  id: string
  name: string
  label: string
  description: string
  stack: string[]
  githubUrl: string | null
  note?: string | null
}

export interface Experience {
  role: string
  company: string
  start: string
  end: string
  location?: string | null
  summary?: string | null
  highlights?: string[]
  visible?: boolean
}

export interface SiteData {
  profile: Profile
  skills: SkillGroup[]
  projects: Project[]
  additionalProjects?: AdditionalProject[]
  experience?: Experience[]
}
