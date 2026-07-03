import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import toIco from 'to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svg = readFileSync(join(root, 'scripts/favicon-source.svg'));

const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);

const ico = await toIco(pngs);
writeFileSync(join(root, 'public/favicon.ico'), ico);
console.log('Generated public/favicon.ico');
