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

const fallbackProjects: TechProjectLink[] = [
  {
    name: 'Proyecto 01',
    image: '/images/cover.jpg',
    href: 'https://example.com/project-01',
  },
  {
    name: 'Proyecto 02',
    image: '/images/cover.jpg',
    href: 'https://example.com/project-02',
  },
]

const catalog = techProjects as TechCatalogEntry[]

export const TECH_SLUGS = catalog.map((entry) => entry.slug)

export function getTechEntry(slug: string): TechCatalogEntry {
  const entry = catalog.find((item) => item.slug === slug)

  if (entry) {
    return entry
  }

  return {
    slug,
    label: slug.charAt(0).toUpperCase() + slug.slice(1),
    projects: fallbackProjects,
  }
}
