import * as fs from 'node:fs';
import * as path from 'node:path';
import sharp from 'sharp';

const urls = {
  'shot-1': 'https://tr.rbxcdn.com/180DAY-4ba0a40dd5937875309bcbad16a9318d/768/432/Image/Png/noFilter',
  'shot-2': 'https://tr.rbxcdn.com/180DAY-284c97f9158fdeec0b23236f62af91a0/768/432/Image/Png/noFilter',
  'shot-3': 'https://tr.rbxcdn.com/180DAY-b72020db68b399f63eb75935000b569c/768/432/Image/Png/noFilter',
  'shot-4': 'https://tr.rbxcdn.com/180DAY-4f7d5d985c2d64999622ff68048eb902/768/432/Image/Png/noFilter',
  'shot-5': 'https://tr.rbxcdn.com/180DAY-68c7403e89c040f64115568e38fb0293/768/432/Image/Png/noFilter',
};

const rawDir = 'scripts/tmp-official-shots';
const outDir = 'public/images/game';
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

for (const [name, url] of Object.entries(urls)) {
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0', accept: 'image/png' } });
  if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(path.join(rawDir, `${name}.png`), buf);
  // Hero-grade 1200x630 cinematic crop
  await sharp(buf).resize(1200, 630, { fit: 'cover' }).webp({ quality: 82 }).toFile(path.join(outDir, `${name}.webp`));
  // Native 768x432 for smaller slots
  await sharp(buf).webp({ quality: 80 }).toFile(path.join(outDir, `${name}-768.webp`));
  console.log(name, buf.length, 'bytes');
}
console.log('done:', fs.readdirSync(outDir).join(', '));
