import { useEffect, useState } from 'react';
import type { Project } from '../types/project';
import type { Locale } from '../i18n/config';
import type { UITranslations } from '../i18n/ui';
import { t as format } from '../i18n/ui';
import { projectDetailPath } from '../i18n/paths';
import { projectCover } from '../lib/projectCover';
import {
  dispatchCrtIntroCatalog,
  shouldPlayCrtHomeIntro,
  subscribeCrtIntroFeatured,
} from '../lib/crtBoot';
import ProjectStatus from './ProjectStatus';
import Typewriter from './Typewriter';
import CrtCover from './CrtCover';

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
    if (phase !== 'show' || instant) return;
    const delay = 280 + projects.length * 90;
    const id = window.setTimeout(() => dispatchCrtIntroCatalog(false), delay);
    return () => window.clearTimeout(id);
  }, [phase, instant, projects.length]);

  if (projects.length === 0) return null;

  const onCommandDone = () => setPhase('show');

  return (
    <section
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
              charMs={40}
              delayMs={80}
              className="crt-phosphor"
              style={{ color: 'var(--crt-text)' }}
              onDone={onCommandDone}
            />
          )}
        </p>
      )}

      <div
        className={phase === 'show' ? 'crt-reveal space-y-4' : 'crt-reveal-pending space-y-4'}
        aria-hidden={phase !== 'show'}
      >
        <h2 id="featured-heading" className="terminal-label">
          {t.featured.label}
        </h2>

        <div className="space-y-3">
          {projects.map((project, index) => {
            const cover = projectCover(project);
            const techLine = (project.tech ?? []).slice(0, 3).join(' · ');

            return (
              <a
                key={project.id}
                href={projectDetailPath(locale, project.slug)}
                className={[
                  'terminal-card terminal-card-hover group relative flex items-stretch gap-4 p-4 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-accent)]',
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
              >
                <CrtCover
                  src={cover}
                  alt={format(t.project.coverAlt, { name: project.name })}
                  slug={project.slug}
                  loading="lazy"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 py-0.5">
                  <div className="flex items-baseline gap-3 min-w-0">
                    <h3 className="text-base font-semibold tracking-tight truncate">
                      {project.name}
                    </h3>
                    <ProjectStatus
                      projectId={project.id}
                      labels={t.status}
                      className="ml-auto shrink-0"
                    />
                  </div>

                  <p
                    className="text-sm leading-snug line-clamp-2 text-pretty"
                    style={{ color: 'var(--crt-text-muted)' }}
                  >
                    {project.description}
                  </p>

                  <div className="flex items-center gap-3 min-w-0 mt-0.5">
                    {techLine && (
                      <p
                        className="text-xs truncate tabular-nums"
                        style={{ color: 'var(--crt-text-dim)' }}
                      >
                        {techLine}
                      </p>
                    )}
                    <span
                      className="ml-auto shrink-0 text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-150"
                      style={{ color: 'var(--crt-accent)' }}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
