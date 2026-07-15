/**
 * 从 projects.source.json 生成 projects.json / projects.en.json
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = join(root, 'src/data/projects.source.json');
const locales = ['zh', 'en'];
const outFiles = {
  zh: join(root, 'src/data/projects.json'),
  en: join(root, 'src/data/projects.en.json'),
};

const SHARED_KEYS = [
  'id',
  'slug',
  'emoji',
  'url',
  'featured',
  'repo',
  'tech',
  'createdAt',
  'lifecycle',
  'demo',
  'docs',
  'changelog',
  'cover',
  'screenshots',
];

function pickShared(entry) {
  const out = {};
  for (const key of SHARED_KEYS) {
    if (entry[key] !== undefined) out[key] = entry[key];
  }
  return out;
}

function generateLocale(source, locale) {
  return source.map((entry) => {
    const localized = entry.i18n?.[locale];
    if (!localized) {
      throw new Error(`Missing i18n.${locale} for project id=${entry.id}`);
    }
    return {
      ...pickShared(entry),
      name: localized.name,
      category: localized.category,
      description: localized.description,
      ...(localized.longDescription
        ? { longDescription: localized.longDescription }
        : {}),
    };
  });
}

const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
if (!Array.isArray(source)) {
  throw new Error('projects.source.json must be an array');
}

for (const locale of locales) {
  const projects = generateLocale(source, locale);
  writeFileSync(outFiles[locale], `${JSON.stringify(projects, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${outFiles[locale]} (${projects.length} projects)`);
}
