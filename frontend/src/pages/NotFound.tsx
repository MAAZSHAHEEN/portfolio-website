import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <Container className="max-w-3xl py-20 sm:py-28">
      <div className="state-panel">
        <p className="eyebrow">404 / Not found</p>
        <h1 className="detail-title">Page not found</h1>
        <p className="mt-4 text-muted-foreground">The page you requested does not exist.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button render={<Link to="/" />}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Button>
          <Button variant="outline" render={<Link to="/#projects" />}>
            View projects
          </Button>
        </div>
      </div>
    </Container>
  )
}
