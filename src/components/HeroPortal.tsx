import { useCallback, useEffect, useState } from 'react';
import type { UITranslations } from '../i18n/ui';
import site from '../data/site.json';
import { IconGithub, IconLink, IconMail } from './PortalIcons';
import Typewriter from './Typewriter';
import {
  CRT_TIMING,
  dispatchCrtIntroCatalog,
  shouldPlayCrtHomeIntro,
  subscribeCrtBootDone,
} from '../lib/crtBoot';
import { useTypingSkip } from '../lib/useTypingSkip';

interface HeroPortalProps {
  t: UITranslations;
}

type IntroMode = 'pending' | 'type' | 'instant';
/** ssr：水合帧；ready 后才向下游派发 intro */
type IntroGate = 'ssr' | 'ready';

const techStack = ['React', 'Vue', 'TypeScript', , 'Golang'];

export default function HeroPortal({ t }: HeroPortalProps) {
  // 始终以「已展示」水合，与 SSR（shouldPlay=false）一致；开场在 effect 里切入
  const [mode, setMode] = useState<IntroMode>('instant');
  const [typed, setTyped] = useState(true);
  const [gate, setGate] = useState<IntroGate>('ssr');

  useEffect(() => {
    if (!shouldPlayCrtHomeIntro()) {
      setMode('instant');
      setTyped(true);
      setGate('ready');
      return;
    }

    setMode('pending');
    setTyped(false);
    setGate('ready');

    return subscribeCrtBootDone((detail) => {
      if (detail.typing) {
        setMode('type');
      } else {
        setMode('instant');
        setTyped(true);
      }
    });
  }, []);

  // 仅在打字尚未完成时武装 skip；打完后卸监听，避免误跳后续分区
  const skipTyping = useCallback(() => {
    setMode('instant');
    setTyped(true);
  }, []);
  useTypingSkip(mode === 'type' && !typed, skipTyping, CRT_TIMING.home.skipGuardMs);

  const showBody = mode === 'instant' || typed;

  useEffect(() => {
    if (gate !== 'ready' || !showBody) return;
    const instant = mode === 'instant';
    const delay = instant ? 0 : CRT_TIMING.home.afterTypedMs;
    const id = window.setTimeout(() => dispatchCrtIntroCatalog(instant), delay);
    return () => window.clearTimeout(id);
  }, [gate, showBody, mode]);

  const githubDisplay = site.github.replace(/^https?:\/\//, '');
  const portals = [
    {
      label: t.portal.github,
      href: site.github,
      display: githubDisplay,
      external: true,
      Icon: IconGithub,
    },
    {
      label: t.portal.email,
      href: `mailto:${site.email}`,
      display: site.email,
      external: false,
      Icon: IconMail,
    },
    {
      label: t.portal.blog,
      href: site.blog ?? '#',
      display: site.blog ?? '',
      external: true,
      Icon: IconLink,
    },
  ].filter((p) => p.display);

  const revealClass = showBody ? 'crt-reveal' : 'crt-reveal-pending';

  const onCommandDone = () => {
    setTyped(true);
  };

  return (
    <section className="w-full" aria-labelledby="portal-heading">
      <p className="terminal-prompt relative mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:mb-6">
        <span className="terminal-prompt-user shrink-0">{t.crt.prompt}</span>
        {showBody ? (
          <span className="terminal-prompt-cmd">{t.crt.homeCommand}</span>
        ) : mode === 'type' && (
          <>
            <Typewriter
              text={t.crt.homeCommand}
              charMs={CRT_TIMING.home.charMs}
              delayMs={CRT_TIMING.home.delayMs}
              className="terminal-prompt-cmd"
              onDone={onCommandDone}
            />
            <span className="terminal-prompt-hint shrink-0 max-sm:absolute max-sm:top-full max-sm:left-0" aria-hidden="true">
              {t.crt.skipHint}
            </span>
          </>
        )}
      </p>

      <div
        className={`${revealClass} grid items-start gap-x-6 gap-y-4 min-[52rem]:grid-cols-[minmax(0,1fr)_auto]`}
        aria-hidden={!showBody}
      >
        <div className="grid min-w-0 gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            {site.avatar && (
              <img
                src={site.avatar}
                alt={t.portal.avatarAlt}
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-sm object-cover"
                style={{ backgroundColor: 'var(--crt-surface)' }}
                loading="eager"
                decoding="async"
              />
            )}
            <div className="min-w-0">
              <h1 id="portal-heading" className="hero-name">
                {t.site.seo.author}
              </h1>
              <p className="hero-intro">{t.portal.introBody}</p>
            </div>
          </div>
          <ul className="flex flex-wrap gap-1.5" aria-label={t.portal.stackLabel}>
            {techStack.map((tech) => <li className="tech-tag" key={tech}>{tech}</li>)}
          </ul>
        </div>

        <ul className="flex flex-wrap items-center gap-2 min-[52rem]:justify-end">
          {portals.map((item, index) => (
            <li
              key={item.href}
              className={showBody && mode !== 'instant' ? 'crt-stagger-item' : undefined}
              style={
                showBody && mode !== 'instant'
                  ? { ['--crt-stagger' as string]: String(index) }
                  : undefined
              }
            >
              <a
                href={item.href}
                className="portal-link"
                aria-label={`${item.label}: ${item.display}`}
                tabIndex={showBody ? undefined : -1}
                {...(item.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <item.Icon className="shrink-0" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
