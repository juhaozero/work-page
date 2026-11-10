import type { Project } from '../types/project';

interface ProjectIndexRowProps {
  project: Project;
  detailHref: string;
  staggerIndex?: number;
  tabIndex?: number;
}

export function ProjectIndexRow({
  project,
  detailHref,
  staggerIndex,
  tabIndex,
}: ProjectIndexRowProps) {
  const stagger =
    typeof staggerIndex === 'number'
      ? {
          className: 'crt-index-row crt-stagger-item',
          style: { ['--crt-stagger' as string]: String(staggerIndex) },
        }
      : { className: 'crt-index-row', style: undefined };

  return (
    <a
      href={detailHref}
      className={stagger.className}
      style={stagger.style}
      tabIndex={tabIndex}
    >
      <h3 className="crt-index-row-name">{project.name}</h3>
      <p className="crt-index-row-description">{project.description}</p>
    </a>
  );
}
