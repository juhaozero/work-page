# UI 设计审阅与改进梳理

> 范围：全站视觉与交互（首页为重点）  
> 立场：保留现有 **CRT 终端** 美学，不推倒重做；针对「项目展示偏廉价」做有优先级的升格方案。  
> 日期：2026-09-07

---

## 1. Design Direction Summary

| 项 | 内容 |
| --- | --- |
| **现有美学名** | CRT Terminal / 终端索引站 |
| **建议坚持方向** | *Curated Terminal Index*（策展感的终端目录，而非「emoji + 列表」工具页） |
| **DFII（建议方向）** | **13 / 15** → 可完整执行，但要控制组件变体数量 |
| **概念灵感** | 老式 CRT 终端的信息密度 + 独立开发者作品集的「策展感」；像 `ls` 出结果，而不是像 Notion 卡片墙 |

**DFII 拆分（建议方向）**

| Dimension | Score | 说明 |
| --- | --- | --- |
| Aesthetic Impact | 4 | CRT 已有辨识度；升格后可更难忘 |
| Context Fit | 5 | 个人工具/小项目索引，终端隐喻贴切 |
| Implementation Feasibility | 5 | Astro + Tailwind CSS 变量即可落地 |
| Performance Safety | 4 | 避免重动画与大图瀑布；封面按需 |
| Consistency Risk | −2 | 精选/目录若层级不清会分裂成两套 UI |
| **DFII** | **13** | Excellent → 按阶段执行 |

**差异化锚点（去掉 logo 仍应认出）**

> 墨绿 CRT 底 + JetBrains Mono + 扫描线 + 方角边框 + 「在线/离线」状态语法。

廉价感主要来自：**锚点足够，但项目条目没有吃到这套语法的「重量」**——仍停在 emoji 行列表。

---

## 2. Design System Snapshot（现状）

### 2.1 字体

| 角色 | 当前 | 评价 |
| --- | --- | --- |
| 全站唯一 | JetBrains Mono + Noto Sans Mono / SC | 符合 CRT；缺一层「展示级」对比（标题与正文同一声部） |

**建议**：继续以 Mono 为身体；精选标题可用同族加粗 / 略大字号阶梯，**不要**引入第二套无衬线展示字体，以免冲掉终端感。

### 2.2 颜色（CSS 变量，已成型）

```text
--crt-bg / surface / text / muted / dim
--crt-border / border-dim
--crt-accent / glow / scanline
```

亮色：浅绿灰底 + 深绿字；暗色：近黑绿底 + `#5fe66a` 磷光字。体系清晰，应继续 **只通过变量改主题**，禁止组件内硬编码色（`status-offline` 例外可保留，但建议收进变量）。

### 2.3 空间节奏

| Token（事实约定） | 用途 |
| --- | --- |
| `container-main` max 1200 + px-6/8 | 全站栏宽 |
| `pt-24/28` | 顶栏避让 |
| `space-y-3/4`、`py-3` | 列表行距 |

问题：精选与目录同属 `space-y-12` 容器，**区块呼吸接近，层级不够「一主一次」**。

### 2.4 运动哲学（现状偏弱）

- 已装 `framer-motion`，首页几乎未用
- 交互多为 `opacity` / `border-color` 150ms
- 有 `prefers-reduced-motion` 全局降速（好）

**建议哲学**：CSS-first；**一次进场**（精选区 stagger）+ **少量 hover 态**（边框/光晕/`translate` 1px），禁止装饰性微动效刷屏。

### 2.5 纹理与深度

- `body::before` 扫描线：轻、对题
- 卡片背景多为 `transparent`：精选「框」在，**体」不在
- `featured-pin`：有手作感，但被 emoji 方块抢走注意力

---

## 3. 信息架构与页面地图

```text
首页
├── Header（在线 · 站名 · 关于 · 语言 · 主题）
├── Hero / Portal（头像 + 外链列表）← 文案标题常为空
├── FeaturedProjects（精选卡片条）← 刚恢复挂载；视觉重量不足
├── ProjectCatalog（分类 + 行列表）← 「廉价感」主战场
└── Footer

详情 /projects/:slug
├── 返回 · emoji · 名称 · 健康 · 长描述 · 链接
└── 未用 cover / screenshots / tech（数据层已有）

关于 /about
└── 标题/SEO 文案空缺；结构干净但品牌弱
```

---

## 4. 「廉价感」诊断（首页项目展示）

### 4.1 核心判断

当前首页把项目当成 **通讯录行**，而不是 **可打开的作品**。  
CRT 美学适合「目录」，但目录仍需要：**主视觉、主次、手感、证据（截图/技术栈）**。

### 4.2 问题清单（按对廉价感的贡献排序）

