import type { AdditionalProject, Experience, Profile, Project, SkillGroup } from '@/types'

// Same-origin in production; Vite proxies these paths during development.

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, detail: string) {
    super(`API error ${status}: ${detail}`)
    this.name = 'ApiError'
    this.status = status
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText)
    throw new ApiError(response.status, detail)
  }

  return response.json() as Promise<T>
}

export const api = {
  getProfile: () => apiFetch<Profile>('/profile'),
  getProjects: () => apiFetch<Project[]>('/projects'),
  getProject: (slug: string) => apiFetch<Project>(`/projects/${slug}`),
  getSkills: () => apiFetch<SkillGroup[]>('/skills'),
  getAdditionalProjects: () => apiFetch<AdditionalProject[]>('/additional-projects'),
  getExperience: () => apiFetch<Experience[]>('/experience'),
}
