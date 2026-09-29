import { useProfile } from '@/lib/queries'

const PLACEHOLDER_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export function Home() {
  const { data: profile, isLoading, isError } = useProfile()

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <section id="hero" className="py-16 text-center sm:py-24">
        {isLoading ? (
          <p className="text-muted-foreground">Loading profile...</p>
        ) : isError ? (
          <p className="text-destructive">Could not load profile from the API.</p>
        ) : (
          <>
            <h1 className="font-display text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              {profile?.name}
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">{profile?.title}</p>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
              {profile?.tagline}
            </p>
          </>
        )}
        <p className="mt-10 text-sm text-brand-link">
          Layout scaffold complete &mdash; full Hero, About, Skills, Projects, Education and Contact
          sections are coming in Phase 2.
        </p>
      </section>

      {PLACEHOLDER_SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="flex min-h-40 scroll-mt-20 items-center justify-center border-t border-dashed border-border py-16"
        >
          <p className="text-sm text-muted-foreground">
            {section.label} section &mdash; coming in Phase 2
          </p>
        </section>
      ))}
    </div>
  )
}
