import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Education } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { useExperience } from '@/lib/queries'

export function Home() {
  const { data: experience } = useExperience()
  // Section eyebrows are numbered in render order, so hiding a section never leaves a gap.
  const order = ['projects', ...(experience?.length ? ['experience'] : []), 'about', 'skills']
  const labels = ['Selected work', 'Experience', 'About', 'Skills & tools', 'Education', 'Contact']
  const all = [...order, 'education', 'contact']
  const eyebrow = (id: string, label: string) =>
    `${String(all.indexOf(id) + 1).padStart(2, '0')} / ${label}`

  return (
    <>
      <Hero />
      <Projects eyebrow={eyebrow('projects', labels[0])} />
      <Experience eyebrow={eyebrow('experience', labels[1])} />
      <About eyebrow={eyebrow('about', labels[2])} />
      <Skills eyebrow={eyebrow('skills', labels[3])} />
      <Education eyebrow={eyebrow('education', labels[4])} />
      <Contact eyebrow={eyebrow('contact', labels[5])} />
    </>
  )
}
