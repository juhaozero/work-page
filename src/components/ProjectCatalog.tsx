import type { Project } from '../types/project';
import type { Locale } from '../i18n/config';
import type { UITranslations } from '../i18n/ui';
import { t as format } from '../i18n/ui';
import { projectDetailPath } from '../i18n/paths';
import { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';

interface ProjectCatalogProps {
  projects: Project[];
  categories: string[];
  locale: Locale;
  t: UITranslations;
}

export default function ProjectCatalog({
  projects,
  categories,
  locale,
  t,
}: ProjectCatalogProps) {
  const filterAll = t.catalog.filterAll;
  const [active, setActive] = useState(filterAll);

  const filtered = useMemo(
    () => (active === filterAll ? projects : projects.filter((p) => p.category === active)),
    [active, filterAll, projects],
  );

  const allCategories = [filterAll, ...categories];

  return (
    <section aria-labelledby="catalog-heading">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 id="catalog-heading" className="text-lg font-medium">
            {t.catalog.title}
          </h2>
          <p className="text-xs" style={{ color: 'var(--crt-text-muted)' }}>
            {t.catalog.showing}{' '}
            <span className="tabular-nums" style={{ color: 'var(--crt-text)' }}>
              {filtered.length}
            </span>
            {format(t.catalog.of, { total: projects.length })}
            {active !== filterAll && (
              <span style={{ color: 'var(--crt-text-dim)' }}>
                {t.catalog.categoryPrefix}
                {active}
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
              {category}
            </button>
          ))}
        </nav>
      </div>

      <ul className="border-t border-[var(--crt-border-dim)]">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            t={t}
            detailHref={projectDetailPath(locale, project.slug)}
          />
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center" role="status">
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
