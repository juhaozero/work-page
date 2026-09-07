import type { Project } from '../types/project';

/** 站内展示封面：显式 cover，否则 CRT 风格 `/covers/projects/{slug}.png` */
export function projectCover(project: Project): string {
  return project.cover ?? `/covers/projects/${project.slug}.png`;
}

/** 社交分享 OG 图（与站内 CRT 封面分离） */
export function projectOgImage(project: Project): string {
  return `/og/projects/${project.slug}.png`;
}
