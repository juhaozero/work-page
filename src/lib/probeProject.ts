const PROBE_TIMEOUT_MS = 8000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** 探测项目 URL 是否可达 */
export async function probeProjectUrl(url: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(url, {
      method: 'HEAD',
      cache: 'no-store',
    });

    if (response.ok) return true;
    if (response.status === 405) {
      const getResponse = await fetchWithTimeout(url, {
        method: 'GET',
        cache: 'no-store',
      });
      return getResponse.ok;
    }
    return false;
  } catch {
    try {
      await fetchWithTimeout(url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
      });
      return true;
    } catch {
      return false;
    }
  }
}
