import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { UITranslations } from '../i18n/ui';
import site from '../data/site.json';
import Typewriter from './Typewriter';
import {
  CRT_TIMING,
  dispatchCrtIntroCatalog,
  followTerminalScroll,
  shouldPlayCrtHomeIntro,
  subscribeCrtBootDone,
} from '../lib/crtBoot';
import { useTypingSkip } from '../lib/useTypingSkip';
import { IconGithub, IconLink, IconMail } from './PortalIcons';

interface HeroPortalProps {
  t: UITranslations;
}

type IntroMode = 'pending' | 'type' | 'instant';
/** ssr：水合帧；ready 后才向下游派发 intro */
type IntroGate = 'ssr' | 'ready';

type PortalKind = 'github' | 'email' | 'blog';

const PORTAL_ICONS: Record<PortalKind, ReactNode> = {
  github: <IconGithub className="portal-row-icon" />,
  email: <IconMail className="portal-row-icon" />,
  blog: <IconLink className="portal-row-icon" />,
};

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
    const id = window.setTimeout(() => dispatchCrtIntroCatalog(instant), delay);
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
  const portals: {
    kind: PortalKind;
    label: string;
    href: string;
    display: string;
    external: boolean;
  }[] = [
    {
      kind: 'github',
      label: t.portal.github,
      href: site.github,
      display: githubDisplay,
      external: true,
    },
    {
      kind: 'email',
      label: t.portal.email,
      href: `mailto:${site.email}`,
      display: site.email,
      external: false,
    },
    {
      kind: 'blog',
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
    <section
      className="w-full"
      {...(t.portal.title ? { 'aria-labelledby': 'portal-heading' } : {})}
    >
      <p className="terminal-prompt mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="terminal-prompt-user shrink-0">{t.crt.prompt}</span>
        {mode === 'pending' ? (
          <span className="crt-cursor crt-cursor-blink" aria-hidden="true" />
        ) : commandDone ? (
          <span className="terminal-prompt-cmd">{t.crt.homeCommand}</span>
        ) : (
          <>
            <Typewriter
              text={t.crt.homeCommand}
              charMs={CRT_TIMING.home.charMs}
              delayMs={CRT_TIMING.home.delayMs}
              className="terminal-prompt-cmd"
              onDone={onCommandDone}
            />
            <span className="terminal-prompt-hint shrink-0" aria-hidden="true">
              {t.crt.skipHint}
            </span>
          </>
        )}
      </p>

      <div ref={tipRef} className={`${revealClass} flex flex-col items-start text-left`}>
        {site.avatar && (
          <div className="mb-5">
            <img
              src={site.avatar}
              alt={t.portal.avatarAlt}
              width={64}
              height={64}
              className="w-16 h-16 object-cover border border-[var(--crt-border)]"
              style={{ backgroundColor: 'var(--crt-surface)' }}
              loading="eager"
              decoding="async"
            />
          </div>
        )}

        {t.portal.title ? (
          <h2
            id="portal-heading"
            className="text-base font-medium mb-5"
            style={{ color: 'var(--crt-text)' }}
          >
            {t.portal.title}
          </h2>
        ) : null}

        <ul
          className={`w-full space-y-1 ${showBody ? '' : 'invisible'}`}
          aria-hidden={!showBody}
        >
          {portals.map((item, index) => (
            <li
              key={item.kind}
              className={showBody && mode !== 'instant' ? 'crt-stagger-item' : undefined}
              style={
                showBody && mode !== 'instant'
                  ? { ['--crt-stagger' as string]: String(index) }
                  : undefined
              }
            >
              <a
                href={item.href}
                className="portal-row"
                aria-label={`${item.label}: ${item.display}`}
                tabIndex={showBody ? undefined : -1}
                {...(item.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <span className="portal-row-icon-wrap">{PORTAL_ICONS[item.kind]}</span>
                <span className="portal-row-text">{item.display}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
