import type { Project } from '../types/project';
import type { UITranslations } from '../i18n/ui';
import ProjectStatus from './ProjectStatus';

interface ProjectCardProps {
  project: Project;
  t: UITranslations;
  detailHref: string;
  mode?: string;
  staggerIndex?: number;
}

/** 桌面：仿 ls -l 一行 */
export function ProjectTableRow({
  project,
  t,
  detailHref,
  mode = '-rw-r--r--',
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
      <td className="terminal-td terminal-td--mode">
        <span className="crt-ls-mode" aria-hidden="true">
          {mode}
        </span>
        <span className="sr-only">{mode}</span>
      </td>
      <td className="terminal-td">
        <a
          href={detailHref}
          className="crt-ls-name truncate block min-w-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]"
        >
          {project.name}
        </a>
      </td>
      <td className="terminal-td">
        <span className="crt-ls-meta">{project.category}</span>
      </td>
      <td className="terminal-td hidden md:table-cell">
        <span className="crt-ls-tech truncate block max-w-[14rem]">
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

/** 移动端：权限位 + 名/状态 + 分类 */
export function ProjectMobileRow({
  project,
  t,
  detailHref,
  mode = '-rw-r--r--',
}: ProjectCardProps) {
  return (
    <a
      href={detailHref}
      className="crt-ls-mobile block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]"
    >
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="crt-ls-mode shrink-0" aria-hidden="true">
          {mode}
        </span>
        <span className="crt-ls-name truncate text-sm min-w-0">{project.name}</span>
        <ProjectStatus projectId={project.id} labels={t.status} className="ml-auto shrink-0" />
      </div>
      <p className="crt-ls-meta text-xs mt-1 truncate pl-[calc(10ch+0.5rem)]">
        {project.category}
      </p>
    </a>
  );
}
