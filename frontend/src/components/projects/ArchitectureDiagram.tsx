import type { Diagram, DiagramNode } from '@/types'

function Node({ node }: { node: DiagramNode }) {
  return (
    <div className="arch-node" data-kind={node.kind}>
      <p className="arch-label">{node.label}</p>
      <p className="arch-detail">{node.detail}</p>
    </div>
  )
}

/** Request-flow diagram as an ordered list: readable as text, no image or JS needed. */
export function ArchitectureDiagram({ diagram }: { diagram: Diagram }) {
  return (
    <figure className="arch" aria-labelledby="arch-caption">
      <div className="arch-grid">
        <ol className="arch-flow" aria-label="Request path">
          {diagram.flow.map((node) => (
            <li key={node.label}>
              <Node node={node} />
            </li>
          ))}
        </ol>
        {diagram.aside?.length ? (
          <ul className="arch-aside" aria-label="Supporting services">
            {diagram.aside.map((node) => (
              <li key={node.label}>
                <Node node={node} />
                {node.connectsTo ? (
                  <p className="arch-link-note">used by {node.connectsTo}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <figcaption id="arch-caption" className="arch-caption">
        {diagram.caption}
      </figcaption>
    </figure>
  )
}
