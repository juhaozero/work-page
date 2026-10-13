/**
 * 构建期探测项目 URL，写入 src/data/status.json 与 public/status.json
 *
 * 代理优先级（有则启用，经 Node `--use-env-proxy` 生效）：
 * 1. 环境变量 HTTPS_PROXY / HTTP_PROXY / ALL_PROXY（及小写）
 * 2. 项目根目录 probe.config.json 的 `proxy` 字段
 * 3. Windows 用户「Internet 设置」系统代理（HKCU）
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROBE_TIMEOUT_MS = 8000;
const PROXY_RELAUNCH_ENV = 'WORK_PAGE_PROBE_PROXY_READY';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const projectsPath = join(root, 'src/data/projects.json');
const outSrc = join(root, 'src/data/status.json');
const outPublic = join(root, 'public/status.json');
const probeConfigPath = join(root, 'probe.config.json');

/** @returns {string | null} */
function normalizeProxyUrl(raw) {
  if (typeof raw !== 'string') return null;
  let value = raw.trim();
  if (!value) return null;

  // http=host:port;https=host:port
  if (value.includes('=')) {
    const map = {};
    for (const part of value.split(';')) {
      const idx = part.indexOf('=');
      if (idx <= 0) continue;
      const key = part.slice(0, idx).trim().toLowerCase();
      const val = part.slice(idx + 1).trim();
      if (key && val) map[key] = val;
    }
    value = map.https || map.http || map.all || Object.values(map)[0] || '';
    value = value.trim();
    if (!value) return null;
  }

  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    value = `http://${value}`;
  }

  try {
    const u = new URL(value);
    if (!u.hostname) return null;
    return u.href.replace(/\/$/, '');
  } catch {
    return null;
  }
}

/** @returns {{ url: string, source: string } | null} */
function resolveProxyFromEnv() {
  const keys = [
    'HTTPS_PROXY',
    'HTTP_PROXY',
    'ALL_PROXY',
    'https_proxy',
    'http_proxy',
    'all_proxy',
  ];
  for (const key of keys) {
    const url = normalizeProxyUrl(process.env[key] ?? '');
    if (url) return { url, source: `env:${key}` };
  }
  return null;
}

/** @returns {{ url: string, source: string } | null} */
function resolveProxyFromProjectConfig() {
  if (!existsSync(probeConfigPath)) return null;
  try {
    const raw = readFileSync(probeConfigPath, 'utf8');
    const config = JSON.parse(raw);
    const url = normalizeProxyUrl(config?.proxy ?? '');
    if (url) return { url, source: 'probe.config.json' };
  } catch (error) {
    console.warn(
      `Warning: failed to read ${probeConfigPath}: ${error.message}`,
    );
  }
  return null;
}

/** @returns {{ url: string, source: string } | null} */
function resolveProxyFromWindowsInternetSettings() {
  if (process.platform !== 'win32') return null;

  const keyPath =
    'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings';

  try {
    const enableOut = execFileSync(
      'reg',
      ['query', keyPath, '/v', 'ProxyEnable'],
      { encoding: 'utf8', windowsHide: true },
    );
    if (!/ProxyEnable\s+REG_DWORD\s+0x1\b/i.test(enableOut)) {
      return null;
    }

    const serverOut = execFileSync(
      'reg',
      ['query', keyPath, '/v', 'ProxyServer'],
      { encoding: 'utf8', windowsHide: true },
    );
    const match = serverOut.match(/ProxyServer\s+REG_SZ\s+(.+)\r?$/im);
    const url = normalizeProxyUrl(match?.[1]?.trim() ?? '');
    if (url) return { url, source: 'windows:Internet Settings' };
  } catch {
    /* 无代理项或 reg 不可用 */
  }
  return null;
}

/** @returns {{ url: string, source: string } | null} */
function resolveProxy() {
  return (
    resolveProxyFromEnv() ||
    resolveProxyFromProjectConfig() ||
    resolveProxyFromWindowsInternetSettings()
  );
}

