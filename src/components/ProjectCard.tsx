import type { Project } from '../types/project';
import type { UITranslations } from '../i18n/ui';
import ProjectStatus from './ProjectStatus';

interface ProjectCardProps {
  project: Project;
  t: UITranslations;
  detailHref: string;
}

export default function ProjectCard({ project, t, detailHref }: ProjectCardProps) {
  return (
    <li className="group">
      <a
        href={detailHref}
        className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 sm:gap-x-0 border-b border-[var(--crt-border-dim)] hover:opacity-80 transition-opacity duration-150"
      >
        <span className="flex items-baseline gap-2 shrink-0 text-sm sm:w-[14em] sm:pr-4">
          <span role="img" aria-hidden="true">
            {project.emoji}
          </span>
          <span className="font-medium truncate">{project.name}</span>
        </span>

        <span className="flex flex-1 items-baseline gap-3 min-w-0 text-sm">
          <span
            className="text-pretty flex-1 min-w-0 line-clamp-2 sm:line-clamp-1"
            style={{ color: 'var(--crt-text-muted)' }}
          >
            {project.description}
          </span>
          <ProjectStatus projectId={project.id} labels={t.status} className="ml-auto" />
        </span>
      </a>
    </li>
  );
}
