# WordPress → Astro migration

One-shot script that imports posts from the live WordPress site at
`https://jamesmarkey.co.uk/` into the Astro content collection.

## Usage

```powershell
npm run migrate
```

Imports all 16 slugs listed in `slugs.ts`. To re-import a single post:

```powershell
npx tsx scripts/migrate/index.ts --slug visiting-10-downing-street
```

## How it works

1. Fetches each post via `wp-json/wp/v2/posts?slug=<slug>&_embed=1`.
2. Caches the raw JSON response in `scripts/migrate/cache/<slug>.json` so reruns
   don't re-hit the origin. Delete the cache file to force a fresh fetch.
3. Parses `content.rendered` with `node-html-parser`, strips WordPress cruft
   (share/related/comment blocks), and downloads each `<img>` (largest from
   `srcset`) to `src/content/posts/<slug>/images/`.
4. Converts the cleaned HTML to Markdown via Turndown + the GFM plugin. A
   custom Turndown rule turns `<figure><img><figcaption>` into the
   `<ProseFigure>` MDX component so captions survive.
5. Writes `src/content/posts/<slug>/index.mdx` with frontmatter matching the
   Zod schema in `src/content/config.ts`.

## After running

Manual review steps:
- Confirm each `category` in frontmatter — the script uses the first non-"Uncategorized" WP category.
- Trim `excerpt` lines if they read awkwardly.
- Check `heroAlt` is meaningful (falls back to post title).
- Spot-check gallery order in `index.mdx`.
- Delete `scripts/migrate/cache/` once you're happy (it's gitignored anyway).
