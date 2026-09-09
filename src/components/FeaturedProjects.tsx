import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '../types/project';
import type { Locale } from '../i18n/config';
import type { UITranslations } from '../i18n/ui';
import { projectDetailPath } from '../i18n/paths';
import {
  CRT_TIMING,
  dispatchCrtIntroCatalog,
  followTerminalScroll,
  shouldPlayCrtHomeIntro,
  subscribeCrtIntroFeatured,
} from '../lib/crtBoot';
import { useTypingSkip } from '../lib/useTypingSkip';
import Typewriter from './Typewriter';
import ProjectStatus from './ProjectStatus';

interface FeaturedProjectsProps {
  projects: Project[];
  locale: Locale;
  t: UITranslations;
}

type Phase = 'pending' | 'command' | 'show';

export default function FeaturedProjects({ projects, locale, t }: FeaturedProjectsProps) {
  // 与 SSR 一致先按已展示水合；首访在 effect 切入 pending
  const [phase, setPhase] = useState<Phase>('show');
  const [instant, setInstant] = useState(true);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldPlayCrtHomeIntro()) {
      setPhase('pending');
      setInstant(false);
    }

    return subscribeCrtIntroFeatured((detail) => {
      setInstant(detail.instant);
      if (detail.instant) {
        setPhase('show');
        dispatchCrtIntroCatalog(true);
      } else {
        setPhase('command');
      }
    });
  }, []);

  // cat 命令打字中：一键跳过 → 列表直接亮起并让目录也立即就绪
  const skipTyping = useCallback(() => {
    setInstant(true);
    setPhase('show');
    dispatchCrtIntroCatalog(true);
  }, []);
  useTypingSkip(phase === 'command', skipTyping);

  // 仅非 instant：打字/逐条亮起时，锚点超出视口才跟滚
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
        80 + index * 70,
      ),
    );

    const delay =
      CRT_TIMING.featured.afterShowBaseMs +
      projects.length * CRT_TIMING.featured.afterShowPerItemMs;
    const catalogId = window.setTimeout(() => dispatchCrtIntroCatalog(false), delay);

    return () => {
      ids.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(catalogId);
    };
  }, [phase, instant, projects.length]);

  if (projects.length === 0) return null;

  const onCommandDone = () => setPhase('show');

  return (
    <section
      className="w-full"
      aria-labelledby="featured-heading"
      aria-busy={phase === 'pending'}
    >
      {phase !== 'pending' && (
        <p
          ref={promptRef}
          className="terminal-prompt mb-4 sm:mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1"
          style={{ color: 'var(--crt-text-muted)' }}
        >
          <span className="crt-phosphor shrink-0" style={{ color: 'var(--crt-accent)' }}>
            {t.crt.prompt}
          </span>
          {instant || phase === 'show' ? (
            <span className="crt-phosphor" style={{ color: 'var(--crt-text)' }}>
              {t.crt.featuredCommand}
            </span>
          ) : (
            <>
              <Typewriter
                text={t.crt.featuredCommand}
                charMs={CRT_TIMING.featured.charMs}
                delayMs={CRT_TIMING.featured.delayMs}
                className="crt-phosphor"
                style={{ color: 'var(--crt-text)' }}
                onDone={onCommandDone}
              />
              <span
                className="text-[0.6875rem] shrink-0"
                style={{ color: 'var(--crt-text-dim)' }}
                aria-hidden="true"
              >
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
        <div className="crt-window crt-window--listing">
          <h2 id="featured-heading" className="sr-only">
            {t.featured.label}
          </h2>

          <ul className="featured-list list-none m-0 p-0">
            {projects.map((project, index) => (
              <li
                key={project.id}
                className={phase === 'show' && !instant ? 'crt-stagger-item' : undefined}
                style={
                  phase === 'show' && !instant
                    ? { ['--crt-stagger' as string]: String(index) }
                    : undefined
                }
              >
                <a
                  href={projectDetailPath(locale, project.slug)}
                  className="featured-entry group"
                  tabIndex={phase === 'show' ? undefined : -1}
                  aria-label={`${project.name} — ${t.featured.goTo}`}
                >
                  <div className="featured-entry-head">
                    <span className="featured-entry-mark" aria-hidden="true">
                      *
                    </span>
                    <span className="featured-entry-name">{project.name}</span>
                    <ProjectStatus
                      projectId={project.id}
                      labels={t.status}
                      className="featured-entry-status"
                    />
                  </div>
                  <p className="featured-entry-desc">{project.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
