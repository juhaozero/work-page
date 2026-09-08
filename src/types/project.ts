/** 项目生命周期（内容字段，非在线探测状态） */
export type ProjectLifecycle = 'active' | 'maintenance' | 'archived';

export interface Project {
  id: string;
  /** URL 路径段，全局唯一 */
  slug: string;
  name: string;
  category: string;
  /** 列表短描述 */
  description: string;
  /** 详情页长描述 */
  longDescription?: string;
  /** 主演示 / 访问地址 */
  url: string;
  featured?: boolean;
  repo?: string;
  tech?: string[];
  /** ISO 日期 YYYY-MM-DD */
  createdAt?: string;
  lifecycle?: ProjectLifecycle;
  demo?: string;
  docs?: string;
  changelog?: string;
  /** 站内封面图路径；无则不上图（OG 另走 /og/projects） */
  cover?: string;
}

export interface SiteConfig {
  title: string;
  domain: string;
  url?: string;
  email: string;
  github: string;
  blog?: string;
  avatar?: string;
  seo?: {
    description?: string;
    keywords?: string[];
    author?: string;
    locale?: string;
    robots?: string;
    ogImage?: string;
    sitemap?: string;
  };
}

/** 构建期健康探测结果 */
export type ProbeReason =
  | 'ok'
  | 'http_error'
  | 'timeout'
  | 'network_error'
  | 'unknown';

export interface ProjectHealthEntry {
  online: boolean;
  httpStatus: number | null;
  reason: ProbeReason;
  error?: string;
}

export interface HealthReport {
  checkedAt: string;
  projects: Record<string, ProjectHealthEntry>;
}
