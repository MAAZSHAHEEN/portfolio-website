import { Link, useParams } from 'react-router-dom'

import { useProject } from '@/lib/queries'

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading, isError } = useProject(slug)

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link to="/#projects" className="text-sm text-brand-link hover:underline">
        &larr; Back to projects
      </Link>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading project...</p>
      ) : isError || !project ? (
        <p className="mt-8 text-destructive">Project not found.</p>
      ) : (
        <article className="mt-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight">{project.name}</h1>
          <p className="mt-4 text-muted-foreground">{project.description}</p>
          <p className="mt-8 text-sm text-muted-foreground">
            Full project detail layout (problem, architecture, stack, what I learned) is coming in
            Phase 2.
          </p>
        </article>
      )}
    </div>
  )
}
