/** 首页 CRT 开机 + 分区揭示：每次进入首页都播完整仪式 */

export const CRT_BOOT_CLASS = 'crt-boot';
export const CRT_BOOT_EVENT = 'crt-boot:done';
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

/** 全页刷新时重置模块闩锁（软导航/HMR 保险） */
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
