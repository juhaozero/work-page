import { useEffect } from 'react';
import { initProjectHealth } from '../lib/projectHealthStore';
import type { HealthReport, Project } from '../types/project';

interface ProjectHealthInitProps {
  projects: Project[];
  initialReport?: HealthReport | null;
  /** 默认 false：优先使用构建期 status，避免客户端 CORS 误判 */
  liveRefresh?: boolean;
}

/** 首页挂载时注入构建期健康状态（可选再做客户端刷新） */
export default function ProjectHealthInit({
  projects,
  initialReport = null,
  liveRefresh = false,
}: ProjectHealthInitProps) {
  useEffect(() => {
    initProjectHealth(projects, { initialReport, liveRefresh });
  }, [projects, initialReport, liveRefresh]);

  return null;
}
