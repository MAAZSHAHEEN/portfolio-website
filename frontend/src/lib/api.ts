import type { Profile, Project, SkillGroup } from '@/types'

// In dev, VITE_API_URL is unset and requests go through the Vite proxy
// (/api -> http://localhost:8000). In production it should be the deployed
// backend's configured origin.
const API_BASE = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, detail: string) {
    super(`API error ${status}: ${detail}`)
    this.name = 'ApiError'
    this.status = status
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/api${path}`, {
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
}
