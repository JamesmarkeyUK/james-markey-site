import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, HTMLElement } from 'node-html-parser';
import { SOURCE_BASE } from './slugs';
import { downloadImage, normalizeFilename, pickLargestSrc } from './images';
import { createTurndown } from './html-to-md';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const CACHE_DIR = path.join(__dirname, 'cache');
const POSTS_DIR = path.join(ROOT, 'src/content/posts');

export type WpPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
      alt_text?: string;
      media_details?: {
        sizes?: Record<string, { source_url: string; width: number }>;
      };
    }>;
    'wp:term'?: Array<Array<{ taxonomy: string; name: string; slug: string }>>;
  };
};

export async function fetchPost(slug: string): Promise<WpPost | null> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const cachePath = path.join(CACHE_DIR, `${slug}.json`);

  try {
    const cached = await fs.readFile(cachePath, 'utf-8');
    return JSON.parse(cached) as WpPost;
  } catch {
    /* fall through to network */
  }

  const url = `${SOURCE_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'james-markey-site-migration/1.0' },
  });
  if (!response.ok) {
    console.warn(`  ⚠ Failed to fetch ${slug}: ${response.status}`);
    return null;
  }

  const payload = (await response.json()) as WpPost[];
  if (!Array.isArray(payload) || payload.length === 0) {
    console.warn(`  ⚠ No post found for slug "${slug}"`);
    return null;
  }

  const post = payload[0]!;
  await fs.writeFile(cachePath, JSON.stringify(post, null, 2));
  return post;
}

function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n: string) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—');
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function deriveCategory(post: WpPost): string {
  const terms = post._embedded?.['wp:term'] ?? [];
  for (const group of terms) {
    for (const term of group) {
      if (term.taxonomy === 'category' && term.name && term.name.toLowerCase() !== 'uncategorized') {
        return term.name;
      }
    }
  }
  return 'News';
}

type ProcessedImage = {
  filename: string;
  remoteUrl: string;
};

async function processBodyImages(
  body: HTMLElement,
  imagesDir: string,
): Promise<ProcessedImage[]> {
  const processed: ProcessedImage[] = [];
  const seen = new Set<string>();
  let counter = 0;

  const imgs = body.querySelectorAll('img');
  for (const img of imgs) {
    const remoteUrl = pickLargestSrc(
      img.getAttribute('srcset'),
      img.getAttribute('src') ?? '',
    );
    if (!remoteUrl) continue;
    if (seen.has(remoteUrl)) {
      const existing = processed.find((p) => p.remoteUrl === remoteUrl)!;
      img.setAttribute('src', `./images/${existing.filename}`);
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      continue;
    }
    seen.add(remoteUrl);
    counter++;
    const filename = normalizeFilename(remoteUrl, `image-${String(counter).padStart(2, '0')}`);
    const dest = path.join(imagesDir, filename);
    const ok = await downloadImage(remoteUrl, dest);
    if (!ok) {
      // Image couldn't be downloaded — remove the <img> from the post body so we
      // don't leave a broken local reference. This is most often offsite avatars.
      img.remove();
      continue;
    }
    img.setAttribute('src', `./images/${filename}`);
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    processed.push({ filename, remoteUrl });
  }
  return processed;
}

async function processHero(
  post: WpPost,
  imagesDir: string,
  fallbackUrl: string | null,
): Promise<{ filename: string; alt: string } | null> {
  const featured = post._embedded?.['wp:featuredmedia']?.[0];
  let url = featured?.source_url ?? fallbackUrl;
  let alt = featured?.alt_text ?? '';

  // Prefer the largest size that WP rendered
  const sizes = featured?.media_details?.sizes;
  if (sizes) {
    const largest = Object.values(sizes).sort((a, b) => b.width - a.width)[0];
    if (largest) url = largest.source_url;
  }
  if (!url) return null;
  if (!alt) alt = stripHtml(decodeEntities(post.title.rendered));

  const ext = path.extname(new URL(url).pathname).toLowerCase() || '.jpg';
  const filename = `hero${ext}`;
  const ok = await downloadImage(url, path.join(imagesDir, filename));
  if (!ok) return null;
  return { filename, alt };
}

function escapeYaml(value: string): string {
  return value.replace(/"/g, '\\"');
}

function makeExcerpt(post: WpPost): string {
  const raw = decodeEntities(stripHtml(post.excerpt.rendered));
  if (raw.length === 0) return '';
  if (raw.length <= 280) return raw;
  return raw.slice(0, 277).trimEnd() + '…';
}

export async function processPost(slug: string): Promise<boolean> {
  console.log(`\n→ ${slug}`);
  const post = await fetchPost(slug);
  if (!post) return false;

  const postDir = path.join(POSTS_DIR, slug);
  const imagesDir = path.join(postDir, 'images');
  await fs.mkdir(imagesDir, { recursive: true });

  const root = parse(post.content.rendered, {
    blockTextElements: { script: false, noscript: false, style: false, pre: true },
  });

  // Remove WordPress share / related / comment blocks before image processing.
  const cruftSelectors = [
    '.sharedaddy',
    '.jp-relatedposts',
    '.share-this-story',
    '.related-posts',
    '.wp-block-buttons',
    '.fusion-sharing-box',
  ];
  for (const sel of cruftSelectors) {
    root.querySelectorAll(sel).forEach((n) => n.remove());
  }

  const bodyImages = await processBodyImages(root, imagesDir);
  console.log(`  · ${bodyImages.length} body images`);

  const firstBodyImage = bodyImages[0]?.remoteUrl ?? null;
  const hero = await processHero(post, imagesDir, firstBodyImage);
  if (!hero) {
    console.warn(`  ⚠ No hero image found for ${slug}`);
  }

  const td = createTurndown();
  const markdown = td.turndown(root.toString()).trim();
  const title = decodeEntities(stripHtml(post.title.rendered));
  const excerpt = makeExcerpt(post);
  const category = deriveCategory(post);
  const pubDate = post.date.split('T')[0]; // YYYY-MM-DD

  const frontmatter = [
    '---',
    `title: "${escapeYaml(title)}"`,
    `pubDate: ${pubDate}`,
    `slug: "${slug}"`,
    `category: "${category}"`,
    excerpt ? `excerpt: "${escapeYaml(excerpt)}"` : '',
    hero ? `hero: ./images/${hero.filename}` : '',
    hero ? `heroAlt: "${escapeYaml(hero.alt)}"` : '',
    `legacyUrl: ${SOURCE_BASE}/${slug}/`,
    'featured: false',
    'draft: false',
    '---',
    '',
    'import ProseFigure from "~/components/ProseFigure.astro";',
    '',
    markdown,
    '',
  ]
    .filter((line) => line !== '')
    .join('\n')
    .replace('---\n\nimport', '---\n\nimport');

  // Re-join properly with empty lines preserved between sections
  const cleanFrontmatter = [
    '---',
    `title: "${escapeYaml(title)}"`,
    `pubDate: ${pubDate}`,
    `slug: "${slug}"`,
    `category: "${category}"`,
    ...(excerpt ? [`excerpt: "${escapeYaml(excerpt)}"`] : []),
    ...(hero ? [`hero: ./images/${hero.filename}`, `heroAlt: "${escapeYaml(hero.alt)}"`] : []),
    `legacyUrl: ${SOURCE_BASE}/${slug}/`,
    'featured: false',
    'draft: false',
    '---',
  ].join('\n');

  const body = [
    cleanFrontmatter,
    '',
    'import ProseFigure from "~/components/ProseFigure.astro";',
    '',
    markdown,
    '',
  ].join('\n');

  await fs.writeFile(path.join(postDir, 'index.mdx'), body);
  void frontmatter; // suppress unused
  console.log(`  ✓ wrote ${slug}/index.mdx`);
  return true;
}
