export type Social = {
  label: string;
  href: string;
  handle?: string;
};

export const socials: Social[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jamesmarkeyuk/', handle: 'jamesmarkeyuk' },
  { label: 'X', href: 'https://x.com/jamesmarkeyuk', handle: '@jamesmarkeyuk' },
  { label: 'Instagram', href: 'https://www.instagram.com/jamesmarkeyuk/', handle: '@jamesmarkeyuk' },
  { label: 'Nomadlist', href: 'https://nomadlist.com/@jamesmarkey', handle: '@jamesmarkey' },
  { label: 'RSS', href: '/rss.xml' },
];
