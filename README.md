# jamesmarkey.co.uk

Personal website of James Markey, built with [Astro](https://astro.build/) and
deployed on Cloudflare Pages.

## Stack

- **Astro 4** with `output: 'static'`
- **TypeScript** strict mode
- **Tailwind CSS** for styling
- **MDX** for posts via Astro Content Collections
- **Cloudflare Pages** for hosting

## Local development

```powershell
npm install
npm run dev          # http://localhost:4321
npm run build        # production build (dist/)
npm run preview      # serve the build locally
npm run typecheck    # astro check
```

## Content

Posts live in `src/content/posts/<slug>/index.mdx`, with co-located images in
`./images/`. Frontmatter is validated against the Zod schema in
`src/content/config.ts`.

To add a new post:

1. Create `src/content/posts/my-new-post/`.
2. Add `index.mdx` with the required frontmatter (see existing posts).
3. Co-locate images under `./images/`.
4. Reference images in MDX as `./images/foo.jpg`.

## Migrating from WordPress

A one-shot migration script imports the 16 legacy posts from the live
WordPress site:

```powershell
npm run migrate
```

See `scripts/migrate/README.md` for details.

## Deploying

The `main` branch auto-deploys to Cloudflare Pages on every push.

- Framework preset: **Astro**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `20`
