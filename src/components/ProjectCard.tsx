import type { Project } from '../types/project';
import type { UITranslations } from '../i18n/ui';
import { t as format } from '../i18n/ui';
import FeaturedPin from './FeaturedPin';
import ProjectStatus from './ProjectStatus';

interface ProjectCardProps {
  project: Project;
  index: number;
  t: UITranslations;
  detailHref: string;
}

export default function ProjectCard({ project, index, t, detailHref }: ProjectCardProps) {
  const paddedIndex = String(index + 1).padStart(2, '0');

  return (
    <article className="group h-full">
      <a
        href={detailHref}
        className={[
          'terminal-card terminal-card-hover relative flex h-full flex-col p-5 cursor-pointer',
          project.featured && 'pl-8',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {project.featured && <FeaturedPin label={t.featured.pinLabel} />}
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div
              className="flex h-11 w-11 items-center justify-center text-xl shrink-0"
              style={{ border: '1px solid var(--crt-border-dim)', background: 'var(--crt-bg)' }}
            >
              <span role="img" aria-label={project.name}>
                {project.emoji}
              </span>
            </div>
            <span className="tag-terminal tabular-nums">
              {format(t.project.indexLabel, { index: paddedIndex })}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="tag-terminal">{project.category}</span>
            {project.lifecycle && (
              <span className="tag-terminal">{t.project.lifecycle[project.lifecycle]}</span>
            )}
            <ProjectStatus projectId={project.id} labels={t.status} />
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

          {project.tech && project.tech.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech.slice(0, 4).map((tech) => (
                <span key={tech} className="tag-terminal">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <span
            className="inline-flex items-center gap-1.5 text-xs mt-auto transition-opacity duration-150 group-hover:opacity-80"
            style={{ color: 'var(--crt-accent)' }}
          >
            {t.project.detailsLabel}
          </span>
        </div>
      </a>
    </article>
  );
}