| # | 问题 | 表现 | 严重度 |
| --- | --- | --- | --- |
| P1 | **Emoji 充当封面** | 精选 48px 方框 + 目录行首 emoji，像占位符而非产品 | 高 |
| P2 | **精选不像精选** | 与目录信息结构几乎同构（标签+名+一句话+状态），只多 pin 与边框 | 高 |
| P3 | **目录是「细线列表」** | `border-b` + 单行描述 + 状态，无 tech、无时间、无封面，密度低且无记忆点 | 高 |
| P4 | **Hero 空心** | `portal.title` 中文为空；首屏像通讯录，不像作品门户 | 中 |
| P5 | **Hover 廉价** | 整行 `opacity`，CRT 应更像「焦点行高亮 / 边框点亮」 | 中 |
| P6 | **数据资产未上屏** | `cover` / `screenshots` / `tech` / `createdAt` 在 schema 与详情文案里存在，首页几乎不用 | 中 |
| P7 | **精选标签噪声** | `项目 01` + category + 状态并排，像后台表而不是策展 | 中 |
| P8 | **站名泛化** | `Developer` 可替换成任何人；品牌信号弱 | 低–中 |
| P9 | **移动端行布局** | `flex-wrap` 后名/描述/状态易碎成三截，触控热区偏扁 | 中 |
| P10 | **关于页空标题** | `about.title` / `seoDescription` 空，影响完整度（此前 Bugbot 已标） | 中（文案） |

### 4.3 与「好 CRT 目录」的差距（一句话）

> 现在像：`ls` 出了一堆文件名。  
> 目标像：`ls -l` —— 有权限/时间/大小（状态、日期、tech），精选则像置顶的可执行文件带图标与摘要。

---

## 5. 分模块审阅

### 5.1 Header（`BaseLayout`）

**优点**：固定顶栏、安全区、主题/语言齐全；在线状态强化终端感。  
**改进**：

- 站名在 `sm` 以下隐藏，移动端只剩「◉ 在线」——建议小屏显示短站名或域名缩写。
- 筛选/主题按钮字号偏小，触控目标可提到 ≥ 44px 高度（视觉仍可紧凑）。

### 5.2 Hero / Portal（`Hero.astro`）

**优点**：外链结构化，像终端通讯录。  
**问题**：缺少一句「这里是什么」；与下方项目列表视觉同构（label + link 行），首屏记忆点弱。

**改进方向（择一）**：

1. **Portal 精简 + 一句 manifest**（推荐）：头像旁/下补 1 行站点主张（填满 `portal.title` 或独立 `hero.tagline`）。
2. **把统计并入 Hero**：`共 N 个项目 · M 个精选`（文案 key 已有 `hero.projectsTotal` / `featuredCount`，未用）。

### 5.3 Featured（`FeaturedProjects`）— 升格重点

**现状结构**：pin + emoji 盒 + tags + 标题 + 一行描述 +「详情」。

**建议构图（一主视觉）**：

```text
┌─────────────────────────────────────────────┐
│ PIN                                         │
│  [封面或大号字形标记]   名称                 │
│                         一句话价值主张        │
│                         tech · 状态 · →      │
└─────────────────────────────────────────────┘
```

规则：

- **有 `cover`**：全宽或左侧大图（边缘贴齐卡片，勿再套圆角卡片审美）。
- **无 cover**：用项目名首字母 / slug 缩写的 **CRT 字形块**（仍 mono），替代 emoji 方盒。
- 去掉「项目 01」索引，或改为极弱的边栏序号。
- Hover：边框 → accent，左侧 2px 光条或轻微 `box-shadow: inset`，**不要**整卡透明度。

### 5.4 Catalog（`ProjectCatalog` + `ProjectCard`）— 廉价感主战场

**现状**：行列表，像未完成的表格。

**两条升级路径（二选一，避免两套风格）**：

| 方案 | 描述 | 适合 |
| --- | --- | --- |
| **A. 加强版终端表** ✅ 已采纳 | 保留列表，但列对齐：`NAME` · `CATEGORY` · `TECH` · `STATUS` · `DATE`；表头用 `terminal-label` | 项目会继续变多、偏工具索引 |
| **B. 紧凑双列终端块** | 每项小块：左标记 + 名 + 描述 2 行 + tech chips；仍方角、无阴影堆叠 | 项目少（当前 ~5）、希望更「作品」 |

**已选 A**（2026-09-07）：首页目录落地为终端表；精选同步做了 surface / 字形块 / 光边 hover。

交互：

- `aria-pressed` 筛选已有 → 保留。
- Active 筛选可加下划线或 `[x]` 前缀，强化终端语法。
- 行 hover：`background: var(--crt-glow)` + 左边框 accent，替代 opacity。

### 5.5 详情页（`projects/[slug].astro`）

