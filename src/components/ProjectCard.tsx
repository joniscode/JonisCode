import { Project } from '@/lib/projects';

export default function ProjectCard({
  name,
  description,
  demoUrl,
  repoUrl,
}: Project) {
  return (
    <article className="card flex flex-col bg-primary-800 rounded-xl overflow-hidden">
      <iframe
        src={demoUrl}
        className="aspect-video w-full"
        loading="lazy"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm text-text-secondary flex-1">{description}</p>
        <a
          href={repoUrl}
          target="_blank"
          className="btn btn--primary mt-4 self-start"
        >
          Ver código
        </a>
      </div>
    </article>
  );
}
