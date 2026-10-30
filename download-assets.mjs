// Run once on your own computer (Node 18+):  node download-assets.mjs
// Downloads the 4 decorative SVGs (hero corner cut + warm overlay, desktop and
// mobile) that were not in the assets you sent. Figma links are temporary
// (about 7 days from 30 Oct 2026), so run this soon.
import { mkdir, writeFile } from 'node:fs/promises';

const D = 'https://www.figma.com/api/mcp/asset/84591e34-83ab-4aa6-bad1-65f3f15ad2ba';
const M = 'https://www.figma.com/api/mcp/asset/e118d20b-1c8b-489a-951e-47fceee315b7';

const files = [
  [`${D}/f64e4.svg`, 'cut-desktop.svg'],
  [`${D}/30079.svg`, 'overlay-desktop.svg'],
  [`${M}/31a8f.svg`, 'cut-mobile.svg'],
  [`${M}/b8038.svg`, 'overlay-mobile.svg'],
];

await mkdir('assets', { recursive: true });

let failed = 0;
for (const [url, name] of files) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(`assets/${name}`, Buffer.from(await res.arrayBuffer()));
    console.log('ok    ', name);
  } catch (err) {
    failed++;
    console.log('FAILED', name, '-', err.message);
  }
}
console.log(failed ? `\n${failed} file(s) failed. Re-export them from Figma (hero layers "Architectural cut" and "Warm geometric overlay").` : '\nDone. Open index.html.');
process.exit(failed ? 1 : 0);
