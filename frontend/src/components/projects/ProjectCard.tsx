import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

import { GitHubIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import type { Project } from '@/types'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-brand/40">
      <CardHeader>
        <Link
          to={`/projects/${project.slug}`}
          className="focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-sm font-display text-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none"
        >
          {project.name}
          <ArrowUpRight
            className="size-4 text-brand-link opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Link>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 bg-transparent">
        <Button
          variant="outline"
          size="sm"
          render={<a href={project.githubUrl} target="_blank" rel="noreferrer" />}
        >
          <GitHubIcon className="size-3.5" />
          Code
        </Button>
        {project.liveUrl ? (
          <Button
            variant="outline"
            size="sm"
            render={<a href={project.liveUrl} target="_blank" rel="noreferrer" />}
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            Live
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          render={<Link to={`/projects/${project.slug}`} />}
          className="ml-auto"
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  )
}
