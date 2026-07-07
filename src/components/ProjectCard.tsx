import type { Project } from '../types/project';
import FeaturedPin from './FeaturedPin';
import ProjectStatus from './ProjectStatus';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const paddedIndex = String(index + 1).padStart(2, '0');

  return (
    <article className="group h-full">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          'terminal-card terminal-card-hover relative flex h-full flex-col p-5 cursor-pointer',
          project.featured && 'pl-8',
        ].filter(Boolean).join(' ')}
      >
        {project.featured && <FeaturedPin />}
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div
              className="flex h-11 w-11 items-center justify-center text-xl shrink-0"
              style={{ border: '1px solid var(--crt-border-dim)', background: 'var(--crt-bg)' }}
            >
              <span role="img" aria-label={project.name}>{project.emoji}</span>
            </div>
            <span className="tag-terminal tabular-nums">项目 {paddedIndex}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="tag-terminal">{project.category}</span>
            <ProjectStatus projectId={project.id} />
          </div>

          <h3 className="text-sm font-semibold tracking-tight mb-2 group-hover:opacity-80 transition-opacity duration-150">
            {project.name}
          </h3>

          <p
            className="text-xs leading-relaxed flex-1 mb-5 line-clamp-3"
            style={{ color: 'var(--crt-text-muted)' }}
          >
            {project.description}
          </p>

          <span
            className="inline-flex items-center gap-1.5 text-xs mt-auto transition-opacity duration-150 group-hover:opacity-80"
            style={{ color: 'var(--crt-accent)' }}
          >
            打开项目 →
          </span>
        </div>
      </a>
    </article>
  );
}
