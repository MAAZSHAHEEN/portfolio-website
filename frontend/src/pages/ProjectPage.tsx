import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { ProjectDetail } from '@/components/projects/ProjectDetail'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api'
import { useProject, useProjects } from '@/lib/queries'

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading, error, refetch, isFetching } = useProject(slug)
  const { data: projects } = useProjects()
  const notFound = error instanceof ApiError && error.status === 404

  const index = projects?.findIndex((item) => item.slug === slug) ?? -1
  const next = projects && index >= 0 ? projects[(index + 1) % projects.length] : undefined
  const showNext = Boolean(next && projects && projects.length > 1 && next.slug !== slug)

  return (
    <Container className="detail-shell">
      <nav aria-label="Breadcrumb" className="detail-breadcrumb">
        <Link to="/#projects" className="text-link text-brand-link">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All projects
        </Link>
      </nav>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ) : notFound ? (
          <div role="alert" className="state-panel">
            <p className="eyebrow">404 / Project</p>
            <h1 className="section-title">Project not found</h1>
            <p className="mt-3 text-muted-foreground">
              This project does not exist or may have been renamed.
            </p>
            <Button className="mt-6" variant="outline" render={<Link to="/#projects" />}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to projects
            </Button>
          </div>
        ) : error || !project ? (
          <div role="alert" className="state-panel">
            <p className="eyebrow">Error / Network</p>
            <p className="text-destructive">
              Could not load this project. Please check your connection and try again.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              {isFetching ? 'Retrying...' : 'Try again'}
            </Button>
          </div>
        ) : (
          <>
            <ProjectDetail
              project={project}
              position={index >= 0 ? index + 1 : undefined}
              total={projects?.length}
            />
            {showNext && next ? (
              <nav aria-label="More projects" className="detail-next">
                <Link to={`/projects/${next.slug}`} className="detail-next-link">
                  <span className="project-label">Next project</span>
                  <span className="detail-next-title">
                    {next.name}
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </span>
                </Link>
              </nav>
            ) : null}
          </>
        )}
      </div>
    </Container>
  )
}
