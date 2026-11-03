import { MoroccanCity, IntercityRouteBenchmark } from '../types/index';

export const MOROCCAN_CITIES: MoroccanCity[] = [
  {
    id: 'casablanca',
    name: 'Casablanca',
    nameArabic: 'الدار البيضاء',
    region: 'Casablanca-Settat',
    popularPickups: [
      'Maarif - Boulevard Zerktouni (Near Twin Center)',
      'Gare Casa-Voyageurs / Boulevard Bahmad',
      'Ain Diab Corniche / Near McDonald’s',
      'Hay Hassani - Rond-point Al Qods',
      'Sidi Maarouf - Near Technopark',
      'Gare Casa-Port - Marina Entrance'
    ],
    popularDropoffs: [
      'Maarif Center',
      'Twin Center / Zerktouni',
      'Ain Diab Beach',
      'Casablanca Finance City (CFC)',
      'Morocco Mall Entrance'
    ]
  },
  {
    id: 'rabat',
    name: 'Rabat',
    nameArabic: 'الرباط',
    region: 'Rabat-Salé-Kénitra',
    popularPickups: [
      'Agdal - Avenue Fal Ould Oumeir',
      'Hay Riad - Mahaj Riad Promenade',
      'Gare Rabat-Ville - Avenue Mohammed V',
      'Hassan - Tour Hassan / Tramway',
      'Souissi - Near Souissi Clinics'
    ],
    popularDropoffs: [
      'Agdal - Avenue de France',
      'Hay Riad Business Park',
      'Gare Rabat-Agdal TGV',
      'Marina Bouregreg',
      'Medina Bab El Had'
    ]
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    nameArabic: 'مراكش',
    region: 'Marrakech-Safi',
    popularPickups: [
      'Gueliz - Plaza Marrakech / Avenue Mohammed V',
      'Hivernage - Near Menara Mall',
      'Gare Marrakech TGV / Guéliz',
      'Sidi Youssef Ben Ali',
      'Targa - Carrefour Targa',
      'Bab Doukkala Entrance'
    ],
    popularDropoffs: [
      'Jemaa el-Fnaa / Koutoubia',
      'Gueliz Center',
      'Hivernage Hotel Zone',
      'Palmeraie Resort Area',
      'Majorelle Gardens'
    ]
  },
  {
    id: 'tangier',
    name: 'Tangier',
    nameArabic: 'طنجة',
    region: 'Tanger-Tétouan-Al Hoceïma',
    popularPickups: [
      'Tanger Ville TGV Station',
      'Malabata Corniche / Near Casino',
      'Boulevard Pasteur / Place des Nations',
      'Iberia Square / Rue de Fès',
      'Gzenaya Free Zone'
    ],
    popularDropoffs: [
      'Tanja Marina Bay',
      'Malabata Beach Promenade',
      'Cap Spartel Area',
      'Grand Socco / Kasbah Gate',
      'Ibn Battuta Airport'
    ]
  },
  {
    id: 'fes',
    name: 'Fes',
    nameArabic: 'فاس',
    region: 'Fès-Meknès',
    popularPickups: [
      'Fès Ville Nouvelle - Avenue Hassan II',
      'Gare de Fès / Place Roi Mohammed V',
      'Route d’Imouzzer / Near Marjane',
      'Bab Bou Jeloud (Blue Gate)'
    ],
    popularDropoffs: [
      'Ville Nouvelle Center',
      'Fès El Bali Medina Gate',
      'Route de Sefrou',
      'Fès-Saïss Airport'
    ]
  },
  {
    id: 'meknes',
    name: 'Meknes',
    nameArabic: 'مكناس',
    region: 'Fès-Meknès',
    popularPickups: [
      'Hamria - Boulevard Allal Ben Abdallah',
      'Gare Meknès-Ville',
      'Place Lahdim Entrance',
      'Marjane Route d’Agouray'
    ],
    popularDropoffs: [
      'Hamria Downtown',
      'Place El Hedim',
      'Bab Mansour Area',
      'Zaytouna Neighborhood'
    ]
  },
  {
    id: 'agadir',
    name: 'Agadir',
    nameArabic: 'أكادير',
    region: 'Souss-Massa',
    popularPickups: [
      'Marina Agadir / Boulevard 20 Août',
      'Talborjt - Place Al Amal',
      'Sonaba - Founty Beach Area',
      'Dakhla Neighborhood / Souk El Had Gate'
    ],
    popularDropoffs: [
      'Agadir Bay Promenade',
      'Souk El Had Center',
      'Taghazout Bay Turnoff',
      'Agadir Al Massira Airport'
    ]
  },
  {
    id: 'kenitra',
    name: 'Kenitra',
    nameArabic: 'القنيطرة',
    region: 'Rabat-Salé-Kénitra',
    popularPickups: [
      'Gare Kénitra TGV',
      'Avenue Mohammed V / Downtown',
      'Mehdia Beach Entrance',
      'Atlantic Free Zone'
    ],
    popularDropoffs: [
      'Downtown Kenitra',
      'Mehdia Corniche',
      'La Ville Haute'
    ]
  },
  {
    id: 'tetouan',
    name: 'Tetouan',
    nameArabic: 'تطوان',
    region: 'Tanger-Tétouan-Al Hoceïma',
    popularPickups: [
      'Place Moulay El Mehdi',
      'Wilaya Center / Avenue des FAR',
      'Martil Coastal Turnoff',
      'Bab Sebta Route'
    ],
    popularDropoffs: [
      'Martil Promenade',
      'Tetouan Ensanche',
      'Cabo Negro Road'
    ]
  },
  {
    id: 'essaouira',
    name: 'Essaouira',
    nameArabic: 'الصويرة',
    region: 'Marrakech-Safi',
    popularPickups: [
      'Bab Doukkala Entrance',
      'Avenue Mohammed V / Beach Front',
      'Ghazoua Entrance',
      'Port d’Essaouira'
    ],
    popularDropoffs: [
      'Medina Bab El Minzah',
      'Essaouira Beach Promenade',
      'Diabat / Jimi Hendrix Area'
    ]
  }
];