**优点**：结构清楚，健康信息诚实。  
**缺口**：

- 未展示 `tech`、`cover`、`screenshots`、`lifecycle`（i18n 已有文案）。
- 仍以 emoji 作主识别；与首页同样「轻」。
- 主 CTA「打开项目」与次链视觉权重接近。

**建议**：详情首屏 = 封面（或字形块）+ 名称 + 一句话 + 主按钮「打开」；下方再放长描述与次链。

### 5.6 关于页

结构干净；补齐 `about.title` / `seoDescription` 即可先止血。视觉可与详情共用「窄栏阅读」节奏，不必新开美学。

### 5.7 页脚

克制、合格。可把版权行做成 `// end of transmission` 一类轻终端玩笑（可选，勿过梗）。

---

## 6. 文案与内容层（影响观感）

设计升格若文案仍「占位」，观感仍会廉价。

| 位置 | 现状 | 建议 |
| --- | --- | --- |
| `portal.title`（zh） | `''` | 补一句站点身份，如「个人小项目索引」 |
| `about.title` / SEO | 空 | 补齐 |
| 部分 `description` | 复述站名式（「XX，可以XX」） | 改成利益点一句，避免同义反复 |
| en `tarot-hall` | 名称/描述极简 | 与中文信息量对齐 |
| `site.title` = Developer | 泛 | 可考虑域名感品牌（如 juhaozero / DEV.INDEX）——属品牌决策 |

---

## 7. 响应式与表现

| 断点 | 问题 | 建议 |
| --- | --- | --- |
| &lt;640px | 目录行 wrap 成碎片 | 改为两行固定结构：上行名+状态，下行描述；或纵向 stack |
| 精选 | 右侧「详情」挤占宽度 | 小屏隐藏文字箭头，保留 `→` |
| 顶栏 | 站名隐藏 | 显示短品牌 |
| 安全区 | header 已处理 | 底部可补 `safe-area-inset-bottom` 于 footer |

对比度：暗色磷光绿在扫描线上总体可读；注意 `text-dim` 不要承担长段落。

---

## 8. 运动与质感清单（克制）

建议落地的 **2–3 个有意动作**（满足「有记忆点」且不噪）：

1. **首屏精选**：挂载后 1 次 stagger fade/slide（CSS 或极少 Framer），`reduced-motion` 时关闭。
2. **行/卡 hover**：边框与 inset glow，150–200ms。
3. **主题切换**：已有 bg/color transition，保持即可。

纹理：可把精选卡 `background` 设为 `var(--crt-surface)`，与页面底拉开一层——成本最低的「不廉价」手段。

---

## 9. 分阶段落地路线

### Phase 0 — 文案止血（0.5h）

- 填 `portal.title`、`about.title`、`about.seoDescription`
- 扫一遍项目 description，去掉同义反复

### Phase 1 — 立刻去廉价（首页，1–2d）**【优先】**

1. 精选卡：`surface` 底 + 去掉索引 tag + hover 光边；无 cover 时用字形块替 emoji 盒  
2. 目录：改为对齐「终端表」或强化行结构（名 / 分类 / 状态分列）  
3. 行 hover 改为 glow，禁用整行 opacity  
4. Hero 使用已有 count 文案，建立「门户」而不只是链接表  

### Phase 2 — 资产上屏（2–3d）

- 为精选（至少）补 `cover` 图或统一 OG 裁切  
- 详情页展示 cover + tech + 主 CTA 权重  
- Catalog 行内展示 `tech`（最多 3 个 chip）

### Phase 3 — 打磨（按需）

- 精选进场动效  
- 移动端顶栏品牌  
- 状态色收入 CSS 变量  
- 评估是否启用 Framer；用不到可移除依赖  

---

## 10. 明确不做什么（保持克制）

- ❌ 改成紫渐变 / 玻璃拟态 / 大圆角 SaaS 卡片墙  
- ❌ 为「高级」引入 Inter / 第二套无衬线展示体系冲掉 Mono  
- ❌ 首页同时上「大图瀑布 + 重动画 + 多列卡片」导致与 CRT 分裂  
- ❌ 精选与目录两套完全不同的视觉语言  

**差异化一句话**：

> This avoids generic UI by deepening the CRT terminal grammar (phosphor type, square rules, status syntax, scanlines) instead of swapping to portfolio card templates.

---

## 11. Operator Checklist（对照 frontend-design）

- [x] 明确美学方向：Curated Terminal Index（继承 CRT）  
- [x] DFII ≥ 8（13）  
- [x] 记忆锚点：磷光绿 + Mono + 扫描线 + 方角 + 在线语法  
- [x] 避免泛用字体/紫渐变/模板卡片墙  
- [x] 代码与野心匹配 → Phase 1（方案 A）已落地；精选已收紧  
- [x] 无障碍与性能 → focus ring、`reduced-motion`、暗色默认；封面按需待 Phase 2  

