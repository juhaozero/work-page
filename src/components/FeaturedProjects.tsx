import { useEffect, useRef, useState } from 'react';
import type { Project } from '../types/project';
import type { Locale } from '../i18n/config';
import type { UITranslations } from '../i18n/ui';
import { projectDetailPath } from '../i18n/paths';
import { projectCoverImage } from '../lib/projectCover';
import {
  CRT_TIMING,
  dispatchCrtIntroCatalog,
  followTerminalScroll,
  shouldPlayCrtHomeIntro,
  subscribeCrtIntroFeatured,
} from '../lib/crtBoot';
import Typewriter from './Typewriter';
import ProjectStatus from './ProjectStatus';

interface FeaturedProjectsProps {
  projects: Project[];
  locale: Locale;
  t: UITranslations;
}

type Phase = 'pending' | 'command' | 'show';

export default function FeaturedProjects({ projects, locale, t }: FeaturedProjectsProps) {
  const skipIntro = !shouldPlayCrtHomeIntro();
  const [phase, setPhase] = useState<Phase>(skipIntro ? 'show' : 'pending');
  const [instant, setInstant] = useState(skipIntro);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (phase === 'pending' || instant) return;
    followTerminalScroll(sectionRef.current);
  }, [phase, instant]);

  useEffect(() => {
    if (phase !== 'show' || instant) return;

    const ids = projects.map((_, index) =>
      window.setTimeout(
        () => followTerminalScroll(sectionRef.current),
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
      ref={sectionRef}
      className="pb-4"
      aria-labelledby="featured-heading"
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
              {t.crt.featuredCommand}
            </span>
          ) : (
            <Typewriter
              text={t.crt.featuredCommand}
              charMs={CRT_TIMING.featured.charMs}
              delayMs={CRT_TIMING.featured.delayMs}
              className="crt-phosphor"
              style={{ color: 'var(--crt-text)' }}
              onDone={onCommandDone}
            />
          )}
        </p>
      )}

      <div
        className={phase === 'show' ? 'crt-reveal space-y-3' : 'crt-reveal-pending space-y-3'}
        aria-hidden={phase !== 'show'}
      >
        <h2 id="featured-heading" className="terminal-label">
          {t.featured.label}
        </h2>

        <ul className="flex flex-col gap-3 list-none m-0 p-0">
          {projects.map((project, index) => {
            const cover = projectCoverImage(project);
            const techPreview = (project.tech ?? []).slice(0, 3).join(' · ');

            return (
              <li key={project.id}>
                <a
                  href={projectDetailPath(locale, project.slug)}
                  className={[
                    'featured-card group',
                    !cover ? 'featured-card--text' : '',
                    phase === 'show' && !instant ? 'crt-stagger-item' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={
                    phase === 'show' && !instant
                      ? { ['--crt-stagger' as string]: String(index) }
                      : undefined
                  }
                  tabIndex={phase === 'show' ? undefined : -1}
                  aria-label={`${project.name} — ${t.featured.goTo}`}
                >
                  {cover ? (
                    <div className="featured-card-media">
                      <img
                        src={cover}
                        alt=""
                        width={224}
                        height={126}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </div>
                  ) : null}
                  <div className="featured-card-body min-w-0 flex-1">
                    <h3
                      className="text-[1.0625rem] sm:text-[1.125rem] font-semibold tracking-tight text-balance"
                      style={{ color: 'var(--crt-text)' }}
                    >
                      {project.name}
                    </h3>
                    <p
                      className="text-sm mt-1.5 line-clamp-2 text-pretty leading-snug"
                      style={{ color: 'var(--crt-text-muted)' }}
                    >
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {techPreview ? (
                        <span
                          className="text-xs truncate max-w-full"
                          style={{ color: 'var(--crt-text-dim)' }}
                        >
                          {techPreview}
                        </span>
                      ) : null}
                      <ProjectStatus
                        projectId={project.id}
                        labels={t.status}
                        className="ml-auto"
                      />
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
