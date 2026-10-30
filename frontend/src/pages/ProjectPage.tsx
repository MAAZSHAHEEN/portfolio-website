import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { ApiErrorPanel } from '@/pages/NotFound'
import { CaseStudyFooter } from '@/components/projects/CaseStudyFooter'
import { ProjectDetail } from '@/components/projects/ProjectDetail'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api'
import { useProject, useProjects } from '@/lib/queries'

/** Default export so App can lazy-load case studies out of the home bundle. */
export default function ProjectPage() {
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
          <ApiErrorPanel
            title="Project not found"
            detail="This project doesn't exist or was renamed."
          />
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
            <CaseStudyFooter next={showNext ? next : undefined} />
          </>
        )}
      </div>
    </Container>
  )
}
