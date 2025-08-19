import type { ExperienceItem } from '@/components/ExperienceSection'

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'fibrazo',
    year: 2025,
    icon: '/icons/php.png',
    title: 'Panel de administración de Fibrazo',
    roleLine: '42mate – SSR. Desarrollador de software',
    companyLine: 'Fibrazo — Proveedor de servicios de internet colombiano',
    tags: ['Laravel','PHP','jQuery','MySQL'],
    description:
      'El panel facilita operaciones internas como gestión de clientes, mensajería y control de infraestructura.',
    achievements: [
      'Mejora de interfaces con Blade + jQuery.',
      'Mensajería automatizada con tareas programadas.',
      'Soporte al equipo backend para optimizar flujos internos.',
    ],
    period: '2024 — 2025',
    linkHref: 'https://fibrazo.com',
  },
  {
    id: 'ux-dash',
    year: 2024,
    icon: '/icons/react.png',
    title: 'Dashboard de métricas UX',
    roleLine: 'Freelance – Frontend',
    companyLine: 'Producto interno',
    tags: ['React','TypeScript','Tailwind','Vite'],
    description:
      'Dashboard para visualizar KPIs con filtros en tiempo real y exportaciones.',
    achievements: [
      'Arquitectura por features y lazy routes.',
      'Gráficos accesibles y responsivos.',
      'Tests de regresión visual.',
    ],
    period: '2023 — 2024',
    linkHref: '#',
    linkLabel: 'Ver demo',
  },
  {
    id: 'first-job',
    year: 2019,
    icon: '/icons/angular.png',
    title: 'Aplicación interna de reportes',
    roleLine: 'Jr. Frontend',
    companyLine: 'Compañía X',
    tags: ['Angular','TypeScript','Sass'],
    description: 'Módulos CRUD, filtros y exportación a CSV/PDF.',
    achievements: [
      'Refactor a componentes reutilizables.',
      'Mejora de performance con OnPush.',
    ],
    period: '2019 — 2020',
  },
]
