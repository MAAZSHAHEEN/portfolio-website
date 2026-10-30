import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'

import { GitHubIcon } from '@/components/icons'
import { ArchitectureDiagram } from '@/components/projects/ArchitectureDiagram'
import { Button } from '@/components/ui/button'
import type { Project } from '@/types'

interface ProjectDetailProps {
  project: Project
  /** 1-based position in the project list, when known. */
  position?: number
  total?: number
}

interface Section {
  id: string
  label: string
  body: ReactNode
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="detail-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

/** Builds only the sections a project has data for, in a fixed case-study order. */
function sectionsFor(project: Project): Section[] {
  const s: (Section | false | null | undefined | 0 | '')[] = [
    {
      id: 'problem',
      label: project.users ? 'Problem & users' : 'The problem',
      body: (
        <>
          <p>{project.problem}</p>
          {project.users ? <p>{project.users}</p> : null}
        </>
      ),
    },
    project.role && { id: 'role', label: 'My role', body: <p>{project.role}</p> },
    project.features?.length && {
      id: 'features',
      label: 'Features',
      body: <List items={project.features} />,
    },
    {
      id: 'architecture',
      label: project.diagram ? 'Architecture' : 'How it works',
      body: (
        <>
          {project.diagram ? <ArchitectureDiagram diagram={project.diagram} /> : null}
          <p>{project.architecture}</p>
        </>
      ),
    },
    project.dataModel?.length && {
      id: 'data-model',
      label: 'Data model',
      body: (
        <dl className="data-model">
          {project.dataModel.map((table) => (
            <div key={table.name}>
              <dt>
                <code>{table.name}</code>
              </dt>
              <dd>
                <p>{table.columns}</p>
                {table.note ? <p className="data-model-note">{table.note}</p> : null}
              </dd>
            </div>
          ))}
        </dl>
      ),
    },
    project.endpoints?.length && {
      id: 'endpoints',
      label: 'Key endpoints',
      body: (
        <>
          <div className="table-scroll" role="region" aria-label="Endpoints" tabIndex={0}>
            <table className="api-table">
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Path</th>
                  <th scope="col">Auth</th>
                  <th scope="col">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {project.endpoints.map((endpoint) => (
                  <tr key={`${endpoint.method} ${endpoint.path}`}>
                    <td>
                      <span className="method-pill" data-method={endpoint.method}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td>
                      <code>{endpoint.path}</code>
                    </td>
                    <td>{endpoint.auth ? 'Bearer' : 'Public'}</td>
                    <td>{endpoint.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {project.example ? (
            <figure className="api-example">
              <figcaption className="api-example-title">{project.example.title}</figcaption>
              <div className="api-example-panes">
                <div>
                  <p className="code-label">Request</p>
                  <pre
                    className="code-block"
                    tabIndex={0}
                    role="region"
                    aria-label="Example request"
                  >
                    <code>{project.example.request}</code>
                  </pre>
                </div>
                <div>
                  <p className="code-label">Response</p>
                  <pre
                    className="code-block"
                    tabIndex={0}
                    role="region"
                    aria-label="Example response"
                  >
                    <code>{project.example.response}</code>
                  </pre>
                </div>
              </div>
              {project.example.caption ? (
                <p className="api-example-caption">{project.example.caption}</p>
              ) : null}
            </figure>
          ) : null}
        </>
      ),
    },
    project.statusCodes?.length && {
      id: 'errors',
      label: 'Status codes & errors',
      body: (
        <div className="table-scroll" role="region" aria-label="Status codes" tabIndex={0}>
          <table className="api-table">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Meaning</th>
                <th scope="col">When</th>
              </tr>
            </thead>
            <tbody>
              {project.statusCodes.map((row) => (
                <tr key={row.code}>
                  <td>
                    <span className="status-code" data-ok={row.code < 400 ? 'true' : 'false'}>
                      {row.code}
                    </span>
                  </td>
                  <td>{row.meaning}</td>
                  <td>{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    project.decisions?.length && {
      id: 'decisions',
      label: 'Engineering decisions',
      body: (
        <div className="decision-list">
          {project.decisions.map((decision) => (
            <div key={decision.title}>
              <h3>{decision.title}</h3>
              <p>{decision.body}</p>
            </div>
          ))}
        </div>
      ),
    },
    project.security?.length && {
      id: 'security',
      label: 'Security & validation',
      body: <List items={project.security} />,
    },
    project.testing && {
      id: 'testing',
      label: 'Testing',
      body: (
        <>
          <p>{project.testing.summary}</p>
          {project.testing.items?.length ? <List items={project.testing.items} /> : null}
          {project.testing.ciUrl ? (
            <p>
              <a
                className="text-link text-brand-link"
                href={project.testing.ciUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                {project.testing.ciLabel ?? 'CI run'}
              </a>
            </p>
          ) : null}
        </>
      ),
    },
    project.deployment?.length && {
      id: 'deployment',
      label: 'Deployment',
      body: <List items={project.deployment} />,
    },
    project.limits?.length && {
      id: 'limits',
      label: 'Trade-offs & limits',
      body: <List items={project.limits} />,
    },
    { id: 'learned', label: 'What I learned', body: <p>{project.whatILearned}</p> },
  ]
  return s.filter((item): item is Section => Boolean(item))
}

function ProjectLinks({ project, size = 'lg' }: { project: Project; size?: 'lg' | 'default' }) {
  return (
    <>
      {project.githubUrl ? (
        <Button
          size={size}
          render={<a href={project.githubUrl} target="_blank" rel="noreferrer" />}
        >
          <GitHubIcon className="size-4" />
          View code
        </Button>
      ) : null}
      {project.liveUrl ? (
        <Button
          size={size}
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
          size={size}
          variant="ghost"
          render={<a href={link.url} target="_blank" rel="noreferrer" />}
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          {link.label}
        </Button>
      ))}
    </>
  )
}

export function ProjectDetail({ project, position, total }: ProjectDetailProps) {
  const sections = sectionsFor(project)

  return (
    <article className="detail">
      <header className="detail-header">
        <p className="eyebrow">
          {project.kind}
          {position && total
            ? ` · ${String(position).padStart(2, '0')} of ${String(total).padStart(2, '0')}`
            : ''}
        </p>
        <h1 className="detail-title">{project.name}</h1>
        <p className="detail-lede">{project.description}</p>
        <dl className="detail-meta">
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.stack.slice(0, 5).join(' · ')}</dd>
          </div>
        </dl>
        <div className="detail-actions">
          <ProjectLinks project={project} />
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
        <aside className="detail-aside" aria-label="Project summary">
          {project.highlights.length ? (
            <>
              <p className="project-label">TL;DR</p>
              <ul className="detail-highlights">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {sections.length > 5 ? (
            <nav aria-label="On this page" className="detail-toc">
              <p className="project-label">On this page</p>
              <ol>
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-link">
                      {section.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
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
            <section key={section.id} id={section.id} aria-labelledby={`detail-${section.id}`}>
              <p className="detail-section-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <div className="detail-section-body">
                <h2 id={`detail-${section.id}`}>{section.label}</h2>
                {section.body}
              </div>
            </section>
          ))}
          <section id="links" aria-labelledby="detail-links">
            <p className="detail-section-index" aria-hidden="true">
              {String(sections.length + 1).padStart(2, '0')}
            </p>
            <div className="detail-section-body">
              <h2 id="detail-links">Links</h2>
              <div className="detail-actions">
                <ProjectLinks project={project} size="default" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </article>
  )
}
