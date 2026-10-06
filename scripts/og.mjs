/**
 * Generates the Open Graph card (src/assets/images/og.png).
 *
 * Rendered in Chromium with the real self-hosted woff2 files rather than
 * composed with sharp, so the type in the link preview is the same type the
 * site loads — Instrument Sans at the same tracking. Run after a build:
 *
 *   node scripts/og.mjs
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontsDir = path.join(root, 'dist/_astro/fonts');
const out = path.join(root, 'src/assets/images/og.png');

if (!existsSync(fontsDir)) {
  console.error('No built fonts found. Run `npm run build` first.');
  process.exit(1);
}

const faces = [
  ['Display', '35557a33a889e42d.woff2'],
  ['Body', '0976180ba0e36444.woff2'],
  ['Mono', '53722250936f1eed.woff2'],
];

const fontFaceCss = faces
  .map(
    ([family, file]) =>
      `@font-face{font-family:'${family}';src:url('file://${path.join(fontsDir, file)}') format('woff2');font-weight:100 900;font-display:block}`
  )
  .join('\n');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
${fontFaceCss}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#fff;position:relative;overflow:hidden;font-synthesis:none}
.hair{position:absolute;top:0;bottom:0;left:96px;right:96px;border-left:1px solid rgba(29,29,30,.12);border-right:1px solid rgba(29,29,30,.12)}
.tick{position:absolute;top:0;bottom:0;left:89px;width:7px;
  background-image:repeating-linear-gradient(to bottom,rgba(29,29,30,.12) 0 1px,transparent 1px 24px)}
.pad{position:absolute;inset:0;padding:64px 160px;display:flex;flex-direction:column;justify-content:space-between}
.name{font-family:'Display',sans-serif;font-size:150px;line-height:.9;letter-spacing:-.04em;font-weight:500;color:#1d1d1e}
.surname{font-family:'Mono',monospace;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:#6b7178;margin-top:28px}
.role{font-family:'Display',sans-serif;font-size:38px;line-height:1.1;letter-spacing:-.022em;font-weight:500;color:#1d1d1e;max-width:19ch}
.foot{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid rgba(29,29,30,.12);padding-top:20px}
.meta{font-family:'Mono',monospace;font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:#6b7178}
.ruler{position:absolute;left:160px;top:78px;font-family:'Mono',monospace;font-size:13px;letter-spacing:.16em;color:#6b7178}
</style></head><body>
  <div class="tick"></div>
  <div class="hair"></div>
  <div class="pad">
    <div>
      <div class="name">Aurora</div>
      <div class="surname">Del Pino Gallardo</div>
    </div>
    <div class="role">Product designer. I design the screens people use after they click.</div>
    <div class="foot">
      <span class="meta">Product Designer · Product Ops</span>
      <span class="meta">Málaga, Spain</span>
    </div>
  </div>
  <div class="ruler">Y 0000</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: out });
await browser.close();

console.log('Wrote', path.relative(root, out));
