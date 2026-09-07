import type { Project } from '../types/project';
import type { Locale } from '../i18n/config';
import type { UITranslations } from '../i18n/ui';
import { projectDetailPath } from '../i18n/paths';
import { projectGlyph } from '../lib/projectGlyph';
import ProjectStatus from './ProjectStatus';

interface FeaturedProjectsProps {
  projects: Project[];
  locale: Locale;
  t: UITranslations;
}

export default function FeaturedProjects({ projects, locale, t }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <div className="space-y-2" aria-label={t.featured.ariaLabel}>
      <p className="terminal-label">{t.featured.label}</p>

      <div className="space-y-2">
        {projects.map((project) => (
          <a
            key={project.id}
            href={projectDetailPath(locale, project.slug)}
            className="terminal-card terminal-card-hover group relative flex items-center gap-3 py-2.5 px-3 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]"
          >
            <div
              className="terminal-glyph !h-8 !w-8 !text-[0.6875rem]"
              aria-hidden="true"
            >
              {projectGlyph(project.slug)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 min-w-0">
                <h2 className="text-sm font-semibold tracking-tight truncate">
                  {project.name}
                </h2>
                <span className="tag-terminal shrink-0 hidden sm:inline-flex">
                  {project.category}
                </span>
                <ProjectStatus
                  projectId={project.id}
                  labels={t.status}
                  className="ml-auto shrink-0"
                />
              </div>
              <p
                className="text-xs leading-snug line-clamp-1 mt-0.5"
                style={{ color: 'var(--crt-text-muted)' }}
              >
                {project.description}
              </p>
            </div>

            <span
              className="shrink-0 text-xs opacity-70 group-hover:opacity-100 transition-opacity duration-150"
              style={{ color: 'var(--crt-accent)' }}
              aria-hidden="true"
            >
              →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
