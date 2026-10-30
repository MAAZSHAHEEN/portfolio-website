import { GitHubIcon } from '@/components/icons'
import type { AdditionalProject } from '@/types'

/** Compact card for smaller work: no case-study page, code link only. */
export function AdditionalProjectCard({ project }: { project: AdditionalProject }) {
  const headingId = `extra-${project.id}-title`
  return (
    <article id={project.id} className="extra-card" aria-labelledby={headingId}>
      <div className="extra-head">
        <h3 id={headingId} className="extra-title">
          {project.name}
        </h3>
        <span className="project-meta-tag">{project.label}</span>
      </div>
      <p className="extra-summary">{project.description}</p>
      {project.note ? <p className="extra-note">{project.note}</p> : null}
      <ul className="tech-list" aria-label={`Technologies used in ${project.name}`}>
        {project.stack.map((tech) => (
          <li className="tech-tag" key={tech}>
            {tech}
          </li>
        ))}
      </ul>
      {project.githubUrl ? (
        <a
          className="text-link text-brand-link"
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`View code for ${project.name} on GitHub`}
        >
          <GitHubIcon className="size-4" />
          Code
        </a>
      ) : null}
    </article>
  )
}
