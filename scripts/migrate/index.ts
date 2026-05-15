import { SLUGS } from './slugs';
import { processPost } from './scrape';

async function main() {
  const args = process.argv.slice(2);
  const onlyIdx = args.indexOf('--slug');
  const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

  const slugs = only ? [only] : [...SLUGS];

  console.log(`Migrating ${slugs.length} post(s) from WordPress…`);

  let ok = 0;
  let fail = 0;
  for (const slug of slugs) {
    try {
      const result = await processPost(slug);
      if (result) ok++;
      else fail++;
    } catch (err) {
      fail++;
      console.error(`  ✗ ${slug}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
