import { useCallback, useEffect, useState } from 'react';
import type { UITranslations } from '../i18n/ui';
import site from '../data/site.json';
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
    },
    {
      label: t.portal.email,
      href: `mailto:${site.email}`,
      display: site.email,
      external: false,
    },
    {
      label: t.portal.blog,
      href: site.blog ?? '#',
      display: site.blog ?? '',
      external: true,
    },
  ].filter((p) => p.display);

  const revealClass = showBody ? 'crt-reveal' : 'crt-reveal-pending';

  const onCommandDone = () => {
    setTyped(true);
  };

  return (
    <section className="w-full" aria-labelledby="portal-heading">
      <p className="terminal-prompt relative mb-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="terminal-prompt-accent shrink-0">{t.crt.prompt}</span>
        {showBody ? (
          <span className="terminal-prompt-cmd">{t.crt.homeCommand}</span>
        ) : mode === 'pending' ? (
          <span className="crt-cursor crt-cursor-blink" aria-hidden="true" />
        ) : (
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
        className={`${revealClass} flex flex-wrap items-center justify-between gap-x-8 gap-y-4`}
        aria-hidden={!showBody}
      >
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          {site.avatar && (
            <img
              src={site.avatar}
              alt={t.portal.avatarAlt}
              width={64}
              height={64}
              className="size-14 shrink-0 rounded-sm object-cover sm:size-16"
              style={{ backgroundColor: 'var(--crt-surface)' }}
              loading="eager"
              decoding="async"
            />
          )}
          <div className="font-sans">
            <h1 id="portal-heading" className="text-2xl font-semibold leading-tight sm:text-[1.75rem]">
              {t.site.seo.author}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--crt-text-muted)] sm:text-base">
              {t.portal.title}
            </p>
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 sm:gap-x-8">
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
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
