import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { RouteScroll } from '@/components/layout/RouteScroll'
import { RouteMetadata } from '@/components/seo/RouteMetadata'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'

// Case studies load as their own chunk. The prerenderer waits for it, and during
// hydration React keeps the server HTML until the chunk arrives.
const ProjectPage = lazy(() => import('@/pages/ProjectPage'))

function App() {
  return (
    <div className="bg-grain flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <CustomCursor />
      <ScrollProgress />
      <RouteScroll />
      <RouteMetadata />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Suspense fallback={<div className="detail-shell min-h-[60vh]" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