/**
 * Node 内置 fetch 默认不走系统/环境代理；有代理时用 `--use-env-proxy` 子进程重跑。
 */
function ensureProxyDispatcher() {
  if (process.env[PROXY_RELAUNCH_ENV] === '1') {
    const active =
      normalizeProxyUrl(process.env.HTTPS_PROXY || process.env.HTTP_PROXY || '') ||
      '(set)';
    console.log(`Proxy: ${active} (active)`);
    return;
  }

  const resolved = resolveProxy();
  if (!resolved) {
    console.log('Proxy: none (direct)');
    return;
  }

  console.log(`Proxy: ${resolved.url} (from ${resolved.source}); relaunching with --use-env-proxy…`);

  const env = {
    ...process.env,
    [PROXY_RELAUNCH_ENV]: '1',
    NODE_USE_ENV_PROXY: '1',
    HTTP_PROXY: process.env.HTTP_PROXY || resolved.url,
    HTTPS_PROXY: process.env.HTTPS_PROXY || resolved.url,
    http_proxy: process.env.http_proxy || process.env.HTTP_PROXY || resolved.url,
    https_proxy: process.env.https_proxy || process.env.HTTPS_PROXY || resolved.url,
  };

  const result = spawnSync(
    process.execPath,
    ['--use-env-proxy', ...process.argv.slice(1)],
    { env, stdio: 'inherit', windowsHide: true },
  );

  if (result.error) {
    console.error(`Failed to relaunch probe with proxy: ${result.error.message}`);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

ensureProxyDispatcher();

async function fetchWithTimeout(url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent': 'work-page-health-probe/1.0',
        ...(init?.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function probe(url) {
  try {
    let response = await fetchWithTimeout(url, { method: 'HEAD' });
    if (response.status === 405 || response.status === 501) {
      response = await fetchWithTimeout(url, { method: 'GET' });
    }

    const httpStatus = response.status;
    if (response.ok) {
      return { online: true, httpStatus, reason: 'ok' };
    }
    return {
      online: false,
      httpStatus,
      reason: 'http_error',
      error: `HTTP ${httpStatus}`,
    };
  } catch (error) {
    const name = error?.name ?? '';
    const message = error?.message ?? String(error);
    if (name === 'AbortError' || /aborted|timeout/i.test(message)) {
      return { online: false, httpStatus: null, reason: 'timeout', error: message };
    }
    return { online: false, httpStatus: null, reason: 'network_error', error: message };
  }
}

/** 与 src/lib/projectAccess.ts getProbeUrl 对齐 */
function getProbeUrl(project) {
  const kind = project.kind ?? 'web';
  if (kind === 'package') {
    return project.downloadUrl || null;
  }
  return project.url || null;
}

const projects = JSON.parse(readFileSync(projectsPath, 'utf8'));
const projectsMap = {};

console.log(`Probing ${projects.length} project targets…`);

for (const project of projects) {
  const target = getProbeUrl(project);
  const kind = project.kind ?? 'web';
  let result;
  if (!target) {
    result = {
      online: false,
      httpStatus: null,
      reason: 'unknown',
      error: 'no probe url',
    };
  } else {
    result = await probe(target);
  }
  projectsMap[project.id] = result;
  const mark = result.online ? '✔' : '✘';
  console.log(
    `  ${mark} [${kind}] ${project.slug ?? project.id} → ${result.reason}` +
      (result.httpStatus != null ? ` (${result.httpStatus})` : '') +
      (result.error ? ` ${result.error}` : ''),
  );
}

const report = {
  checkedAt: new Date().toISOString(),
  projects: projectsMap,
};

const json = `${JSON.stringify(report, null, 2)}\n`;
writeFileSync(outSrc, json, 'utf8');
mkdirSync(dirname(outPublic), { recursive: true });
writeFileSync(outPublic, json, 'utf8');
console.log(`Wrote ${outSrc}`);
console.log(`Wrote ${outPublic}`);
