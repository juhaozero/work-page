import type { Project } from '../types/project';
import type { Locale } from '../i18n/config';
import type { UITranslations } from '../i18n/ui';
import { projectDetailPath } from '../i18n/paths';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProjectIndexRow } from './ProjectCard';
import {
  CRT_TIMING,
  followTerminalScroll,
  subscribeCrtIntroCatalog,
  shouldPlayCrtHomeIntro,
} from '../lib/crtBoot';
import { useTypingSkip } from '../lib/useTypingSkip';
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
  // 与 SSR 一致先按已展示水合；首访在 effect 切入 pending
  const [active, setActive] = useState(filterAll);
  const [phase, setPhase] = useState<Phase>('show');
  const [instant, setInstant] = useState(true);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldPlayCrtHomeIntro()) {
      setPhase('pending');
      setInstant(false);
    }

    return subscribeCrtIntroCatalog((detail) => {
      setInstant(detail.instant);
      if (detail.instant) {
        setPhase('show');
      } else {
        setPhase('command');
      }
    });
  }, []);

  // 仅非 instant：打字/列表亮起超出视口才跟滚
  useEffect(() => {
    if (instant || phase === 'pending') return;
    const tip = phase === 'command' ? promptRef.current : listRef.current;
    followTerminalScroll(tip);
  }, [phase, instant]);

  useEffect(() => {
    if (phase !== 'show' || instant) return;
    const ids = projects.map((_, index) =>
      window.setTimeout(
        () => followTerminalScroll(listRef.current),
        100 + index * 70,
      ),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [phase, instant, projects.length]);

  // ls 命令打字中：一键跳过 → 列表直接亮起
  const skipTyping = useCallback(() => {
    setInstant(true);
    setPhase('show');
  }, []);
  useTypingSkip(phase === 'command', skipTyping);

  const filtered = useMemo(
    () => (active === filterAll ? projects : projects.filter((p) => p.category === active)),
    [active, filterAll, projects],
  );

  const allCategories = [filterAll, ...categories];
  const onCommandDone = () => setPhase('show');

  return (
    <section
      className="w-full"
      aria-labelledby="catalog-heading"
      aria-busy={phase === 'pending'}
    >
      {phase !== 'pending' && (
        <p
          ref={promptRef}
          className="terminal-prompt mb-4 sm:mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1"
        >
          <span className="terminal-prompt-user shrink-0">{t.crt.prompt}</span>
          {instant || phase === 'show' ? (
            <span className="terminal-prompt-cmd">{t.crt.catalogCommand}</span>
          ) : (
            <>
              <Typewriter
                text={t.crt.catalogCommand}
                charMs={CRT_TIMING.catalog.charMs}
                delayMs={CRT_TIMING.catalog.delayMs}
                className="terminal-prompt-cmd"
                onDone={onCommandDone}
              />
              <span className="terminal-prompt-hint shrink-0" aria-hidden="true">
                {t.crt.skipHint}
              </span>
            </>
          )}
        </p>
      )}

      <div
        ref={listRef}
        className={phase === 'show' ? 'crt-reveal' : 'crt-reveal-pending'}
        aria-hidden={phase !== 'show'}
      >
        <h2 id="catalog-heading" className="sr-only">
          {t.catalog.title}
        </h2>

        <div className="crt-listing-filter">
          <span className="crt-listing-filter-flag" aria-hidden="true">
            type:
          </span>
          <nav
            className="crt-listing-filter-nav"
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
                    'btn-filter',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]',
                    isActive ? 'btn-filter-active' : 'btn-filter-inactive',
                  ].join(' ')}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="crt-listing-body">
          {filtered.map((project, index) => (
            <ProjectIndexRow
              key={project.id}
              project={project}
              detailHref={projectDetailPath(locale, project.slug)}
              staggerIndex={phase === 'show' && !instant ? index : undefined}
              tabIndex={phase === 'show' ? undefined : -1}
            />
          ))}

          {filtered.length === 0 && (
            <div className="crt-listing-empty" role="status">
              <p className="m-0 text-sm" style={{ color: 'var(--crt-text-muted)' }}>
                {t.catalog.emptyTitle}
              </p>
              <p className="m-0 text-xs mt-2" style={{ color: 'var(--crt-text-dim)' }}>
                {t.catalog.emptyHint}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
