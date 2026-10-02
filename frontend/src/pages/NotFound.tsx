import { Link } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <Container className="max-w-3xl py-20">
      <p className="text-sm font-semibold text-brand-link">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted-foreground">The page you requested does not exist.</p>
      <Button className="mt-8" render={<Link to="/" />}>
        Back to home
      </Button>
    </Container>
  )
}
