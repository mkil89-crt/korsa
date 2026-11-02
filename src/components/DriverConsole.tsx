import React, { useState } from 'react';
import {
  Car,
  Users,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Award,
  Navigation,
  ArrowRight,
  Plus,
  Landmark,
  X,
  Building
} from 'lucide-react';
import { RideRequest, DriverBid, UserSession } from '../types';
import { DirectContactCard } from './DirectContactCard';

interface DriverConsoleProps {
  pendingRides: RideRequest[];
  currentUser?: UserSession | null;
  onDriverAcceptRide: (rideId: string, customPrice?: number) => void;
  activeDriverRide: RideRequest | null;
  onUpdateRideStatus: (newStatus: RideRequest['status']) => void;
  driverWalletBalance: number;
  onDriverWithdraw: () => void;
  onVerifyMutualPin: (pin: string) => boolean;
  onOpenAuthModal?: () => void;
}

export const DriverConsole: React.FC<DriverConsoleProps> = ({
  pendingRides,
  currentUser,
  onDriverAcceptRide,
  activeDriverRide,
  onUpdateRideStatus,
  driverWalletBalance,
  onDriverWithdraw,
  onVerifyMutualPin,
  onOpenAuthModal
}) => {
  const [selectedBidPrice, setSelectedBidPrice] = useState<{ [rideId: string]: number }>({});
  const [etaSelected, setEtaSelected] = useState<number>(8);
  const [tripStep, setTripStep] = useState<'approaching' | 'at_pickup' | 'on_autoroute' | 'delivered'>('approaching');
  const [driverActionToast, setDriverActionToast] = useState<string | null>(null);

  const isDriverLoggedIn = currentUser?.role === 'driver';
  const driverDisplayName = isDriverLoggedIn ? currentUser.name : 'Si Hassan El Amrani';
  const driverVehicleName = isDriverLoggedIn && currentUser.driverDetails?.carModel
    ? currentUser.driverDetails.carModel
    : 'Dacia Lodgy 7-Places (Climatisée)';
  const driverLicenceLabel = isDriverLoggedIn && currentUser.driverDetails?.lagrimaNumber
    ? `${currentUser.driverDetails.lagrimaNumber} ${currentUser.city || ''}`
    : 'Lagrima #3108 Casablanca';

  // Driver RIB state
  const [showDriverRibModal, setShowDriverRibModal] = useState(false);
  const [driverBank, setDriverBank] = useState('CIH Bank (Code 30)');
  const [driverRib, setDriverRib] = useState('230780000987654321098765');
  const [ribSuccess, setRibSuccess] = useState(false);

  // Driver Post Trip Offer State
  const [showPostTripModal, setShowPostTripModal] = useState(false);
  const [postFromCity, setPostFromCity] = useState('Casablanca');
  const [postToCity, setPostToCity] = useState('Marrakech');
  const [postPickupSpot, setPostPickupSpot] = useState('Maarif - Boulevard Zerktouni (Twin Center)');
  const [postSeats, setPostSeats] = useState(4);
  const [postPriceMAD, setPostPriceMAD] = useState(120);
  const [postDepartureTime, setPostDepartureTime] = useState('15:30 (Aujourd’hui)');
  const [postSuccessMsg, setPostSuccessMsg] = useState(false);

  const handleSendOffer = (ride: RideRequest, price: number) => {
    onDriverAcceptRide(ride.id, price);
  };

  const handlePublishTripOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setPostSuccessMsg(true);
    setTimeout(() => {
      setPostSuccessMsg(false);
      setShowPostTripModal(false);
      alert(`Départ Grand Taxi publié avec succès ! Votre course ${postFromCity} ➔ ${postToCity} (${postSeats} places à ${postPriceMAD} MAD) est visible pour les voyageurs.`);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Driver Profile & Vehicle Badge Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="/assets/images/korsa_driver_moul_1793551615472.jpg"
                alt="Si Hassan Chauffeur"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md">
                PRO
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Outfit',sans-serif]">
                  {driverDisplayName}
                </h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Chauffeur Agréé
                </span>
              </div>
              
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span className="text-amber-400 font-semibold">{driverVehicleName}</span>
                <span>·</span>
                <span className="text-slate-300 font-mono">{driverLicenceLabel}</span>
                <span>·</span>
                <span className="text-amber-400 font-bold">★ 4.95 (1,420 courses)</span>
              </div>

              {!isDriverLoggedIn && onOpenAuthModal && (
                <div className="mt-2">
                  <button
                    onClick={onOpenAuthModal}
                    className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Vous êtes chauffeur ? Connectez votre profil agréé</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Daily Earnings Card */}
          <div className="flex items-center gap-4 bg-slate-800/80 border border-slate-700/80 px-5 py-3.5 rounded-2xl self-start md:self-auto">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Driver Wallet & Earnings
              </div>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-white">
                {driverWalletBalance} <span className="text-xs font-sans text-amber-400">MAD</span>
              </div>
            </div>
            <button
              onClick={() => setShowDriverRibModal(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Mon RIB & Virement</span>
            </button>
          </div>

        </div>
      </div>

      {/* DRIVER RIB MODAL */}
      {showDriverRibModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                    RIB Bancaire du Chauffeur · سحب الأرباح
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pour recevoir vos gains de courses directement sur votre compte bancaire.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDriverRibModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {ribSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>RIB enregistré avec succès ! Virement de {driverWalletBalance} MAD initié.</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Votre Banque Marocaine
                </label>
                <select
                  value={driverBank}
                  onChange={(e) => setDriverBank(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option>CIH Bank (Code 30)</option>
                  <option>Attijariwafa Bank</option>
                  <option>Banque Populaire (BCP)</option>
                  <option>Bank of Africa (BMCE)</option>
                  <option>Crédit Agricole du Maroc</option>
                  <option>Société Générale Maroc</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Numéro de RIB (24 Chiffres)
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-600">
                    {driverRib.length}/24 chiffres
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={24}
                  value={driverRib}
                  onChange={(e) => setDriverRib(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="24 chiffres sans espaces"
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm font-bold tracking-widest text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500">Montant des gains à virer</span>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {driverWalletBalance} <span className="text-xs font-sans text-amber-600">MAD</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-md">
                  Virement Gratuit
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDriverRibModal(false)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  setRibSuccess(true);
                  setTimeout(() => {
                    onDriverWithdraw();
                    setShowDriverRibModal(false);
                    setRibSuccess(false);
                  }, 1200);
                }}
                disabled={driverRib.length < 24 || driverWalletBalance <= 0}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Enregistrer & Virer vers ce RIB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE RIDE IN PROGRESS (MATCHED WITH PASSENGER) */}
      {activeDriverRide && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                  Active Intercity Mission: {activeDriverRide.fromCity} ➔ {activeDriverRide.toCity}
                </h3>
                <p className="text-xs text-slate-500">
                  Fare: <strong className="font-mono text-amber-600">{activeDriverRide.proposedPriceMAD} MAD</strong> · Passenger: <strong>{activeDriverRide.passengerName}</strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Course Confirmed
              </span>
            </div>
          </div>

          {/* DIRECT CALL & CONTACT CARD */}
          <DirectContactCard
            ride={activeDriverRide}
            viewerRole="driver"
            onVerifyPin={onVerifyMutualPin}
          />

          {/* Driver Trip Lifecycle Controls */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Chauffeur Mission Lifecycle
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setTripStep('at_pickup');
                  onUpdateRideStatus('arrived_at_pickup');
                  notifyDriver('Arrivé au pas de la porte du passager ! Notification envoyée.');
                }}
                className={`py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  tripStep === 'at_pickup'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>1. Arrivé au Point de Rendez-vous</span>
              </button>

              <button
                onClick={() => {
                  setTripStep('on_autoroute');
                  onUpdateRideStatus('in_progress');
                  notifyDriver('Course démarrée ! Trajet sur l’autoroute nationale.');
                }}
                className={`py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  tripStep === 'on_autoroute'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>2. Départ sur l’Autoroute</span>
              </button>

              <button
                onClick={() => {
                  setTripStep('delivered');
                  onUpdateRideStatus('completed');
                  notifyDriver(`Course terminée ! ${activeDriverRide.proposedPriceMAD} MAD crédités sur votre portefeuille.`);
                }}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>3. Terminer & Encaisser ({activeDriverRide.proposedPriceMAD} MAD)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. RADAR OF LIVE PASSENGER REQUESTS */}
      {!activeDriverRide && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif] flex items-center gap-2">
                <span>Intercity Ride Radar · طلبات المسافرين</span>
                <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-mono">
                  {pendingRides.length} Available
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Moroccan travelers requesting direct Grand Taxi rides. Accept fare or submit a counter-bid.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowPostTripModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publier un Départ Chauffeur</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="hidden sm:inline">Corridors Actifs</span>
              </div>
            </div>
          </div>

          {/* Pending rides cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRides.map((ride) => {
              const currentBidPrice = selectedBidPrice[ride.id] ?? ride.proposedPriceMAD;

              return (
                <div
                  key={ride.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Route and Type Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                            {ride.fromCity} ➔ {ride.toCity}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ride.passengerName}</span>
                          <span>·</span>
                          <span className="font-semibold text-amber-600">
                            {ride.rideType === 'korsa_kamla' ? 'Private Taxi (6 seats)' : `${ride.seatsRequested} Seat(s)`}
                          </span>
                        </div>
                      </div>

                      {/* Passenger Offered Price */}
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Client Offers:</div>
                        <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                          {ride.proposedPriceMAD} <span className="text-xs font-sans text-amber-600">MAD</span>
                        </div>
                      </div>
                    </div>

                    {/* Pick-up Doorstep Details */}
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-slate-800 dark:text-slate-200">Doorstep Pickup: </strong>
                          <span className="text-slate-600 dark:text-slate-400">{ride.pickupLandmark}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-slate-800 dark:text-slate-200">Dropoff: </strong>
                          <span className="text-slate-600 dark:text-slate-400">{ride.dropoffLandmark}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chauffeur Bidding Actions */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span>Propose Chauffeur Fare:</span>
                      <div className="flex items-center gap-1 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedBidPrice(prev => ({ ...prev, [ride.id]: ride.proposedPriceMAD }))}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                        >
                          Accept {ride.proposedPriceMAD} DH
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBidPrice(prev => ({ ...prev, [ride.id]: ride.proposedPriceMAD + 10 }))}
                          className="px-2 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
                        >
                          +10 DH
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBidPrice(prev => ({ ...prev, [ride.id]: ride.proposedPriceMAD + 20 }))}
                          className="px-2 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
                        >
                          +20 DH
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSendOffer(ride, ride.proposedPriceMAD)}
                        className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm text-center"
                      >
                        Accept at {ride.proposedPriceMAD} MAD
                      </button>

                      <button
                        onClick={() => handleSendOffer(ride, currentBidPrice)}
                        className="py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm text-center"
                      >
                        Counter at {currentBidPrice} MAD
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {pendingRides.length === 0 && (
            <div className="p-10 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto relative">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping"></div>
                <Navigation className="w-8 h-8 text-amber-500" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                  Radar Inter-Villes Actif · 0 course en attente
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Aucune demande de trajet en attente sur ce corridor. Dès qu’un voyageur soumettra une course (ex: Casablanca ➔ Rabat ou Marrakech), elle apparaîtra instantanément ici avec son tarif proposé.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostTripModal(true)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publier un Départ Chauffeur (Places Libres)</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* POST TRIP MODAL FOR DRIVER */}
      {showPostTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                    Publier un Départ Grand Taxi · إعلان رحلة
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Proposez un trajet interurbain avec vos places libres et votre tarif.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPostTripModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {postSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Publication réussie ! Votre trajet est visible sur le réseau Korsa.</span>
              </div>
            )}

            <form onSubmit={handlePublishTripOffer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ville de Départ
                  </label>
                  <select
                    value={postFromCity}
                    onChange={(e) => setPostFromCity(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option>Casablanca</option>
                    <option>Rabat</option>
                    <option>Marrakech</option>
                    <option>Tanger</option>
                    <option>Fès</option>
                    <option>Agadir</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ville de Destination
                  </label>
                  <select
                    value={postToCity}
                    onChange={(e) => setPostToCity(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option>Marrakech</option>
                    <option>Rabat</option>
                    <option>Casablanca</option>
                    <option>Tanger</option>
                    <option>Agadir</option>
                    <option>Essaouira</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Point de Ramassage Prévu (Quartier / Repère)
                </label>
                <input
                  type="text"
                  value={postPickupSpot}
                  onChange={(e) => setPostPickupSpot(e.target.value)}
                  placeholder="Ex: Maarif Boulevard Zerktouni, Gare Casa-Port"
                  className="w-full mt-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Places Disponibles (1 à 6)
                  </label>
                  <select
                    value={postSeats}
                    onChange={(e) => setPostSeats(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} place(s)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Prix par Place (MAD)
                  </label>
                  <input
                    type="number"
                    value={postPriceMAD}
                    onChange={(e) => setPostPriceMAD(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Heure de Départ
                </label>
                <input
                  type="text"
                  value={postDepartureTime}
                  onChange={(e) => setPostDepartureTime(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostTripModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Publier l'Offre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
