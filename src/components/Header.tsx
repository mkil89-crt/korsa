import React from 'react';
import { Car, Wallet, ArrowRightLeft, ShieldCheck, PhoneCall, User, LogIn, Crown } from 'lucide-react';
import { UserSession } from '../types/index';

interface HeaderProps {
  currentRole: 'passenger' | 'driver';
  onToggleRole: () => void;
  walletBalance: number;
  onOpenWallet: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeTripCount: number;
  onOpenActiveTrip?: () => void;
  onOpenFounderDashboard?: () => void;
  currentUser: UserSession | null;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onToggleRole,
  walletBalance,
  onOpenWallet,
  onNavigateSection,
  activeTripCount,
  onOpenActiveTrip,
  onOpenFounderDashboard,
  currentUser,
  onOpenAuthModal
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
              Trajets & Tarifs
            </button>
            <button
              onClick={() => onNavigateSection('booking')}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Réserver un Grand Taxi
            </button>
            <button
              onClick={() => onNavigateSection('safety')}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sécurité & Contact Direct
            </button>
            <button
              onClick={() => onNavigateSection('faq')}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Comment ça marche
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
                <span>Course en Direct</span>
              </button>
            )}

            {/* Wallet quick balance trigger */}
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              title="Ouvrir le portefeuille Korsa (MAD)"
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
                {currentRole === 'passenger' ? 'Espace Chauffeur (Moul Taxi)' : 'Mode Passager'}
              </span>
            </button>



            {/* User Login / Register Button */}
            <button
              onClick={onOpenAuthModal}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                currentUser
                  ? 'bg-slate-900 text-white dark:bg-slate-800 border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
              }`}
              title={currentUser ? `Connecté: ${currentUser.name}` : 'Créer un compte ou se connecter'}
            >
              {currentUser ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="max-w-[130px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400">({currentUser.role === 'driver' ? 'Chauffeur' : currentUser.role === 'founder' ? 'Fondateur' : 'Client'})</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>S'inscrire & Connexion</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
