import type { QueryClient } from '@tanstack/react-query'

import type { SiteData } from '@/types'

declare global {
  interface Window {
    __PORTFOLIO_DATA__?: SiteData
    __PORTFOLIO_ROUTE__?: string
  }
}

/** Seeds the query cache with site data so the first render needs no API round trip. */
export function seedQueryClient(client: QueryClient, data: SiteData) {
  client.setQueryData(['profile'], data.profile)
  client.setQueryData(['skills'], data.skills)
  client.setQueryData(['projects'], data.projects)
  client.setQueryData(['additional-projects'], data.additionalProjects ?? [])
  client.setQueryData(['experience'], data.experience ?? [])
  for (const project of data.projects) client.setQueryData(['projects', project.slug], project)
}
