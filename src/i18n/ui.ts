import type { Locale } from './config';
import type {
  ProjectLifecycle,
  ProjectKind,
  ProbeReason,
} from '../types/project';

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
    downloadLabel: string;
    backToCatalog: string;
    techLabel: string;
    linksLabel: string;
    summaryLabel: string;
    lifecycleLabel: string;
    kindLabel: string;
    versionLabel: string;
    kind: Record<ProjectKind, string>;
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
    available: string;
    unavailable: string;
    ariaChecking: string;
    ariaOnline: string;
    ariaOffline: string;
    ariaAvailable: string;
    ariaUnavailable: string;
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
    catalogCommand: string;
    skipHint: string;
  };
}

const ui: Record<Locale, UITranslations> = {
  zh: {
    site: {
      seo: {
        description: '收录我开发的小工具与网页应用：浏览器里打开即用，轻量、克制、无打扰。',
        keywords: ['个人项目', '工具合集', '开源', 'Web 应用', '项目展示'],
        author: 'juhaozero',
      },
    },
    nav: {
      online: '◉ 在线',
      about: '关于',
    },
    portal: {
      title: '',
      avatarAlt: '头像',
      github: 'GitHub',
      blog: '博客',
      email: '电子邮件',
      about: '关于',
    },
    catalog: {
      title: '作品',
      filterAll: '全部',
      filterAriaLabel: '项目分类筛选',
      emptyTitle: 'ls: 没有匹配的条目',
      emptyHint: '换个 type 再试',
      columns: {
        name: '名称',
        category: '分类',
        tech: '技术',
        status: '状态',
      },
    },
    project: {
      openLabel: '打开项目',
      downloadLabel: '下载最新版',
      backToCatalog: '← 返回目录',
      techLabel: '技术栈',
      linksLabel: '相关链接',
      summaryLabel: '简介',
      lifecycleLabel: '生命周期',
      kindLabel: '类型',
      versionLabel: '版本',
      kind: {
        web: '网页',
        package: '安装包',
      },
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
      available: '◉ 发布可用',
      unavailable: '◯ 不可用',
      ariaChecking: '服务检测中',
      ariaOnline: '服务在线',
      ariaOffline: '服务离线',
      ariaAvailable: '安装包可下载',
      ariaUnavailable: '安装包不可用',
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
      nowItems: ['重构整个UI界面'],
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
      bootSkip: '点按 / Esc 跳过',
      catalogCommand: 'ls ~/projects',
      skipHint: '· 点按跳过',
    },
  },
  en: {
    site: {
      seo: {
        description:
          'Small web tools and apps I build — open in the browser, no install. Lightweight and to the point.',
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
    catalog: {
      title: 'Works',
      filterAll: 'All',
      filterAriaLabel: 'Project category filter',
      emptyTitle: 'ls: no matches found',
      emptyHint: 'try another type',
      columns: {
        name: 'Name',
        category: 'Category',
        tech: 'Tech',
        status: 'Status',
      },
    },
    project: {
      openLabel: 'Open project',
      downloadLabel: 'Download latest',
      backToCatalog: '← Back to catalog',
      techLabel: 'Tech stack',
      linksLabel: 'Links',
      summaryLabel: 'Summary',
      lifecycleLabel: 'Lifecycle',
      kindLabel: 'Type',
      versionLabel: 'Version',
      kind: {
        web: 'Web',
        package: 'Package',
      },
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
      available: '◉ Available',
      unavailable: '◯ Unavailable',
      ariaChecking: 'Service checking',
      ariaOnline: 'Service online',
      ariaOffline: 'Service offline',
      ariaAvailable: 'Release available',
      ariaUnavailable: 'Release unavailable',
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
      nowItems: ['Launched “UnWatermark” — resolve share links into clean downloads.'],
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
      catalogCommand: 'ls ~/projects',
      skipHint: '· click to skip',
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
