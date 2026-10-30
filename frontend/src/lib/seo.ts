import type { Profile, Project, SiteData } from '@/types'

/** Pure route metadata shared by the build-time prerenderer and the runtime updater. */
export interface RouteMeta {
  title: string
  description: string
  canonical: string
  robots: string
  ogType: 'website' | 'article' | 'profile'
  image: string
  imageAlt: string
  imageType: string
  imageWidth: number
  imageHeight: number
  jsonLd: Record<string, unknown>[]
}

export const SOCIAL_IMAGE_ALT =
  'Maaz Shaheen — Python Backend Engineer and FastAPI Developer, on a dark charcoal card with a warm amber lamp motif.'

function personLd(profile: Profile, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${origin}/#person`,
    name: profile.name,
    url: `${origin}/`,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Lahore', addressCountry: 'PK' },
    knowsAbout: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'REST APIs', 'LLM integration'],
    sameAs: [profile.github, profile.linkedin],
    alumniOf: profile.education.map((item) => ({
      '@type': 'CollegeOrUniversity',
      name: item.institution,
    })),
    hasCredential: profile.education.map((item) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: `${item.degree}, ${item.institution}, ${item.startYear}–${item.endYear}`,
      recognizedBy: { '@type': 'CollegeOrUniversity', name: item.institution },
    })),
  }
}

export function homeMeta(site: SiteData, origin: string): RouteMeta {
  const { profile } = site
  return {
    title: `${profile.name} | Python Backend Engineer & FastAPI Developer, Lahore`,
    description: `${profile.name}, Python backend engineer in Lahore, Pakistan, building FastAPI and PostgreSQL services. ${profile.availability}. Case studies: ${site.projects.map((p) => p.name).join(', ')}.`,
    canonical: `${origin}/`,
    robots: 'index, follow',
    ogType: 'profile',
    image: `${origin}/og-image.png`,
    imageAlt: SOCIAL_IMAGE_ALT,
    imageType: 'image/png',
    imageWidth: 1200,
    imageHeight: 630,
    jsonLd: [
      personLd(profile, origin),
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        name: `${profile.name} Portfolio`,
        url: `${origin}/`,
        author: { '@id': `${origin}/#person` },
      },
    ],
  }
}

export function projectMeta(site: SiteData, project: Project, origin: string): RouteMeta {
  const url = `${origin}/projects/${project.slug}`
  return {
    title: `${project.name} — Case Study | ${site.profile.name}`,
    description: project.description,
    canonical: url,
    robots: 'index, follow',
    ogType: 'article',
    // Social cards keep the 1200x630 PNG: every network renders it, unlike WebP.
    image: `${origin}/og-image.png`,
    imageAlt: SOCIAL_IMAGE_ALT,
    imageType: 'image/png',
    imageWidth: 1200,
    imageHeight: 630,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.name,
        headline: `${project.name} — Case Study`,
        description: project.description,
        url,
        keywords: project.stack.join(', '),
        creativeWorkStatus: project.status,
        author: { '@type': 'Person', '@id': `${origin}/#person`, name: site.profile.name },
        ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
        ...(project.image ? { image: `${origin}${project.image.src}` } : {}),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${origin}/#projects` },
          { '@type': 'ListItem', position: 3, name: project.name, item: url },
        ],
      },
    ],
  }
}

export function notFoundMeta(site: SiteData, origin: string): RouteMeta {
  return {
    title: `Page Not Found | ${site.profile.name}`,
    description:
      'The requested page could not be found. Return to the portfolio homepage to explore projects and contact details.',
    canonical: `${origin}/`,
    robots: 'noindex, follow',
    ogType: 'website',
    image: `${origin}/og-image.png`,
    imageAlt: SOCIAL_IMAGE_ALT,
    imageType: 'image/png',
    imageWidth: 1200,
    imageHeight: 630,
    jsonLd: [],
  }
}

export function metaForPath(site: SiteData, pathname: string, origin: string): RouteMeta {
  if (pathname === '/' || pathname === '') return homeMeta(site, origin)
  const match = /^\/projects\/([a-z0-9-]+)\/?$/.exec(pathname)
  const project = match ? site.projects.find((item) => item.slug === match[1]) : undefined
  return project ? projectMeta(site, project, origin) : notFoundMeta(site, origin)
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The <head> tags owned by route metadata, as an HTML string for the prerenderer. */
export function renderHeadTags(meta: RouteMeta, siteName: string): string {
  const tags = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="robots" content="${meta.robots}" />`,
    `<link rel="canonical" href="${meta.canonical}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:site_name" content="${escapeAttr(siteName)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${meta.canonical}" />`,
    `<meta property="og:image" content="${meta.image}" />`,
    `<meta property="og:image:type" content="${meta.imageType}" />`,
    `<meta property="og:image:width" content="${meta.imageWidth}" />`,
    `<meta property="og:image:height" content="${meta.imageHeight}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(meta.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${meta.image}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(meta.imageAlt)}" />`,
    ...meta.jsonLd.map(
      (block) =>
        `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`,
    ),
  ]
  return tags.join('\n    ')
}
