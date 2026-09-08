# UI 设计审阅与改进梳理

> 范围：全站视觉与交互（首页为重点）  
> 立场：坚持 **现代终端窗（Modern Terminal Window）** 美学，不推倒重做；在 shell 语法内升格项目展示，去掉廉价感。  
> 日期：初稿 2026-09-07 · **立意同步 2026-09-08**

---

## 1. Design Direction Summary

| 项 | 内容 |
| --- | --- |
| **现有美学名** | *Modern Terminal Window* / 策展感终端索引站 |
| **建议坚持方向** | *Curated Terminal Index*（像桌面 Terminal.app 里 `ls` 出作品，不是 Notion 卡片墙） |
| **DFII（建议方向）** | **12 / 15** → 可完整执行，控制组件变体 |
| **概念灵感** | macOS / 现代终端窗 chrome（slate + mint prompt）+ 独立开发者作品集的「策展感」 |

**曾弃方向（勿回退）**

- ❌ 老管 CRT 磷光绿 / 扫描线 / 强暗角 / 开机光束（刺眼且与当前窗体冲突）
- ❌ 半 CRT 半 macOS 的混搭

**DFII 拆分（建议方向）**

| Dimension | Score | 说明 |
| --- | --- | --- |
| Aesthetic Impact | 4 | 终端窗 + 命令行仪式已有辨识度；升格靠信息重量而非 glow |
| Context Fit | 5 | 个人工具/小项目索引，shell 隐喻贴切 |
| Implementation Feasibility | 5 | Astro + Tailwind CSS 变量即可落地 |
| Performance Safety | 4 | 避免重动画与大图瀑布；封面按需 |
| Consistency Risk | −2 | 精选/目录若层级不清会分裂成两套 UI |
| **DFII** | **12** | Strong → 按阶段执行 |

**差异化锚点（去掉 logo 仍应认出）**

> Slate 终端底 + mint 强调色 + JetBrains Mono + 方角规则 + `guest@dev:~$` 命令行分区 + 「◉ 在线」状态语法 +（首页）macOS 红绿灯开机窗。

廉价感主要来自：**锚点够用，但项目条目没有吃到这套语法的「重量」**——精选与目录仍偏同构细线列表。

---

## 2. Design System Snapshot（现状 · 2026-09-08）

### 2.1 字体

| 角色 | 当前 | 评价 |
| --- | --- | --- |
| 全站唯一 | JetBrains Mono + Noto Sans Mono / SC | 符合终端窗；缺一层「展示级」对比（标题与正文同一声部） |

**建议**：继续以 Mono 为身体；精选标题用同族加粗 / 略大字号阶梯，**不要**引入第二套无衬线展示字体。

### 2.2 颜色（CSS 变量）

```text
--crt-bg / surface / surface-2 / text / muted / dim
--crt-border / border-dim
--crt-accent / accent-dim / glow / selection-* / vignette
--crt-scanline → transparent（保留变量名兼容，现代终端窗不用扫描线）
```

| 模式 | 气质 | 关键色 |
| --- | --- | --- |
| 亮色 | 冷 slate 纸色 + 蓝灰强调 | bg `#eef0f6` · accent `#3f6b8a` |
| 暗色 | 终端窗 slate + mint prompt | bg `#2d2e49` · accent `#8fd4a8` · text `#f0f0f4` |

只通过 `--crt-*` 改主题；禁止组件内硬编码色（`status-offline`、开机红绿灯除外）。类名 `crt-*` 为历史命名，语义已是「终端主题」而非 CRT 显像管。

### 2.3 空间节奏

| Token（事实约定） | 用途 |
| --- | --- |
| `container-main` max 1200 + px-6/8 | 全站栏宽 |
| `pt-24/28` | 顶栏避让 |
| 区块 `gap-16` / `sm:gap-20` | Hero 后精选↔目录 |
| `space-y-3/4`、`py-3` | 列表行距 |

问题：精选与目录信息结构仍接近，**层级主要靠命令行文案与间距，视觉重量差不够「一主一次」**。

### 2.4 运动哲学