---

## 12. 相关文件索引

| 文件 | 角色 |
| --- | --- |
| `src/styles/global.css` | 主题变量与 terminal utilities |
| `src/layouts/BaseLayout.astro` | 壳、顶栏、主题 bootstrap（暗色默认） |
| `src/components/Hero.astro` | 门户 |
| `src/components/FeaturedProjects.tsx` | 精选（紧凑行卡） |
| `src/components/ProjectCatalog.tsx` / `ProjectCard.tsx` | 方案 A 终端表 |
| `src/pages/[...locale]/projects/[slug].astro` | 详情（与首页语法对齐） |
| `src/i18n/ui.ts` | 文案 |
| `src/data/projects.source.json` | 内容与 cover/tech 等字段 |
| `src/data/site.json` | 站名与品牌信号 |

---

## 13. 建议的下一步（更新）

1. ~~选 A/B~~ → **已选 A 并落地**  
2. Phase 2：精选/详情补 `cover`（升格上限最高）  
3. 移动端顶栏短品牌、触控目标微调  
4. 评估是否移除未使用的 `framer-motion`  

---

## 14. 全站评估（2026-09-07 迭代后）

### Design Direction

| 项 | 结论 |
| --- | --- |
| Aesthetic | **Curated Terminal Index**（CRT 磷光终端目录） |
| DFII（现状） | **12 / 15** — Excellent，可维持迭代 |
| 差异化锚点 | 墨绿磷光 + JetBrains Mono + 扫描线 + 方角 + `◉/◯` 状态语法 + slug 字形块 |
| 默认主题 | 暗色首选（`<html class="dark">`） |

**DFII 复评**

| Dimension | Score | 说明 |
| --- | --- | --- |
| Aesthetic Impact | 4 | 终端语法已贯穿列表/精选/详情；仍缺真实封面冲击力 |
| Context Fit | 5 | 个人工具索引与 CRT 高度契合 |
| Feasibility | 5 | 现有栈即可维护 |
| Performance | 4 | SSG + 轻岛屿；framer-motion 闲置略冗余 |
| Consistency Risk | −2 | 精选/目录/详情已基本同构；关于页略偏文档风 |
| **DFII** | **12** | |

> This avoids generic UI by deepening CRT grammar (glyphs, terminal table, `*` pin, phosphor dark-first) instead of portfolio card templates.

### 页面评分（功能 + 表现）

| 页面 | 表现 | 功能 | 备注 |
| --- | --- | --- | --- |
| 首页 Hero | 7/10 | 9/10 | 门户清晰；站名 `Developer` 仍泛 |
| 精选 | 8/10 | 9/10 | 已收紧为紧凑行卡，不再压过目录 |
| 目录（方案 A） | 8.5/10 | 9/10 | 列对齐 + 筛选 `[x]`；主信息架构正确 |
| 详情 | 8/10 | 9/10 | 头部/元信息/简介/主 CTA 已对齐；无 cover |
| 关于 | 6.5/10 | 7/10 | 标题已补；视觉仍偏「纯文档」 |
| 主题/i18n | 9/10 | 9/10 | 暗色默认稳；中英路径正常 |
| 健康状态 | 8/10 | 9/10 | 构建期 + 客户端探测完整 |

### 层级是否正确（精选收紧后）

```text
Hero（身份）
  ↓ 轻
Featured（置顶提示，紧凑行）  ← 本次缩小
  ↓
Catalog（主体，终端表）       ← 视觉重心应在此
```

当前层级：**合理**。精选用 `*` + surface 提示优先级，体量不再抢目录。

### 仍存问题（按优先级）

| # | 项 | 严重度 | 建议 |
| --- | --- | --- | --- |
| 1 | 无项目封面/截图上屏 | 中 | Phase 2 给精选至少 1 张 cover |
| 2 | `site.title = Developer` 品牌弱 | 低–中 | 改为域名感命名 |
| 3 | 移动端顶栏隐藏站名 | 低 | 显示短品牌 |
| 4 | `framer-motion` 未使用 | 低 | 移除或做一次进场 |
| 5 | 部分 description 同义反复 | 低 | 内容润色 |
| 6 | 关于页与 CRT 元信息语法略脱节 | 低 | 可用 `dl` 行展示栈要点 |

### Operator Checklist（本次）

- [x] 美学方向清晰且一贯  
- [x] DFII ≥ 8  
- [x] 记忆锚点可见  
- [x] 无泛用 SaaS 模板感  
- [x] 精选体量已下调，目录重新成为主体  
- [x] 关于页空标题已补  