export const ROUTE_BENCHMARKS: Record<string, IntercityRouteBenchmark> = {
  'casablanca-rabat': {
    fromCityId: 'casablanca',
    toCityId: 'rabat',
    distanceKm: 87,
    durationMinutes: 55,
    standardSeatPriceMAD: 45,
    standardFullKorsaPriceMAD: 270,
    tollFeesMAD: 23
  },
  'rabat-casablanca': {
    fromCityId: 'rabat',
    toCityId: 'casablanca',
    distanceKm: 87,
    durationMinutes: 55,
    standardSeatPriceMAD: 45,
    standardFullKorsaPriceMAD: 270,
    tollFeesMAD: 23
  },
  'casablanca-marrakech': {
    fromCityId: 'casablanca',
    toCityId: 'marrakech',
    distanceKm: 242,
    durationMinutes: 145,
    standardSeatPriceMAD: 120,
    standardFullKorsaPriceMAD: 720,
    tollFeesMAD: 82
  },
  'marrakech-casablanca': {
    fromCityId: 'marrakech',
    toCityId: 'casablanca',
    distanceKm: 242,
    durationMinutes: 145,
    standardSeatPriceMAD: 120,
    standardFullKorsaPriceMAD: 720,
    tollFeesMAD: 82
  },
  'rabat-tangier': {
    fromCityId: 'rabat',
    toCityId: 'tangier',
    distanceKm: 250,
    durationMinutes: 155,
    standardSeatPriceMAD: 130,
    standardFullKorsaPriceMAD: 780,
    tollFeesMAD: 91
  },
  'tangier-rabat': {
    fromCityId: 'tangier',
    toCityId: 'rabat',
    distanceKm: 250,
    durationMinutes: 155,
    standardSeatPriceMAD: 130,
    standardFullKorsaPriceMAD: 780,
    tollFeesMAD: 91
  },
  'casablanca-tangier': {
    fromCityId: 'casablanca',
    toCityId: 'tangier',
    distanceKm: 338,
    durationMinutes: 205,
    standardSeatPriceMAD: 175,
    standardFullKorsaPriceMAD: 1050,
    tollFeesMAD: 114
  },
  'tangier-casablanca': {
    fromCityId: 'tangier',
    toCityId: 'casablanca',
    distanceKm: 338,
    durationMinutes: 205,
    standardSeatPriceMAD: 175,
    standardFullKorsaPriceMAD: 1050,
    tollFeesMAD: 114
  },
  'rabat-kenitra': {
    fromCityId: 'rabat',
    toCityId: 'kenitra',
    distanceKm: 42,
    durationMinutes: 35,
    standardSeatPriceMAD: 22,
    standardFullKorsaPriceMAD: 132,
    tollFeesMAD: 14
  },
  'kenitra-rabat': {
    fromCityId: 'kenitra',
    toCityId: 'rabat',
    distanceKm: 42,
    durationMinutes: 35,
    standardSeatPriceMAD: 22,
    standardFullKorsaPriceMAD: 132,
    tollFeesMAD: 14
  },
  'casablanca-fes': {
    fromCityId: 'casablanca',
    toCityId: 'fes',
    distanceKm: 298,
    durationMinutes: 180,
    standardSeatPriceMAD: 150,
    standardFullKorsaPriceMAD: 900,
    tollFeesMAD: 96
  },
  'fes-casablanca': {
    fromCityId: 'fes',
    toCityId: 'casablanca',
    distanceKm: 298,
    durationMinutes: 180,
    standardSeatPriceMAD: 150,
    standardFullKorsaPriceMAD: 900,
    tollFeesMAD: 96
  },
  'fes-meknes': {
    fromCityId: 'fes',
    toCityId: 'meknes',
    distanceKm: 60,
    durationMinutes: 45,
    standardSeatPriceMAD: 30,
    standardFullKorsaPriceMAD: 180,
    tollFeesMAD: 15
  },
  'meknes-fes': {
    fromCityId: 'meknes',
    toCityId: 'fes',
    distanceKm: 60,
    durationMinutes: 45,
    standardSeatPriceMAD: 30,
    standardFullKorsaPriceMAD: 180,
    tollFeesMAD: 15
  },
  'marrakech-agadir': {
    fromCityId: 'marrakech',
    toCityId: 'agadir',
    distanceKm: 255,
    durationMinutes: 160,
    standardSeatPriceMAD: 130,
    standardFullKorsaPriceMAD: 780,
    tollFeesMAD: 78
  },
  'agadir-marrakech': {
    fromCityId: 'agadir',
    toCityId: 'marrakech',
    distanceKm: 255,
    durationMinutes: 160,
    standardSeatPriceMAD: 130,
    standardFullKorsaPriceMAD: 780,
    tollFeesMAD: 78
  },
  'marrakech-essaouira': {
    fromCityId: 'marrakech',
    toCityId: 'essaouira',
    distanceKm: 178,
    durationMinutes: 130,
    standardSeatPriceMAD: 90,
    standardFullKorsaPriceMAD: 540,
    tollFeesMAD: 0
  },
  'tangier-tetouan': {
    fromCityId: 'tangier',
    toCityId: 'tetouan',
    distanceKm: 58,
    durationMinutes: 50,
    standardSeatPriceMAD: 35,
    standardFullKorsaPriceMAD: 210,
    tollFeesMAD: 0
  }
};

export function getRouteBenchmark(fromCityId: string, toCityId: string): IntercityRouteBenchmark {
  const key = `${fromCityId}-${toCityId}`;
  if (ROUTE_BENCHMARKS[key]) {
    return ROUTE_BENCHMARKS[key];
  }
  // Default fallback estimate based on average Moroccan intercity road
  return {
    fromCityId,
    toCityId,
    distanceKm: 160,
    durationMinutes: 110,
    standardSeatPriceMAD: 80,
    standardFullKorsaPriceMAD: 480,
    tollFeesMAD: 40
  };
}
