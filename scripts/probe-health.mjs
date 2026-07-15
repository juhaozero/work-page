/**
 * 构建期探测项目 URL，写入 src/data/status.json 与 public/status.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROBE_TIMEOUT_MS = 8000;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const projectsPath = join(root, 'src/data/projects.json');
const outSrc = join(root, 'src/data/status.json');
const outPublic = join(root, 'public/status.json');

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

const projects = JSON.parse(readFileSync(projectsPath, 'utf8'));
const projectsMap = {};

console.log(`Probing ${projects.length} project URLs…`);

for (const project of projects) {
  const result = await probe(project.url);
  projectsMap[project.id] = result;
  const mark = result.online ? '✔' : '✘';
  console.log(
    `  ${mark} ${project.slug ?? project.id} → ${result.reason}` +
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
