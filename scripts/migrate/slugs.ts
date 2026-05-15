export const SOURCE_BASE = 'https://jamesmarkey.co.uk';

// The 16 posts on the current WordPress site, in the order they appear in the
// sitemap. Order does not matter for the migration but is preserved for clarity.
export const SLUGS = [
  'james-markey-travels-with-prime-minister-to-india',
  'pakistan-tv',
  'visiting-10-downing-street',
  'bipolar-uk-photoshoot',
  'from-local-to-global',
  'prime-minister-delegation',
  'department-for-business-and-trade-interview',
  'invite-to-house-of-lords',
  'bbc-radio-live-five',
  'dental-seminar-in-bulgaria',
  'virtual-touch-real-impact-james-markey-honoured-for-advancing-the-state-of-dental-education-in-the-uk',
  'santander-x',
  'cpttp-launch',
  'government-international-trade-week',
  'university_of_portsmouth',
  'open_university',
] as const;

export type Slug = (typeof SLUGS)[number];
