import { useCallback, useEffect, useRef, useState } from 'react';
import type { UITranslations } from '../i18n/ui';
import site from '../data/site.json';
import Typewriter from './Typewriter';
import {
  CRT_TIMING,
  dispatchCrtIntroFeatured,
  followTerminalScroll,
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
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !shouldPlayCrtHomeIntro()) {
      setMode('instant');
      setTyped(true);
      setGate('ready');
      return subscribeCrtBootDone(() => {
        setMode('instant');
        setTyped(true);
      });
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
  const commandDone = mode === 'instant' || typed;

  useEffect(() => {
    if (gate !== 'ready' || !showBody) return;
    const instant = mode === 'instant';
    const delay = instant ? 0 : CRT_TIMING.home.afterTypedMs;
    const id = window.setTimeout(() => dispatchCrtIntroFeatured(instant), delay);
    return () => window.clearTimeout(id);
  }, [gate, showBody, mode]);

  // 非 instant：正文展开后若超出视口才跟滚
  useEffect(() => {
    if (!showBody || mode === 'instant') return;
    followTerminalScroll(tipRef.current);
    const ids = [0, 1, 2, 3].map((i) =>
      window.setTimeout(() => followTerminalScroll(tipRef.current), 80 + i * 70),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [showBody, mode]);

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

  const revealClass = showBody ? 'crt-reveal space-y-0' : 'crt-reveal-pending space-y-0';

  const onCommandDone = () => {
    setTyped(true);
  };

  return (
    <section
      className="container-main pt-24 sm:pt-28 pb-2"
      {...(t.portal.title ? { 'aria-labelledby': 'portal-heading' } : {})}
    >
      <p
        className="terminal-prompt mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1"
        style={{ color: 'var(--crt-text-muted)' }}
      >
        <span className="crt-phosphor shrink-0" style={{ color: 'var(--crt-accent)' }}>
          {t.crt.prompt}
        </span>
        {mode === 'pending' ? (
          <span className="crt-cursor crt-cursor-blink" aria-hidden="true" />
        ) : commandDone ? (
          <span className="crt-phosphor" style={{ color: 'var(--crt-text)' }}>
            {t.crt.homeCommand}
          </span>
        ) : (
          <>
            <Typewriter
              text={t.crt.homeCommand}
              charMs={CRT_TIMING.home.charMs}
              delayMs={CRT_TIMING.home.delayMs}
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

      <div ref={tipRef} className={`${revealClass} flex flex-col items-center text-center`}>
        {site.avatar && (
          <div className="mb-5">
            <img
              src={site.avatar}
              alt={t.portal.avatarAlt}
              width={72}
              height={72}
              className="w-[72px] h-[72px] object-cover border border-[var(--crt-border)]"
              style={{ backgroundColor: 'var(--crt-surface)' }}
              loading="eager"
              decoding="async"
            />
          </div>
        )}

        {t.portal.title ? (
          <h2
            id="portal-heading"
            className="text-lg font-medium crt-phosphor mb-5"
          >
            {t.portal.title}
          </h2>
        ) : null}

        <ul
          className={`w-fit space-y-3 text-left ${showBody ? '' : 'invisible'}`}
          aria-hidden={!showBody}
        >
          {portals.map((item, index) => (
            <li
              key={item.label}
              className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 sm:gap-x-0${showBody && mode !== 'instant' ? ' crt-stagger-item' : ''}`}
              style={
                showBody && mode !== 'instant'
                  ? { ['--crt-stagger' as string]: String(index) }
                  : undefined
              }
            >
              <span
                className="shrink-0 text-sm sm:w-[12em] sm:pr-4"
                style={{ color: 'var(--crt-text-muted)' }}
              >
                {item.label}
              </span>
              <a
                href={item.href}
                className="text-sm hover:opacity-70 transition-opacity duration-150"
                style={{ color: 'var(--crt-accent)' }}
                {...(item.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {item.display}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
