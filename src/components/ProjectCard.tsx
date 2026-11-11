import type { Project } from '../types/project';

const projectIcons: Record<string, string> = {
  'browser-toolbox': '🧰',
  'linux-quick-reference': '🐧',
  'ins-collage': '🖼️',
  'watermark-video': '🎬',
  'tarot-hall': '🔮',
  'midnight-channel': '📺',
  'look-translate': '🌐',
  'search-layout': '🔎',
};

interface ProjectCardProps {
  project: Project;
  detailHref: string;
  featuredLabel: string;
  staggerIndex?: number;
  tabIndex?: number;
}

export function ProjectCard({
  project,
  detailHref,
  featuredLabel,
  staggerIndex,
  tabIndex,
}: ProjectCardProps) {
  const stagger = typeof staggerIndex === 'number';

  return (
    <a
      href={detailHref}
      className={stagger ? 'project-card crt-stagger-item' : 'project-card'}
      style={stagger ? { ['--crt-stagger' as string]: String(staggerIndex) } : undefined}
      tabIndex={tabIndex}
    >
      <span className="project-card-media" aria-hidden="true">
        {projectIcons[project.slug] ?? '📦'}
      </span>
      <div>
        <h3 className="project-card-title">{project.name}</h3>
        <p className="project-card-description">{project.description}</p>
        {project.featured && <span className="project-card-featured">★ {featuredLabel}</span>}
      </div>
    </a>
  );
}
