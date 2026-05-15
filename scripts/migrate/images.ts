import { promises as fs } from 'node:fs';
import path from 'node:path';
import pLimit from 'p-limit';
import slugify from 'slugify';

const limit = pLimit(4);

export function pickLargestSrc(srcset: string | undefined, fallback: string): string {
  if (!srcset) return fallback;
  const candidates = srcset
    .split(',')
    .map((part) => part.trim())
    .map((part) => {
      const [url, descriptor] = part.split(/\s+/);
      const width = descriptor && descriptor.endsWith('w') ? parseInt(descriptor) : 0;
      return { url, width };
    })
    .filter((c) => c.url);
  if (candidates.length === 0) return fallback;
  candidates.sort((a, b) => b.width - a.width);
  return candidates[0]?.url ?? fallback;
}

export function normalizeFilename(url: string, prefix?: string): string {
  const u = new URL(url);
  const basename = path.basename(u.pathname);
  const ext = path.extname(basename).toLowerCase() || '.jpg';
  const stem = path.basename(basename, ext);
  const safe = slugify(stem, { lower: true, strict: true });
  return prefix ? `${prefix}${ext}` : `${safe}${ext}`;
}

export async function downloadImage(url: string, destPath: string): Promise<boolean> {
  // Idempotent: skip if file already exists.
  try {
    await fs.access(destPath);
    return true;
  } catch {
    /* file does not exist, proceed */
  }

  return limit(async () => {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'james-markey-site-migration/1.0' },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) {
        console.warn(`    ⚠ HTTP ${response.status} for ${url}`);
        return false;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.writeFile(destPath, buffer);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`    ⚠ Failed to download ${url}: ${msg}`);
      return false;
    }
  });
}
