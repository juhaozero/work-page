import { useEffect } from 'react';
import { initProjectHealth } from '../lib/projectHealthStore';
import type { Project } from '../types/project';

interface ProjectHealthInitProps {
  projects: Project[];
}

/** 首页挂载时批量探测项目 URL 可用性 */
export default function ProjectHealthInit({ projects }: ProjectHealthInitProps) {
  useEffect(() => {
    initProjectHealth(projects);
  }, [projects]);

  return null;
}
