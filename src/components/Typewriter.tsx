import { useEffect, useRef, useState, type CSSProperties, type ElementType } from 'react';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface TypewriterProps {
  text: string;
  /** 每个字符间隔 ms */
  charMs?: number;
  /** 开始前延迟 ms */
  delayMs?: number;
  className?: string;
  style?: CSSProperties;
  /** 打完后是否保留闪烁光标 */
  cursor?: boolean;
  onDone?: () => void;
  as?: ElementType;
}

export default function Typewriter({
  text,
  charMs = 28,
  delayMs = 200,
  className,
  style,
  cursor = true,
  onDone,
  as: Tag = 'span',
}: TypewriterProps) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const [reduce, setReduce] = useState(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const reducedMotion = prefersReducedMotion();
    setReduce(reducedMotion);
    if (reducedMotion || !text) {
      setShown(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    setShown('');
    setDone(false);
    const characters = Array.from(text);
    const start = performance.now() + delayMs;
    const step = Math.max(1, charMs);
    let count = 0;
    let frame = 0;

    const tick = (now: number) => {
      const next = Math.min(characters.length, Math.max(0, Math.floor((now - start) / step) + 1));
      if (next !== count) {
        count = next;
        setShown(characters.slice(0, count).join(''));
      }
      if (count === characters.length) {
        setDone(true);
        onDoneRef.current?.();
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [text, charMs, delayMs]);

  return (
    <Tag className={className} style={style} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
      {cursor && !reduce && (
        <span
          className={done ? 'crt-cursor crt-cursor-blink' : 'crt-cursor'}
          aria-hidden="true"
        />
      )}
    </Tag>
  );
}
