import type { Project } from '../types/project';

/** 站内封面路径（保留供资产脚本等使用；列表/详情已改用字形块） */
export function projectCover(project: Project): string {
  return project.cover ?? `/covers/projects/${project.slug}.png`;
}

/** 社交分享 OG 图（与站内 CRT 封面分离） */
export function projectOgImage(project: Project): string {
  return `/og/projects/${project.slug}.png`;
}
