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

async function renderOg({ slug, name, emoji, category, siteTitle }) {
  const lines = wrapText(name);
  const titleSvg = lines
    .map(
      (line, i) =>
        `<text x="80" y="${280 + i * 64}" fill="#5fe66a" font-size="52" font-family="ui-monospace, monospace" font-weight="700">${escapeXml(line)}</text>`,
    )
    .join('');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#080d08"/>
  <rect x="40" y="40" width="${WIDTH - 80}" height="${HEIGHT - 80}" fill="none" stroke="#1e4a22" stroke-width="2"/>
  <text x="80" y="120" fill="#2d6a34" font-size="22" font-family="ui-monospace, monospace" letter-spacing="4">${escapeXml(siteTitle.toUpperCase())}</text>
  <text x="80" y="200" font-size="64">${escapeXml(emoji)}</text>
  ${titleSvg}
  <text x="80" y="540" fill="#4a9a52" font-size="24" font-family="ui-monospace, monospace">[${escapeXml(category)}] · /projects/${escapeXml(slug)}</text>
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
    emoji: project.emoji,
    category: project.category,
    siteTitle: site.title ?? 'Project Hub',
  });
  console.log(`OG → ${project.slug}.png`);
}

console.log(`Wrote ${projects.length} OG images to ${outDir}`);
