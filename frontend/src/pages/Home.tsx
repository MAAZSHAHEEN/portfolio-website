import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Education } from '@/components/sections/Education'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'

export function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Skills />
      <Education />
      <Contact />
    </>
  )
}
