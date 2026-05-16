export type Continent = 'North America' | 'South America' | 'Europe' | 'Africa' | 'Asia' | 'Oceania';

export const CONTINENTS: Continent[] = [
  'North America',
  'South America',
  'Europe',
  'Africa',
  'Asia',
  'Oceania',
];

// SVG viewBox zoom targets per continent (x, y, w, h in 1000×500 space)
export const CONTINENT_VIEWBOXES: Record<Continent, [number, number, number, number]> = {
  'North America': [10,  70, 380, 210],
  'South America': [245, 195, 180, 265],
  'Europe':        [415, 75, 230, 175],
  'Africa':        [440, 135, 235, 310],
  'Asia':          [545, 60, 430, 265],
  'Oceania':       [775, 255, 230, 180],
};

export const countryContinent: Record<string, Continent> = {
  // North America
  AG: 'North America', AI: 'North America', AN: 'North America', AW: 'North America',
  BB: 'North America', BL: 'North America', BM: 'North America', BQ: 'North America',
  BS: 'North America', BZ: 'North America', CA: 'North America', CR: 'North America',
  CU: 'North America', CW: 'North America', DM: 'North America', DO: 'North America',
  GD: 'North America', GL: 'North America', GP: 'North America', GT: 'North America',
  HN: 'North America', HT: 'North America', JM: 'North America', KN: 'North America',
  KY: 'North America', LC: 'North America', MF: 'North America', MQ: 'North America',
  MS: 'North America', MX: 'North America', NI: 'North America', PA: 'North America',
  PM: 'North America', PR: 'North America', SV: 'North America', SX: 'North America',
  TC: 'North America', TT: 'North America', US: 'North America', VC: 'North America',
  VG: 'North America', VI: 'North America',

  // South America
  AR: 'South America', BO: 'South America', BR: 'South America', CL: 'South America',
  CO: 'South America', EC: 'South America', FK: 'South America', GF: 'South America',
  GY: 'South America', PE: 'South America', PY: 'South America', SR: 'South America',
  UY: 'South America', VE: 'South America',

  // Europe
  AD: 'Europe', AL: 'Europe', AM: 'Europe', AT: 'Europe', AX: 'Europe',
  AZ: 'Europe', BA: 'Europe', BE: 'Europe', BG: 'Europe', BY: 'Europe',
  CH: 'Europe', CY: 'Europe', CZ: 'Europe', DE: 'Europe', DK: 'Europe',
  EE: 'Europe', ES: 'Europe', FI: 'Europe', FO: 'Europe', FR: 'Europe',
  GB: 'Europe', GE: 'Europe', GG: 'Europe', GI: 'Europe', GR: 'Europe',
  HR: 'Europe', HU: 'Europe', IE: 'Europe', IM: 'Europe', IS: 'Europe',
  IT: 'Europe', JE: 'Europe', LI: 'Europe', LT: 'Europe', LU: 'Europe',
  LV: 'Europe', MC: 'Europe', MD: 'Europe', ME: 'Europe', MK: 'Europe',
  MT: 'Europe', NL: 'Europe', NO: 'Europe', PL: 'Europe', PT: 'Europe',
  RO: 'Europe', RS: 'Europe', RU: 'Europe', SE: 'Europe', SI: 'Europe',
  SJ: 'Europe', SK: 'Europe', SM: 'Europe', TR: 'Europe', UA: 'Europe',
  VA: 'Europe', XK: 'Europe',

  // Africa
  AO: 'Africa', BF: 'Africa', BI: 'Africa', BJ: 'Africa', BW: 'Africa',
  CD: 'Africa', CF: 'Africa', CG: 'Africa', CI: 'Africa', CM: 'Africa',
  CV: 'Africa', DJ: 'Africa', DZ: 'Africa', EG: 'Africa', EH: 'Africa',
  ER: 'Africa', ET: 'Africa', GA: 'Africa', GH: 'Africa', GM: 'Africa',
  GN: 'Africa', GQ: 'Africa', GW: 'Africa', IO: 'Africa', KE: 'Africa',
  KM: 'Africa', LR: 'Africa', LS: 'Africa', LY: 'Africa', MA: 'Africa',
  MG: 'Africa', ML: 'Africa', MR: 'Africa', MU: 'Africa', MW: 'Africa',
  MZ: 'Africa', NA: 'Africa', NE: 'Africa', NG: 'Africa', RE: 'Africa',
  RW: 'Africa', SC: 'Africa', SD: 'Africa', SL: 'Africa', SN: 'Africa',
  SO: 'Africa', SS: 'Africa', ST: 'Africa', SZ: 'Africa', TD: 'Africa',
  TG: 'Africa', TN: 'Africa', TZ: 'Africa', UG: 'Africa', YT: 'Africa',
  ZA: 'Africa', ZM: 'Africa', ZW: 'Africa',

  // Asia
  AE: 'Asia', AF: 'Asia', AP: 'Asia', BD: 'Asia', BH: 'Asia',
  BN: 'Asia', BT: 'Asia', CC: 'Asia', CN: 'Asia', CX: 'Asia',
  HK: 'Asia', ID: 'Asia', IL: 'Asia', IN: 'Asia', IQ: 'Asia',
  IR: 'Asia', JO: 'Asia', JP: 'Asia', KG: 'Asia', KH: 'Asia',
  KP: 'Asia', KR: 'Asia', KW: 'Asia', KZ: 'Asia', LA: 'Asia',
  LB: 'Asia', LK: 'Asia', MM: 'Asia', MN: 'Asia', MO: 'Asia',
  MV: 'Asia', MY: 'Asia', NP: 'Asia', OM: 'Asia', PH: 'Asia',
  PK: 'Asia', PS: 'Asia', QA: 'Asia', SA: 'Asia', SG: 'Asia',
  SY: 'Asia', TH: 'Asia', TJ: 'Asia', TL: 'Asia', TM: 'Asia',
  TW: 'Asia', UZ: 'Asia', VN: 'Asia', YE: 'Asia',

  // Oceania
  AS: 'Oceania', AU: 'Oceania', CK: 'Oceania', FJ: 'Oceania', FM: 'Oceania',
  GU: 'Oceania', KI: 'Oceania', MH: 'Oceania', MP: 'Oceania', NC: 'Oceania',
  NF: 'Oceania', NR: 'Oceania', NU: 'Oceania', NZ: 'Oceania', PF: 'Oceania',
  PG: 'Oceania', PN: 'Oceania', PW: 'Oceania', SB: 'Oceania', TK: 'Oceania',
  TO: 'Oceania', TV: 'Oceania', UM: 'Oceania', VU: 'Oceania', WF: 'Oceania',
  WS: 'Oceania',
};
