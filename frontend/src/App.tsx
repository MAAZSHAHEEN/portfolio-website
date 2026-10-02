import { Route, Routes } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { RouteScroll } from '@/components/layout/RouteScroll'
import { NotFound } from '@/pages/NotFound'
import { Home } from '@/pages/Home'
import { ProjectPage } from '@/pages/ProjectPage'

function App() {
  return (
    <div className="bg-grain flex min-h-screen flex-col">
      <RouteScroll />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
