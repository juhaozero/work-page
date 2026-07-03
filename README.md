# 项目工坊 · Personal Project Hub

极简风格的个人项目展示站，集中展示所有作品，支持分类筛选、暗黑模式与外链跳转。

## 技术栈

| 技术 | 用途 |
|------|------|
| [Astro](https://astro.build) | 静态站点生成（SSG） |
| [Tailwind CSS](https://tailwindcss.com) | 样式与响应式布局 |
| [React](https://react.dev) | 交互组件（筛选栏、主题切换） |
| [TypeScript](https://www.typescriptlang.org) | 类型安全 |
| JSON | 项目数据源 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:4321）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```text
/
├── docs/                    # 项目文档
│   ├── portfolio-prd.md     # 产品需求文档
│   ├── cursor-astro-portfolio-task.md  # 开发任务拆解
│   └── development.md       # 开发指南
├── public/                  # 静态资源
├── src/
│   ├── components/          # UI 组件
│   │   ├── FilterBar.tsx    # 分类筛选栏
│   │   ├── Footer.astro     # 页脚
│   │   ├── Header.astro     # 页头
│   │   ├── ProjectCard.astro # 项目卡片
│   │   └── ThemeToggle.tsx  # 暗黑模式切换
│   ├── data/
│   │   ├── projects.json    # 项目数据
│   │   └── site.json        # 站点配置
│   ├── layouts/
│   │   └── BaseLayout.astro # 基础布局
│   ├── pages/
│   │   └── index.astro      # 首页
│   ├── styles/
│   │   └── global.css       # 全局样式
│   └── types/
│       └── project.ts       # 类型定义
├── astro.config.mjs
├── package.json
└── tsconfig.json
```



### 添加 / 修改项目

编辑 `src/data/projects.json`，每个项目包含以下字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识 |
| `name` | string | ✅ | 项目名称 |
| `emoji` | string | ✅ | 项目图标 |
| `category` | string | ✅ | 分类（用于筛选） |
| `description` | string | ✅ | 项目描述 |
| `url` | string | ✅ | 外链地址 |
| `featured` | boolean | ❌ | 是否标记为「精选」 |

## 功能特性

- **JSON 驱动** — 修改数据文件即可更新展示内容，无需改动代码
- **分类筛选** — 自动从项目数据提取分类，支持一键过滤
- **响应式布局** — 移动端 1 列、平板 2 列、桌面 3 列
- **暗黑模式** — 默认跟随系统偏好，支持手动切换并持久化到 localStorage
- **极简 UI** — 大留白、圆角卡片、hover 上浮动效
- **SEO 友好** — 语义化 HTML、meta 标签、纯静态输出

## 部署

支持部署到任意静态托管平台：

- [Vercel](https://vercel.com) — 海外访问，零配置
- [腾讯云 COS + CDN](https://cloud.tencent.com/product/cos) — 国内访问，成本低
- [Cloudflare Pages](https://pages.cloudflare.com)
- [Netlify](https://netlify.com)
- GitHub Pages

以 Vercel 为例：

```bash
npm run build
# 将 dist/ 目录部署，或直接关联 Git 仓库自动部署
```

## 文档

- [产品需求文档（PRD）](./docs/portfolio-prd.md)
- [开发任务拆解](./docs/cursor-astro-portfolio-task.md)
- [开发指南](./docs/development.md)

## License

MIT
