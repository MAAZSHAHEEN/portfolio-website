import type { ContactPayload, ContactResponse, Profile, Project, SkillGroup } from '@/types'

// In dev, VITE_API_URL is unset and requests go through the Vite proxy
// (/api -> http://localhost:8000). In production it should be the deployed
// backend's origin, e.g. https://api.maazshaheen.dev
const API_BASE = import.meta.env.VITE_API_URL ?? ''

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText)
    throw new Error(`API error ${response.status}: ${detail}`)
  }

  return response.json() as Promise<T>
}

export const api = {
  getProfile: () => apiFetch<Profile>('/profile'),
  getProjects: () => apiFetch<Project[]>('/projects'),
  getProject: (slug: string) => apiFetch<Project>(`/projects/${slug}`),
  getSkills: () => apiFetch<SkillGroup[]>('/skills'),
  submitContact: (payload: ContactPayload) =>
    apiFetch<ContactResponse>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