- CSS-first：开机窗入场、命令行打字、区块 `crt-reveal` / stagger
- 交互多为 `opacity` / `border-color` / inset 150ms
- `prefers-reduced-motion` 全局降速；减动效时跳过开机仪式
- `framer-motion` 若仍闲置可移除

**建议**：保持稀疏；**一次进场序列** + **少量 hover**，禁止装饰性微动效。

### 2.5 纹理与深度

- **无扫描线**；仅极轻边缘压暗（`body::after` vignette）
- **无磷光 text-shadow**（`crt-phosphor` 为空操作，保留类名兼容）
- 开机：圆角窗 + 红绿灯 titlebar + 串行打字（非 CRT 光束）
- 卡片/表行：方角、surface / inset hover

---

## 3. 信息架构与页面地图

```text
首页
├── Boot（首访/刷新）：macOS 风格终端窗打字
├── Header（在线 · 站名 · 关于 · 语言 · 主题）
├── HeroPortal（$ ls ~/home → 头像 + 外链）
├── FeaturedProjects（$ cat ~/featured.list → 精选行）
├── ProjectCatalog（$ ls -l ~/projects → 终端表 + 筛选）
└── Footer

详情 /projects/:slug
├── $ cat projects/{slug}.md → 名 · 健康 · 长描述 · 链接
└── cover 数据层有，多数项目尚未配置站内封面

关于 /about
└── 叙事页；终端语法弱于首页
```

---

## 4. 「廉价感」诊断（首页项目展示）

### 4.1 核心判断

当前首页把项目当成 **通讯录行**，而不是 **可打开的作品**。  
终端窗美学适合「目录」，但目录仍需要：**主次、手感、证据（截图/技术栈）**。

### 4.2 问题清单（按对廉价感的贡献排序）

| # | 问题 | 表现 | 严重度 |
| --- | --- | --- | --- |
| P1 | **精选不像精选** | 与目录几乎同构（名 + 一句话），缺媒体/tech 重量 | 高 |
| P2 | **目录密度可再升** | 已有终端表列，但 DATE 等资产未充分上屏；无封面证据 | 中 |
| P3 | **Hero 空心** | `portal.title` 中文为空；首屏像通讯录 | 中 |
| P4 | **品牌弱** | `site.title = Developer` 泛用 | 中 |
| P5 | **数据资产未上屏** | `cover` / 部分 tech 未吃满 | 中 |
| P6 | **关于页脱节** | 偏纯文档，少 shell 元信息语法 | 低 |

### 4.3 与「好终端索引」的差距（一句话）

有命令行仪式，缺策展重量：精选应像「置顶文件」，目录应像「完整 `ls -l`」。

---

## 5. 分区与落地规格

详细 Token、精选升格、分阶段方案见 [`ui-improvement-proposal.md`](./ui-improvement-proposal.md)。

原则摘要：

| # | 原则 | 落地含义 |
| --- | --- | --- |
| P1 | **块间疏、块内密** | 区块 gap 大；表行保持紧凑 |
| P2 | **一主一次** | 精选 = 策展；目录 = `ls -l` |
| P3 | **证据优先于装饰** | cover / OG / tech 上屏 |
| P4 | **字号阶梯** | 精选名 ≫ 表单元格 |
| P5 | **终端窗语法一致** | inset hover、`[x]` 筛选、状态色、方角内容区 |

---

## 6. 明确不做什么（保持克制）

- ❌ 改成紫渐变 / 玻璃拟态 / 大圆角 SaaS 卡片墙  
- ❌ 为「高级」引入 Inter / 第二套无衬线展示体系冲掉 Mono  
- ❌ 首页同时上「大图瀑布 + 重动画 + 多列卡片」导致与终端窗分裂  
- ❌ 精选与目录两套完全不同的视觉语言  
- ❌ 回退到老管磷光 / 扫描线 / 强 glow（已否决）

**差异化一句话**：

> This avoids generic UI by deepening modern terminal-window grammar (slate chrome, mint prompt, square rules, `$` section commands, status syntax) instead of swapping to portfolio card templates or CRT phosphor nostalgia.

---

