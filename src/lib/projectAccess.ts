import type { Project, ProjectKind, ReleasePlatform } from '../types/project';

/** 解析交付形态；缺省为 web */
export function getProjectKind(project: Project): ProjectKind {
  return project.kind ?? 'web';
}

/**
 * 健康探测目标 URL：
 * - web → url
 * - package → downloadUrl → releases[0].url → url
 */
export function getProbeUrl(project: Project): string | null {
  const kind = getProjectKind(project);
  switch (kind) {
    case 'web':
      return project.url ?? null;
    case 'package':
      return (
        project.downloadUrl ??
        project.releases?.[0]?.url ??
        project.url ??
        null
      );
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
    case 'package': {
      const href =
        project.downloadUrl ?? project.releases?.[0]?.url ?? project.url;
      return href ? { href, action: 'download' } : null;
    }
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

/** 从 releases 推导 operatingSystem 文案（JSON-LD 等） */
export function releasePlatformsLabel(
  platforms: ReleasePlatform[] | undefined,
): string {
  if (!platforms?.length) return 'Any';
  const unique = [...new Set(platforms)];
  return unique
    .map((platform) => {
      switch (platform) {
        case 'windows':
          return 'Windows';
        case 'macos':
          return 'macOS';
        case 'linux':
          return 'Linux';
        case 'android':
          return 'Android';
        case 'ios':
          return 'iOS';
        case 'other':
          return 'Other';
        default: {
          const _exhaustive: never = platform;
          return _exhaustive;
        }
      }
    })
    .join(', ');
}
