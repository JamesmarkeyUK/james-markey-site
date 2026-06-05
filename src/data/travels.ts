import { countryCentroids } from '~/data/countryCentroids';
import { countryData } from '~/data/countryData';
import { countryContinent, type Continent } from '~/data/continents';

const NOMADS_URL = 'https://nomads.com/@jamesmarkey.json';

type NomadsTrip = {
  country: string;
  country_code: string;
  country_slug: string;
  latitude: number;
  longitude: number;
  place: string;
  date_start: string;
  date_end: string;
  epoch_start: number;
};

type NomadsResponse = {
  trips?: NomadsTrip[];
};

export type CuratedDetails = {
  country: string;
  capital: string;
  capitalPopulation: string;
  countryPopulation: string;
  leader: string;
  leaderTitle: string;
};

// Hand-curated extra context for a few of the more exotic stops. Keyed by
// ISO-3166-1 alpha-2 country code so it can be merged onto nomads data.
// Snapshot as of May 2026 — update by editing this map.
export const curatedDetails: Record<string, CuratedDetails> = {
  UZ: {
    country: 'Uzbekistan',
    capital: 'Tashkent',
    capitalPopulation: '~3.0M',
    countryPopulation: '~36.7M',
    leader: 'Shavkat Mirziyoyev',
    leaderTitle: 'President',
  },
  PK: {
    country: 'Pakistan',
    capital: 'Islamabad',
    capitalPopulation: '~1.1M',
    countryPopulation: '~245M',
    leader: 'Shehbaz Sharif',
    leaderTitle: 'Prime Minister',
  },
  CN: {
    country: 'China',
    capital: 'Beijing',
    capitalPopulation: '~21.9M',
    countryPopulation: '~1.41B',
    leader: 'Xi Jinping',
    leaderTitle: 'President',
  },
  PS: {
    country: 'Palestine',
    capital: 'Ramallah (admin.)',
    capitalPopulation: '~38K',
    countryPopulation: '~5.4M',
    leader: 'Mahmoud Abbas',
    leaderTitle: 'President',
  },
  IL: {
    country: 'Israel',
    capital: 'Jerusalem',
    capitalPopulation: '~982K',
    countryPopulation: '~9.9M',
    leader: 'Benjamin Netanyahu',
    leaderTitle: 'Prime Minister',
  },
  UA: {
    country: 'Ukraine',
    capital: 'Kyiv',
    capitalPopulation: '~3.0M',
    countryPopulation: '~37M',
    leader: 'Volodymyr Zelenskyy',
    leaderTitle: 'President',
  },
  EG: {
    country: 'Egypt',
    capital: 'Cairo',
    capitalPopulation: '~10.2M',
    countryPopulation: '~110M',
    leader: 'Abdel Fattah el-Sisi',
    leaderTitle: 'President',
  },
  ZA: {
    country: 'South Africa',
    capital: 'Pretoria (admin.)',
    capitalPopulation: '~2.9M',
    countryPopulation: '~62M',
    leader: 'Cyril Ramaphosa',
    leaderTitle: 'President',
  },
  CL: {
    country: 'Chile',
    capital: 'Santiago',
    capitalPopulation: '~7.0M',
    countryPopulation: '~19.8M',
    leader: 'Gabriel Boric',
    leaderTitle: 'President',
  },
};

export type CountryPin = {
  id: string;
  countryCode: string;
  country: string;
  continent: Continent | '';
  lat: number;
  lon: number;
  cities: string[];
  tripCount: number;
  firstVisit: string;
  lastVisit: string;
  capital: string;
  capitalPop: string;
  countryPop: string;
  curated?: CuratedDetails;
  pinOffsetX?: number;
  pinOffsetY?: number;
};

// Some pin pairs sit on the same pixel at world scale — nudge them apart.
const pinOffsets: Record<string, { x?: number; y?: number }> = {
  IL: { x: -4 },
  PS: { x: 4 },
};

async function fetchNomadsTrips(): Promise<NomadsTrip[]> {
  try {
    const res = await fetch(NOMADS_URL, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      console.warn(`[travels] nomads.com returned ${res.status}; using curated fallback`);
      return [];
    }
    const data = (await res.json()) as NomadsResponse;
    return Array.isArray(data.trips) ? data.trips : [];
  } catch (err) {
    console.warn(`[travels] failed to fetch nomads.com: ${(err as Error).message}; using curated fallback`);
    return [];
  }
}

function buildFallbackPins(): CountryPin[] {
  return Object.entries(curatedDetails).map(([code, curated]) => {
    const centroid = countryCentroids[code] ?? { lat: 0, lon: 0 };
    const basic = countryData[code];
    return {
      id: code.toLowerCase(),
      countryCode: code,
      country: curated.country,
      continent: countryContinent[code] ?? '',
      lat: centroid.lat,
      lon: centroid.lon,
      cities: [],
      tripCount: 0,
      firstVisit: '',
      lastVisit: '',
      capital: basic?.capital ?? curated.capital,
      capitalPop: basic?.capitalPop ?? curated.capitalPopulation,
      countryPop: basic?.countryPop ?? curated.countryPopulation,
      curated,
      pinOffsetX: pinOffsets[code]?.x,
      pinOffsetY: pinOffsets[code]?.y,
    };
  });
}

let pinsPromise: Promise<CountryPin[]> | null = null;

// Memoised so multiple components (the map and the headline count) share a
// single fetch and therefore always display a consistent country count.
export function getCountryPins(): Promise<CountryPin[]> {
  if (!pinsPromise) pinsPromise = buildCountryPins();
  return pinsPromise;
}

async function buildCountryPins(): Promise<CountryPin[]> {
  const trips = await fetchNomadsTrips();
  if (trips.length === 0) return buildFallbackPins();

  const byCountry = new Map<string, NomadsTrip[]>();
  for (const t of trips) {
    if (!t.country_code) continue;
    const key = t.country_code.toUpperCase();
    if (!byCountry.has(key)) byCountry.set(key, []);
    byCountry.get(key)!.push(t);
  }

  // Make sure every curated country shows up even if it isn't in the feed.
  for (const code of Object.keys(curatedDetails)) {
    if (!byCountry.has(code)) byCountry.set(code, []);
  }

  const pins: CountryPin[] = [];
  for (const [code, countryTrips] of byCountry.entries()) {
    const centroid = countryCentroids[code];
    if (!centroid) continue;

    const sorted = [...countryTrips].sort((a, b) => a.epoch_start - b.epoch_start);
    const cities = Array.from(new Set(countryTrips.map((t) => t.place))).filter(Boolean);
    const countryName = countryTrips[0]?.country ?? curatedDetails[code]?.country ?? code;

    const basic = countryData[code];
    const curated = curatedDetails[code];
    pins.push({
      id: code.toLowerCase(),
      countryCode: code,
      country: countryName,
      continent: countryContinent[code] ?? '',
      lat: centroid.lat,
      lon: centroid.lon,
      cities,
      tripCount: countryTrips.length,
      firstVisit: sorted[0]?.date_start ?? '',
      lastVisit: sorted[sorted.length - 1]?.date_end ?? '',
      capital: basic?.capital ?? curated?.capital ?? '',
      capitalPop: basic?.capitalPop ?? curated?.capitalPopulation ?? '',
      countryPop: basic?.countryPop ?? curated?.countryPopulation ?? '',
      curated,
      pinOffsetX: pinOffsets[code]?.x,
      pinOffsetY: pinOffsets[code]?.y,
    });
  }

  return pins;
}
