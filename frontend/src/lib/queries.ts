import { useQuery } from '@tanstack/react-query'

import { api, ApiError } from '@/lib/api'

export function useProfile() {
  return useQuery({ queryKey: ['profile'], queryFn: api.getProfile })
}

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: api.getProjects })
}

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: () => api.getProject(slug!),
    enabled: Boolean(slug),
    // A missing project is final; only retry network/server errors.
    retry: (count, error) => !(error instanceof ApiError && error.status === 404) && count < 1,
  })
}

export function useSkills() {
  return useQuery({ queryKey: ['skills'], queryFn: api.getSkills })
}

export function useAdditionalProjects() {
  return useQuery({ queryKey: ['additional-projects'], queryFn: api.getAdditionalProjects })
}

/** Only entries the owner marked visible; an empty list hides the section. */
export function useExperience() {
  return useQuery({
    queryKey: ['experience'],
    queryFn: api.getExperience,
    select: (items) => items.filter((item) => item.visible !== false),
  })
}
