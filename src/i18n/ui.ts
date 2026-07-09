import type { Locale } from './config';

export interface SiteTranslations {
  title: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  tagline: string;
  seo: {
    description: string;
    keywords: string[];
    author: string;
  };
}

export interface UITranslations {
  site: SiteTranslations;
  nav: {
    online: string;
  };
  hero: {
    projectsTotal: string;
    featuredCount: string;
  };
  featured: {
    label: string;
    ariaLabel: string;
    pinLabel: string;
    goTo: string;
  };
  catalog: {
    divider: string;
    title: string;
    showing: string;
    of: string;
    categoryPrefix: string;
    filterAll: string;
    filterAriaLabel: string;
    emptyTitle: string;
    emptyHint: string;
  };
  project: {
    indexLabel: string;
    openLabel: string;
  };
  status: {
    checking: string;
    online: string;
    offline: string;
    ariaChecking: string;
    ariaOnline: string;
    ariaOffline: string;
  };
  footer: {
    contact: string;
    github: string;
  };
  theme: {
    toLight: string;
    toDark: string;
    light: string;
    dark: string;
  };
  langSwitcher: {
    ariaLabel: string;
  };
}
/** 多语言配置 */

const ui: Record<Locale, UITranslations> = {
  zh: {
    site: {
      title: '项目炼金室',
      eyebrow: '零散项目合集',
      heroTitle: '加一点毒蘑菇\n再加点旧鞋跟',
      heroDescription: '一些零散的项目合集,打开即用。',
      tagline: '瞎搞日常',
      seo: {
        description: '一些零散的项目合集,打开即用。集中展示个人开发的 Web 工具与小项目。',
        keywords: ['个人项目', '工具合集', '开源', 'Web 应用', '项目展示'],
        author: 'juhaozero',
      },
    },
    nav: {
      online: '◉ 在线',
    },
    hero: {
      projectsTotal: '共 {count} 个项目',
      featuredCount: '{count} 个精选',
    },
    featured: {
      label: '精选项目',
      ariaLabel: '精选项目',
      pinLabel: '精选项目',
      goTo: '前往',
    },
    catalog: {
      divider: '-- 项目目录 ----------------------------------------------',
      title: '全部项目',
      showing: '显示',
      of: '/ {total} 个',
      categoryPrefix: ' · 分类：',
      filterAll: '全部',
      filterAriaLabel: '项目分类筛选',
      emptyTitle: '未找到匹配的项目',
      emptyHint: '试试切换其他分类',
    },
    project: {
      indexLabel: '项目 {index}',
      openLabel: '打开项目 →',
    },
    status: {
      checking: '◌ 检测中',
      online: '◉ 在线',
      offline: '◯ 离线',
      ariaChecking: '服务检测中',
      ariaOnline: '服务在线',
      ariaOffline: '服务离线',
    },
    footer: {
      contact: '◆ 联系',
      github: '▶ GitHub',
    },
    theme: {
      toLight: '切换为亮色模式',
      toDark: '切换为暗色模式',
      light: '[ 亮色 ]',
      dark: '[ 暗色 ]',
    },
    langSwitcher: {
      ariaLabel: '切换语言',
    },
  },
  en: {
    site: {
      title: 'Project Alchemy Lab',
      eyebrow: 'Misc project collection',
      heroTitle: 'A pinch of poison mushroom\nAnd a dash of old shoe heel',
      heroDescription: 'A collection of small projects — open and use instantly.',
      tagline: 'Daily tinkering',
      seo: {
        description:
          'A collection of small projects — open and use instantly. Showcasing personal Web tools and side projects.',
        keywords: ['personal projects', 'tools', 'open source', 'web apps', 'portfolio'],
        author: 'juhaozero',
      },
    },
    nav: {
      online: '◉ Online',
    },
    hero: {
      projectsTotal: '{count} projects total',
      featuredCount: '{count} featured',
    },
    featured: {
      label: 'Featured',
      ariaLabel: 'Featured projects',
      pinLabel: 'Featured project',
      goTo: 'Open',
    },
    catalog: {
      divider: '-- Project catalog ----------------------------------------',
      title: 'All projects',
      showing: 'Showing',
      of: ' / {total}',
      categoryPrefix: ' · Category: ',
      filterAll: 'All',
      filterAriaLabel: 'Project category filter',
      emptyTitle: 'No matching projects',
      emptyHint: 'Try another category',
    },
    project: {
      indexLabel: 'Project {index}',
      openLabel: 'Open project →',
    },
    status: {
      checking: '◌ Checking',
      online: '◉ Online',
      offline: '◯ Offline',
      ariaChecking: 'Service checking',
      ariaOnline: 'Service online',
      ariaOffline: 'Service offline',
    },
    footer: {
      contact: '◆ Contact',
      github: '▶ GitHub',
    },
    theme: {
      toLight: 'Switch to light mode',
      toDark: 'Switch to dark mode',
      light: '[ Light ]',
      dark: '[ Dark ]',
    },
    langSwitcher: {
      ariaLabel: 'Switch language',
    },
  },
};

export function getTranslations(locale: Locale): UITranslations {
  return ui[locale];
}

/** 替换 `{key}` 占位符 */
export function t(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
}
