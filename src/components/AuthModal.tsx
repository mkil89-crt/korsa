import React, { useState, useEffect } from 'react';
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
  Building,
  RotateCw,
  Mail,
  AlertCircle
} from 'lucide-react';
import { UserSession } from '../types/index';
import { MOROCCAN_CITIES } from '../data/moroccanCities';

// Moroccan phone number regex: +212 / 00212 / 0 followed by 5, 6 or 7 and 8 digits
const MOROCCAN_PHONE_REGEX = /^(?:\+212|00212|0)[5-7]\d{8}$/;

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
  
  // Passenger Form State
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerCity, setPassengerCity] = useState('Casablanca');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);

  // Driver Form State
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverCity, setDriverCity] = useState('Casablanca');
  const [driverLagrima, setDriverLagrima] = useState('');
  const [driverCarModel, setDriverCarModel] = useState('');
  const [driverPlate, setDriverPlate] = useState('');
  const [driverError, setDriverError] = useState<string | null>(null);
  const [driverSubmitting, setDriverSubmitting] = useState(false);
  const [driverSuccessNotice, setDriverSuccessNotice] = useState<string | null>(null);

  // Founder Form State (Email + Password verified server-side)
  const [founderEmail, setFounderEmail] = useState('');
  const [founderPasswordInput, setFounderPasswordInput] = useState('');
  const [founderError, setFounderError] = useState<string | null>(null);
  const [founderLoading, setFounderLoading] = useState(false);

  // Resend countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Sync role tab when prop changes
  useEffect(() => {
    setRoleTab(initialRoleTab);
    setOtpStep(false);
    setOtpError(null);
    setOtpCode('');
  }, [initialRoleTab, isOpen]);

  if (!isOpen) return null;

  // 1. Request OTP via Server API
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOtpError(null);
    setOtpSuccessMessage(null);

    const trimmedPhone = passengerPhone.trim();
    if (!trimmedPhone) {
      setOtpError('Le numéro de téléphone est obligatoire.');
      return;
    }

    if (!MOROCCAN_PHONE_REGEX.test(trimmedPhone)) {
      setOtpError('Numéro de téléphone marocain invalide. Formats acceptés : 06XXXXXXXX, 07XXXXXXXX ou +2126XXXXXXXX.');
      return;
    }

    if (attemptsCount >= 5) {
      setOtpError('Nombre maximal de tentatives atteint (5 essais). Veuillez patienter 5 minutes.');
      return;
    }

    setIsRequestingOtp(true);
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: trimmedPhone })
      });
      const data = await response.json();

      if (!response.ok) {
        setOtpError(data.error || "Impossible d'envoyer le code par SMS.");
        setIsRequestingOtp(false);
        return;
      }

      setOtpStep(true);
      setOtpCode(''); // Clean empty input, strictly no pre-fill!
      setOtpSuccessMessage('Un code de vérification à 6 chiffres a été envoyé par SMS sur votre mobile.');
      setCountdown(data.cooldownSeconds || 60);
    } catch (err) {
      setOtpError('Erreur de connexion au serveur d’authentification.');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // 2. Verify OTP via Server API
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    const trimmedCode = otpCode.trim();
    if (!trimmedCode || trimmedCode.length !== 6) {
      setOtpError('Veuillez saisir le code à 6 chiffres reçu par SMS.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: passengerPhone.trim(),
          code: trimmedCode
        })
      });
      const data = await response.json();

      if (!response.ok) {
        setAttemptsCount((prev) => prev + 1);
        setOtpError(data.error || 'Code de confirmation incorrect.');
        setIsVerifyingOtp(false);
        return;
      }

      const session: UserSession = {
        role: 'passenger',
        id: `usr-client-${Date.now()}`,
        name: passengerName.trim() || 'Passager Korsa',
        phone: passengerPhone.trim(),
        city: passengerCity,
        isVerified: true
      };

      onLoginSuccess(session);
      setOtpStep(false);
      setOtpCode('');
      setAttemptsCount(0);
      onClose();
    } catch (err) {
      setOtpError('Erreur de communication lors de la vérification.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // 3. Driver Registration (Strictly 'pending', All fields mandatory)
  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDriverError(null);
    setDriverSuccessNotice(null);

    const name = driverName.trim();
    const phone = driverPhone.trim();
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
          city: driverCity,
          lagrimaNumber: lagrima,
          carModel,
          plateNumber: plate
        })
      });
      const data = await response.json();

      if (!response.ok) {
        setDriverError(data.error || 'Erreur lors de l’inscription du chauffeur.');
        setDriverSubmitting(false);
        return;
      }

      // Session starts with 'pending' status! No automatic 'approved'!
      const session: UserSession = {
        role: 'driver',
        id: data.driver?.id || `usr-driver-${Date.now()}`,
        name,
        phone,
        city: driverCity,
        isVerified: false,
        driverDetails: {
          carModel,
          carYear: 2023,
          lagrimaNumber: lagrima,
          plateNumber: plate,
          taxiCity: driverCity,
          status: 'pending' // Initial status is ALWAYS pending!
        }
      };

      setDriverSuccessNotice('Dossier soumis avec succès ! Votre compte est en attente d’approbation par l’administration Korsa.');
      setTimeout(() => {
        onLoginSuccess(session);
        onClose();
      }, 1500);
    } catch (err) {
      // Fallback local pending session if server unreachable
      const session: UserSession = {
        role: 'driver',
        id: `usr-driver-${Date.now()}`,
        name,
        phone,
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

  // 4. Founder Login (Server-Side Verified Email + Password)
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
        setFounderError(data.error || 'Identifiants administrateur incorrects.');
        setFounderLoading(false);
        return;
      }

      const session: UserSession = {
        role: 'founder',
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '+212 7 08 13 24 61',
        isVerified: true
      };

      onLoginSuccess(session);
      setFounderEmail('');
      setFounderPasswordInput('');
      onClose();
    } catch (err) {
      setFounderError('Erreur de connexion au serveur d’authentification.');
    } finally {
      setFounderLoading(false);
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
                Espace Passagers, Chauffeurs et Administration
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

          {/* TAB 1: PASSAGER (Genuine SMS OTP flow) */}
          {roleTab === 'passenger' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Authentification sécurisée par SMS. Entrez votre numéro marocain pour recevoir un code à 6 chiffres.
              </div>

              {!otpStep ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  {otpError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Votre Nom & Prénom
                    </label>
                    <input
                      type="text"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="Nom complet"
                      className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Numéro de Téléphone Marocain (+212)
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">06/07XXXXXXXX</span>
                    </div>
                    <div className="relative mt-1">
                      <input
                        type="tel"
                        value={passengerPhone}
                        onChange={(e) => {
                          setPassengerPhone(e.target.value);
                          setOtpError(null);
                        }}
                        placeholder="Ex: 06 12 34 56 78"
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
                      {MOROCCAN_CITIES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name} ({c.nameArabic})</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isRequestingOtp}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/20"
                  >
                    {isRequestingOtp ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Envoi du code par SMS...</span>
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        <span>Recevoir le Code SMS (OTP)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {otpSuccessMessage && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{otpSuccessMessage}</span>
                    </div>
                  )}

                  {otpError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Code SMS à 6 chiffres
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Tentative : {attemptsCount + 1}/5
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value.replace(/\D/g, ''));
                        setOtpError(null);
                      }}
                      placeholder="• • • • • •"
                      className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-emerald-500 rounded-xl font-mono text-center text-2xl font-bold tracking-[0.4em] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep(false);
                        setOtpError(null);
                        setOtpCode('');
                      }}
                      className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold underline cursor-pointer"
                    >
                      Modifier mon numéro
                    </button>

                    <button
                      type="button"
                      disabled={countdown > 0 || attemptsCount >= 5 || isRequestingOtp}
                      onClick={() => handleRequestOtp()}
                      className={`font-bold transition-colors cursor-pointer ${
                        countdown > 0 || attemptsCount >= 5
                          ? 'text-slate-400 cursor-not-allowed'
                          : 'text-emerald-600 hover:text-emerald-700'
                      }`}
                    >
                      {countdown > 0
                        ? `Renvoyer le code (${countdown}s)`
                        : attemptsCount >= 5
                        ? 'Limite d’essais atteinte'
                        : 'Renvoyer le code SMS'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpCode.length !== 6}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Vérification du code...</span>
                      </>
                    ) : (
                      <>
                        <span>Valider & Se Connecter</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: CHAUFFEUR TAXI (Mandatory fields & pending status) */}
          {roleTab === 'driver' && (
            <form onSubmit={handleDriverSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                ⚠️ <strong>Agrément obligatoire</strong> : Toute nouvelle inscription est soumise à la vérification de l'administration. Statut initial : <em>En attente d'approbation (Pending)</em>.
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

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nom & Prénom du Chauffeur *
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Nom complet"
                  className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Téléphone (+212) *
                  </label>
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    N° Lagrima / Agrément *
                  </label>
                  <input
                    type="text"
                    value={driverLagrima}
                    onChange={(e) => setDriverLagrima(e.target.value)}
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
                    onChange={(e) => setDriverCarModel(e.target.value)}
                    placeholder="Ex: Dacia Lodgy, Mercedes E220"
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Matricule Véhicule *
                </label>
                <input
                  type="text"
                  value={driverPlate}
                  onChange={(e) => setDriverPlate(e.target.value)}
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
                    <span>Soumission de la demande...</span>
                  </>
                ) : (
                  <>
                    <span>Soumettre mon dossier Chauffeur (En attente)</span>
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
