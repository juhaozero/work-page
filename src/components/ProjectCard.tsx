import type { Project } from '../types/project';
import type { UITranslations } from '../i18n/ui';
import ProjectStatus from './ProjectStatus';

interface ProjectCardProps {
  project: Project;
  t: UITranslations;
  detailHref: string;
  staggerIndex?: number;
}

/** 桌面终端表的一行 */
export function ProjectTableRow({
  project,
  t,
  detailHref,
  staggerIndex,
}: ProjectCardProps) {
  const techPreview = (project.tech ?? []).slice(0, 3).join(' · ') || '—';
  const moreTech =
    project.tech && project.tech.length > 3 ? ` +${project.tech.length - 3}` : '';
  const stagger =
    typeof staggerIndex === 'number'
      ? {
          className: 'terminal-row group crt-stagger-item',
          style: { ['--crt-stagger' as string]: String(staggerIndex) },
        }
      : { className: 'terminal-row group', style: undefined };

  return (
    <tr className={stagger.className} style={stagger.style}>
      <td className="terminal-td">
        <a
          href={detailHref}
          className="font-medium truncate block min-w-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]"
          style={{ color: 'var(--crt-text)' }}
        >
          {project.name}
        </a>
      </td>
      <td className="terminal-td">
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
    </tr>
  );
}

/** 移动端两行：上行名+状态 / 下行分类 */
export function ProjectMobileRow({ project, t, detailHref }: ProjectCardProps) {
  return (
    <a
      href={detailHref}
      className="block py-3 border-b border-[var(--crt-border-dim)] cursor-pointer transition-[background-color,box-shadow] duration-150 hover:bg-[var(--crt-glow)] hover:shadow-[inset_2px_0_0_var(--crt-accent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]"
    >
      <div className="flex items-baseline gap-3 min-w-0">
        <span className="font-medium truncate text-sm" style={{ color: 'var(--crt-text)' }}>
          {project.name}
        </span>
        <ProjectStatus projectId={project.id} labels={t.status} className="ml-auto shrink-0" />
      </div>
      <p className="text-xs mt-1 truncate" style={{ color: 'var(--crt-text-muted)' }}>
        {project.category}
      </p>
    </a>
  );
}
