import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

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
  })
}

export function useSkills() {
  return useQuery({ queryKey: ['skills'], queryFn: api.getSkills })
}
