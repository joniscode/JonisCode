import type { Language } from '@/components/LanguageProvider'
import content from './site.json'

/*
 * Todos los textos y datos del sitio viven en `site.json`.
 * Este archivo solo les pone tipos; para cambiar contenido, edita el JSON.
 */

export type Localized<T = string> = Record<Language, T>

export type CaseDiagram = 'microfrontends' | 'migration' | 'portal'

export type CaseStudy = {
  id: string
  company: string
  diagram: CaseDiagram
  stack: string[]
  period: Localized
  sector: Localized
  role: Localized
  title: Localized
  challenge: Localized
  work: Localized
  // Cifras de EJEMPLO: reemplazar por datos reales y poner `"example": false` en el JSON.
  metrics: { value: string; label: Localized; example: boolean }[]
}

export const PROFILE = content.profile
export const META = content.meta
export const LINKS = content.links
export const UI: Localized<typeof content.ui.es> = content.ui
export const NAV: Localized<{ href: string; label: string }[]> = content.nav
export const HERO: Localized<typeof content.hero.es> = content.hero
export const CASES_COPY: Localized<typeof content.casesCopy.es> = content.casesCopy
export const CASES = content.cases as CaseStudy[]
export const DIAGRAMS: Localized<typeof content.diagrams.es> = content.diagrams
export const STACK_COPY: Localized<typeof content.stackCopy.es> = content.stackCopy
export const STACK: { group: Localized; items: string[] }[] = content.stack
export const EDUCATION_COPY: Localized<typeof content.educationCopy.es> = content.educationCopy
export const EDUCATION: { title: Localized; school: string; period: Localized; done: boolean; href: string }[] =
  content.education
export const LAB_COPY: Localized<typeof content.labCopy.es> = content.labCopy
export const LAB: { name: string; tech: string; href: string; download?: boolean; description: Localized }[] =
  content.lab
export const CONTACT: Localized<typeof content.contact.es> = content.contact
