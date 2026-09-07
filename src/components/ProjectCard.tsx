import type { Project } from '../types/project';
import type { UITranslations } from '../i18n/ui';
import { projectGlyph } from '../lib/projectGlyph';
import ProjectStatus from './ProjectStatus';

interface ProjectCardProps {
  project: Project;
  t: UITranslations;
  detailHref: string;
}

function formatDate(date: string | undefined): string {
  if (!date) return '—';
  return date;
}

export default function ProjectCard({ project, t, detailHref }: ProjectCardProps) {
  const techPreview = (project.tech ?? []).slice(0, 3).join(' · ') || '—';
  const moreTech =
    project.tech && project.tech.length > 3 ? ` +${project.tech.length - 3}` : '';

  return (
    <tr className="terminal-row group">
      <td className="terminal-td">
        <a
          href={detailHref}
          className="flex items-center gap-3 min-w-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]"
        >
          <span className="terminal-glyph !h-8 !w-8 !text-[0.6875rem]" aria-hidden="true">
            {projectGlyph(project.slug)}
          </span>
          <span className="font-medium truncate" style={{ color: 'var(--crt-text)' }}>
            {project.name}
          </span>
        </a>
      </td>
      <td className="terminal-td hidden sm:table-cell">
        <span style={{ color: 'var(--crt-text-muted)' }}>{project.category}</span>
      </td>
      <td className="terminal-td hidden md:table-cell">
        <span className="truncate block max-w-[14rem]" style={{ color: 'var(--crt-text-dim)' }}>
          {techPreview}
          {moreTech}
        </span>
      </td>
      <td className="terminal-td">
        <ProjectStatus projectId={project.id} labels={t.status} />
      </td>
      <td className="terminal-td hidden lg:table-cell tabular-nums">
        <span style={{ color: 'var(--crt-text-dim)' }}>{formatDate(project.createdAt)}</span>
      </td>
    </tr>
  );
}
