import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Car,
  Crown,
  Lock,
  Phone,
  CheckCircle2,
  ArrowRight,
  Mail,
  AlertCircle,
  RotateCw,
  Building,
  ShieldCheck
} from 'lucide-react';
import { UserSession } from '../types/index';
import { MOROCCAN_CITIES } from '../data/moroccanCities';

// Moroccan phone number regex: +212 / 00212 / 0 followed by 5, 6 or 7 and 8 digits
export const MOROCCAN_PHONE_REGEX = /^(?:\+212|00212|0)[5-7]\d{8}$/;

// Standard Email format regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onLoginSuccess: (user: UserSession) => void;
  onLogout: () => void;
  initialRoleTab?: 'passenger' | 'driver' | 'founder';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  initialRoleTab = 'passenger'
}) => {
  const [roleTab, setRoleTab] = useState<'passenger' | 'driver' | 'founder'>(initialRoleTab);

  // 1. Passenger Form State (Direct access - No confirmation code)
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerCity, setPassengerCity] = useState('Casablanca');
  const [passengerError, setPassengerError] = useState<string | null>(null);
  const [passengerLoading, setPassengerLoading] = useState(false);

  // 2. Driver Form State (Direct access - Pending status, Mandatory lagrima/car/plate)
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverCity, setDriverCity] = useState('Casablanca');
  const [driverLagrima, setDriverLagrima] = useState('');
  const [driverCarModel, setDriverCarModel] = useState('');
  const [driverPlate, setDriverPlate] = useState('');
  const [driverError, setDriverError] = useState<string | null>(null);
  const [driverSubmitting, setDriverSubmitting] = useState(false);
  const [driverSuccessNotice, setDriverSuccessNotice] = useState<string | null>(null);

  // 3. Founder Form State (Verified server-side via email + password)
  const [founderEmail, setFounderEmail] = useState('');
  const [founderPasswordInput, setFounderPasswordInput] = useState('');
  const [founderError, setFounderError] = useState<string | null>(null);
  const [founderLoading, setFounderLoading] = useState(false);

  // Sync role tab when prop changes or modal opens
  useEffect(() => {
    setRoleTab(initialRoleTab);
    setPassengerError(null);
    setDriverError(null);
    setFounderError(null);
    setDriverSuccessNotice(null);
  }, [initialRoleTab, isOpen]);

  if (!isOpen) return null;

  // --- Passenger Submission (Direct registration/login without confirmation code) ---
  const handlePassengerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassengerError(null);

    const name = passengerName.trim();
    const phone = passengerPhone.trim();
    const email = passengerEmail.trim().toLowerCase();

    if (!name) {
      setPassengerError('Veuillez renseigner votre nom et prénom.');
      return;
    }

    if (!phone) {
      setPassengerError('Le numéro de téléphone est obligatoire.');
      return;
    }

    if (!MOROCCAN_PHONE_REGEX.test(phone)) {
      setPassengerError('Numéro marocain invalide (formats acceptés : 06XXXXXXXX, 07XXXXXXXX ou +2126XXXXXXXX).');
      return;
    }

    if (!email) {
      setPassengerError('Votre adresse Gmail / Email est obligatoire.');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setPassengerError('Veuillez saisir une adresse Gmail ou email valide (ex : exemple@gmail.com).');
      return;
    }

    setPassengerLoading(true);
    try {
      const response = await fetch('/api/passengers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          city: passengerCity
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setPassengerError(data.error || 'Erreur lors de la connexion du passager.');
        setPassengerLoading(false);
        return;
      }

      const session: UserSession = {
        role: 'passenger',
        id: data.user?.id || `usr-client-${Date.now()}`,
        name,
        phone,
        email,
        city: passengerCity,
        isVerified: true
      };

      onLoginSuccess(session);
      onClose();
    } catch {
      // Fallback local session if server unreachable
      const session: UserSession = {
        role: 'passenger',
        id: `usr-client-${Date.now()}`,
        name,
        phone,
        email,
        city: passengerCity,
        isVerified: true
      };
      onLoginSuccess(session);
      onClose();
    } finally {
      setPassengerLoading(false);
    }
  };

  // --- Driver Submission (Direct registration/login without confirmation code) ---
  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDriverError(null);
    setDriverSuccessNotice(null);

    const name = driverName.trim();
    const phone = driverPhone.trim();
    const email = driverEmail.trim().toLowerCase();
    const lagrima = driverLagrima.trim();
    const carModel = driverCarModel.trim();
    const plate = driverPlate.trim();

    if (!name) {
      setDriverError('Le nom et prénom du chauffeur sont obligatoires.');
      return;
    }

    if (!phone || !MOROCCAN_PHONE_REGEX.test(phone)) {
      setDriverError('Numéro de téléphone marocain invalide (ex: 06XXXXXXXX ou +2126XXXXXXXX).');
      return;
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      setDriverError('Veuillez renseigner une adresse Gmail ou Email valide pour le contact.');
      return;
    }

    if (!lagrima) {
      setDriverError('Le numéro d’agrément (Lagrima / Permis de confiance) est obligatoire.');
      return;
    }

    if (!carModel) {
      setDriverError('Le modèle du véhicule Grand Taxi est obligatoire.');
      return;
    }

    if (!plate) {
      setDriverError('Le matricule d’immatriculation du véhicule est obligatoire.');
      return;
    }

    setDriverSubmitting(true);
    try {
      const response = await fetch('/api/drivers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          city: driverCity,
          lagrimaNumber: lagrima,
          carModel,
          plateNumber: plate
        })
      });
      const data = await response.json();

      if (!response.ok) {
        setDriverError(data.error || 'Erreur lors de l’enregistrement du chauffeur.');
        setDriverSubmitting(false);
        return;
      }

      // Initial status is ALWAYS 'pending' unless already approved by founder
      const initialStatus = data.driver?.status || 'pending';

      const session: UserSession = {
        role: 'driver',
        id: data.driver?.id || `usr-driver-${Date.now()}`,
        name,
        phone,
        email,
        city: driverCity,
        isVerified: initialStatus === 'approved',
        driverDetails: {
          carModel,
          carYear: 2023,
          lagrimaNumber: lagrima,
          plateNumber: plate,
          taxiCity: driverCity,
          status: initialStatus
        }
      };

      if (initialStatus === 'pending') {
        setDriverSuccessNotice(
          'Dossier enregistré sans attente ! Votre compte est actif en statut « En attente d’approbation » par le fondateur Korsa.'
        );
        setTimeout(() => {
          onLoginSuccess(session);
          onClose();
        }, 1200);
      } else {
        onLoginSuccess(session);
        onClose();
      }
    } catch {
      // Fallback local pending session if server unreachable
      const session: UserSession = {
        role: 'driver',
        id: `usr-driver-${Date.now()}`,
        name,
        phone,
        email,
        city: driverCity,
        isVerified: false,
        driverDetails: {
          carModel,
          carYear: 2023,
          lagrimaNumber: lagrima,
          plateNumber: plate,
          taxiCity: driverCity,
          status: 'pending'
        }
      };
      onLoginSuccess(session);
      onClose();
    } finally {
      setDriverSubmitting(false);
    }
  };

  // --- Founder Login (Server-Side Verified Email + Password) ---
  const handleFounderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFounderError(null);

    const email = founderEmail.trim();
    const password = founderPasswordInput.trim();

    if (!email || !password) {
      setFounderError('Veuillez saisir votre email et votre mot de passe administrateur.');
      return;
    }

    setFounderLoading(true);
    try {
      const response = await fetch('/api/auth/founder-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setFounderError(data.error || 'Identifiants administrateur invalides.');
        setFounderLoading(false);
        return;
      }

      onLoginSuccess(data.user);
      onClose();
    } catch {
      setFounderError('Erreur de connexion au serveur d’authentification administrateur.');
    } finally {
      setFounderLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
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
                Accès direct passagers, chauffeurs et administration
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
                Connecté : <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
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
            onClick={() => setRoleTab('passenger')}
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
            onClick={() => setRoleTab('driver')}
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
            onClick={() => setRoleTab('founder')}
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

          {/* TAB 1: PASSAGER (Direct access with phone, name, email/gmail - No confirmation code) */}
          {roleTab === 'passenger' && (
            <form onSubmit={handlePassengerSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Accès direct sans code de confirmation
                </span>
                Renseignez votre nom, votre numéro marocain et votre adresse Gmail/Email pour réserver un Grand Taxi immédiatement.
              </div>

              {passengerError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passengerError}</span>
                </div>
              )}

              {/* Nom & Prénom */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nom & Prénom du Passager *
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => {
                      setPassengerName(e.target.value);
                      setPassengerError(null);
                    }}
                    placeholder="Ex: Karim Bennani"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Téléphone Marocain */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Numéro de Téléphone Marocain (+212) *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">06 / 07XXXXXXXX</span>
                </div>
                <div className="relative mt-1">
                  <input
                    type="tel"
                    value={passengerPhone}
                    onChange={(e) => {
                      setPassengerPhone(e.target.value);
                      setPassengerError(null);
                    }}
                    placeholder="Ex: 06 12 34 56 78"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                    required
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Contact Email / Gmail */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Adresse Gmail / Email de contact *
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    value={passengerEmail}
                    onChange={(e) => {
                      setPassengerEmail(e.target.value);
                      setPassengerError(null);
                    }}
                    placeholder="Ex: karim.bennani@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Ville Principale */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ville de Départ Principale
                </label>
                <div className="relative mt-1">
                  <select
                    value={passengerCity}
                    onChange={(e) => setPassengerCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.nameArabic})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={passengerLoading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/20"
              >
                {passengerLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Accès en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Accéder aux Trajets Korsa (Sans confirmation)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: CHAUFFEUR TAXI (Mandatory fields & pending status - No confirmation code) */}
          {roleTab === 'driver' && (
            <form onSubmit={handleDriverSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                ⚠️ <strong>Agrément obligatoire</strong> : Renseignez vos coordonnées, contact Gmail et informations taxi. Statut initial : <em>En attente d'approbation (Pending)</em> par le fondateur.
              </div>

              {driverError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{driverError}</span>
                </div>
              )}

              {driverSuccessNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{driverSuccessNotice}</span>
                </div>
              )}

              {/* Nom & Prénom */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nom & Prénom du Chauffeur *
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => {
                    setDriverName(e.target.value);
                    setDriverError(null);
                  }}
                  placeholder="Nom complet"
                  className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              {/* Téléphone & Ville */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Téléphone (+212) *
                  </label>
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={(e) => {
                      setDriverPhone(e.target.value);
                      setDriverError(null);
                    }}
                    placeholder="06XXXXXXXX"
                    className="w-full mt-1 px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ville d'Agrément *
                  </label>
                  <select
                    value={driverCity}
                    onChange={(e) => setDriverCity(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email / Gmail Chauffeur */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Adresse Gmail / Email du Chauffeur *
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    value={driverEmail}
                    onChange={(e) => {
                      setDriverEmail(e.target.value);
                      setDriverError(null);
                    }}
                    placeholder="chauffeur.korsa@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Agrément & Modèle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    N° Lagrima / Agrément *
                  </label>
                  <input
                    type="text"
                    value={driverLagrima}
                    onChange={(e) => {
                      setDriverLagrima(e.target.value);
                      setDriverError(null);
                    }}
                    placeholder="Ex: Lagrima #4912"
                    className="w-full mt-1 px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Modèle du Véhicule *
                  </label>
                  <input
                    type="text"
                    value={driverCarModel}
                    onChange={(e) => {
                      setDriverCarModel(e.target.value);
                      setDriverError(null);
                    }}
                    placeholder="Ex: Dacia Lodgy, Mercedes E220"
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Matricule */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Matricule Véhicule *
                </label>
                <input
                  type="text"
                  value={driverPlate}
                  onChange={(e) => {
                    setDriverPlate(e.target.value);
                    setDriverError(null);
                  }}
                  placeholder="Ex: 61492 - A - 6"
                  className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={driverSubmitting}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {driverSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Enregistrement en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Valider mon Dossier Chauffeur (Sans confirmation)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: FONDATEUR (Server-Side Verified Email + Password) */}
          {roleTab === 'founder' && (
            <form onSubmit={handleFounderSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Crown className="w-4 h-4" />
                  <span>Portail Administrateur & Fondateur</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Authentification serveur sécurisée par identifiant et mot de passe.
                </p>
              </div>

              {founderError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{founderError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Administrateur
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    value={founderEmail}
                    onChange={(e) => {
                      setFounderEmail(e.target.value);
                      setFounderError(null);
                    }}
                    placeholder="abdelhaqcherqui@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mot de passe Administrateur
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    value={founderPasswordInput}
                    onChange={(e) => {
                      setFounderPasswordInput(e.target.value);
                      setFounderError(null);
                    }}
                    placeholder="Votre mot de passe sécurisé"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={founderLoading}
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {founderLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Vérification des accès...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Se Connecter à l'Espace Fondateur</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
