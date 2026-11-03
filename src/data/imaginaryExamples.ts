import { DriverBid, RideRequest } from '../types/index';

/**
 * Exemples de données imaginaires pour la démonstration et le test de l'application Korsa Maroc.
 * Ces données réalistes permettent d'illustrer le fonctionnement en direct sans données réelles de clients.
 */

export interface RoutePreset {
  id: string;
  label: string;
  fromCityId: string;
  fromCityName: string;
  pickupSpot: string;
  toCityId: string;
  toCityName: string;
  dropoffSpot: string;
  rideType: 'blasa' | 'korsa_kamla';
  seats: number;
  recommendedPriceMAD: number;
  distanceKm: number;
  durationMinutes: number;
}

export const IMAGINARY_ROUTE_PRESETS: RoutePreset[] = [
  {
    id: 'casa-rabat',
    label: 'Casablanca ⇄ Rabat (Navette Rapide)',
    fromCityId: 'casablanca',
    fromCityName: 'Casablanca',
    pickupSpot: 'Maarif - Boulevard Zerktouni (ou Gare Casa-Port)',
    toCityId: 'rabat',
    toCityName: 'Rabat',
    dropoffSpot: 'Agdal - Avenue Fal Ould Oumeir (ou Gare Rabat-Agdal)',
    rideType: 'blasa',
    seats: 2,
    recommendedPriceMAD: 60,
    distanceKm: 87,
    durationMinutes: 65
  },
  {
    id: 'marrakech-essaouira',
    label: 'Marrakech ⇄ Essaouira (Korsa Kamla Privatisée)',
    fromCityId: 'marrakech',
    fromCityName: 'Marrakech',
    pickupSpot: 'Guéliz - Boulevard Mohammed V (devant la Poste)',
    toCityId: 'essaouira',
    toCityName: 'Essaouira',
    dropoffSpot: 'Médina - Bab Sbaa ou Gare Routière',
    rideType: 'korsa_kamla',
    seats: 6,
    recommendedPriceMAD: 550,
    distanceKm: 177,
    durationMinutes: 140
  },
  {
    id: 'tanger-tetouan',
    label: 'Tanger ⇄ Tétouan (Départ Immédiat)',
    fromCityId: 'tanger',
    fromCityName: 'Tanger',
    pickupSpot: 'Gare Tanger Ville (Place du Maghreb Arabe)',
    toCityId: 'tetouan',
    toCityName: 'Tétouan',
    dropoffSpot: 'Place des Colombes / Station Hamama',
    rideType: 'blasa',
    seats: 1,
    recommendedPriceMAD: 45,
    distanceKm: 58,
    durationMinutes: 50
  },
  {
    id: 'fes-meknes',
    label: 'Fès ⇄ Meknès (Corridor Impérial)',
    fromCityId: 'fes',
    fromCityName: 'Fès',
    pickupSpot: 'Ville Nouvelle - Avenue Hassan II (ou Bab Boujloud)',
    toCityId: 'meknes',
    toCityName: 'Meknès',
    dropoffSpot: 'Place Lahdim ou Gare Meknès-Ville',
    rideType: 'blasa',
    seats: 2,
    recommendedPriceMAD: 30,
    distanceKm: 62,
    durationMinutes: 45
  }
];

