import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const paddedIndex = String(index + 1).padStart(2, '0');

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const spotlightAlpha = isDark ? 0.08 : 0.5;

  return (
    <motion.article
      layout={!shouldReduceMotion}
      layoutId={shouldReduceMotion ? undefined : `project-${project.id}`}
      variants={shouldReduceMotion ? undefined : itemVariants}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'visible'}
      exit={shouldReduceMotion ? undefined : 'exit'}
      className="group"
    >
      <motion.a
        ref={cardRef}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        whileHover={shouldReduceMotion ? undefined : { y: -2 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="glass-card relative flex h-full flex-col overflow-hidden p-6 cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-md"
      >
        {isHovering && !shouldReduceMotion && (
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
            style={{
              background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,${spotlightAlpha}), transparent 42%)`,
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100/80 text-xl dark:bg-zinc-800/60">
              <span role="img" aria-label={project.name}>{project.emoji}</span>
            </div>
            <span className="text-xs font-medium tabular-nums text-zinc-400 dark:text-zinc-500">
              {paddedIndex}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="tag-muted">{project.category}</span>
            {project.featured && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">精选</span>
            )}
          </div>

          <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-all duration-300 ease-in-out">
            {project.name}
          </h3>

          <p className="text-sm text-zinc-500 leading-relaxed flex-1 mb-6 line-clamp-3">
            {project.description}
          </p>

          <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-auto transition-all duration-300 ease-in-out">
            打开项目
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-all duration-300 ease-in-out" aria-hidden="true">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </span>
        </div>
      </motion.a>
    </motion.article>
  );
}
