import React from 'react';
import {
  Car,
  MapPin,
  Clock,
  PhoneCall,
  ShieldCheck,
  Wallet,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users
} from 'lucide-react';
import { ROUTE_BENCHMARKS, MOROCCAN_CITIES } from '../data/moroccanCities';

interface HeroSectionProps {
  onStartBooking: () => void;
  onExploreRoutes: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBooking,
  onExploreRoutes
}) => {
  return (
    <div className="space-y-12">
      
      {/* 1. Main Hero Split */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-center space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The inDrive & markoub.ma for Moroccan Grand Taxis</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] font-['Outfit',sans-serif]">
                Travel City to City in a <span className="text-amber-400">Grand Taxi</span> Without Going to the Station.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Book direct inter-city rides from your doorstep in Casablanca, Rabat, Marrakech, Tangier, and across Morocco. Propose your fare in MAD, negotiate with certified chauffeurs, and call each other directly to meet up without hassle.
              </p>
            </div>

            {/* Micro Key Selling Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero station crowds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fair inDrive bidding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct phone & PIN</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartBooking}
                className="px-7 py-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Book a Korsa Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreRoutes}
                className="px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-2xl border border-white/20 transition-all cursor-pointer"
              >
                View Intercity Corridors
              </button>
            </div>
          </div>

          {/* Right Hero Image Showcase */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <img
              src="/assets/images/korsa_hero_taxi_1793551614833.jpg"
              alt="Moroccan Grand Taxi on Coastal Highway"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
            
            {/* Floating Trust Card */}
            <div className="absolute bottom-6 right-6 left-6 sm:left-auto sm:max-w-xs bg-slate-950/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl text-xs space-y-1 text-white shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Certified Mouline Taxi</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Official Ministry transport licenses (Lagrima) with verified Moroccan vehicle insurance and inspected drivers.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Key Pillars Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
            No More Taxi Stations (Mahatta)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Skip the noise, aggressive touts (*courtia*), and waiting for hours at Oulad Ziane or Kamra. The Grand Taxi comes directly to your chosen neighborhood or doorstep.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
            Direct Phone Call & Mutual PIN
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            One-tap Moroccan phone call (+212) and WhatsApp buttons ensure passenger and driver locate each other immediately on the street, verified with a 4-digit security PIN.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
            Moroccan Dirham Payment System
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Complete flexibility: instant Korsa digital wallet, Moroccan bank card payment (CMI / Attijariwafa / CIH / BCP), or traditional cash on arrival with digital receipt.
          </p>
        </div>

      </div>

      {/* 3. Popular Intercity Grand Taxi Corridors */}
      <div id="routes" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
              Popular Moroccan Grand Taxi Corridors
            </h2>
            <p className="text-xs text-slate-500">
              Standard station prices vs. flexible Korsa door-to-door courses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              from: 'Casablanca',
              to: 'Rabat',
              dist: '87 km',
              time: '55 min',
              seatPrice: '45 MAD',
              korsaKamla: '270 MAD',
              tag: 'A1 Autoroute'
            },
            {
              from: 'Casablanca',
              to: 'Marrakech',
              dist: '242 km',
              time: '2h 25m',
              seatPrice: '120 MAD',
              korsaKamla: '720 MAD',
              tag: 'A3 Autoroute'
            },
            {
              from: 'Rabat',
              to: 'Tangier',
              dist: '250 km',
              time: '2h 35m',
              seatPrice: '130 MAD',
              korsaKamla: '780 MAD',
              tag: 'A1 North'
            },
            {
              from: 'Marrakech',
              to: 'Essaouira',
              dist: '178 km',
              time: '2h 10m',
              seatPrice: '90 MAD',
              korsaKamla: '540 MAD',
              tag: 'R207 Road'
            }
          ].map((corridor, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-amber-500 transition-colors cursor-pointer"
              onClick={onStartBooking}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">{corridor.tag}</span>
                <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                  {corridor.dist}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {corridor.from} ⇄ {corridor.to}
                </h4>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{corridor.time} travel</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Blasa (Seat)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{corridor.seatPrice}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Korsa Kamla</span>
                  <span className="font-mono font-bold text-amber-600">{corridor.korsaKamla}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Visual Highway Section with Authentic Photo */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
        <img
          src="/assets/images/korsa_intercity_route_1793551615608.jpg"
          alt="Moroccan Autoroute Toll and Taxi"
          className="w-full h-72 md:h-80 object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Morocco Modern Mobility
            </span>
            <h3 className="text-xl md:text-2xl font-bold font-['Outfit',sans-serif]">
              Door-to-Door Freedom on the National Autoroute Network
            </h3>
            <p className="text-xs md:text-sm text-slate-300">
              Whether you need one seat for a commute or a whole private Grand Taxi for your family and luggage, Korsa makes intercity travel dignified, transparent, and fair.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
