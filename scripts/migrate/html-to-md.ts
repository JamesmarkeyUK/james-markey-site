import TurndownService from 'turndown';
// @ts-expect-error — no types ship with turndown-plugin-gfm
import { gfm } from 'turndown-plugin-gfm';

export function createTurndown(): TurndownService {
  const td = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '_',
    linkStyle: 'inlined',
  });

  td.use(gfm);

  // Strip WordPress-specific share/related/comment blocks.
  td.addRule('strip-wp-cruft', {
    filter: (node) => {
      const el = node as HTMLElement;
      if (!el.className || typeof el.className !== 'string') return false;
      const cls = el.className;
      return (
        cls.includes('sharedaddy') ||
        cls.includes('jp-relatedposts') ||
        cls.includes('wp-block-buttons') ||
        cls.includes('share-this-story') ||
        cls.includes('related-posts')
      );
    },
    replacement: () => '',
  });

  // Convert <figure><img><figcaption> -> MDX ProseFigure component so captions survive.
  td.addRule('figure-to-prose-figure', {
    filter: (node) => node.nodeName === 'FIGURE',
    replacement: (_content, node) => {
      const fig = node as HTMLElement;
      const img = fig.querySelector('img');
      const caption = fig.querySelector('figcaption');
      if (!img) return '';
      const src = img.getAttribute('src') ?? '';
      const alt = (img.getAttribute('alt') ?? '').replace(/"/g, '\\"');
      const captionText = caption?.textContent?.trim().replace(/"/g, '\\"') ?? '';
      const captionAttr = captionText ? ` caption="${captionText}"` : '';
      return `\n\n<ProseFigure src="${src}" alt="${alt}"${captionAttr} />\n\n`;
    },
  });

  return td;
}
