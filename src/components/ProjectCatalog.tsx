import type { Project } from '../types/project';
import type { Locale } from '../i18n/config';
import type { UITranslations } from '../i18n/ui';
import { projectDetailPath } from '../i18n/paths';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProjectMobileRow, ProjectTableRow } from './ProjectCard';
import {
  CRT_TIMING,
  followTerminalScroll,
  subscribeCrtIntroCatalog,
  shouldPlayCrtHomeIntro,
} from '../lib/crtBoot';
import Typewriter from './Typewriter';

interface ProjectCatalogProps {
  projects: Project[];
  categories: string[];
  locale: Locale;
  t: UITranslations;
}

type Phase = 'pending' | 'command' | 'show';

export default function ProjectCatalog({
  projects,
  categories,
  locale,
  t,
}: ProjectCatalogProps) {
  const filterAll = t.catalog.filterAll;
  const skipIntro = !shouldPlayCrtHomeIntro();
  const [active, setActive] = useState(filterAll);
  const [phase, setPhase] = useState<Phase>(skipIntro ? 'show' : 'pending');
  const [instant, setInstant] = useState(skipIntro);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return subscribeCrtIntroCatalog((detail) => {
      setInstant(detail.instant);
      if (detail.instant) {
        setPhase('show');
      } else {
        setPhase('command');
      }
    });
  }, []);

  useEffect(() => {
    if (phase === 'pending' || instant) return;
    followTerminalScroll(sectionRef.current);
  }, [phase, instant]);

  useEffect(() => {
    if (phase !== 'show' || instant) return;
    const ids = projects.map((_, index) =>
      window.setTimeout(
        () => followTerminalScroll(sectionRef.current),
        100 + index * 70,
      ),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [phase, instant, projects.length]);

  const filtered = useMemo(
    () => (active === filterAll ? projects : projects.filter((p) => p.category === active)),
    [active, filterAll, projects],
  );

  const allCategories = [filterAll, ...categories];
  const cols = t.catalog.columns;
  const onCommandDone = () => setPhase('show');

  return (
    <section
      ref={sectionRef}
      aria-labelledby="catalog-heading"
      aria-busy={phase === 'pending'}
    >
      {phase !== 'pending' && (
        <p
          className="terminal-prompt mb-6 sm:mb-8 flex flex-wrap items-baseline gap-x-2 gap-y-1"
          style={{ color: 'var(--crt-text-muted)' }}
        >
          <span className="crt-phosphor shrink-0" style={{ color: 'var(--crt-accent)' }}>
            {t.crt.prompt}
          </span>
          {instant || phase === 'show' ? (
            <span className="crt-phosphor" style={{ color: 'var(--crt-text)' }}>
              {t.crt.catalogCommand}
            </span>
          ) : (
            <Typewriter
              text={t.crt.catalogCommand}
              charMs={CRT_TIMING.catalog.charMs}
              delayMs={CRT_TIMING.catalog.delayMs}
              className="crt-phosphor"
              style={{ color: 'var(--crt-text)' }}
              onDone={onCommandDone}
            />
          )}
        </p>
      )}

      <div
        className={phase === 'show' ? 'crt-reveal' : 'crt-reveal-pending'}
        aria-hidden={phase !== 'show'}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <h2 id="catalog-heading" className="text-lg font-medium">
            {t.catalog.title}
          </h2>

          <nav
            className="flex flex-wrap gap-x-2 gap-y-1 -mx-1"
            aria-label={t.catalog.filterAriaLabel}
          >
            {allCategories.map((category) => {
              const isActive = active === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActive(category)}
                  disabled={phase !== 'show'}
                  className={[
                    'btn-filter min-h-10 px-2',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]',
                    isActive ? 'btn-filter-active' : 'btn-filter-inactive',
                  ].join(' ')}
                  aria-pressed={isActive}
                >
                  {isActive ? `[x] ${category}` : category}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sm:hidden border-t border-[var(--crt-border)]">
          {filtered.map((project, index) => (
            <div
              key={project.id}
              className={phase === 'show' && !instant ? 'crt-stagger-item' : undefined}
              style={
                phase === 'show' && !instant
                  ? { ['--crt-stagger' as string]: String(index) }
                  : undefined
              }
            >
              <ProjectMobileRow
                project={project}
                t={t}
                detailHref={projectDetailPath(locale, project.slug)}
              />
            </div>
          ))}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th scope="col" className="terminal-th">
                  {cols.name}
                </th>
                <th scope="col" className="terminal-th">
                  {cols.category}
                </th>
                <th scope="col" className="terminal-th hidden md:table-cell">
                  {cols.tech}
                </th>
                <th scope="col" className="terminal-th">
                  {cols.status}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project, index) => (
                <ProjectTableRow
                  key={project.id}
                  project={project}
                  t={t}
                  detailHref={projectDetailPath(locale, project.slug)}
                  staggerIndex={phase === 'show' && !instant ? index : undefined}
                />
              ))}
            </tbody>
          </table>
        </div>

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
      </div>
    </section>
  );
}
