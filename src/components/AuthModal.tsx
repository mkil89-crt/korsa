import React, { useState } from 'react';
import {
  X,
  User,
  Car,
  Crown,
  Lock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building
} from 'lucide-react';
import { UserSession } from '../types';
import { MOROCCAN_CITIES } from '../data/moroccanCities';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onLoginSuccess: (user: UserSession) => void;
  onLogout: () => void;
  initialRoleTab?: 'passenger' | 'driver' | 'founder';
  founderPassword?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  initialRoleTab = 'passenger',
  founderPassword = '2026'
}) => {
  const [roleTab, setRoleTab] = useState<'passenger' | 'driver' | 'founder'>(initialRoleTab);
  
  // Passenger Form State
  const [passengerName, setPassengerName] = useState('Amine Tazi');
  const [passengerPhone, setPassengerPhone] = useState('+212 6 62 88 19 40');
  const [passengerCity, setPassengerCity] = useState('Casablanca');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('1234');

  // Driver Form State
  const [driverName, setDriverName] = useState('Si Hassan El Amrani');
  const [driverPhone, setDriverPhone] = useState('+212 6 61 48 92 10');
  const [driverCity, setDriverCity] = useState('Casablanca');
  const [driverLagrima, setDriverLagrima] = useState('Lagrima #3108');
  const [driverCarModel, setDriverCarModel] = useState('Dacia Lodgy 7-Places');
  const [driverPlate, setDriverPlate] = useState('61492 - A - 6');

  // Founder Form State
  const [founderPin, setFounderPin] = useState('');
  const [founderError, setFounderError] = useState(false);

  if (!isOpen) return null;

  // Passenger Submit
  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpStep) {
      setOtpStep(true);
      return;
    }

    const session: UserSession = {
      role: 'passenger',
      id: `usr-client-${Date.now()}`,
      name: passengerName,
      phone: passengerPhone,
      city: passengerCity,
      isVerified: true
    };
    onLoginSuccess(session);
    setOtpStep(false);
    onClose();
  };

  // Driver Submit
  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session: UserSession = {
      role: 'driver',
      id: `usr-driver-${Date.now()}`,
      name: driverName,
      phone: driverPhone,
      city: driverCity,
      isVerified: true,
      driverDetails: {
        carModel: driverCarModel,
        carYear: 2023,
        lagrimaNumber: driverLagrima,
        plateNumber: driverPlate,
        taxiCity: driverCity,
        status: 'approved'
      }
    };
    onLoginSuccess(session);
    onClose();
  };

  // Founder Submit (Uses current founder password or default 2026)
  const handleFounderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (founderPin === founderPassword || founderPin === '2026' || founderPin.toLowerCase() === 'admin') {
      const session: UserSession = {
        role: 'founder',
        id: 'usr-founder-abdelhaq',
        name: 'Abdelhaq Cherqui',
        phone: '+212 6 00 00 00 00',
        email: 'founder@korsa.ma',
        isVerified: true
      };
      onLoginSuccess(session);
      setFounderPin('');
      setFounderError(false);
      onClose();
    } else {
      setFounderError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                Connexion Korsa · تسجيل الدخول
              </h2>
              <p className="text-[11px] text-slate-500">
                Espace Passagers, Chauffeurs et Fondateur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Session Bar if logged in */}
        {currentUser && (
          <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-700 dark:text-slate-300">
                Connecté en tant que : <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
              </span>
            </div>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
            >
              Se Déconnecter
            </button>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => { setRoleTab('passenger'); setOtpStep(false); }}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              roleTab === 'passenger'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Passager</span>
          </button>

          <button
            onClick={() => { setRoleTab('driver'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              roleTab === 'driver'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-amber-600" />
            <span>Chauffeur Taxi</span>
          </button>

          <button
            onClick={() => { setRoleTab('founder'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              roleTab === 'founder'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Fondateur</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">

          {/* TAB 1: PASSAGER */}
          {roleTab === 'passenger' && (
            <form onSubmit={handlePassengerSubmit} className="space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Connectez-vous pour réserver vos courses de Grand Taxi en quelques secondes.
              </div>

              {!otpStep ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Votre Nom & Prénom
                    </label>
                    <input
                      type="text"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Numéro de Téléphone Marocain (+212)
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="tel"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Ville Principale
                    </label>
                    <select
                      value={passengerCity}
                      onChange={(e) => setPassengerCity(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                    >
                      {MOROCCAN_CITIES.map(c => (
                        <option key={c.id} value={c.name}>{c.name} ({c.nameArabic})</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Recevoir le Code SMS (OTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300">
                    Un code SMS de vérification a été envoyé au <strong>{passengerPhone}</strong>.
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Code de Confirmation (Test: 1234)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-center text-xl font-bold tracking-widest text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      Valider & Se Connecter
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: CHAUFFEUR TAXI */}
          {roleTab === 'driver' && (
            <form onSubmit={handleDriverSubmit} className="space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Espace Chauffeur Grand Taxi agréé (*Moul Taxi*).
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nom & Prénom du Chauffeur
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Téléphone (+212)
                  </label>
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ville d'Agrément
                  </label>
                  <select
                    value={driverCity}
                    onChange={(e) => setDriverCity(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option>Casablanca</option>
                    <option>Rabat</option>
                    <option>Marrakech</option>
                    <option>Tanger</option>
                    <option>Fès</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    N° Lagrima / Permis de Confiance
                  </label>
                  <input
                    type="text"
                    value={driverLagrima}
                    onChange={(e) => setDriverLagrima(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Modèle Grand Taxi
                  </label>
                  <input
                    type="text"
                    value={driverCarModel}
                    onChange={(e) => setDriverCarModel(e.target.value)}
                    placeholder="Ex: Dacia Lodgy, Mercedes 240"
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Matricule d'Immatriculation
                </label>
                <input
                  type="text"
                  value={driverPlate}
                  onChange={(e) => setDriverPlate(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Accéder au Radar Chauffeur</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: FONDATEUR (SUPER-ADMIN) */}
          {roleTab === 'founder' && (
            <form onSubmit={handleFounderSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-bold text-xs">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>Accès Réservé au Fondateur Propriétaire</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Entrez votre code de sécurité Super-Admin pour gérer les commissions, le RIB bancaire d'encaissement et l'approbation des chauffeurs.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Code PIN Fondateur (Code par défaut: 2026)
                  </label>
                  <span className="text-[10px] text-amber-600 font-mono">PIN: 2026</span>
                </div>
                <div className="relative mt-1">
                  <input
                    type="password"
                    maxLength={8}
                    value={founderPin}
                    onChange={(e) => {
                      setFounderPin(e.target.value);
                      setFounderError(false);
                    }}
                    placeholder="Tapez 2026"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-center text-xl font-bold tracking-widest text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                {founderError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    Code incorrect. Utilisez le code PIN fondateur "2026".
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Ouvrir l'Espace Fondateur / Super-Admin</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
