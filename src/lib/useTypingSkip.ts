import { useEffect } from 'react';

const SKIP_KEYS = new Set(['Escape', 'Enter', ' ']);

/**
 * 打字动画进行中允许“点按 / Esc / Enter / Space”一键跳过。
 * armed 为 true 时挂全局监听；onSkip 触发后由调用方决定如何快进。
 * guardMs：武装后短暂忽略输入，避免上一阶段 skip 的同一次手势连跳。
 */
export function useTypingSkip(
  armed: boolean,
  onSkip: () => void,
  guardMs = 0,
): void {
  useEffect(() => {
    if (!armed) return;

    let canSkip = guardMs <= 0;
    const guardId =
      guardMs > 0
        ? window.setTimeout(() => {
            canSkip = true;
          }, guardMs)
        : 0;

    const trySkip = () => {
      if (!canSkip) return;
      canSkip = false;
      onSkip();
    };

    const onPointer = () => trySkip();

    const onKey = (e: KeyboardEvent) => {
      if (!SKIP_KEYS.has(e.key)) return;
      if (e.key === ' ') e.preventDefault();
      trySkip();
    };

    // capture 阶段监听，保证点在子元素上也能命中
    window.addEventListener('pointerdown', onPointer, true);
    window.addEventListener('keydown', onKey);

    return () => {
      if (guardId) window.clearTimeout(guardId);
      window.removeEventListener('pointerdown', onPointer, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [armed, onSkip, guardMs]);
}
