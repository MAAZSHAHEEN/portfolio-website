import path from 'node:path'
import { readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const CANONICAL_ORIGIN = 'https://maazshaheen.tech'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_')
  // Production builds default to the canonical custom domain so a build can never
  // ship canonical/OG/sitemap URLs pointing at a platform subdomain by accident.
  const configuredUrl =
    env.VITE_SITE_URL?.trim() || (command === 'build' ? CANONICAL_ORIGIN : undefined)
  const siteUrl = new URL(configuredUrl || 'http://localhost:5173')
  if (
    siteUrl.pathname !== '/' ||
    siteUrl.search ||
    siteUrl.hash ||
    siteUrl.username ||
    siteUrl.password ||
    (command === 'build' &&
      (siteUrl.protocol !== 'https:' ||
        ['localhost', '127.0.0.1', 'maazshaheen.github.io'].includes(siteUrl.hostname)))
  ) {
    throw new Error(
      'VITE_SITE_URL must be the portfolio HTTPS origin without credentials or a path.',
    )
  }
  const origin = siteUrl.origin
  const site: unknown = JSON.parse(
    readFileSync(path.resolve(import.meta.dirname, '../backend/app/data/site.json'), 'utf8'),
  )
  if (!site || typeof site !== 'object' || !('projects' in site) || !Array.isArray(site.projects)) {
    throw new Error('Invalid portfolio project data for sitemap generation.')
  }
  const routes = [
    '/',
    ...site.projects.map((project: unknown) => {
      if (
        !project ||
        typeof project !== 'object' ||
        !('slug' in project) ||
        typeof project.slug !== 'string' ||
        !/^[a-z0-9-]+$/.test(project.slug)
      ) {
        throw new Error('Invalid project slug for sitemap generation.')
      }
      return `/projects/${project.slug}`
    }),
  ]
  // Exposed to the client and the SSR bundle so runtime metadata uses the same origin.
  process.env.VITE_SITE_URL = origin
  return {
    define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(origin) },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'portfolio-public-metadata',
        transformIndexHtml(html) {
          return html.replaceAll('%PORTFOLIO_SITE_URL%', origin)
        },
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: 'robots.txt',
            source: `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
          })
          this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${origin}${route}</loc></url>`).join('\n')}\n</urlset>\n`,
          })
        },
      },
    ],
    build: {
      outDir: path.resolve(import.meta.dirname, '../backend/dist'),
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  }
})
