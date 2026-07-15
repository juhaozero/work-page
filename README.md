# 项目炼金室 · Personal Project Hub

终端风格的个人项目展示站：集中索引作品，支持分类筛选、精选、暗黑模式、中英双语、项目详情与构建期服务探测。

线上地址：https://work.juhaozero.com

## 技术栈

| 技术 | 用途 |
|------|------|
| [Astro](https://astro.build) | 静态站点生成（SSG）+ 多语言路由 |
| [Tailwind CSS](https://tailwindcss.com) v4 | CRT 主题与响应式布局 |
| [React](https://react.dev) | 交互岛屿（筛选、主题、语言、健康状态） |
| [TypeScript](https://www.typescriptlang.org) | 类型安全 |
| JSON | 统一源数据生成中英文项目列表 |

## 快速开始

```bash
# 安装依赖（需 Node.js ≥ 22.12）
npm install

# 启动开发（会先从 projects.source.json 生成双语数据）
npm run dev

# 校验 + 生成 + 健康探测 + OG + 构建
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```text
/
├── docs/development.md          # 开发指南与拓展方向
├── scripts/
│   ├── generate-projects.mjs    # source → 中英文 JSON
│   ├── validate-projects.mjs    # 源数据校验
│   ├── probe-health.mjs         # 构建期 URL 探测
│   └── generate-og.mjs          # 项目 OG 图
├── src/
│   ├── data/
│   │   ├── projects.source.json # ★ 唯一编辑入口
│   │   ├── projects.json        # 生成物（中文）
│   │   ├── projects.en.json     # 生成物（英文）
│   │   ├── status.json          # 健康探测结果
│   │   └── site.json
│   ├── i18n/ · components/ · layouts/ · lib/ · pages/ · styles/ · types/
├── .github/workflows/deploy-cos.yml
└── package.json
```

细节见 [docs/development.md](docs/development.md)。

## 添加 / 修改项目

编辑 `src/data/projects.source.json`（不要手改生成出的 `projects*.json`），然后：

```bash
npm run validate:projects
npm run generate:projects
```

共享字段示例：`id`、`slug`、`emoji`、`url`、`featured`、`tech`、`createdAt`、`lifecycle`、`repo`、`demo`、`docs`；文案放在 `i18n.zh` / `i18n.en`。

## 功能特性

- **统一源数据** — 一份 source 生成中英文，CI 校验防漂移
- **项目详情** — `/projects/:slug`，长描述、技术栈、多链接
- **About / Now** — `/about` 叙事与近期动态
- **构建期探测** — 写入 status.json，详情页展示检测时间与原因
- **SEO** — hreflang、ItemList / SoftwareApplication、按项目 OG
- **分类筛选 · 精选 · 暗黑模式 · CRT 视觉**
- **部署** — `main` 推送与每日定时构建后同步腾讯云 COS

## License

MIT