export const IMAGINARY_DEMO_DRIVERS: DriverBid[] = [
  {
    id: 'bid-demo-1',
    driverId: 'drv-demo-1',
    driverName: 'Si Mohammed El Fassi',
    driverPhone: '+212 6 61 00 42 10',
    driverRating: 4.96,
    tripsCount: 1840,
    carModel: 'Dacia Lodgy 7-places Climatisée (2023)',
    carYear: 2023,
    carColor: 'Blanc Casablanca',
    taxiCity: 'Casablanca',
    taxiLicenseNumber: 'Agrément Grand Taxi N° 4182/Casa',
    plateNumber: '24810 | أ | 26',
    photoUrl: '/assets/images/korsa_driver_moul_1793551615472.jpg',
    offeredPriceMAD: 60,
    etaMinutes: 6,
    message: 'Salam ! Disponible à Maarif avec coffre libre et climatisation. Départ direct par l’autoroute A1.',
    timestamp: 'Il y a 2 min'
  },
  {
    id: 'bid-demo-2',
    driverId: 'drv-demo-2',
    driverName: 'Brahim Amrani',
    driverPhone: '+212 6 63 00 88 19',
    driverRating: 4.92,
    tripsCount: 950,
    carModel: 'Mercedes-Benz Classe E Grand Taxi',
    carYear: 2021,
    carColor: 'Bleu Marine Rabat',
    taxiCity: 'Rabat',
    taxiLicenseNumber: 'Agrément Grand Taxi N° 1205/Rabat',
    plateNumber: '51940 | ب | 1',
    photoUrl: '/assets/images/korsa_driver_moul_1793551615472.jpg',
    offeredPriceMAD: 65,
    etaMinutes: 11,
    message: 'Trajet grand confort. Sièges cuir et arrêt express possible au péage.',
    timestamp: 'Il y a 4 min'
  },
  {
    id: 'bid-demo-3',
    driverId: 'drv-demo-3',
    driverName: 'Hassan Tazi',
    driverPhone: '+212 6 72 00 14 55',
    driverRating: 4.88,
    tripsCount: 620,
    carModel: 'Peugeot 301 Grand Taxi Confort',
    carYear: 2022,
    carColor: 'Ocre Marrakech',
    taxiCity: 'Marrakech',
    taxiLicenseNumber: 'Agrément Grand Taxi N° 3317/Marrakech',
    plateNumber: '19402 | أ | 40',
    photoUrl: '/assets/images/korsa_driver_moul_1793551615472.jpg',
    offeredPriceMAD: 55,
    etaMinutes: 15,
    message: 'Prêt au départ. Tarif préférentiel pour réservation rapide.',
    timestamp: 'Il y a 6 min'
  }
];

export const IMAGINARY_DEMO_RIDES: RideRequest[] = [
  {
    id: 'ride-demo-1',
    passengerName: 'Hamza Bennani (Exemple)',
    passengerPhone: '+212 6 61 00 12 34',
    fromCity: 'Casablanca',
    pickupLandmark: 'Maarif - Boulevard Zerktouni (près du Twin Center)',
    toCity: 'Rabat',
    dropoffLandmark: 'Agdal - Avenue Fal Ould Oumeir (Gare ONCF)',
    rideType: 'blasa',
    seatsRequested: 2,
    proposedPriceMAD: 120, // 60 MAD x 2 places
    status: 'bidding',
    createdAt: 'Il y a 5 min',
    departureTime: 'daba',
    mutualPin: '4829',
    activeBids: [],
    paymentStatus: 'unpaid'
  },
  {
    id: 'ride-demo-2',
    passengerName: 'Famille Drissi (Exemple)',
    passengerPhone: '+212 6 63 00 56 78',
    fromCity: 'Marrakech',
    pickupLandmark: 'Guéliz - Boulevard Mohammed V',
    toCity: 'Essaouira',
    dropoffLandmark: 'Port d’Essaouira / Bab El Menzeh',
    rideType: 'korsa_kamla',
    seatsRequested: 6,
    proposedPriceMAD: 550,
    status: 'bidding',
    createdAt: 'Il y a 12 min',
    departureTime: 'daba',
    mutualPin: '7314',
    activeBids: [],
    paymentStatus: 'unpaid'
  },
  {
    id: 'ride-demo-3',
    passengerName: 'Yasmine Cherkaoui (Exemple)',
    passengerPhone: '+212 6 70 00 90 12',
    fromCity: 'Tanger',
    pickupLandmark: 'Gare Tanger Ville (Place du Maghreb Arabe)',
    toCity: 'Tétouan',
    dropoffLandmark: 'Station Hamama / Avenue Hassan II',
    rideType: 'blasa',
    seatsRequested: 1,
    proposedPriceMAD: 45,
    status: 'bidding',
    createdAt: 'Il y a 18 min',
    departureTime: 'daba',
    mutualPin: '9162',
    activeBids: [],
    paymentStatus: 'unpaid'
  }
];
