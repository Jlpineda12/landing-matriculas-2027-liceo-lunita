// Renderiza cuadros de control con un solo bundle: node scripts/stills.mjs Landscape 40,100,...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
const [id = 'Landscape', frames = '60'] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id });
for (const f of frames.split(',').map(Number)) {
  await renderStill({ composition, serveUrl, output: `out/${id[0].toLowerCase()}_${f}.png`, frame: f, overwrite: true });
  console.log('✓', f);
}
