# 开发指南

## 架构概览

```text
pages/[...locale]/
├── index.astro                   # 首页目录
├── about.astro                   # 关于 / Now
└── projects/[slug].astro         # 项目详情

index.astro
├── BaseLayout.astro              # HTML 骨架、SEO、顶栏
├── ProjectHealthInit.tsx         # 注入构建期 status.json
├── Hero.astro + FeaturedProjects
├── ProjectCatalog + ProjectCard
└── Footer.astro
```

站点采用 **Astro SSG + React Islands** 混合架构：

- 页面外壳与详情 / About 由 Astro 静态生成
- 筛选、精选、主题、语言、健康角标以 React 岛屿 `client:load` 激活
- **唯一内容源**：`src/data/projects.source.json` → 生成中英文 `projects*.json`
- **构建期健康探测**：`scripts/probe-health.mjs` → `src/data/status.json` + `public/status.json`

### 路由与多语言

| URL | 说明 |
|-----|------|
| `/` · `/en/` | 首页 |
| `/about` · `/en/about/` | 关于 |
| `/projects/:slug` · `/en/projects/:slug/` | 项目详情 |

配置见 `astro.config.mjs` 的 `i18n`（`prefixDefaultLocale: false`）与 `src/i18n/config.ts`。路径助手：`src/i18n/paths.ts`。

## 数据流

```text
projects.source.json
        │  validate + generate
        ▼
projects.json / projects.en.json
        │
        ├── probe:health ──→ status.json
        ├── generate:og  ──→ public/og/projects/*.png
        ▼
getProjects(locale)
        ├── 首页 ItemList JSON-LD + Catalog（链到详情）
        ├── 详情 SoftwareApplication JSON-LD
        └── ProjectHealthInit(initialReport)
```

### 类型与数据文件

| 文件 | 用途 |
|------|------|
| `src/types/project.ts` | `Project` / `HealthReport` 等 |
| `src/data/projects.source.json` | **唯一编辑入口**（含 `i18n.zh` / `i18n.en`） |
| `src/data/projects.json` | 生成物（中文），请勿手改 |
| `src/data/projects.en.json` | 生成物（英文），请勿手改 |
| `src/data/status.json` | 构建期探测结果 |
| `src/data/site.json` | 域名、联系方式、默认 OG |
| `src/i18n/ui.ts` | 界面与 About 文案 |

`Project` 主要字段：`id`、`slug`、`name`、`emoji`、`category`、`description`、`longDescription?`、`url`、`featured?`、`repo?`、`tech?`、`createdAt?`、`lifecycle?`、`demo?`、`docs?`、`changelog?`、`cover?`、`screenshots?`。

生命周期 `lifecycle`：`active` | `maintenance` | `archived`（与在线探测状态分离）。

## npm 脚本

| 脚本 | 作用 |
|------|------|
| `npm run validate:projects` | 校验源数据（必填、唯一、URL、双语） |
| `npm run generate:projects` | 从 source 生成中英文 JSON |
| `npm run probe:health` | 构建期探测，写 status.json |
| `npm run generate:og` | 按项目生成 OG PNG |
| `npm run prepare:content` | 上述四步串联 |
| `npm run build` | `prepare:content` + `astro build` |
| `npm run dev` | 先 `generate:projects` 再启动开发服 |

## 组件说明（要点）

### BaseLayout.astro

- SEO：canonical、hreflang、OG/Twitter、可注入 `jsonLd`
- `path` prop：当前路径（无语言前缀），供语言切换与 hreflang
- 顶栏：标题链首页、About 链、`LanguageSwitcher`、`ThemeToggle`

### 首页卡片 / 精选

卡片与精选跳转**详情页**（非直接外链）；详情页再提供打开 / 仓库等链接。

### 健康状态

- 默认使用构建期 `status.json`，避免客户端 CORS 误判
- 详情页展示最近检测时间、`reason`、HTTP 状态
- `ProjectHealthInit` 可选 `liveRefresh`（默认 `false`）

相关：`scripts/probe-health.mjs`、`src/lib/projectHealthStore.ts`、`ProjectStatus`。

### Footer.astro

版权、About、邮箱、GitHub。

## 样式系统

使用 **Tailwind CSS v4**（`src/styles/global.css`）：

- 暗黑模式：`html.dark` + `--crt-*` CRT 终端变量
- 字体系列：`JetBrains Mono` + `Noto Sans Mono` / `Noto Sans SC`

### 响应式断点（项目网格）

| 断点 | 列数 | Tailwind 前缀 |
|------|------|---------------|
| 默认（< 640px） | 1 列 | — |
| sm（≥ 640px） | 2 列 | `sm:grid-cols-2` |
| lg（≥ 1024px） | 3 列 | `lg:grid-cols-3` |

## 常见开发任务

### 新增 / 修改项目

1. **只编辑** `src/data/projects.source.json`
2. 运行 `npm run validate:projects && npm run generate:projects`（或直接 `npm run dev` / `build`）
3. 源条目示例结构：

```json
{
  "id": "5",
  "slug": "my-tool",
  "emoji": "🧪",
  "url": "https://example.com/",
  "featured": false,
  "tech": ["TypeScript"],
  "createdAt": "2026-07-15",
  "lifecycle": "active",
  "repo": "https://github.com/…",
  "i18n": {
    "zh": {
      "name": "…",
      "category": "工具",
      "description": "短描述",
      "longDescription": "详情长描述"
    },
    "en": {
      "name": "…",
      "category": "Tools",
      "description": "…",
      "longDescription": "…"
    }
  }
}
```

`slug` 需为 kebab-case，且全局唯一。

### 新增分类

在 source 的 `i18n.*.category` 使用新值即可，筛选栏自动提取。

### 修改界面 / About 文案

编辑 `src/i18n/ui.ts`；域名与默认 OG 改 `src/data/site.json`。

### 修改主题色

改 `global.css` 中 `:root` / `html.dark` 的 `--crt-*`。

### 添加多语言新页

在 `src/pages/[...locale]/` 下新建，并实现与首页相同的 `getStaticPaths`；`BaseLayout` 传入对应 `path`。

### 部署

`.github/workflows/deploy-cos.yml`：

- `main` 推送、手动触发，以及 **每天 02:00 UTC** 定时构建（刷新健康状态）
- CI 先 `validate:projects`，再 `npm run build`（内含探测与 OG 生成）
- 将 `dist/` 同步到腾讯云 COS

## 后续拓展方向

### 已完成（原 1–5）

| 项 | 现状 |
|----|------|
| 加深内容模型 | `slug` / 长描述 / tech / lifecycle / 多链接等；详情页已上线 |
| 服务检测可靠化 | 构建期探测 + status.json；详情展示时间与原因；CI 定时重建 |
| 发现与 SEO | 详情路由、按项目 OG、ItemList / SoftwareApplication |
| 产品叙事页 | `/about`（含 Now 列表） |
| 工程工作流 | source 生成双语 JSON + validate 脚本挂 CI |

