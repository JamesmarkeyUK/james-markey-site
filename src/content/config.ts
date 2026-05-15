import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      category: z.string(),
      excerpt: z.string().max(320).optional(),
      hero: image(),
      heroAlt: z.string(),
      gallery: z
        .array(z.object({ src: image(), alt: z.string() }))
        .optional(),
      featured: z.boolean().default(false),
      legacyUrl: z.string().url().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
