import type { Project, ProjectKind } from '../types/project';

/** 解析交付形态；缺省为 web */
export function getProjectKind(project: Project): ProjectKind {
  return project.kind ?? 'web';
}

/**
 * 健康探测目标 URL：
 * - web → url
 * - package → downloadUrl
 */
export function getProbeUrl(project: Project): string | null {
  const kind = getProjectKind(project);
  switch (kind) {
    case 'web':
      return project.url ?? null;
    case 'package':
      return project.downloadUrl ?? null;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export type ProjectPrimaryAction =
  | { href: string; action: 'open' }
  | { href: string; action: 'download' };

/** 详情页主 CTA；无可用地址时返回 null */
export function getPrimaryAction(project: Project): ProjectPrimaryAction | null {
  const kind = getProjectKind(project);
  switch (kind) {
    case 'web':
      return project.url ? { href: project.url, action: 'open' } : null;
    case 'package':
      return project.downloadUrl
        ? { href: project.downloadUrl, action: 'download' }
        : null;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
