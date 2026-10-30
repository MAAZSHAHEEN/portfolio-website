import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'

import App from './App'
import { seedQueryClient } from './lib/initialData'
import { createQueryClient } from './lib/queryClient'
import type { SiteData } from './types'

export { metaForPath, renderHeadTags } from './lib/seo'

/** Renders one route to HTML for the build-time prerenderer. Unlike renderToString,
 * prerender waits for lazy route chunks, so case studies are fully in the HTML. */
export async function render(url: string, data: SiteData): Promise<string> {
  const queryClient = createQueryClient()
  seedQueryClient(queryClient, data)
  const { prelude } = await prerender(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </StrictMode>,
  )
  return new Response(prelude).text()
}
