export type Place = {
  id: string;
  country: string;
  capital: string;
  capitalPopulation: string;
  countryPopulation: string;
  leader: string;
  leaderTitle: string;
  lat: number;
  lon: number;
  // Optional display nudge in SVG units, used only to separate pins that
  // sit on top of each other at world scale (e.g. Israel / Palestine).
  pinOffsetX?: number;
  pinOffsetY?: number;
};

// Snapshot as of May 2026. Update this file when leaders or populations change.
export const places: Place[] = [
  {
    id: 'uzbekistan',
    country: 'Uzbekistan',
    capital: 'Tashkent',
    capitalPopulation: '~3.0M',
    countryPopulation: '~36.7M',
    leader: 'Shavkat Mirziyoyev',
    leaderTitle: 'President',
    lat: 41.31,
    lon: 69.28,
  },
  {
    id: 'pakistan',
    country: 'Pakistan',
    capital: 'Islamabad',
    capitalPopulation: '~1.1M',
    countryPopulation: '~245M',
    leader: 'Shehbaz Sharif',
    leaderTitle: 'Prime Minister',
    lat: 33.69,
    lon: 73.05,
  },
  {
    id: 'china',
    country: 'China',
    capital: 'Beijing',
    capitalPopulation: '~21.9M',
    countryPopulation: '~1.41B',
    leader: 'Xi Jinping',
    leaderTitle: 'President',
    lat: 39.90,
    lon: 116.40,
  },
  {
    id: 'palestine',
    country: 'Palestine',
    capital: 'Ramallah (admin.)',
    capitalPopulation: '~38K',
    countryPopulation: '~5.4M',
    leader: 'Mahmoud Abbas',
    leaderTitle: 'President',
    lat: 31.90,
    lon: 35.21,
    pinOffsetX: 4,
  },
  {
    id: 'israel',
    country: 'Israel',
    capital: 'Jerusalem',
    capitalPopulation: '~982K',
    countryPopulation: '~9.9M',
    leader: 'Benjamin Netanyahu',
    leaderTitle: 'Prime Minister',
    lat: 31.78,
    lon: 35.22,
    pinOffsetX: -4,
  },
  {
    id: 'ukraine',
    country: 'Ukraine',
    capital: 'Kyiv',
    capitalPopulation: '~3.0M',
    countryPopulation: '~37M',
    leader: 'Volodymyr Zelenskyy',
    leaderTitle: 'President',
    lat: 50.45,
    lon: 30.52,
  },
  {
    id: 'egypt',
    country: 'Egypt',
    capital: 'Cairo',
    capitalPopulation: '~10.2M',
    countryPopulation: '~110M',
    leader: 'Abdel Fattah el-Sisi',
    leaderTitle: 'President',
    lat: 30.04,
    lon: 31.24,
  },
  {
    id: 'south-africa',
    country: 'South Africa',
    capital: 'Pretoria (admin.)',
    capitalPopulation: '~2.9M',
    countryPopulation: '~62M',
    leader: 'Cyril Ramaphosa',
    leaderTitle: 'President',
    lat: -25.75,
    lon: 28.19,
  },
  {
    id: 'chile',
    country: 'Chile',
    capital: 'Santiago',
    capitalPopulation: '~7.0M',
    countryPopulation: '~19.8M',
    leader: 'Gabriel Boric',
    leaderTitle: 'President',
    lat: -33.45,
    lon: -70.67,
  },
];
