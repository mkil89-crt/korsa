import React, { useState } from 'react';
import { Phone, MessageSquare, ShieldCheck, MapPin, CheckCircle2, Car, Copy, Check, Radio } from 'lucide-react';
import { DriverBid, RideRequest } from '../types/index';
import { DriverAvatar } from './DriverAvatar';

interface DirectContactCardProps {
  ride: RideRequest;
  driver?: DriverBid;
  viewerRole: 'passenger' | 'driver';
  onVerifyPin?: (pin: string) => boolean;
}

export const DirectContactCard: React.FC<DirectContactCardProps> = ({
  ride,
  driver,
  viewerRole,
  onVerifyPin
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinStatus, setPinStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [buzzed, setBuzzed] = useState(false);

  // Target contact info depending on viewer
  const targetName = viewerRole === 'passenger' 
    ? (driver?.driverName || ride.driverOfferAccepted?.driverName || 'Chauffeur Moul Taxi')
    : (ride.passengerName || 'Voyageur');

  const targetPhone = viewerRole === 'passenger'
    ? (driver?.driverPhone || ride.driverOfferAccepted?.driverPhone || '')
    : (ride.passengerPhone || '');

  const cleanPhoneForLink = targetPhone ? targetPhone.replace(/[\s-]/g, '').replace('+', '') : '';

  // Pre-formatted WhatsApp message in Moroccan context
  const whatsappMessage = viewerRole === 'passenger'
    ? encodeURIComponent(`Salam ${targetName}! I am your Korsa passenger for the trip ${ride.fromCity} ➔ ${ride.toCity}. I am waiting at: "${ride.pickupLandmark}". My Korsa PIN is: ${ride.mutualPin}. See you soon!`)
    : encodeURIComponent(`Salam ${targetName}! This is your Korsa Grand Taxi driver (${driver?.carModel || 'Dacia Lodgy'}). I am arriving at "${ride.pickupLandmark}". My taxi license is ${driver?.taxiLicenseNumber || 'Lagrima'}.`);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(targetPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === ride.mutualPin) {
      setPinStatus('success');
      if (onVerifyPin) onVerifyPin(enteredPin);
    } else {
      setPinStatus('error');
    }
  };

  const handleBuzzArrival = () => {
    setBuzzed(true);
    setTimeout(() => setBuzzed(false), 4000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 md:p-6 space-y-6">
      
      {/* Header alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Direct Rendez-Vous System · تواصل مباشر
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
            {viewerRole === 'passenger' ? 'Contact Your Grand Taxi Chauffeur' : 'Contact Your Passenger'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Find each other easily without getting lost at the street or junction.
          </p>
        </div>

        {/* 4-digit mutual security code */}
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl px-3.5 py-2">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Mutual Korsa PIN
            </div>
            <div className="text-xl font-mono font-extrabold text-amber-900 dark:text-amber-100 tracking-widest">
              {ride.mutualPin}
            </div>
          </div>
        </div>
      </div>

      {/* Target Party Info Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <DriverAvatar
              photoUrl={viewerRole === 'passenger' ? (driver?.photoUrl || '/assets/images/korsa_driver_moul_1793551615472.jpg') : ''}
              name={targetName}
              size="lg"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {targetName}
              </h4>
              <span className="text-[11px] font-medium text-slate-500">
                {viewerRole === 'passenger' ? 'Chauffeur' : 'Client'}
              </span>
            </div>

            {viewerRole === 'passenger' && driver && (
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 space-y-0.5">
                <div className="flex items-center gap-1.5 font-medium">
                  <Car className="w-3.5 h-3.5 text-amber-600" />
                  <span>{driver.carModel}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{driver.plateNumber}</span>
                  <span className="mx-1.5">·</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{driver.taxiLicenseNumber}</span>
                </div>
              </div>
            )}

            {viewerRole === 'driver' && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {ride.seatsRequested} {ride.seatsRequested > 1 ? 'Passengers' : 'Passenger'} · {ride.rideType === 'korsa_kamla' ? 'Private Korsa Kamla' : 'Shared Blasa'}
              </p>
            )}
          </div>
        </div>

        {/* Big Phone Number Display */}
        <div className="text-left sm:text-right">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Moroccan Phone Number
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-wide">
            {targetPhone}
          </div>
        </div>
      </div>

      {/* THE HERO ACTION BUTTONS: Direct Call & WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Direct Call Button (tel: protocol) */}
        <a
          href={`tel:${cleanPhoneForLink}`}
          className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all text-center"
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Phone className="w-4 h-4 text-white animate-bounce" />
          </div>
          <div className="text-left">
            <div className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">
              Appeler Directement
            </div>
            <div className="text-sm font-extrabold tracking-wide">
              Call {targetPhone}
            </div>
          </div>
        </a>

        {/* Direct WhatsApp Button */}
        <a
          href={`https://wa.me/${cleanPhoneForLink}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-[#25D366]/20 transition-all text-center"
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">
              Envoyer Message WhatsApp
            </div>
            <div className="text-sm font-extrabold tracking-wide">
              WhatsApp Chat (+212)
            </div>
          </div>
        </a>

      </div>

      {/* Auxiliary actions: Copy number & Landmark notes */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={handleCopyPhone}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
          >
            {copiedPhone ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Phone Number</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuzzArrival}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
              buzzed
                ? 'bg-amber-500 text-slate-950 border-amber-500 animate-pulse'
                : 'border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{buzzed ? 'Signal Sent: "I am here on the street!"' : 'Signal "I am standing here"'}</span>
          </button>
        </div>

        {/* Pickup spot description */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3">
          <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white">Exact Pickup Spot: </span>
            <span>{ride.pickupLandmark}</span>
            <span className="block text-[11px] text-slate-500 mt-1">
              Destination: {ride.dropoffLandmark}, {ride.toCity}.
            </span>
          </div>
        </div>

        {/* Security code verification form (especially for driver when meeting passenger) */}
        {viewerRole === 'driver' && (
          <form onSubmit={handleVerify} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Verify Passenger PIN Before Boarding:
              </label>
              {pinStatus === 'success' && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Code Verified
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinStatus('idle');
                }}
                placeholder="Enter 4-digit code"
                className="w-36 px-3 py-1.5 text-center font-mono font-bold tracking-widest text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Validate PIN
              </button>
            </div>
            {pinStatus === 'error' && (
              <p className="text-[11px] text-rose-600 font-medium">
                Incorrect PIN. Ask passenger for their 4-digit Korsa code shown on their screen.
              </p>
            )}
          </form>
        )}

      </div>

    </div>
  );
};
