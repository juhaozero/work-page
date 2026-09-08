/**
 * 为每个项目生成简易 OG 图 → public/og/projects/{slug}.png
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const projectsPath = join(root, 'src/data/projects.json');
const sitePath = join(root, 'src/data/site.json');
const outDir = join(root, 'public/og/projects');

const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapText(text, maxChars = 22) {
  const chars = [...text];
  const lines = [];
  for (let i = 0; i < chars.length; i += maxChars) {
    lines.push(chars.slice(i, i + maxChars).join(''));
    if (lines.length >= 3) break;
  }
  return lines;
}

async function renderOg({ slug, name, category, siteTitle }) {
  const lines = wrapText(name);
  const titleSvg = lines
    .map(
      (line, i) =>
        `<text x="80" y="${240 + i * 64}" fill="#f0f0f4" font-size="52" font-family="ui-monospace, monospace" font-weight="700">${escapeXml(line)}</text>`,
    )
    .join('');

  const brand = siteTitle?.trim() || 'Project Hub';

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#2d2e49"/>
  <rect x="40" y="40" width="${WIDTH - 80}" height="${HEIGHT - 80}" rx="16" fill="#212238" stroke="#3f4060" stroke-width="2"/>
  <circle cx="72" cy="78" r="8" fill="#ff5f57"/>
  <circle cx="96" cy="78" r="8" fill="#febc2e"/>
  <circle cx="120" cy="78" r="8" fill="#28c840"/>
  <text x="160" y="84" fill="#b4b5c8" font-size="20" font-family="ui-monospace, monospace">${escapeXml(brand)}</text>
  <text x="80" y="180" fill="#8fd4a8" font-size="28" font-family="ui-monospace, monospace">$</text>
  ${titleSvg}
  <text x="80" y="540" fill="#8fd4a8" font-size="24" font-family="ui-monospace, monospace">[${escapeXml(category)}] · /projects/${escapeXml(slug)}</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(outDir, `${slug}.png`), png);
}

mkdirSync(outDir, { recursive: true });
const projects = JSON.parse(readFileSync(projectsPath, 'utf8'));
const site = JSON.parse(readFileSync(sitePath, 'utf8'));

for (const project of projects) {
  if (!project.slug) continue;
  await renderOg({
    slug: project.slug,
    name: project.name,
    category: project.category,
    siteTitle: site.title,
  });
  console.log(`OG → ${project.slug}.png`);
}

console.log(`Wrote ${projects.length} OG images to ${outDir}`);
