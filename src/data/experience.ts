import type { ExperienceItem } from '@/components/ExperienceSection'

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'fibrazo',
    year: 2025,
    icon: '/icons/javascript.png',
    title: 'Panel de administracion de Fibrazo',
    roleLine: '42mate - SSR. Desarrollador de software',
    companyLine: 'Fibrazo - Proveedor de servicios de internet colombiano',
    tags: ['Laravel', 'PHP', 'jQuery', 'MySQL'],
    description:
      'El panel facilita operaciones internas como gestion de clientes, mensajeria y control de infraestructura.',
    achievements: [
      'Mejora de interfaces con Blade + jQuery.',
      'Mensajeria automatizada con tareas programadas.',
      'Soporte al equipo backend para optimizar flujos internos.',
    ],
    period: '2024 - 2025',
    linkHref: 'https://fibrazo.com',
  },
  {
    id: 'ux-dash',
    year: 2024,
    icon: '/icons/react.png',
    title: 'Dashboard de metricas UX',
    roleLine: 'Freelance - Frontend',
    companyLine: 'Producto interno',
    tags: ['React', 'TypeScript', 'Tailwind', 'Vite'],
    description: 'Dashboard para visualizar KPIs con filtros en tiempo real y exportaciones.',
    achievements: [
      'Arquitectura por features y lazy routes.',
      'Graficos accesibles y responsivos.',
      'Tests de regresion visual.',
    ],
    period: '2023 - 2024',
    linkHref: '#',
    linkLabel: 'Ver demo',
  },
  {
    id: 'first-job',
    year: 2019,
    icon: '/icons/angular.png',
    title: 'Aplicacion interna de reportes',
    roleLine: 'Jr. Frontend',
    companyLine: 'Compania X',
    tags: ['Angular', 'TypeScript', 'Sass'],
    description: 'Modulos CRUD, filtros y exportacion a CSV/PDF.',
    achievements: ['Refactor a componentes reutilizables.', 'Mejora de performance con OnPush.'],
    period: '2019 - 2020',
  },
]
