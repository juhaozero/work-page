import type { Project } from '../types/project';

interface ProjectIndexRowProps {
  project: Project;
  detailHref: string;
  staggerIndex?: number;
  tabIndex?: number;
}

/** 作品目录行：左名称、右分类对齐 */
export function ProjectIndexRow({
  project,
  detailHref,
  staggerIndex,
  tabIndex,
}: ProjectIndexRowProps) {
  const stagger =
    typeof staggerIndex === 'number'
      ? {
          className: 'crt-index-row group crt-stagger-item',
          style: { ['--crt-stagger' as string]: String(staggerIndex) },
        }
      : { className: 'crt-index-row group', style: undefined };

  return (
    <a
      href={detailHref}
      className={stagger.className}
      style={stagger.style}
      tabIndex={tabIndex}
    >
      <span className="crt-index-row-name">{project.name}</span>
      <span className="crt-index-row-meta">{project.category}</span>
    </a>
  );
}
