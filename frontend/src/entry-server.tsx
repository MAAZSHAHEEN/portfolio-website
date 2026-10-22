import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import App from './App'
import { seedQueryClient } from './lib/initialData'
import { createQueryClient } from './lib/queryClient'
import type { SiteData } from './types'

export { metaForPath, renderHeadTags } from './lib/seo'

/** Renders one route to HTML for the build-time prerenderer. */
export function render(url: string, data: SiteData): string {
  const queryClient = createQueryClient()
  seedQueryClient(queryClient, data)
  return renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </StrictMode>,
  )
}
