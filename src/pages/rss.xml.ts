import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '~/data/site';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.excerpt ?? '',
      link: `/${post.slug}/`,
      categories: [post.data.category],
    })),
    customData: `<language>en-gb</language>`,
  });
}
