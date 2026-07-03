# 部署指南

本文档介绍如何将项目工坊部署到主流静态托管平台。

## 构建

所有平台部署前均需先完成本地构建：

```bash
npm install
npm run build
```

构建产物输出到 `dist/` 目录，包含完整的静态 HTML、CSS 和 JS 文件。




## 部署前检查清单

- [ ] 更新 `src/data/site.json` 中的邮箱和 GitHub 链接
- [ ] 更新 `src/data/projects.json` 中的项目 URL 为真实地址
- [ ] 确认 `npm run build` 无报错
- [ ] 本地 `npm run preview` 预览效果正常
- [ ] 测试分类筛选和暗黑模式切换
- [ ] 检查移动端响应式布局

## 环境要求

| 依赖 | 最低版本 |
|------|----------|
| Node.js | ≥ 22.12.0 |
| npm | ≥ 10 |

