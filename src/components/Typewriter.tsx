import { useEffect, useState, type CSSProperties, type ElementType } from 'react';

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

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReduce(true);
      setShown(text);
      setDone(true);
      onDone?.();
      return;
    }

    let i = 0;
    let intervalId = 0;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          window.clearInterval(intervalId);
          setDone(true);
          onDone?.();
        }
      }, charMs);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
    // onDone 故意不入依赖，避免父组件重渲染打断打字
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
