// src/app/tech/[slug]/page.tsx
const TECH_SLUGS = [
  'css','javascript','sass','angular','react','vue',
  'typescript','html','github','python','fastapi'
];

export async function generateStaticParams() {
  return TECH_SLUGS.map(slug => ({ slug }));
}

export default function TechDetail({ params }: { params: { slug: string } }) {
  const title = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return (
    <section className="min-h-[100svh] grid place-items-center">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="opacity-70">Página en construcción…</p>
      </div>
    </section>
  );
}
