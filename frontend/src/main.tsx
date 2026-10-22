import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import { seedQueryClient } from './lib/initialData'
import { createQueryClient } from './lib/queryClient'
import './index.css'

const queryClient = createQueryClient()
const initialData = window.__PORTFOLIO_DATA__
const normalizedPath = window.location.pathname.replace(/(.)\/$/, '$1')
// Hydrate only when the prerendered route is the one being shown (the 404 page is
// served for many URLs, so those render fresh instead of hydrating mismatched markup).
const canHydrate = Boolean(initialData) && window.__PORTFOLIO_ROUTE__ === normalizedPath
if (initialData) seedQueryClient(queryClient, initialData)

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)

// Prerendered pages hydrate; anything else (e.g. the Vite dev server) renders fresh.
if (canHydrate) {
  hydrateRoot(container, app, {
    onRecoverableError(error) {
      if (import.meta.env.DEV) console.warn('Hydration recovered:', error)
    },
  })
} else {
  container.replaceChildren()
  createRoot(container).render(app)
}
