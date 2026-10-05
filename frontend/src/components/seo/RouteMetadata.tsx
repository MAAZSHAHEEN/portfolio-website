import { useEffect, useRef } from 'react'
import { useLocation, useMatch } from 'react-router-dom'

import { ApiError } from '@/lib/api'
import { useProfile, useProject } from '@/lib/queries'

/** Runtime snippets supplement, rather than replace, static social metadata. */
export function RouteMetadata() {
  const { pathname } = useLocation()
  const match = useMatch('/projects/:slug')
  const { data: profile } = useProfile()
  const { data: project, error } = useProject(match?.params.slug)
  const defaults = useRef<{ title: string; description: string; robots: string } | null>(null)

  useEffect(() => {
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!description || !robots) return
    defaults.current ??= {
      title: document.title,
      description: description.content,
      robots: robots.content,
    }
    const home = defaults.current
    const missing =
      (!match && pathname !== '/') || (error instanceof ApiError && error.status === 404)
    const suffix = profile ? ` | ${profile.name}` : ''
    document.title = missing
      ? `Page Not Found${suffix}`
      : match && project && profile
        ? `${project.name} | ${profile.name}`
        : home.title
    description.content = missing
      ? 'The requested page could not be found. Return to the portfolio homepage to explore projects and contact details.'
      : match && project
        ? project.description
        : home.description
    robots.content = missing ? 'noindex, follow' : home.robots

    return () => {
      document.title = home.title
      description.content = home.description
      robots.content = home.robots
    }
  }, [pathname, match, project, error, profile])

  return null
}
