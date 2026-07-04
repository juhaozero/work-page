import { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';
import type { Project } from '../types/project';

interface ProjectCatalogProps {
  projects: Project[];
  categories: string[];
}

const DIVIDER = '-- 项目目录 ----------------------------------------------';

export default function ProjectCatalog({ projects, categories }: ProjectCatalogProps) {
  const [active, setActive] = useState('全部');

  const filtered = useMemo(
    () => (active === '全部' ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  );

  const allCategories = ['全部', ...categories];

  return (
    <section aria-labelledby="catalog-heading">
      <p className="terminal-divider mb-6">{DIVIDER}</p>

      <div className="space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-2">
            <h2 id="catalog-heading" className="terminal-section-title">
              全部项目
            </h2>
            <p className="text-xs" style={{ color: 'var(--crt-text-muted)' }}>
              显示{' '}
              <span className="tabular-nums font-semibold" style={{ color: 'var(--crt-text)' }}>
                {filtered.length}
              </span>{' '}
              / {projects.length} 个
              {active !== '全部' && (
                <span style={{ color: 'var(--crt-text-dim)' }}> · 分类：{active}</span>
              )}
            </p>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="项目分类筛选">
            {allCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={[
                  'btn-filter',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]',
                  active === category ? 'btn-filter-active' : 'btn-filter-inactive',
                ].join(' ')}
                aria-pressed={active === category}
              >
                [{category}]
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((project) => {
          const originalIndex = projects.findIndex((p) => p.id === project.id);
          return (
            <ProjectCard
              key={project.id}
              project={project}
              index={originalIndex}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div
          className="terminal-card flex flex-col items-center py-16 text-center mt-6"
          role="status"
        >
          <p className="text-sm" style={{ color: 'var(--crt-text-muted)' }}>
            未找到匹配的项目
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--crt-text-dim)' }}>
            试试切换其他分类
          </p>
        </div>
      )}
    </section>
  );
}
