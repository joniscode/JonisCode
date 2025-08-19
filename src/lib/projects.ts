export type Project = {
  slug: string;     // tecnología
  name: string;
  description: string;
  demoUrl: string;  // URL desplegada (iframe)
  repoUrl: string;
};

export const projects: Project[] = [
  {
    slug: 'angular',
    name: 'Gestor de Extintores',
    description: 'SPA para administrar mantenimientos…',
    demoUrl: 'https://extintores-angular.vercel.app',
    repoUrl: 'https://github.com/usuario/gestor-extintores',
  },
  // Añade más…
];
