// Build-time prerender: renders / , /projects/<slug> and the 404 page to static HTML
// from backend/app/data/site.json (the single source of truth), so crawlers and
// no-JS clients get full content. The client bundle then hydrates the same markup.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const distDir = path.resolve(root, '../backend/dist')
const ssrDir = path.resolve(root, '.ssr')
// Must match vite.config.ts: VITE_SITE_URL, else the canonical custom domain.
const siteUrl = (process.env.VITE_SITE_URL?.trim() || 'https://maazshaheen.tech').replace(/\/$/, '')
if (!/^https:\/\/[^/]+$/.test(siteUrl)) throw new Error('VITE_SITE_URL must be an HTTPS origin.')

const site = JSON.parse(readFileSync(path.resolve(root, '../backend/app/data/site.json'), 'utf8'))
const { render, metaForPath, renderHeadTags } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)
const template = readFileSync(path.join(distDir, 'index.html'), 'utf8')
const metaRegion = /<!--route-meta:start-->[\s\S]*?<!--route-meta:end-->/
if (!metaRegion.test(template) || !template.includes('<!--app-html-->')) {
  throw new Error('index.html is missing prerender markers.')
}

// Preload the two hero text weights so the LCP text paints without a font swap.
const preloads = readdirSync(path.join(distDir, 'assets'))
  .filter((file) => /^inter-latin-(400|600)-normal-.*\.woff2$/.test(file))
  .map(
    (file) =>
      `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`,
  )
  .join('\n    ')

const safeJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

function page(route, metaPath) {
  const meta = metaForPath(site, metaPath, siteUrl)
  const appHtml = render(route, site)
  const data = `<script>window.__PORTFOLIO_DATA__=${safeJson(site)};window.__PORTFOLIO_ROUTE__=${safeJson(route)}</script>`
  return template
    .replace(
      metaRegion,
      `${renderHeadTags(meta, `${site.profile.name} Portfolio`)}\n    ${preloads}`,
    )
    .replace('<!--app-html-->', appHtml)
    .replace('<!--app-data-->', data)
}

const outputs = [
  ['/', '/', 'index.html'],
  ...site.projects.map((project) => [
    `/projects/${project.slug}`,
    `/projects/${project.slug}`,
    `projects/${project.slug}/index.html`,
  ]),
  ['/404', '/404', '404.html'],
]

for (const [route, metaPath, file] of outputs) {
  const target = path.join(distDir, file)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, page(route, metaPath))
  console.log(`prerendered ${route} -> ${path.relative(root, target)}`)
}
rmSync(ssrDir, { recursive: true, force: true })
