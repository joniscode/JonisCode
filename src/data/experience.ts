import type { ExperienceItem } from '@/components/ExperienceSection'

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'vass',
    year: 2026,
    icon: '/icons/react.png',
    title: 'Microfrontends para autoadmision y agenda medica',
    roleLine: 'Desarrollador Front-End',
    companyLine: 'VASS Company',
    tags: ['React', 'Angular', 'TypeScript', 'Vite', 'Tailwind CSS', 'RxJS', 'NgRx', 'GraphQL'],
    description:
      'Desarrollo y mantenimiento de microfrontends para flujos de autoadmision y agenda medica, en colaboracion con equipos multidisciplinarios bajo Scrum.',
    achievements: [
      'Implementacion de UI modular con React y Angular, enfocada en reutilizacion, consistencia visual y escalabilidad.',
      'Integracion con APIs REST y GraphQL usando Apollo Client, junto con manejo de estados y asincronia por modulo.',
      'Optimizacion de rendering, reduccion de deuda tecnica, revision de PRs y soporte a despliegues con Git Flow y CI/CD.',
    ],
    period: 'Oct 2025 - Actualidad',
  },
  {
    id: 'prilso',
    year: 2025,
    icon: '/icons/typescript.png',
    title: 'Migracion y arquitectura modular de plataforma web',
    roleLine: 'Desarrollador Front-End',
    companyLine: 'Prilso S.A.S.',
    tags: ['Next.js', 'React 18', 'TypeScript', 'RxJS', 'Tailwind CSS', 'REST APIs', 'GitHub'],
    description:
      'Migracion de la plataforma web a Next.js con una arquitectura modular, enfocada en escalabilidad y reutilizacion de componentes.',
    achievements: [
      'Creacion de librerias de componentes reutilizables en React y Next.js.',
      'Integracion de autenticacion JWT, guardas y resolvers avanzados para mejorar seguridad y control de acceso.',
      'Gestion de CI/CD con GitHub Actions y despliegues automaticos en Vercel.',
    ],
    period: 'Ene 2025 - Oct 2025',
  },
  {
    id: 'young-travelers',
    year: 2025,
    icon: '/icons/angular.png',
    title: 'Voluntariado en tecnologias de la informacion',
    roleLine: 'Voluntario Front-End',
    companyLine: 'Young Travelers',
    tags: ['Angular', 'TypeScript', 'REST APIs', 'Git', 'GitHub'],
    description:
      'Participacion como voluntario en el departamento de tecnologias de la informacion, apoyando el desarrollo y mantenimiento del frente web.',
    achievements: [
      'Desarrollo de funcionalidades y mantenimiento de componentes en Angular.',
      'Integracion con APIs y optimizacion de la interfaz para mejorar la experiencia de uso.',
      'Colaboracion con el equipo tecnico y gestion del codigo con Git y GitHub.',
    ],
    period: 'May 2025 - Dic 2026',
  },
  {
    id: 'cun',
    year: 2025,
    icon: '/icons/github.png',
    title: 'Ingenieria de Sistemas',
    roleLine: 'Formacion academica',
    companyLine: 'CUN',
    tags: ['Ingenieria', 'Sistemas', 'Software'],
    description: 'Formacion enfocada en desarrollo de software, analisis de sistemas y construccion de soluciones tecnologicas.',
    achievements: [
      'Fortalecimiento de bases en arquitectura de software y desarrollo web.',
      'Complemento academico para la experiencia profesional en frontend y plataformas digitales.',
    ],
    period: '2025',
  },
  {
    id: 'indra',
    year: 2024,
    icon: '/icons/angular.png',
    title: 'Modulos escalables y microfrontends en Liferay DXP',
    roleLine: 'Desarrollador Liferay DXP Front-End',
    companyLine: 'Indra Colombia',
    tags: ['Liferay DXP 7.4', 'Angular 17+', 'React 18+', 'TypeScript', 'Tailwind', 'Jest', 'Git'],
    description:
      'Desarrollo de modulos escalables y microfrontends sobre Liferay DXP 7.4 para portales de alto trafico.',
    achievements: [
      'Creacion de librerias de componentes reutilizables con TypeScript y RxJS.',
      'Optimizacion de rendimiento superior al 20% en portales con mas de 3 millones de usuarios mensuales.',
      'Impulso de buenas practicas de Clean Code y revisiones de codigo en el equipo.',
    ],
    period: 'Oct 2022 - Dic 2024',
  },
  {
    id: 'sena',
    year: 2023,
    icon: '/icons/github.png',
    title: 'Tecnologo en Analisis y Desarrollo de Sistemas de Informacion',
    roleLine: 'Formacion academica',
    companyLine: 'SENA',
    tags: ['Analisis', 'Desarrollo', 'Sistemas de Informacion'],
    description:
      'Proceso formativo centrado en analisis, construccion e implementacion de soluciones de software aplicadas a necesidades reales.',
    achievements: [
      'Base tecnica para consolidar procesos de desarrollo, documentacion y trabajo por proyectos.',
      'Refuerzo de fundamentos usados luego en entornos empresariales y proyectos frontend.',
    ],
    period: '2021 - 2023',
  },
  {
    id: 'cantaleta',
    year: 2022,
    icon: '/icons/javascript.png',
    title: 'Tiendas personalizadas y optimizacion en Magento 2',
    roleLine: 'Desarrollador Front-End Magento 2 CE',
    companyLine: 'Cantaleta.co',
    tags: ['Magento 2 CE', 'HTML5', 'CSS3', 'jQuery', 'REST APIs', 'Git'],
    description:
      'Desarrollo de tiendas personalizadas para ecommerce, integraciones empresariales y soporte tecnico a clientes.',
    achievements: [
      'Incremento de conversiones en un 20% mediante mejoras en experiencia e implementacion frontend.',
      'Integracion con ERP y procesos de facturacion electronica.',
      'Optimizacion de rendimiento y soporte tecnico continuo para clientes.',
    ],
    period: 'Feb 2021 - Oct 2022',
  },
]
