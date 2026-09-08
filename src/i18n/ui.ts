import type { Locale } from './config';
import type { ProjectLifecycle, ProbeReason } from '../types/project';

export interface SiteTranslations {
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
    about: string;
  };
  portal: {
    title: string;
    avatarAlt: string;
    github: string;
    email: string;
    blog: string;
    about: string;
  };
  hero: {
    projectsTotal: string;
    featuredCount: string;
  };
  featured: {
    label: string;
    goTo: string;
  };
  catalog: {
    title: string;
    filterAll: string;
    filterAriaLabel: string;
    emptyTitle: string;
    emptyHint: string;
    columns: {
      name: string;
      category: string;
      tech: string;
      status: string;
    };
  };
  project: {
    openLabel: string;
    backToCatalog: string;
    techLabel: string;
    linksLabel: string;
    summaryLabel: string;
    lifecycleLabel: string;
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
    whoamiCommand: string;
    metaHost: string;
    metaStack: string;
    metaLocale: string;
  };
  footer: {
    contact: string;
    github: string;
    about: string;
    exitLine: string;
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
  crt: {
    prompt: string;
    homeCommand: string;
    detailCommand: string;
    bootTitle: string;
    bootLines: [string, string, string, string];
    bootSkip: string;
    featuredCommand: string;
    catalogCommand: string;
  };
}

const ui: Record<Locale, UITranslations> = {
  zh: {
    site: {
      seo: {
        description: '一些零散的项目合集,打开即用。集中展示个人开发的 Web 工具与小项目。',
        keywords: ['个人项目', '工具合集', '开源', 'Web 应用', '项目展示'],
        author: 'juhaozero',
      },
    },
    nav: {
      online: '◉ 在线',
      about: '关于',
    },
    portal: {
      title: '个人小项目索引',
      avatarAlt: '头像',
      github: 'GitHub',
      blog: '博客',
      email: '电子邮件',
      about: '关于',
    },
    hero: {
      projectsTotal: '共 {count} 个项目',
      featuredCount: '{count} 个精选',
    },
    featured: {
      label: '精选项目',
      goTo: '详情',
    },
    catalog: {
      title: '个人作品',
      filterAll: '全部',
      filterAriaLabel: '项目分类筛选',
      emptyTitle: '未找到匹配的项目',
      emptyHint: '试试切换其他分类',
      columns: {
        name: '名称',
        category: '分类',
        tech: '技术',
        status: '状态',
      },
    },
    project: {
      openLabel: '打开项目',
      backToCatalog: '← 返回目录',
      techLabel: '技术栈',
      linksLabel: '相关链接',
      summaryLabel: '简介',
      lifecycleLabel: '生命周期',
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
      title: '关于本站',
      seoDescription: '个人小项目索引站：技术栈、近期动态与站点说明。',
      introTitle: '这是什么',
      introBody: '个人作品的索引站，收纳一些打开即用的小项目与工具。',
      stackTitle: '怎么做的',
      stackBody:
        'Astro 静态生成 + React 交互岛屿，Tailwind 驱动现代终端窗视觉；中英文由一份 projects.source.json 生成，构建与 CI 会校验数据并写入健康状态。',
      nowTitle: '最近动态',
      nowItems: ['新增了无水印下载工具'],
      backHome: '← 返回首页',
      whoamiCommand: 'whoami',
      metaHost: 'host',
      metaStack: 'stack',
      metaLocale: 'locale',
    },
    footer: {
      contact: '联系',
      github: 'GitHub',
      about: '关于',
      exitLine: 'exit 0',
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
    crt: {
      prompt: 'guest@dev:~$',
      homeCommand: 'ls ~/home',
      detailCommand: 'cat projects/{slug}.md',
      bootTitle: 'Terminal',
      bootLines: [
        '> loading shell…',
        '> source ~/.profile…',
        '> cd ~/dev…',
        '> ready.',
      ],
      bootSkip: 'click / esc to skip',
      featuredCommand: 'cat ~/featured.list',
      catalogCommand: 'ls -l ~/projects',
    },
  },
  en: {
    site: {
      seo: {
        description:
          'A collection of small projects — open and use instantly. Showcasing personal Web tools and side projects.',
        keywords: ['personal projects', 'tools', 'open source', 'web apps', 'portfolio'],
        author: 'juhaozero',
      },
    },
    nav: {
      online: '◉ Online',
      about: 'About',
    },
    portal: {
      title: 'Personal tools index',
      avatarAlt: 'Avatar',
      github: 'GitHub',
      blog: 'Blog',
      email: 'Email',
      about: 'About',
    },
    hero: {
      projectsTotal: '{count} projects total',
      featuredCount: '{count} featured',
    },
    featured: {
      label: 'Featured',
      goTo: 'Details',
    },
    catalog: {
      title: 'Personal works',
      filterAll: 'All',
      filterAriaLabel: 'Project category filter',
      emptyTitle: 'No matching projects',
      emptyHint: 'Try another category',
      columns: {
        name: 'Name',
        category: 'Category',
        tech: 'Tech',
        status: 'Status',
      },
    },
    project: {
      openLabel: 'Open project',
      backToCatalog: '← Back to catalog',
      techLabel: 'Tech stack',
      linksLabel: 'Links',
      summaryLabel: 'Summary',
      lifecycleLabel: 'Lifecycle',
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
      title: 'About',
      seoDescription:
        'About this personal project index: stack, recent notes, and site notes.',
      introTitle: 'What this is',
      introBody:
        'A personal project index for small tools you can open and use instantly.',
      stackTitle: 'How it is built',
      stackBody:
        'Astro SSG with React islands and a modern terminal-window look via Tailwind. zh/en project files are generated from projects.source.json; CI validates data and writes health status.',
      nowTitle: 'Recent notes',
      nowItems: ['Added a watermark-free video download tool'],
      backHome: '← Back home',
      whoamiCommand: 'whoami',
      metaHost: 'host',
      metaStack: 'stack',
      metaLocale: 'locale',
    },
    footer: {
      contact: 'Contact',
      github: 'GitHub',
      about: 'About',
      exitLine: 'exit 0',
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
    crt: {
      prompt: 'guest@dev:~$',
      homeCommand: 'ls ~/home',
      detailCommand: 'cat projects/{slug}.md',
      bootTitle: 'Terminal',
      bootLines: [
        '> loading shell…',
        '> source ~/.profile…',
        '> cd ~/dev…',
        '> ready.',
      ],
      bootSkip: 'click / esc to skip',
      featuredCommand: 'cat ~/featured.list',
      catalogCommand: 'ls -l ~/projects',
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
