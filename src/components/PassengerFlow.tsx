import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ArrowRight,
  Car,
  Users,
  Clock,
  Sparkles,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { MoroccanCity, RideRequest, DriverBid, RideType, UserSession } from '../types/index';
import { MOROCCAN_CITIES, getRouteBenchmark } from '../data/moroccanCities';
import { MOCK_CERTIFIED_DRIVERS } from '../data/mockDrivers';
import { IMAGINARY_ROUTE_PRESETS, IMAGINARY_DEMO_DRIVERS, RoutePreset } from '../data/imaginaryExamples';
import { DirectContactCard } from './DirectContactCard';
import { DriverAvatar } from './DriverAvatar';

interface PassengerFlowProps {
  currentRide: RideRequest | null;
  currentUser?: UserSession | null;
  onPublishRide: (ride: RideRequest) => void;
  onAcceptDriverBid: (driver: DriverBid) => void;
  onCancelRide: () => void;
  onOpenPaymentModal: () => void;
  onVerifyMutualPin: (pin: string) => boolean;
  onSimulateTestBid?: () => void;
}

export const PassengerFlow: React.FC<PassengerFlowProps> = ({
  currentRide,
  currentUser,
  onPublishRide,
  onAcceptDriverBid,
  onCancelRide,
  onOpenPaymentModal,
  onVerifyMutualPin,
  onSimulateTestBid
}) => {
  // Booking Form State - clean initial values ready for real online passengers
  const [fromCityId, setFromCityId] = useState<string>('casablanca');
  const [toCityId, setToCityId] = useState<string>('rabat');
  const [pickupLandmark, setPickupLandmark] = useState<string>('');
  const [dropoffLandmark, setDropoffLandmark] = useState<string>('');
  const [rideType, setRideType] = useState<RideType>('blasa');
  const [seatsRequested, setSeatsRequested] = useState<number>(1);
  const [passengerName, setPassengerName] = useState<string>(currentUser?.name || '');
  const [passengerPhone, setPassengerPhone] = useState<string>(currentUser?.phone || '');
  const [proposedPriceMAD, setProposedPriceMAD] = useState<number>(45);
  const [customCounterInput, setCustomCounterInput] = useState<{ [bidId: string]: number }>({});
  const [showCounterBox, setShowCounterBox] = useState<{ [bidId: string]: boolean }>({});

  // Sync passenger credentials if logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !passengerName) setPassengerName(currentUser.name);
      if (currentUser.phone && !passengerPhone) setPassengerPhone(currentUser.phone);
    }
  }, [currentUser]);

  const routeBenchmark = getRouteBenchmark(fromCityId, toCityId);

  // Auto-adjust default price recommendation when route or ride type changes
  useEffect(() => {
    if (rideType === 'korsa_kamla') {
      setProposedPriceMAD(routeBenchmark.standardFullKorsaPriceMAD);
    } else {
      setProposedPriceMAD(routeBenchmark.standardSeatPriceMAD * seatsRequested);
    }
  }, [fromCityId, toCityId, rideType, seatsRequested]);

  // When fromCity changes, update default landmark suggestion
  const handleFromCityChange = (cityId: string) => {
    setFromCityId(cityId);
    const city = MOROCCAN_CITIES.find(c => c.id === cityId);
    if (city && city.popularPickups.length > 0) {
      setPickupLandmark(city.popularPickups[0]);
    }
  };

  const handleToCityChange = (cityId: string) => {
    setToCityId(cityId);
    const city = MOROCCAN_CITIES.find(c => c.id === cityId);
    if (city && city.popularDropoffs.length > 0) {
      setDropoffLandmark(city.popularDropoffs[0]);
    }
  };

  const handleStartKorsa = (e: React.FormEvent) => {
    e.preventDefault();
    const fromCityObj = MOROCCAN_CITIES.find(c => c.id === fromCityId)?.name || 'Casablanca';
    const toCityObj = MOROCCAN_CITIES.find(c => c.id === toCityId)?.name || 'Rabat';

    // Generate random 4-digit mutual pin (e.g. "8392")
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();

    const newRequest: RideRequest = {
      id: `ride-${Date.now()}`,
      passengerName,
      passengerPhone,
      fromCity: fromCityObj,
      pickupLandmark,
      toCity: toCityObj,
      dropoffLandmark,
      rideType,
      seatsRequested: rideType === 'korsa_kamla' ? 6 : seatsRequested,
      proposedPriceMAD,
      status: 'bidding',
      createdAt: 'Just now',
      departureTime: 'daba',
      mutualPin: generatedPin,
      activeBids: [],
      paymentStatus: 'unpaid'
    };

    onPublishRide(newRequest);
  };

  // Helper for passenger counter-offering
  const handlePassengerCounterOffer = (bid: DriverBid) => {
    const counterVal = customCounterInput[bid.id] || proposedPriceMAD;
    alert(`Your counter-offer of ${counterVal} MAD was sent to ${bid.driverName}!`);
    setShowCounterBox(prev => ({ ...prev, [bid.id]: false }));
  };

  const fromCityData = MOROCCAN_CITIES.find(c => c.id === fromCityId);
  const toCityData = MOROCCAN_CITIES.find(c => c.id === toCityId);

  return (
    <div className="space-y-8">
      
      {/* 1. STATE: NO ACTIVE RIDE (NEW BOOKING FORM) */}
      {!currentRide && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Header Banner - Authentic Moroccan Grand Taxi styling */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 px-6 py-6 text-white border-b border-amber-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase font-black tracking-wider bg-black/40 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/30">
                    Grand Taxi Interurbain · طاكسي كبير بين المدن
                  </span>
                  <span className="text-[11px] text-amber-200/90 font-medium">
                    Modèle d'Enchères Directes
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight font-['Outfit',sans-serif] mt-2">
                  Réserver un Grand Taxi au Pas de Votre Porte
                </h2>
                <p className="text-xs text-amber-100/90 max-w-xl mt-1 leading-relaxed">
                  Voyagez directement d'adresse à adresse entre villes marocaines en Grand Taxi agréé. Proposez votre prix en dirhams (MAD) et négociez en direct avec les chauffeurs sans vous déplacer à la gare routière (Mahatta).
                </p>
              </div>

              <div className="hidden md:flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                <div className="text-xs">
                  <div className="font-bold text-white">Chauffeurs Agréés (Lagrima)</div>
                  <div className="text-[11px] text-amber-200/80">Agrément officiel du Ministère</div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form Body */}
          <form onSubmit={handleStartKorsa} className="p-6 md:p-8 space-y-6">

            {/* Quick Imaginary Route Presets Bar (Exemples de Trajets Types Imaginaires) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Exemples de Trajets Types (Données Imaginaires Réalistes) :</span>
                </div>
                <span className="text-[11px] text-amber-800 dark:text-amber-400 font-medium hidden sm:inline">
                  Cliquez pour charger un exemple
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {IMAGINARY_ROUTE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setFromCityId(preset.fromCityId);
                      setToCityId(preset.toCityId);
                      setPickupLandmark(preset.pickupSpot);
                      setDropoffLandmark(preset.dropoffSpot);
                      setRideType(preset.rideType);
                      setSeatsRequested(preset.seats);
                      setProposedPriceMAD(preset.recommendedPriceMAD);
                    }}
                    className="text-left p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-amber-200/80 dark:border-amber-900/50 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 flex items-center justify-between">
                      <span className="truncate">{preset.fromCityName} ➔ {preset.toCityName}</span>
                      <span className="font-mono text-amber-600 font-extrabold shrink-0 ml-1">{preset.recommendedPriceMAD} DH</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                      <span>{preset.rideType === 'korsa_kamla' ? 'Korsa Kamla (6 pl.)' : `${preset.seats} pl. Blasa`}</span>
                      <span>{preset.distanceKm} km · ~{preset.durationMinutes} min</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Step A: City to City Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Departure City */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Departure City (مدينة الانطلاق)
                  </span>
                </label>
                <select
                  value={fromCityId}
                  onChange={(e) => handleFromCityChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                >
                  {MOROCCAN_CITIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.nameArabic})
                    </option>
                  ))}
                </select>

                {/* Pickup Doorstep / Landmark */}
                <div className="mt-2">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Your Exact Pickup Doorstep or Landmark
                  </label>
                  <input
                    type="text"
                    value={pickupLandmark}
                    onChange={(e) => setPickupLandmark(e.target.value)}
                    placeholder="e.g. Boulevard Zerktouni, near Twin Center"
                    className="w-full mt-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                    required
                  />
                  {/* Quick landmark chips */}
                  {fromCityData && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {fromCityData.popularPickups.slice(0, 3).map((spot, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPickupLandmark(spot)}
                          className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-800 dark:hover:bg-amber-950 dark:hover:text-amber-300 rounded-md text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                        >
                          {spot.split('-')[0].trim()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Destination City */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Destination City (مدينة الوصول)
                  </span>
                </label>
                <select
                  value={toCityId}
                  onChange={(e) => handleToCityChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                >
                  {MOROCCAN_CITIES.map(c => (
                    <option key={c.id} value={c.id} disabled={c.id === fromCityId}>
                      {c.name} ({c.nameArabic})
                    </option>
                  ))}
                </select>

                {/* Dropoff Landmark */}
                <div className="mt-2">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Destination Dropoff Spot
                  </label>
                  <input
                    type="text"
                    value={dropoffLandmark}
                    onChange={(e) => setDropoffLandmark(e.target.value)}
                    placeholder="e.g. Avenue Mohammed V, Agdal, or Hotel Name"
                    className="w-full mt-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                    required
                  />
                  {toCityData && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {toCityData.popularDropoffs.slice(0, 3).map((spot, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setDropoffLandmark(spot)}
                          className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-800 dark:hover:bg-amber-950 dark:hover:text-amber-300 rounded-md text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                        >
                          {spot.split('/')[0].trim()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Route Stats Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Autoroute Distance: <strong>{routeBenchmark.distanceKm} km</strong></span>
              </div>
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Estimated Highway Time: <strong>{routeBenchmark.durationMinutes} mins</strong></span>
              </div>
              <div className="text-[11px] text-amber-800 dark:text-amber-300">
                Péage Toll: <strong>{routeBenchmark.tollFeesMAD} MAD included</strong>
              </div>
            </div>

            {/* Step B: Ride Type (Blasa vs Korsa Kamla) */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Select Taxi Booking Format
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Option 1: Shared Grand Taxi Seat (Blasa) */}
                <div
                  onClick={() => setRideType('blasa')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    rideType === 'blasa'
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          Per-Seat (بلاصة - Blasa)
                        </div>
                        <div className="text-xs text-slate-500">
                          Shared Grand Taxi with other passengers
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-600">
                      ~{routeBenchmark.standardSeatPriceMAD} MAD/seat
                    </span>
                  </div>

                  {rideType === 'blasa' && (
                    <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-900/50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Number of Seats:
                      </span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSeatsRequested(num); }}
                            className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                              seatsRequested === num
                                ? 'bg-amber-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 2: Full Grand Taxi (Korsa Kamla) */}
                <div
                  onClick={() => setRideType('korsa_kamla')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    rideType === 'korsa_kamla'
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          Private Full Taxi (كورصة كاملة)
                        </div>
                        <div className="text-xs text-slate-500">
                          Entire 6-seat car privatized for you & family
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-600">
                      ~{routeBenchmark.standardFullKorsaPriceMAD} MAD
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    Leaves immediately with no wait. Driver takes you directly from your doorstep to destination address.
                  </p>
                </div>

              </div>
            </div>

            {/* Step C: inDrive Fare Proposal */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Propose Your Fare in Moroccan Dirhams (MAD)
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Offer a fair price. Nearby certified taxi chauffeurs will accept or send counter-bids.
                  </p>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  Station standard: <strong className="text-slate-800 dark:text-slate-200">{rideType === 'korsa_kamla' ? routeBenchmark.standardFullKorsaPriceMAD : routeBenchmark.standardSeatPriceMAD * seatsRequested} MAD</strong>
                </div>
              </div>

              {/* Price dialer */}
              <div className="flex items-center justify-center gap-4 py-2">
                <button
                  type="button"
                  onClick={() => setProposedPriceMAD(Math.max(15, proposedPriceMAD - 5))}
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-100 shadow-sm transition-all cursor-pointer"
                >
                  -5
                </button>

                <div className="flex items-baseline gap-2 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border-2 border-amber-500 shadow-inner">
                  <input
                    type="number"
                    step={5}
                    value={proposedPriceMAD}
                    onChange={(e) => setProposedPriceMAD(Math.max(10, Number(e.target.value)))}
                    className="w-24 text-center font-mono text-3xl font-extrabold text-slate-900 dark:text-white focus:outline-none"
                  />
                  <span className="text-lg font-bold text-amber-600 font-['Outfit',sans-serif]">MAD</span>
                </div>

                <button
                  type="button"
                  onClick={() => setProposedPriceMAD(proposedPriceMAD + 5)}
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-100 shadow-sm transition-all cursor-pointer"
                >
                  +5
                </button>
              </div>

              {/* Passenger Contact Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Your Name (Client)
                  </label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Your Moroccan Phone (+212)
                  </label>
                  <input
                    type="tel"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="06XXXXXXXX ou +212..."
                    className="w-full mt-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Launch Ride Request Button */}
            <button
              type="submit"
              className="w-full py-4 bg-slate-950 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-base rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Lancer la Korsa (Find Grand Taxis for {proposedPriceMAD} MAD)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </form>

        </div>
      )}

      {/* 2. STATE: ACTIVE RIDE IN PROGRESS / BIDDING */}
      {currentRide && (
        <div className="space-y-6">
          
          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                currentRide.status === 'bidding'
                  ? 'bg-amber-500/20 text-amber-600 animate-spin'
                  : 'bg-emerald-500/20 text-emerald-600'
              }`}>
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                    {currentRide.fromCity} ➔ {currentRide.toCity}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {currentRide.rideType === 'korsa_kamla' ? 'Private Taxi' : `${currentRide.seatsRequested} Seat(s)`}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Offered Fare: <strong className="font-mono text-amber-600">{currentRide.proposedPriceMAD} MAD</strong> · Mutual PIN: <strong className="font-mono text-slate-900 dark:text-white">{currentRide.mutualPin}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={onCancelRide}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                title="Revenir au formulaire de départ"
              >
                <span>↩️ Revenir à la première étape</span>
              </button>
            </div>
          </div>

          {/* If MATCHED & ACCEPTED: SHOW DIRECT CONTACT CARD HERO */}
          {currentRide.driverOfferAccepted && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Driver Confirmed! Contact Chauffeur below to meet up:</span>
                </div>
                <button
                  onClick={onOpenPaymentModal}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer shadow-sm"
                >
                  Pay Ride ({currentRide.driverOfferAccepted.offeredPriceMAD} MAD)
                </button>
              </div>

              {/* The user-highlighted Contact Card */}
              <DirectContactCard
                ride={currentRide}
                driver={currentRide.driverOfferAccepted}
                viewerRole="passenger"
                onVerifyPin={onVerifyMutualPin}
              />
            </div>
          )}

          {/* If BIDDING: SHOW INCOMING DRIVER BIDS RADAR */}
          {currentRide.status === 'bidding' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                    Live Driver Offers & Radar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Grand Taxi drivers on this corridor are sending bids. Pick the best driver!
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>{currentRide.activeBids.length} Offers Received</span>
                </div>
              </div>

              {/* If no bids yet: live radar searching state */}
              {currentRide.activeBids.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto relative">
                    <div className="absolute inset-0 rounded-full border-2 border-amber-500/40 animate-ping"></div>
                    <Car className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                      Radar Actif · Recherche de Chauffeurs Moul Taxi en cours
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Votre demande ({currentRide.proposedPriceMAD} MAD pour {currentRide.fromCity} ➔ {currentRide.toCity}) est diffusée en direct aux chauffeurs de Grand Taxi connectés.
                    </p>
                  </div>
                  {onSimulateTestBid && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={onSimulateTestBid}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Simuler une offre Chauffeur (Mode Démo)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Bids list */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentRide.activeBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div>
                        {/* Driver info header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <DriverAvatar
                              photoUrl={bid.photoUrl}
                              name={bid.driverName}
                              size="md"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {bid.driverName}
                                </h4>
                                <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-300/40 dark:border-amber-800/40">
                                  {bid.taxiLicenseNumber}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                <span className="text-amber-500 font-bold">★ {bid.driverRating}</span>
                                <span>·</span>
                                <span>{bid.tripsCount} courses</span>
                                {bid.plateNumber && (
                                  <>
                                    <span>·</span>
                                    <span className="font-mono text-[10px] bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded border border-slate-700">
                                      {bid.plateNumber}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Price offered by driver */}
                          <div className="text-right shrink-0">
                            <div className="text-xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                              {bid.offeredPriceMAD} <span className="text-xs font-sans text-amber-600">MAD</span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                              {bid.offeredPriceMAD === currentRide.proposedPriceMAD ? 'Accepte votre tarif' : 'Contre-proposition'}
                            </span>
                          </div>
                        </div>

                        {/* Vehicle & ETA info */}
                        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 border border-slate-200/60 dark:border-slate-700/60">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Car className="w-3.5 h-3.5 text-amber-600" />
                              {bid.carModel}
                            </span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                              Arrivée : {bid.etaMinutes} min
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                            "{bid.message}"
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onAcceptDriverBid(bid)}
                            className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm text-center"
                          >
                            Accept ({bid.offeredPriceMAD} MAD)
                          </button>
                          <button
                            onClick={() => setShowCounterBox(prev => ({ ...prev, [bid.id]: !prev[bid.id] }))}
                            className="py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center"
                          >
                            Counter-Offer
                          </button>
                        </div>

                        {/* Counter offer input toggle */}
                        {showCounterBox[bid.id] && (
                          <div className="flex gap-2 pt-2 animate-in fade-in">
                            <input
                              type="number"
                              value={customCounterInput[bid.id] || currentRide.proposedPriceMAD}
                              onChange={(e) => setCustomCounterInput(prev => ({ ...prev, [bid.id]: Number(e.target.value) }))}
                              className="w-24 px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg"
                            />
                            <button
                              onClick={() => handlePassengerCounterOffer(bid)}
                              className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Send MAD Offer
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
