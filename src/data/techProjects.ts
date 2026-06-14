import techProjects from './techProjects.json'

export type TechProjectLink = {
  tech: string
  name: string
  image: string
  href: string
}

export type TechDefinition = {
  slug: string
  label: string
  icon: string
  showInGrid?: boolean
  showInRing?: boolean
}

type TechProjectsContent = {
  technologies: TechDefinition[]
  projects: TechProjectLink[]
}

export type TechCatalogEntry = TechDefinition & {
  projects: TechProjectLink[]
}

const content = techProjects as TechProjectsContent
const technologies = content.technologies
const technologiesBySlug = new Map(technologies.map((item) => [item.slug, item] as const))

const projectsByTech = content.projects.reduce((groups, project) => {
  if (!technologiesBySlug.has(project.tech)) return groups

  const bucket = groups.get(project.tech)

  if (bucket) {
    bucket.push(project)
    return groups
  }

  groups.set(project.tech, [project])
  return groups
}, new Map<string, TechProjectLink[]>())

function hasProjects(slug: string) {
  return (projectsByTech.get(slug)?.length ?? 0) > 0
}

export const TECH_SLUGS = technologies.filter((item) => hasProjects(item.slug)).map((item) => item.slug)

export const HOME_TECHNOLOGIES = technologies.filter(
  (item) => item.showInGrid && hasProjects(item.slug)
)

export const RING_TECHNOLOGIES = technologies
  .filter((item) => item.showInRing)
  .map(({ slug, label, icon }) => ({ slug, label, icon }))

export function getTechEntry(slug: string): TechCatalogEntry | undefined {
  const technology = technologiesBySlug.get(slug)

  if (!technology || !hasProjects(slug)) {
    return undefined
  }

  return {
    ...technology,
    projects: projectsByTech.get(slug) ?? [],
  }
}
