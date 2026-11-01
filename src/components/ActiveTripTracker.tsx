import React, { useState, useEffect } from 'react';
import {
  Car,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  CreditCard,
  AlertTriangle,
  Share2
} from 'lucide-react';
import { RideRequest, DriverBid } from '../types';

interface ActiveTripTrackerProps {
  ride: RideRequest;
  onOpenPayment: () => void;
  onCompleteTrip: () => void;
  onClose: () => void;
}

export const ActiveTripTracker: React.FC<ActiveTripTrackerProps> = ({
  ride,
  onOpenPayment,
  onCompleteTrip,
  onClose
}) => {
  const [progressPercent, setProgressPercent] = useState(35);
  const [copiedShare, setCopiedShare] = useState(false);

  // Simulate subtle highway progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const driver = ride.driverOfferAccepted;
  const cleanPhone = (driver?.driverPhone || '+212661489210').replace(/[\s-]/g, '').replace('+', '');

  const handleShareTrip = () => {
    const text = `I am on a Korsa Grand Taxi from ${ride.fromCity} to ${ride.toCity}. Driver: ${driver?.driverName} (${driver?.taxiLicenseNumber}). Mutual PIN: ${ride.mutualPin}.`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 md:p-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
            Live Highway Journey · رحلة على الطريق السيار
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
            {ride.fromCity} ➔ {ride.toCity}
          </h2>
          <p className="text-xs text-slate-500">
            Traveling via National Autoroute · Grand Taxi {ride.rideType === 'korsa_kamla' ? 'Private Course' : 'Shared Course'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareTrip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? 'Trip Link Copied!' : 'Share Live Trip with Family'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Highway Map Visualizer */}
      <div className="p-6 rounded-2xl bg-slate-950 text-white space-y-4 shadow-inner relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-white">{ride.fromCity}</span>
            <span className="text-[11px]">({ride.pickupLandmark.split('-')[0].trim()})</span>
          </div>

          <div className="font-mono text-amber-400 font-bold">
            {progressPercent}% Completed
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="font-bold text-white">{ride.toCity}</span>
          </div>
        </div>

        {/* Progress Tracker Track */}
        <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-400 rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Highway Milestones */}
        <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
          <span>Départ</span>
          <span className="hidden sm:inline">Péage Bouznika Toll (Paid)</span>
          <span className="hidden sm:inline">Sortie Échangeur</span>
          <span>Arrivée</span>
        </div>
      </div>

      {/* Driver Card & Direct Contact Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Driver identity */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={driver?.photoUrl || '/src/assets/images/korsa_driver_moul_1793551615472.jpg'}
              alt={driver?.driverName}
              className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
              onError={(e) => {
                e.currentTarget.src = '/src/assets/images/korsa_driver_moul_1793551615472.jpg';
              }}
            />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {driver?.driverName || 'Si Hassan El Amrani'}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-amber-600" />
                <span>{driver?.carModel || 'Dacia Lodgy'}</span>
                <span>·</span>
                <span className="text-amber-600 font-mono font-semibold">{driver?.taxiLicenseNumber}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">PIN:</div>
            <div className="text-lg font-mono font-extrabold text-amber-600">
              {ride.mutualPin}
            </div>
          </div>
        </div>

        {/* The Direct Call & WhatsApp Buttons */}
        <div className="flex gap-2">
          <a
            href={`tel:${cleanPhone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all text-center"
          >
            <Phone className="w-4 h-4" />
            <span>Appeler Chauffeur</span>
          </a>

          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-md transition-all text-center"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp (+212)</span>
          </a>
        </div>

      </div>

      {/* Payment Status Ribbon & Action */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Fare Amount: <span className="font-mono text-amber-600">{ride.proposedPriceMAD} MAD</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Payment Status: <strong className={ride.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}>
                {ride.paymentStatus === 'paid' ? 'Settled (Paid)' : 'Pending Settlement'}
              </strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {ride.paymentStatus !== 'paid' ? (
            <button
              onClick={onOpenPayment}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Pay Now (Wallet / CMI Card / Cash)
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 rounded-xl">
              <CheckCircle2 className="w-4 h-4" /> Paid & Certified
            </span>
          )}

          <button
            onClick={onCompleteTrip}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Finish Course
          </button>
        </div>
      </div>

    </div>
  );
};
