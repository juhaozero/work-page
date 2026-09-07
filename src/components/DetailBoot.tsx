import Typewriter from './Typewriter';

interface DetailBootProps {
  prompt: string;
  command: string;
}

/** 详情页顶部：打出 cat/open 命令，营造 CRT 会话感 */
export default function DetailBoot({ prompt, command }: DetailBootProps) {
  return (
    <p
      className="terminal-prompt mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-1"
      style={{ color: 'var(--crt-text-muted)' }}
    >
      <span className="crt-phosphor shrink-0" style={{ color: 'var(--crt-accent)' }}>
        {prompt}
      </span>
      <Typewriter
        text={command}
        charMs={26}
        delayMs={180}
        className="crt-phosphor break-all"
        style={{ color: 'var(--crt-text)' }}
      />
    </p>
  );
}
