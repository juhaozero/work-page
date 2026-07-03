# 📦 Cursor 执行拆解文档（Astro + Tailwind 个人项目站）

## 🎯 目标

搭建一个纯静态 Portfolio 网站，支持：

- JSON 驱动项目展示
- 分类筛选
- 响应式卡片布局
- 暗黑模式
- 外链跳转
- 极简风格 UI

---

# 🧱 Step 0：初始化项目（Cursor Prompt）

## Prompt

Create a new Astro project.

Requirements:
- Use Astro + TypeScript
- Install Tailwind CSS integration
- Enable strict TypeScript
- Set up project structure for a portfolio site
- Remove default Astro template content

---

# 🎨 Step 1：Tailwind + dark mode

## tailwind.config.ts Prompt

Configure Tailwind CSS:
- darkMode: class
- primary color #3b82f6
- content paths include src/**/*.{astro,ts,tsx}

---

# 📁 Step 2：data/projects.json

Each project:
- id
- name
- emoji
- category
- description
- url

---

# 🧱 Step 3：BaseLayout.astro

- max width container
- slot
- meta tags
- dark mode support

---

# 🧩 Step 4：Header/Footer

Header:
- title + subtitle

Footer:
- email + GitHub

---

# 🧠 Step 5：FilterBar.tsx

- category filter
- active highlight
- click to filter

---

# 🧱 Step 6：ProjectCard.astro

- emoji
- name
- category tag
- description
- visit button (external link)
- hover lift + shadow

---

# 🧱 Step 7：index.astro

- load JSON
- extract categories
- filter state
- render grid:
  - mobile 1 col
  - tablet 2 col
  - desktop 3 col

---

# 🌙 Step 8：ThemeToggle

- localStorage
- system default
- toggle dark class

---

# ✨ Step 9：UI polish

- smooth hover animation
- spacing consistency
- responsive tweaks

---

# 🚀 Done

Static portfolio site ready for deployment.
