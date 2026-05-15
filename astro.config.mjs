// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jamesmarkey.co.uk',
  trailingSlash: 'always',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
  ],
  build: {
    format: 'directory',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
