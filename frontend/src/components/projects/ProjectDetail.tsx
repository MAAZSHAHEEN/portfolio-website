import { ExternalLink } from 'lucide-react'

import { GitHubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import type { Project } from '@/types'

interface ProjectDetailProps {
  project: Project
  /** 1-based position in the project list, when known. */
  position?: number
  total?: number
}

export function ProjectDetail({ project, position, total }: ProjectDetailProps) {
  const sections = [
    { id: 'problem', label: 'The problem', body: project.problem },
    { id: 'architecture', label: 'Architecture', body: project.architecture },
    { id: 'learned', label: 'What I learned', body: project.whatILearned },
  ]

  return (
    <article className="detail">
      <header className="detail-header">
        <p className="eyebrow">
          {project.status} · Case study
          {position && total
            ? ` / ${String(position).padStart(2, '0')} of ${String(total).padStart(2, '0')}`
            : ''}
        </p>
        <h1 className="detail-title">{project.name}</h1>
        <p className="detail-lede">{project.description}</p>
        <div className="detail-actions">
          {project.githubUrl ? (
            <Button
              size="lg"
              render={<a href={project.githubUrl} target="_blank" rel="noreferrer" />}
            >
              <GitHubIcon className="size-4" />
              View code
            </Button>
          ) : null}
          {project.liveUrl ? (
            <Button
              size="lg"
              variant="outline"
              render={<a href={project.liveUrl} target="_blank" rel="noreferrer" />}
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              {project.liveLabel ?? 'Live'}
            </Button>
          ) : null}
          {project.links.map((link) => (
            <Button
              key={link.url}
              size="lg"
              variant="ghost"
              render={<a href={link.url} target="_blank" rel="noreferrer" />}
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              {link.label}
            </Button>
          ))}
        </div>
      </header>

      {project.image ? (
        <figure className="detail-media">
          <img
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            decoding="async"
            fetchPriority="high"
          />
        </figure>
      ) : null}

      <div className="detail-body">
        <aside className="detail-aside" aria-label="Project facts">
          {project.highlights.length ? (
            <>
              <p className="project-label">Highlights</p>
              <ul className="detail-highlights">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          <p className="project-label">Stack</p>
          <ul className="tech-list" aria-label="Technologies">
            {project.stack.map((tech) => (
              <li className="tech-tag" key={tech}>
                {tech}
              </li>
            ))}
          </ul>
        </aside>
        <div className="detail-sections">
          {sections.map((section, index) => (
            <section key={section.id} aria-labelledby={`detail-${section.id}`}>
              <p className="detail-section-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <div>
                <h2 id={`detail-${section.id}`}>{section.label}</h2>
                <p>{section.body}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  )
}
