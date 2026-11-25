// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

// En GitHub Pages el sitio vive en un subdirectorio: SITE_URL + BASE_PATH llegan desde el workflow.
const siteUrl = process.env.SITE_URL || 'https://jlpineda12.github.io';
const rawBase = process.env.BASE_PATH || '/';
const basePath = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export default defineConfig({
  site: siteUrl,
  base: basePath,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always', assets: 'assets' },
  image: { responsiveStyles: true, layout: 'constrained' },
  integrations: [
    {
      name: 'nojekyll',
      hooks: { 'astro:build:done': ({ dir }) => fs.writeFileSync(path.join(fileURLToPath(dir), '.nojekyll'), '') },
    },
  ],
  vite: { build: { assetsInlineLimit: 2048 } },
});
