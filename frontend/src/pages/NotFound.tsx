import { ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

/** A 404 styled like the JSON error a FastAPI backend would return. */
export function ApiErrorPanel({ title, detail }: { title: string; detail: string }) {
  const { pathname } = useLocation()
  const body = JSON.stringify({ detail, path: pathname, status: 404 }, null, 2)
  return (
    <div className="state-panel">
      <p className="eyebrow">
        <span className="status-code" data-ok="false">
          404
        </span>{' '}
        Not Found
      </p>
      <h1 className="detail-title">{title}</h1>
      <pre
        className="code-block not-found-code"
        tabIndex={0}
        role="region"
        aria-label="Error response"
      >
        <code>
          <span className="code-comment">HTTP/1.1 404 Not Found{'\n'}</span>
          <span className="code-comment">content-type: application/json{'\n\n'}</span>
          {body}
        </code>
      </pre>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button render={<Link to="/" />}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </Button>
        <Button variant="outline" render={<Link to="/#projects" />}>
          View case studies
        </Button>
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <Container className="max-w-3xl py-20 sm:py-28">
      <ApiErrorPanel title="Page not found" detail="This page doesn't exist" />
    </Container>
  )
}
