import type { Project } from '../types/project';
import type { UITranslations } from '../i18n/ui';
import { t as format } from '../i18n/ui';
import FeaturedPin from './FeaturedPin';
import ProjectStatus from './ProjectStatus';

interface FeaturedProjectsProps {
  projects: Project[];
  t: UITranslations;
}

export default function FeaturedProjects({ projects, t }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <div className="space-y-4" aria-label={t.featured.ariaLabel}>
      <p className="terminal-label">{t.featured.label}</p>

      <div className="space-y-3">
        {projects.map((project, i) => (
          <a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="terminal-card terminal-card-hover group relative flex items-center gap-4 p-4 sm:p-5 pl-8 cursor-pointer"
          >
            <FeaturedPin label={t.featured.pinLabel} />
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center text-xl"
              style={{ border: '1px solid var(--crt-border-dim)', background: 'var(--crt-bg)' }}
            >
              <span role="img" aria-label={project.name}>{project.emoji}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="tag-terminal">
                  {format(t.project.indexLabel, { index: String(i + 1).padStart(2, '0') })}
                </span>
                <span className="tag-terminal">{project.category}</span>
                <ProjectStatus projectId={project.id} labels={t.status} />
              </div>
              <h2 className="font-semibold tracking-tight truncate group-hover:opacity-80 transition-opacity duration-150">
                {project.name}
              </h2>
              <p
                className="text-xs leading-relaxed line-clamp-1 mt-0.5"
                style={{ color: 'var(--crt-text-muted)' }}
              >
                {project.description}
              </p>
            </div>

            <span
              className="shrink-0 text-xs opacity-60 group-hover:opacity-100 transition-opacity duration-150"
              style={{ color: 'var(--crt-accent)' }}
              aria-hidden="true"
            >
              {t.featured.goTo}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
