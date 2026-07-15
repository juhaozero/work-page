import type { Locale } from './config';
import type { ProjectLifecycle, ProbeReason } from '../types/project';

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
    home: string;
    about: string;
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
    detailsLabel: string;
    backToCatalog: string;
    techLabel: string;
    linksLabel: string;
    demo: string;
    docs: string;
    changelog: string;
    repo: string;
    createdAt: string;
    lifecycle: Record<ProjectLifecycle, string>;
    coverAlt: string;
  };
  status: {
    checking: string;
    online: string;
    offline: string;
    ariaChecking: string;
    ariaOnline: string;
    ariaOffline: string;
    checkedAt: string;
    reason: Record<ProbeReason, string>;
  };
  about: {
    title: string;
    seoDescription: string;
    introTitle: string;
    introBody: string;
    stackTitle: string;
    stackBody: string;
    nowTitle: string;
    nowItems: string[];
    backHome: string;
  };
  footer: {
    contact: string;
    github: string;
    about: string;
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

const ui: Record<Locale, UITranslations> = {
  zh: {
    site: {
      title: '项目炼金室',
      eyebrow: '零散项目合集',
      heroTitle: '加一点毒蘑菇\n再加点旧鞋跟',
      heroDescription: '一些零散的项目合集,打开即用。',
      tagline: '',
      seo: {
        description: '一些零散的项目合集,打开即用。集中展示个人开发的 Web 工具与小项目。',
        keywords: ['个人项目', '工具合集', '开源', 'Web 应用', '项目展示'],
        author: 'juhaozero',
      },
    },
    nav: {
      online: '◉ 在线',
      home: '首页',
      about: '关于',
    },
    hero: {
      projectsTotal: '共 {count} 个项目',
      featuredCount: '{count} 个精选',
    },
    featured: {
      label: '精选项目',
      ariaLabel: '精选项目',
      pinLabel: '精选项目',
      goTo: '详情',
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
      detailsLabel: '查看详情 →',
      backToCatalog: '← 返回目录',
      techLabel: '技术栈',
      linksLabel: '相关链接',
      demo: '演示',
      docs: '文档',
      changelog: '更新日志',
      repo: '仓库',
      createdAt: '创建于 {date}',
      lifecycle: {
        active: '运行中',
        maintenance: '维护中',
        archived: '已归档',
      },
      coverAlt: '{name} 封面',
    },
    status: {
      checking: '◌ 检测中',
      online: '◉ 在线',
      offline: '◯ 离线',
      ariaChecking: '服务检测中',
      ariaOnline: '服务在线',
      ariaOffline: '服务离线',
      checkedAt: '最近检测：{time}',
      reason: {
        ok: '可达',
        http_error: 'HTTP 错误',
        timeout: '超时',
        network_error: '网络错误',
        unknown: '未知',
      },
    },
    about: {
      title: '关于炼金室',
      seoDescription: '项目炼金室的设定',
      introTitle: '这是什么',
      introBody:
        '个人作品的索引站,收纳一些个人的小项目',
      stackTitle: '怎么做的',
      stackBody:
        'Astro 静态生成 + React 交互岛屿，Tailwind 驱动 CRT 终端视觉；中英文由一份 projects.source.json 生成，构建与 CI 会校验数据并写入健康状态。',
      nowTitle: '最近动态',
      nowItems: [
        '新增了无水印下载工具',
      ],
      backHome: '← 返回首页',
    },
    footer: {
      contact: '◆ 联系',
      github: '▶ GitHub',
      about: '◇ 关于',
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
      tagline: '',
      seo: {
        description:
          'A collection of small projects — open and use instantly. Showcasing personal Web tools and side projects.',
        keywords: ['personal projects', 'tools', 'open source', 'web apps', 'portfolio'],
        author: 'juhaozero',
      },
    },
    nav: {
      online: '◉ Online',
      home: 'Home',
      about: 'About',
    },
    hero: {
      projectsTotal: '{count} projects total',
      featuredCount: '{count} featured',
    },
    featured: {
      label: 'Featured',
      ariaLabel: 'Featured projects',
      pinLabel: 'Featured project',
      goTo: 'Details',
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
      detailsLabel: 'View details →',
      backToCatalog: '← Back to catalog',
      techLabel: 'Tech stack',
      linksLabel: 'Links',
      demo: 'Demo',
      docs: 'Docs',
      changelog: 'Changelog',
      repo: 'Repository',
      createdAt: 'Created {date}',
      lifecycle: {
        active: 'Active',
        maintenance: 'Maintenance',
        archived: 'Archived',
      },
      coverAlt: 'Cover for {name}',
    },
    status: {
      checking: '◌ Checking',
      online: '◉ Online',
      offline: '◯ Offline',
      ariaChecking: 'Service checking',
      ariaOnline: 'Service online',
      ariaOffline: 'Service offline',
      checkedAt: 'Last checked: {time}',
      reason: {
        ok: 'Reachable',
        http_error: 'HTTP error',
        timeout: 'Timeout',
        network_error: 'Network error',
        unknown: 'Unknown',
      },
    },
    about: {
      title: 'About the Lab',
      seoDescription: 'What Project Alchemy Lab is, how it is built, and what is new.',
      introTitle: 'What this is',
      introBody:
        'A personal project index: collect some small projects.',
      stackTitle: 'How it is built',
      stackBody:
        'Astro SSG with React islands and a CRT terminal look via Tailwind. zh/en project files are generated from projects.source.json; CI validates data and writes health status.',
      nowTitle: 'Recent dynamic',
      nowItems: [
        'Added a watermark video download tool',
      ],
      backHome: '← Back home',
    },
    footer: {
      contact: '◆ Contact',
      github: '▶ GitHub',
      about: '◇ About',
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
