import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { metaForPath, type RouteMeta } from '@/lib/seo'
import { useProfile, useProjects, useSkills } from '@/lib/queries'

const ORIGIN =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') ||
  (typeof window === 'undefined' ? '' : window.location.origin)

function setAttr(selector: string, attr: string, value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value)
}

function apply(meta: RouteMeta) {
  document.title = meta.title
  setAttr('meta[name="description"]', 'content', meta.description)
  setAttr('meta[name="robots"]', 'content', meta.robots)
  setAttr('link[rel="canonical"]', 'href', meta.canonical)
  setAttr('meta[property="og:type"]', 'content', meta.ogType)
  setAttr('meta[property="og:title"]', 'content', meta.title)
  setAttr('meta[property="og:description"]', 'content', meta.description)
  setAttr('meta[property="og:url"]', 'content', meta.canonical)
  setAttr('meta[property="og:image"]', 'content', meta.image)
  setAttr('meta[property="og:image:alt"]', 'content', meta.imageAlt)
  setAttr('meta[property="og:image:type"]', 'content', meta.imageType)
  setAttr('meta[property="og:image:width"]', 'content', String(meta.imageWidth))
  setAttr('meta[property="og:image:height"]', 'content', String(meta.imageHeight))
  setAttr('meta[name="twitter:title"]', 'content', meta.title)
  setAttr('meta[name="twitter:description"]', 'content', meta.description)
  setAttr('meta[name="twitter:image"]', 'content', meta.image)
  setAttr('meta[name="twitter:image:alt"]', 'content', meta.imageAlt)
}

/** Keeps head metadata in sync on client-side navigation; the prerendered HTML already
 * carries the correct tags for the first load. */
export function RouteMetadata() {
  const { pathname } = useLocation()
  const { data: profile } = useProfile()
  const { data: projects } = useProjects()
  const { data: skills } = useSkills()

  useEffect(() => {
    if (!profile || !projects || !skills) return
    apply(metaForPath({ profile, projects, skills }, pathname, ORIGIN))
  }, [pathname, profile, projects, skills])

  return null
}
