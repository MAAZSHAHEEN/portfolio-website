import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { ProjectDetail } from '@/components/projects/ProjectDetail'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api'
import { useProject } from '@/lib/queries'

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading, error, refetch, isFetching } = useProject(slug)
  const notFound = error instanceof ApiError && error.status === 404

  return (
    <Container className="max-w-3xl py-20">
      <Link
        to="/#projects"
        className="focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-sm text-sm text-brand-link focus-visible:ring-2 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to projects
      </Link>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ) : notFound ? (
          <p role="alert" className="text-destructive">
            Project not found.
          </p>
        ) : error || !project ? (
          <div role="alert" className="space-y-4">
            <p className="text-destructive">
              Could not load this project. Please check your connection and try again.
            </p>
            <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
              {isFetching ? 'Retrying...' : 'Try again'}
            </Button>
          </div>
        ) : (
          <ProjectDetail project={project} />
        )}
      </div>
    </Container>
  )
}
