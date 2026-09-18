/**
 * 将 public/covers/ 下的站内封面统一为 1200×630（16:9，居中裁切）。
 * 用法：
 *   npm run normalize:covers
 *   node scripts/normalize-covers.mjs path/to/one.png
 */
import { readdirSync, existsSync, writeFileSync, renameSync, unlinkSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const ALLOWED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const coversDir = join(root, 'public/covers');

async function normalizeFile(inputPath) {
  const abs = resolve(inputPath);
  const ext = extname(abs).toLowerCase();
  if (!ALLOWED.has(ext)) {
    throw new Error(`Unsupported format: ${ext} (${abs})`);
  }

  const outPath =
    ext === '.png' ? abs : join(dirname(abs), `${basenameWithoutExt(abs)}.png`);
  const tmpPath = `${outPath}.tmp.png`;

  const buffer = await sharp(abs)
    .rotate()
    .resize(WIDTH, HEIGHT, {
      fit: 'cover',
      position: 'centre',
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeFileSync(tmpPath, buffer);
  try {
    unlinkSync(outPath);
  } catch {
    // outPath may not exist yet (e.g. jpg → png)
  }
  renameSync(tmpPath, outPath);

  const meta = await sharp(outPath).metadata();
  const rel = outPath.startsWith(root)
    ? outPath.slice(root.length).replace(/^[/\\]/, '')
    : outPath;
  console.log(`cover → ${rel} (${meta.width}×${meta.height})`);
  return outPath;
}

function basenameWithoutExt(filePath) {
  const base = filePath.split(/[/\\]/).pop() ?? filePath;
  return base.replace(/\.[^.]+$/, '');
}

async function main() {
  const args = process.argv.slice(2).filter(Boolean);

  if (args.length > 0) {
    for (const arg of args) {
      await normalizeFile(arg);
    }
    return;
  }

  if (!existsSync(coversDir)) {
    console.log('No public/covers/ directory — nothing to normalize.');
    return;
  }

  const files = readdirSync(coversDir).filter((name) =>
    ALLOWED.has(extname(name).toLowerCase()),
  );

  if (files.length === 0) {
    console.log('public/covers/ is empty — nothing to normalize.');
    return;
  }

  for (const name of files) {
    await normalizeFile(join(coversDir, name));
  }

  console.log(`Normalized ${files.length} cover(s) to ${WIDTH}×${HEIGHT}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
