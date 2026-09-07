import { useEffect } from 'react';
import {
  CRT_BOOT_CLASS,
  CRT_BOOT_DURATION_MS,
  CRT_BOOT_SKIP_GUARD_MS,
  dispatchCrtBootDone,
  resetCrtIntroLatches,
} from '../lib/crtBoot';

/**
 * 首页开机控制器：每次进入都播；仅 reduced-motion 跳过点亮。
 * 遮罩 DOM 由 BaseLayout SSR，首屏靠 html.crt-boot 显示。
 */
export default function CrtBootController() {
  useEffect(() => {
    resetCrtIntroLatches();

    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      root.classList.remove(CRT_BOOT_CLASS);
      dispatchCrtBootDone(false);
      return;
    }

    if (!root.classList.contains(CRT_BOOT_CLASS)) {
      // 亮色等：无遮罩，仍播打字
      dispatchCrtBootDone(true);
      return;
    }

    let finished = false;
    let canSkip = false;
    const guard = window.setTimeout(() => {
      canSkip = true;
    }, CRT_BOOT_SKIP_GUARD_MS);

    const finish = () => {
      if (finished) return;
      finished = true;
      root.classList.remove(CRT_BOOT_CLASS);
      dispatchCrtBootDone(true);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer, true);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!canSkip) return;
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        finish();
      }
    };
    const onPointer = () => {
      if (!canSkip) return;
      finish();
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer, true);
    const timer = window.setTimeout(finish, CRT_BOOT_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(guard);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer, true);
    };
  }, []);

  return null;
}
