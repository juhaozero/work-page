import { useEffect, useRef, useState } from 'react';
import Typewriter from './Typewriter';
import {
  CRT_BOOT_CLASS,
  CRT_TIMING,
  dispatchCrtBootDone,
  markCrtHomeIntroPlayed,
  resetCrtIntroLatches,
  shouldPlayCrtHomeIntro,
} from '../lib/crtBoot';

interface CrtBootShieldProps {
  /** 标题栏文案，如 github.com/juhaozero */
  windowTitle: string;
  bootLines: readonly [string, string, string, string] | string[];
  bootSkip: string;
}

/**
 * 开机遮罩：macOS 终端窗 + 4 行串行打字；点按/Esc 可跳过。
 * SSR 输出壳层，配合 head 内联脚本的 html.crt-boot 首屏即铺底色。
 */
export default function CrtBootShield({
  windowTitle,
  bootLines,
  bootSkip,
}: CrtBootShieldProps) {
  const lines = [...bootLines];
  const [dismissed, setDismissed] = useState(false);
  const [typing, setTyping] = useState(false);
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [showSkip, setShowSkip] = useState(false);
  const finishedRef = useRef(false);
  const canSkipRef = useRef(false);

  const finish = (nextTyping: boolean) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.documentElement.classList.remove(CRT_BOOT_CLASS);
    // 解锁 overflow 后钉回顶部，避免被下方已挂载区块带偏滚动位置
    window.scrollTo(0, 0);
    setDismissed(true);
    dispatchCrtBootDone(nextTyping);
  };

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!shouldPlayCrtHomeIntro() || reduce) {
      root.classList.remove(CRT_BOOT_CLASS);
      resetCrtIntroLatches();
      finishedRef.current = true;
      setDismissed(true);
      dispatchCrtBootDone(false);
      return;
    }

    markCrtHomeIntroPlayed();
    resetCrtIntroLatches();

    if (!root.classList.contains(CRT_BOOT_CLASS)) {
      finishedRef.current = true;
      setDismissed(true);
      dispatchCrtBootDone(true);
      return;
    }

    setTyping(true);

    const guard = window.setTimeout(() => {
      canSkipRef.current = true;
      setShowSkip(true);
    }, CRT_TIMING.boot.skipGuardMs);

    const skipNow = () => {
      if (!canSkipRef.current || finishedRef.current) return;
      setCompleted(lines);
      setActive(lines.length);
      // 只跳过开机遮罩；首页分区打字继续，需再点一次才跳过
      finish(true);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!canSkipRef.current) return;
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        skipNow();
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', skipNow, true);

    return () => {
      window.clearTimeout(guard);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', skipNow, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLineDone = () => {
    if (finishedRef.current) return;
    const idx = active;
    const line = lines[idx];
    setCompleted((prev) => (prev.length > idx ? prev : [...prev, line]));

    if (idx >= lines.length - 1) {
      setActive(lines.length);
      window.setTimeout(() => finish(true), CRT_TIMING.boot.endHoldMs);
      return;
    }

    window.setTimeout(() => {
      if (!finishedRef.current) setActive(idx + 1);
    }, CRT_TIMING.boot.lineGapMs);
  };

  if (dismissed) return null;

  const typingLine =
    typing && active < lines.length && completed.length === active
      ? lines[active]
      : null;

  return (
    <div className="crt-boot-shield crt-boot-shield--live" aria-hidden="true">
      <div className="crt-boot-window">
        <div className="crt-boot-titlebar">
          <div className="crt-boot-traffic">
            <span className="crt-boot-dot crt-boot-dot--close" />
            <span className="crt-boot-dot crt-boot-dot--min" />
            <span className="crt-boot-dot crt-boot-dot--max" />
          </div>
          <p className="crt-boot-title">{windowTitle}</p>
          <span aria-hidden="true" />
        </div>
        <div className="crt-boot-body">
          <ul className="crt-boot-lines crt-boot-lines--live">
            {completed.map((line, i) => (
              <li key={`done-${i}`}>{line}</li>
            ))}
            {typingLine && (
              <li key={`active-${active}`}>
                <Typewriter
                  text={typingLine}
                  charMs={CRT_TIMING.boot.charMs}
                  delayMs={active === 0 ? CRT_TIMING.boot.firstLineDelayMs : 0}
                  cursor
                  onDone={onLineDone}
                />
              </li>
            )}
          </ul>
          {showSkip ? (
            <p className="crt-boot-skip crt-boot-skip--live">{bootSkip}</p>
          ) : (
            <p className="crt-boot-skip crt-boot-skip--live" style={{ visibility: 'hidden' }}>
              {bootSkip}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
