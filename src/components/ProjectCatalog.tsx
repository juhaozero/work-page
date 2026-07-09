import { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';
import type { Project } from '../types/project';
import type { UITranslations } from '../i18n/ui';
import { t as format } from '../i18n/ui';

interface ProjectCatalogProps {
  projects: Project[];
  categories: string[];
  t: UITranslations;
}

export default function ProjectCatalog({ projects, categories, t }: ProjectCatalogProps) {
  const filterAll = t.catalog.filterAll;
  const [active, setActive] = useState(filterAll);

  const filtered = useMemo(
    () => (active === filterAll ? projects : projects.filter((p) => p.category === active)),
    [active, filterAll, projects],
  );

  const allCategories = [filterAll, ...categories];

  return (
    <section aria-labelledby="catalog-heading">
      <p className="terminal-divider mb-6">{t.catalog.divider}</p>

      <div className="space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-2">
            <h2 id="catalog-heading" className="terminal-section-title">
              {t.catalog.title}
            </h2>
            <p className="text-xs" style={{ color: 'var(--crt-text-muted)' }}>
              {t.catalog.showing}{' '}
              <span className="tabular-nums font-semibold" style={{ color: 'var(--crt-text)' }}>
                {filtered.length}
              </span>
              {format(t.catalog.of, { total: projects.length })}
              {active !== filterAll && (
                <span style={{ color: 'var(--crt-text-dim)' }}>
                  {t.catalog.categoryPrefix}{active}
                </span>
              )}
            </p>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label={t.catalog.filterAriaLabel}>
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
              t={t}
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
            {t.catalog.emptyTitle}
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--crt-text-dim)' }}>
            {t.catalog.emptyHint}
          </p>
        </div>
      )}
    </section>
  );
}
