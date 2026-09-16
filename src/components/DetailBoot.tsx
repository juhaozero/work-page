import Typewriter from './Typewriter';
import { CRT_TIMING } from '../lib/crtBoot';

interface DetailBootProps {
  prompt: string;
  command: string;
}

/** 详情页顶部：打出 cat/open 命令，营造 CRT 会话感 */
export default function DetailBoot({ prompt, command }: DetailBootProps) {
  return (
    <p className="terminal-prompt mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="terminal-prompt-user shrink-0">{prompt}</span>
      <Typewriter
        text={command}
        charMs={CRT_TIMING.detail.charMs}
        delayMs={CRT_TIMING.detail.delayMs}
        className="terminal-prompt-cmd break-all"
      />
    </p>
  );
}
