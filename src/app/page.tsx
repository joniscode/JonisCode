import Cases from '@/components/Cases'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import { Contact, Education, Lab, Stack } from '@/components/Sections'

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Cases />
        <Stack />
        <Education />
        <Lab />
        <Contact />
      </main>
    </>
  )
}