## 7. Operator Checklist（对照 frontend-design）

- [x] 明确美学方向：Modern Terminal Window + Curated Terminal Index  
- [x] DFII ≥ 8（12）  
- [x] 记忆锚点：slate + mint + Mono + 方角 + 命令行分区 + 在线语法 + 开机窗  
- [x] 避免泛用字体/紫渐变/模板卡片墙  
- [x] 无扫描线 / 无磷光 glow  
- [x] 精选视觉重量升格（cover/OG · tech · surface 卡）  
- [x] focus ring、`reduced-motion`、暗色默认  
- [x] 门户主张 / 品牌命名 / 筛选语法 / 详情主 CTA / 关于 shell / Footer `exit 0` / 移除 framer-motion  

---

## 8. 相关文件索引

| 文件 | 角色 |
| --- | --- |
| `src/styles/global.css` | 主题变量与 terminal utilities |
| `src/layouts/BaseLayout.astro` | 壳、顶栏、主题 bootstrap（暗色默认）、开机挂载 |
| `src/components/CrtBootShield.tsx` | macOS 风格开机窗 |
| `src/lib/crtBoot.ts` | 开机/分区 intro 时序 |
| `src/components/HeroPortal.tsx` | 门户 + 打字 |
| `src/components/FeaturedProjects.tsx` | 精选（紧凑行） |
| `src/components/ProjectCatalog.tsx` / `ProjectCard.tsx` | 终端表 |
| `src/pages/[...locale]/projects/[slug].astro` | 详情 |
| `src/i18n/ui.ts` | 文案（含 boot / 命令行） |
| `src/data/projects.source.json` | 内容与 cover/tech 等字段 |
| `scripts/generate-og.mjs` | 终端窗风格 OG |

---

## 9. 全站评估（摘要 · 2026-09-08）

| 项 | 结论 |
| --- | --- |
| Aesthetic | **Modern Terminal Window** + Curated Terminal Index |
| DFII（现状） | **12 / 15** |
| 差异化锚点 | slate/mint · Mono · `$` 分区 · 方角 · `◉` · 开机红绿灯窗 |
| 默认主题 | 暗色首选（`<html class="dark">`） |

| 页面 | 表现 | 备注 |
| --- | --- | --- |
| 开机 | 8.5/10 | 已对齐终端窗 |
| Hero | 7/10 | 标题常空；品牌弱 |
| 精选 | 7/10 | 仪式够，重量不足 |
| 目录 | 8.5/10 | 终端表正确，主体清晰 |
| 详情 | 8/10 | 语法对齐；缺 cover |
| 关于 | 6.5/10 | 终端语法弱 |

层级：Hero（轻）→ Featured（提示）→ Catalog（主体）——结构合理，精选仍可再「重」一点而不压过目录。

---

## 10. 立意同步与后续改进方向（2026-09-08）

### 10.1 已落地

- 配色：slate chrome + mint accent（亮/暗）；亮色对比度已加强
- 去掉扫描线与磷光 glow
- 开机：macOS 红绿灯窗 + shell 文案（`loading shell…`）
- OG：圆角窗 + 红绿灯，色值与暗色主题一致
- 首页串联：boot → `$ ls ~/home` → featured → catalog
- **精选舞台卡**（媒体 + 2 行描述 + tech + 状态）
- **门户主张** + 项目计数；站名 `juhaozero`
- 筛选 `[x]` / `[ ]` + 更大热区
- 详情封面 + 主 CTA「打开项目」；次链分离
- 关于页 `whoami` 元信息；Footer `exit 0`
- 移除未使用的 `framer-motion`

### 10.2 后续可选微调

| 优先级 | 方向 | 说明 |
| --- | --- | --- |
| P3 | 真实 cover 资源 | 有项目级截图时写入 `cover` 字段，替换 OG 回退 |
| P3 | 文案润色 | 部分 description 仍偏同义反复 |
| P3 | 预览图重绘 | `docs/previews/*` 仍为旧 CRT 色示意 |

### 10.3 仍不做

霓虹 Matrix、老管回潮、卡片墙作品集模板、第二套展示字体。
