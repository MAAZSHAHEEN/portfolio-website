import { MapPin } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/lib/queries'

export function About() {
  const { data: profile, isLoading, isError } = useProfile()

  return (
    <section id="about" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="01 · About" title="A little about me" />

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {isLoading ? (
            <>
              <div className="space-y-3 lg:col-span-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
              <Skeleton className="h-48 w-full" />
            </>
          ) : isError || !profile ? (
            <p className="text-destructive">Could not load profile from the API.</p>
          ) : (
            <>
              <Reveal className="lg:col-span-2">
                <p className="text-lg leading-relaxed text-muted-foreground">{profile.bio}</p>
                <p className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="size-4 text-brand-link" aria-hidden="true" />
                  {profile.location}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <Card>
                  <CardContent>
                    <h3 className="font-display text-lg font-semibold">Currently looking for</h3>

                    <div className="mt-4 space-y-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">Roles</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {profile.lookingFor.roles.map((role) => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-muted-foreground">Fields</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {profile.lookingFor.fields.map((field) => (
                            <Badge key={field} variant="secondary">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-muted-foreground">Locations</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {profile.lookingFor.locations.map((location) => (
                            <Badge key={location} variant="secondary">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            </>
          )}
        </div>
      </Container>
    </section>
  )
}
