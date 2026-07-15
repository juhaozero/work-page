/**
 * 校验 projects.source.json：必填字段、id/slug 唯一、URL、双语一致性
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = join(root, 'src/data/projects.source.json');

const LOCALES = ['zh', 'en'];
const LIFECYCLES = new Set(['active', 'maintenance', 'archived']);
const REQUIRED_SHARED = ['id', 'slug', 'emoji', 'url'];
const REQUIRED_I18N = ['name', 'category', 'description'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`✘ ${message}`);
  process.exitCode = 1;
}

const raw = readFileSync(sourcePath, 'utf8');
let source;
try {
  source = JSON.parse(raw);
} catch (error) {
  fail(`Invalid JSON: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(source) || source.length === 0) {
  fail('projects.source.json must be a non-empty array');
  process.exit(1);
}

const ids = new Set();
const slugs = new Set();

for (const [index, entry] of source.entries()) {
  const label = `projects[${index}]`;

  for (const key of REQUIRED_SHARED) {
    if (!isNonEmptyString(entry[key])) {
      fail(`${label}: missing required field "${key}"`);
    }
  }

  if (entry.id !== undefined) {
    if (ids.has(entry.id)) fail(`${label}: duplicate id "${entry.id}"`);
    ids.add(entry.id);
  }

  if (entry.slug !== undefined) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) {
      fail(`${label}: slug must be kebab-case ("${entry.slug}")`);
    }
    if (slugs.has(entry.slug)) fail(`${label}: duplicate slug "${entry.slug}"`);
    slugs.add(entry.slug);
  }

  if (entry.url && !isValidUrl(entry.url)) {
    fail(`${label}: invalid url "${entry.url}"`);
  }

  for (const optionalUrl of ['demo', 'docs', 'changelog', 'repo']) {
    if (entry[optionalUrl] && !isValidUrl(entry[optionalUrl])) {
      fail(`${label}: invalid ${optionalUrl} "${entry[optionalUrl]}"`);
    }
  }

  if (entry.lifecycle && !LIFECYCLES.has(entry.lifecycle)) {
    fail(`${label}: lifecycle must be one of ${[...LIFECYCLES].join(', ')}`);
  }

  if (entry.tech && (!Array.isArray(entry.tech) || entry.tech.some((t) => !isNonEmptyString(t)))) {
    fail(`${label}: tech must be an array of non-empty strings`);
  }

  if (entry.createdAt && !/^\d{4}-\d{2}-\d{2}$/.test(entry.createdAt)) {
    fail(`${label}: createdAt must be YYYY-MM-DD`);
  }

  if (!entry.i18n || typeof entry.i18n !== 'object') {
    fail(`${label}: missing i18n object`);
    continue;
  }

  for (const locale of LOCALES) {
    const localized = entry.i18n[locale];
    if (!localized || typeof localized !== 'object') {
      fail(`${label}: missing i18n.${locale}`);
      continue;
    }
    for (const key of REQUIRED_I18N) {
      if (!isNonEmptyString(localized[key])) {
        fail(`${label}.i18n.${locale}: missing "${key}"`);
      }
    }
  }
}

if (process.exitCode) {
  console.error('\nValidation failed.');
  process.exit(1);
}

console.log(`✔ Validated ${source.length} projects in projects.source.json`);
