import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Sections are mounted even while their API content is loading. */
export function RouteScroll() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash, key])

  return null
}
