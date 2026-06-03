import techProjects from './techProjects.json'

export type TechProjectLink = {
  name: string
  image: string
  href: string
}

export type TechCatalogEntry = {
  slug: string
  label: string
  projects: TechProjectLink[]
}

const catalog = techProjects as TechCatalogEntry[]

export const TECH_SLUGS = catalog.map((entry) => entry.slug)

export function getTechEntry(slug: string): TechCatalogEntry | undefined {
  return catalog.find((item) => item.slug === slug)
}
