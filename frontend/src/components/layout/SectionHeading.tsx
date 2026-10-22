import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
  /** Id for the heading so its section can reference it via aria-labelledby. */
  id?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  id,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn('section-heading', align === 'center' && 'mx-auto text-center', className)}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {description ? <p className="section-description">{description}</p> : null}
    </Reveal>
  )
}
