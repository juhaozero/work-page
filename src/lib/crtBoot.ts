/** 首页 CRT 开机 + 分区揭示：仅首访或刷新主页时播放完整仪式 */

export const CRT_BOOT_CLASS = 'crt-boot';
export const CRT_BOOT_EVENT = 'crt-boot:done';
/** 与 BaseLayout 内联脚本保持一致 */
export const CRT_HOME_PLAYED_KEY = 'crt-home-played';

/**
 * CRT 打字 / 间隔总表 —— 调节奏只改这里。
 * charMs：每字间隔；delayMs：开始前等待。
 */
export const CRT_TIMING = {
  boot: {
    /** 开机每字 */
    charMs: 45,
    /** 第一行开始前（等窗口入场） */
    firstLineDelayMs: 320,
    /** 行与行之间 */
    lineGapMs: 120,
    /** 最后一行打完后再关遮罩 */
    endHoldMs: 450,
    /** 多久后允许跳过 */
    skipGuardMs: 400,
  },
  home: {
    charMs: 100,
    delayMs: 120,
    /** 首页命令打完 → 精选 */
    afterTypedMs: 400,
  },
  featured: {
    charMs: 100,
    delayMs: 120,
    /** 精选列表亮起后 → 目录：基数 + 每项 */
    afterShowBaseMs: 280,
    afterShowPerItemMs: 90,
  },
  catalog: {
      charMs: 100,
    delayMs: 120,
  },
  detail: {
    charMs: 26, // 详情打字速度
    delayMs: 120, // 详情打字延迟
  },
} as const;

/** 终端式跟随：区块底边超出视口时平滑下滚（instant / reduced-motion 不滚） */
export function followTerminalScroll(el: HTMLElement | null): void {
  if (!el || typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  requestAnimationFrame(() => {
    const pad = 28;
    const rect = el.getBoundingClientRect();
    const overflow = rect.bottom - (window.innerHeight - pad);
    if (overflow <= 4) return;
    window.scrollBy({ top: overflow, behavior: 'smooth' });
  });
}

export const CRT_INTRO_FEATURED_EVENT = 'crt-intro:featured';
export const CRT_INTRO_CATALOG_EVENT = 'crt-intro:catalog';

export type CrtBootDoneDetail = {
  /** 是否接着播首页打字 */
  typing: boolean;
};

export type CrtIntroDetail = {
  instant: boolean;
};

let bootResult: CrtBootDoneDetail | null = null;
let featuredIntro: CrtIntroDetail | null = null;
let catalogIntro: CrtIntroDetail | null = null;
/** 本页生命周期内只判定一次，避免 mark 后其它组件误判 */
let playDecision: boolean | null = null;

/** 首访或刷新主页 → 播仪式；同会话内从详情/关于页返回 → 跳过 */
export function shouldPlayCrtHomeIntro(): boolean {
  if (playDecision !== null) return playDecision;

  try {
    const nav = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === 'reload') {
      playDecision = true;
      return playDecision;
    }
    playDecision = sessionStorage.getItem(CRT_HOME_PLAYED_KEY) !== '1';
    return playDecision;
  } catch {
    playDecision = true;
    return playDecision;
  }
}

export function markCrtHomeIntroPlayed(): void {
  try {
    sessionStorage.setItem(CRT_HOME_PLAYED_KEY, '1');
  } catch {
    /* private mode 等 */
  }
}

/** 全页刷新时重置模块门锁（软导航/HMR 保险） */
export function resetCrtIntroLatches(): void {
  bootResult = null;
  featuredIntro = null;
  catalogIntro = null;
}

export function dispatchCrtBootDone(typing: boolean): void {
  const detail = { typing };
  bootResult = detail;
  window.dispatchEvent(
    new CustomEvent<CrtBootDoneDetail>(CRT_BOOT_EVENT, { detail }),
  );
}

export function subscribeCrtBootDone(
  cb: (detail: CrtBootDoneDetail) => void,
): () => void {
  if (bootResult) {
    cb(bootResult);
    return () => {};
  }
  const handler = (event: Event) => {
    cb((event as CustomEvent<CrtBootDoneDetail>).detail);
  };
  window.addEventListener(CRT_BOOT_EVENT, handler);
  return () => window.removeEventListener(CRT_BOOT_EVENT, handler);
}

function subscribeIntro(
  cached: CrtIntroDetail | null,
  eventName: string,
  setCached: (d: CrtIntroDetail) => void,
  cb: (detail: CrtIntroDetail) => void,
): () => void {
  if (cached) {
    cb(cached);
    return () => {};
  }
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<CrtIntroDetail>).detail;
    setCached(detail);
    cb(detail);
  };
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}

export function dispatchCrtIntroFeatured(instant: boolean): void {
  const detail = { instant };
  featuredIntro = detail;
  window.dispatchEvent(
    new CustomEvent<CrtIntroDetail>(CRT_INTRO_FEATURED_EVENT, { detail }),
  );
}

export function subscribeCrtIntroFeatured(
  cb: (detail: CrtIntroDetail) => void,
): () => void {
  return subscribeIntro(
    featuredIntro,
    CRT_INTRO_FEATURED_EVENT,
    (d) => {
      featuredIntro = d;
    },
    cb,
  );
}

export function dispatchCrtIntroCatalog(instant: boolean): void {
  const detail = { instant };
  catalogIntro = detail;
  window.dispatchEvent(
    new CustomEvent<CrtIntroDetail>(CRT_INTRO_CATALOG_EVENT, { detail }),
  );
}

export function subscribeCrtIntroCatalog(
  cb: (detail: CrtIntroDetail) => void,
): () => void {
  return subscribeIntro(
    catalogIntro,
    CRT_INTRO_CATALOG_EVENT,
    (d) => {
      catalogIntro = d;
    },
    cb,
  );
}
