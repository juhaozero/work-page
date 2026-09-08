/** 首页 CRT 开机 + 分区揭示：仅首访或刷新主页时播放完整仪式 */

export const CRT_BOOT_CLASS = 'crt-boot';
export const CRT_BOOT_EVENT = 'crt-boot:done';
/** 与 BaseLayout 内联脚本保持一致 */
export const CRT_HOME_PLAYED_KEY = 'crt-home-played';
/** 点亮总时长（需与 CSS animation 对齐） */
export const CRT_BOOT_DURATION_MS = 1600;
/** 开机后短暂禁止跳过，避免被当成白屏误点 */
export const CRT_BOOT_SKIP_GUARD_MS = 400;

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
