export type Investment = {
  company: string;
  description: string;
  href: string;
  tag?: string;
};

export const investments: Investment[] = [
  {
    company: 'Nirvana Brewery',
    description: "Low- and no-alcohol craft brewery making genuinely good alcohol-free beer.",
    href: 'https://nirvanabrewery.com',
    tag: 'Consumer',
  },
  {
    company: 'Bipolar Bear',
    description: 'Non-profit mental-health app supporting people living with bipolar disorder.',
    href: 'https://bipolarbear.app',
    tag: 'Health',
  },
  {
    company: 'Tallow & Ash',
    description: 'British craft lifestyle brand — tallow-based skincare and home goods.',
    href: 'https://tallowandash.com',
    tag: 'Consumer',
  },
];
