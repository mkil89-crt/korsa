export type RideType = 'blasa' | 'korsa_kamla';

export type RideStatus =
  | 'draft'
  | 'bidding'
  | 'driver_accepted'
  | 'arrived_at_pickup'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'wallet' | 'card' | 'cash';

export interface MoroccanCity {
  id: string;
  name: string;
  nameArabic: string;
  region: string;
  popularPickups: string[];
  popularDropoffs: string[];
}

export interface IntercityRouteBenchmark {
  fromCityId: string;
  toCityId: string;
  distanceKm: number;
  durationMinutes: number;
  standardSeatPriceMAD: number;
  standardFullKorsaPriceMAD: number;
  tollFeesMAD: number;
}

export interface DriverBid {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  tripsCount: number;
  carModel: string;
  carYear: number;
  carColor: string;
  taxiCity: string;
  taxiLicenseNumber: string; // "Lagrima"
  plateNumber: string;
  photoUrl: string;
  offeredPriceMAD: number;
  etaMinutes: number;
  message?: string;
  timestamp: string;
}

export interface RideRequest {
  id: string;
  passengerName: string;
  passengerPhone: string;
  fromCity: string;
  pickupLandmark: string;
  toCity: string;
  dropoffLandmark: string;
  rideType: RideType; // 'blasa' (seat) or 'korsa_kamla' (full grand taxi)
  seatsRequested: number;
  proposedPriceMAD: number;
  status: RideStatus;
  createdAt: string;
  departureTime: 'daba' | 'later';
  departureTimeDetail?: string;
  mutualPin: string; // 4-digit code (e.g. "8492")
  driverOfferAccepted?: DriverBid;
  activeBids: DriverBid[];
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: PaymentMethod;
  paymentReceiptId?: string;
  notes?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'trip_fare' | 'driver_earnings' | 'refund';
  amountMAD: number;
  date: string;
  description: string;
  referenceCode: string;
  status: 'completed' | 'pending';
}

export interface BankCard {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  bankName: 'Attijariwafa Bank' | 'CIH Bank' | 'Banque Populaire' | 'Bank of Africa';
}
