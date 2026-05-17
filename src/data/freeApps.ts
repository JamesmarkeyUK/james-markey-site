export type FreeApp = {
  name: string;
  category: string;
  description: string;
  href: string;
};

export const freeApps: FreeApp[] = [
  {
    name: 'Bipolar Bear',
    category: 'Mood Journal',
    description:
      'A free, non-profit mood journal for people living with bipolar disorder. Track your moods, sleep and triggers privately on-device.',
    href: 'https://bipolarbear.app',
  },
  {
    name: 'Bipolar Anonymous',
    category: 'Private Messaging Board',
    description:
      'An anonymous, private messaging board for people affected by bipolar disorder to share experiences and find support.',
    href: 'https://bipolaranonymous.app',
  },
];
