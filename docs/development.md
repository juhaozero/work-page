# 开发指南

本文档介绍项目工坊（Personal Project Hub）的架构设计、组件说明与常见开发任务。

## 架构概览

```text
index.astro
├── BaseLayout.astro        # HTML 骨架、meta、主题初始化脚本
│   └── ThemeToggle.tsx     # 右上角暗黑模式按钮
├── Header.astro            # 标题 + 副标题
├── FilterBar.tsx           # 分类筛选（React 客户端组件）
├── ProjectCard.astro × N   # 项目卡片（静态渲染）
└── Footer.astro            # 邮箱 + GitHub 链接
```

站点采用 **Astro SSG + React Islands** 混合架构：

- 页面主体由 Astro 在构建时静态生成，首屏加载极快
- 仅筛选栏和主题切换按钮以 React 组件形式在客户端激活（`client:load`）
- 项目数据来自 JSON 文件，构建时注入页面

## 数据流

```text
projects.json ──→ index.astro ──→ ProjectCard.astro（静态 HTML）
site.json     ──→ index.astro ──→ Header / Footer
                └──→ FilterBar.tsx（categories 数组作为 props）
```

### 类型定义

`src/types/project.ts` 中定义了 `Project` 和 `SiteConfig` 接口，修改 JSON 结构时需同步更新类型。

## 组件说明

### BaseLayout.astro

基础 HTML 布局，负责：

- 引入全局样式 `global.css`
- 设置 `lang="zh-CN"` 与 SEO meta 标签
- 内联脚本：在页面渲染前读取 localStorage / 系统偏好，避免主题闪烁（FOUC）
- 固定定位的 `ThemeToggle` 按钮

### Header.astro

接收 `title` 和 `subtitle` props，居中展示站点标题与描述。

### FilterBar.tsx

React 客户端组件，功能：

1. 接收 `categories` 数组，自动添加「全部」选项
2. 点击按钮时通过 `data-category` 属性显示/隐藏对应 `.project-card` 元素
3. 当前选中分类高亮为蓝色（`bg-primary`）

> 筛选逻辑直接操作 DOM，避免将整个卡片列表转为 React 组件，保持 Astro 静态渲染的优势。

### ProjectCard.astro

单个项目卡片，包含：

- 序号（No.01、No.02…）
- emoji 图标、分类标签、项目名称
- 描述文字
- 「打开 →」外链按钮（`target="_blank"`）
- 可选「精选」角标（`featured: true`）
- hover 时上浮 + 阴影增强

### ThemeToggle.tsx

暗黑模式切换按钮：

- 初始化时读取 `localStorage.getItem('theme')`，无记录则跟随 `prefers-color-scheme`
- 切换时在 `<html>` 上添加/移除 `dark` class
- 偏好写入 localStorage 持久化

### Footer.astro

展示版权年份、邮箱（`mailto:` 链接）和 GitHub 外链。

## 样式系统

使用 **Tailwind CSS v4**，配置位于 `src/styles/global.css`：

```css
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary: #3b82f6;
}
```

- 暗黑模式通过 `html.dark` class 切换（非 `prefers-color-scheme` 媒体查询）
- 主题色 `--color-primary` 对应 PRD 中的 Accent Blue `#3b82f6`
- 在组件中使用 `text-primary`、`bg-primary` 等工具类

### 响应式断点

| 断点 | 列数 | Tailwind 前缀 |
|------|------|---------------|
| 默认（< 768px） | 1 列 | — |
| md（≥ 768px） | 2 列 | `md:grid-cols-2` |
| lg（≥ 1024px） | 3 列 | `lg:grid-cols-3` |

## 常见开发任务

### 新增一个项目

1. 打开 `src/data/projects.json`
2. 在数组末尾添加新对象，确保 `id` 唯一
3. 保存后开发服务器会自动热更新

### 新增一个分类

无需额外配置。在 `projects.json` 中使用新的 `category` 值，筛选栏会自动提取并显示。

### 修改主题色

编辑 `src/styles/global.css` 中的 `--color-primary` 值即可全局生效。

### 添加新页面

在 `src/pages/` 下创建 `.astro` 文件，Astro 会按文件名自动生成路由。新页面可复用 `BaseLayout.astro`：

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="关于">
  <main>页面内容</main>
</BaseLayout>
```

## 性能与 SEO

- 全站静态输出，无服务端运行时
- 仅 2 个 React Islands（FilterBar + ThemeToggle），JS 体积极小
- `<html lang="zh-CN">`、语义化标签、`aria-label` 无障碍属性
- Google Fonts 使用 `preconnect` 优化加载

目标指标（PRD）：

- Lighthouse 各维度 > 90
- 首屏加载 < 1s（静态托管 + CDN）

## 扩展方向

以下功能可在当前架构上渐进添加：

| 功能 | 建议方案 |
|------|----------|
| 项目详情页 | `src/pages/projects/[id].astro` 动态路由 |
| MDX 内容 | `@astrojs/mdx` + Content Collections |
| 搜索功能 | 客户端 Fuse.js 或 Pagefind |
| CMS 接入 | Sanity / Contentful，构建时拉取数据 |
| 多语言 | Astro i18n 路由 |

## 故障排查

### 主题切换后页面闪烁

确保 `BaseLayout.astro` 中的内联 `<script is:inline>` 未被移除，它负责在 CSS 加载前设置 `dark` class。

### 筛选按钮无反应

检查 `ProjectCard.astro` 的根元素是否包含 `class="project-card"` 和 `data-category` 属性。

### 样式未生效

确认 `global.css` 已在 `BaseLayout.astro` 中 `import`，且 `astro.config.mjs` 包含 `@tailwindcss/vite` 插件。
