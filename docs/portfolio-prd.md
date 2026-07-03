# 📄 PRD：个人项目展示站（Portfolio Hub）

## 1. 项目概述

### 1.1 项目名称
Personal Project Hub

### 1.2 项目目标
构建一个极简风格的个人项目展示网站，用于集中展示所有项目，并支持外链访问。

### 1.3 核心特性
- 纯静态站点（Astro）
- JSON驱动数据展示
- 分类筛选
- 响应式卡片布局
- 暗黑/亮色模式
- hover动效
- 外链访问

---

## 2. 技术栈

- Astro（SSG）
- Tailwind CSS
- TypeScript
- JSON 数据源

---

## 3. 信息架构

/
├── Header
├── Filter Bar
├── Project Grid
└── Footer

---

## 4. 功能需求

### 4.1 Header
- 标题
- 副标题

### 4.2 分类筛选
- All + categories
- 点击过滤

### 4.3 项目卡片
字段：
- emoji
- name
- category
- description
- url

行为：
- hover上浮
- 阴影增强
- 新窗口打开链接

### 4.4 Grid布局
- mobile: 1列
- tablet: 2列
- desktop: 3列

### 4.5 Dark Mode
- class切换
- 默认跟随系统
- localStorage保存

### 4.6 Footer
- email
- GitHub

---

## 5. UI设计规范

风格：
- 极简
- 大留白
- 圆角卡片

配色：

Light:
- bg: white
- text: gray-900

Dark:
- bg: gray-900
- text: gray-100

Accent:
- blue #3b82f6

---

## 6. 非功能需求

- Lighthouse > 90
- 首屏 < 1s
- SEO友好
- 完全静态

---

## 7. 数据结构

projects.json

{
  id,
  name,
  emoji,
  category,
  description,
  url
}

---

## 8. 扩展方向

- 项目详情页
- MDX支持
- 搜索功能
- CMS接入
