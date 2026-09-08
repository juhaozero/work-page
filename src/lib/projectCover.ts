import type { Project } from '../types/project';

/** 社交分享用的 OG 图（meta，不用于站内展示） */
export function projectOgImage(project: Project): string {
  return `/og/projects/${project.slug}.png`;
}

/** 站内封面：仅真实 cover，无则不上图 */
export function projectCoverImage(project: Project): string | null {
  const cover = project.cover?.trim();
  return cover ? cover : null;
}
