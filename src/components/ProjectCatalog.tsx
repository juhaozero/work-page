import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import type { Project } from '../types/project';

interface ProjectCatalogProps {
  projects: Project[];
  categories: string[];
}

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export default function ProjectCatalog({ projects, categories }: ProjectCatalogProps) {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState('全部');

  const filtered = useMemo(
    () => (active === '全部' ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  );

  const allCategories = ['全部', ...categories];

  return (
    <section aria-labelledby="catalog-heading">
      <div className="space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-1">
            <h2 id="catalog-heading" className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              全部项目
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              显示{' '}
              <span className="tabular-nums font-medium text-zinc-700 dark:text-zinc-300">
                {filtered.length}
              </span>{' '}
              / {projects.length} 个
            </p>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="项目分类筛选">
            {allCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={[
                  'btn-filter',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2',
                  'dark:focus-visible:ring-offset-zinc-950',
                  active === category ? 'btn-filter-active' : 'btn-filter-inactive',
                ].join(' ')}
                aria-pressed={active === category}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <LayoutGroup>
        <motion.div
          layout={!shouldReduceMotion}
          variants={shouldReduceMotion ? undefined : gridVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => {
              const originalIndex = projects.findIndex((p) => p.id === project.id);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={originalIndex}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      <AnimatePresence>
        {filtered.length === 0 && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="glass-card flex flex-col items-center py-16 text-center mt-6"
            role="status"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 dark:text-zinc-500 mb-4" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <p className="text-sm text-zinc-500 leading-relaxed">暂无匹配的项目</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">试试切换其他分类</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
