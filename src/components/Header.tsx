import React from 'react';
import { Car, Wallet, ArrowRightLeft, ShieldCheck, PhoneCall } from 'lucide-react';

interface HeaderProps {
  currentRole: 'passenger' | 'driver';
  onToggleRole: () => void;
  walletBalance: number;
  onOpenWallet: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeTripCount: number;
  onOpenActiveTrip?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onToggleRole,
  walletBalance,
  onOpenWallet,
  onNavigateSection,
  activeTripCount,
  onOpenActiveTrip
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Brand Wordmark (1 single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateSection('hero')}
              className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Outfit',sans-serif] leading-none">
                  Korsa <span className="text-amber-500 font-normal">| كورصة</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                  Moroccan Grand Taxi
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (4-5 single-line clean text links) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onNavigateSection('routes')}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Intercity Routes
            </button>
            <button
              onClick={() => onNavigateSection('booking')}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Book a Korsa
            </button>
            <button
              onClick={() => onNavigateSection('safety')}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Direct Contact & Safety
            </button>
            <button
              onClick={() => onNavigateSection('faq')}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              How It Works
            </button>
          </nav>

          {/* Zone 3: Actions (Wallet + Role Switcher) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Active trip quick indicator if ride is live */}
            {activeTripCount > 0 && (
              <button
                onClick={onOpenActiveTrip}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-lg hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Live Ride</span>
              </button>
            )}

            {/* Wallet quick balance trigger */}
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              title="Open Moroccan Dirham Wallet"
            >
              <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono tabular-nums">{walletBalance} MAD</span>
            </button>

            {/* Role Switcher: Passenger vs Moul Taxi */}
            <button
              onClick={onToggleRole}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm ${
                currentRole === 'passenger'
                  ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold shadow-amber-500/20'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">
                {currentRole === 'passenger' ? 'Switch to Chauffeur (Moul Taxi)' : 'Switch to Passenger Mode'}
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
