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
import { RideRequest, DriverBid } from '../types';
import { DirectContactCard } from './DirectContactCard';

interface DriverConsoleProps {
  pendingRides: RideRequest[];
  onDriverAcceptRide: (rideId: string, customPrice?: number) => void;
  activeDriverRide: RideRequest | null;
  onUpdateRideStatus: (newStatus: RideRequest['status']) => void;
  driverWalletBalance: number;
  onDriverWithdraw: () => void;
  onVerifyMutualPin: (pin: string) => boolean;
}

export const DriverConsole: React.FC<DriverConsoleProps> = ({
  pendingRides,
  onDriverAcceptRide,
  activeDriverRide,
  onUpdateRideStatus,
  driverWalletBalance,
  onDriverWithdraw,
  onVerifyMutualPin
}) => {
  const [selectedBidPrice, setSelectedBidPrice] = useState<{ [rideId: string]: number }>({});
  const [etaSelected, setEtaSelected] = useState<number>(8);
  const [tripStep, setTripStep] = useState<'approaching' | 'at_pickup' | 'on_autoroute' | 'delivered'>('approaching');

  // Driver RIB state
  const [showDriverRibModal, setShowDriverRibModal] = useState(false);
  const [driverBank, setDriverBank] = useState('CIH Bank (Code 30)');
  const [driverRib, setDriverRib] = useState('230780000987654321098765');
  const [ribSuccess, setRibSuccess] = useState(false);

  const handleSendOffer = (ride: RideRequest, price: number) => {
    onDriverAcceptRide(ride.id, price);
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
                  Si Hassan El Amrani
                </h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Chauffeur Agréé
                </span>
              </div>
              
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span className="text-amber-400 font-semibold">Dacia Lodgy 7-Places (Climatisée)</span>
                <span>·</span>
                <span className="text-slate-300 font-mono">Lagrima #3108 Casablanca</span>
                <span>·</span>
                <span className="text-amber-400 font-bold">★ 4.94 (1,420 courses)</span>
              </div>
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
                  alert('Notification sent to passenger: "Your Grand Taxi is waiting outside at your doorstep!"');
                }}
                className={`py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  tripStep === 'at_pickup'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>1. Arrived at Doorstep</span>
              </button>

              <button
                onClick={() => {
                  setTripStep('on_autoroute');
                  onUpdateRideStatus('in_progress');
                  alert('Trip started! Driving onto the Autoroute.');
                }}
                className={`py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  tripStep === 'on_autoroute'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>2. Start Highway Run</span>
              </button>

              <button
                onClick={() => {
                  setTripStep('delivered');
                  onUpdateRideStatus('completed');
                  alert(`Trip Completed! ${activeDriverRide.proposedPriceMAD} MAD credited to your Chauffeur wallet.`);
                }}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>3. Complete & Settle ({activeDriverRide.proposedPriceMAD} MAD)</span>
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

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Scanning Casablanca, Rabat, Marrakech Corridors</span>
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
            <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
              <Car className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No Pending Ride Requests Right Now
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Switch to Passenger Mode in the top bar to launch a new Korsa request and see it appear here live on the chauffeur radar!
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
