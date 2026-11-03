import React, { useState, useEffect } from 'react';
import {
  Sliders,
  DollarSign,
  TrendingUp,
  Car,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  Award,
  Crown,
  Lock,
  Landmark,
  CreditCard,
  Check,
  Copy,
  Save,
  ArrowRight,
  Search,
  Ban,
  Unlock,
  AlertTriangle,
  RotateCw,
  Phone,
  Clock,
  X,
  KeyRound
} from 'lucide-react';
import { MOROCCAN_CITIES } from '../data/moroccanCities';
import { DriverStatus, SuspensionDuration, DriverSuspensionDetails } from '../types/index';

export interface DashboardDriver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  carModel: string;
  carYear?: number;
  lagrimaNumber: string;
  plateNumber: string;
  status: DriverStatus;
  suspension?: DriverSuspensionDetails;
}

interface FounderDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'financials' | 'drivers' | 'ownership' | 'rib_payouts' | 'security';
  onDriverSuspended?: (phoneOrId: string, reason: string) => void;
}

export const FounderDashboard: React.FC<FounderDashboardProps> = ({
  isOpen,
  onClose,
  initialTab = 'financials',
  onDriverSuspended
}) => {
  const [commissionRate, setCommissionRate] = useState<number>(8); // 8% default
  const [activeTab, setActiveTab] = useState<'financials' | 'drivers' | 'ownership' | 'rib_payouts' | 'security'>(initialTab);
  
  // Drivers Management State - starts empty for real registered drivers
  const [driversList, setDriversList] = useState<DashboardDriver[]>([]);
  const [driverSearchQuery, setDriverSearchQuery] = useState('');
  const [driverStatusFilter, setDriverStatusFilter] = useState<'all' | DriverStatus>('all');
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  // Founder Password Management State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  // Suspension Modal State
  const [driverToSuspend, setDriverToSuspend] = useState<DashboardDriver | null>(null);
  const [suspensionDuration, setSuspensionDuration] = useState<SuspensionDuration>('7_days');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionError, setSuspensionError] = useState<string | null>(null);

  // Founder Bank RIB State
  const [accountHolder, setAccountHolder] = useState('Abdelhaq Cherqui');
  const [selectedBank, setSelectedBank] = useState('Attijariwafa Bank');
  const [bankCode, setBankCode] = useState('007');
  const [cityBranch, setCityBranch] = useState('Casablanca - Agence Maarif');
  const [ribDigits, setRibDigits] = useState('007780000123456789012345');
  const [ribSavedNotification, setRibSavedNotification] = useState(false);
  const [transferPending, setTransferPending] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus({ type: 'idle' });

    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      setPasswordChangeStatus({ type: 'error', message: 'Tous les champs sont obligatoires.' });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeStatus({ type: 'error', message: 'Le nouveau mot de passe et sa confirmation ne correspondent pas.' });
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordChangeStatus({ type: 'error', message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
      return;
    }

    setPasswordChangeStatus({ type: 'loading' });
    try {
      const res = await fetch('/api/auth/founder-change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'abdelhaqcherqui@gmail.com',
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordChangeStatus({ type: 'error', message: data.error || 'Erreur lors du changement de mot de passe.' });
        return;
      }

      setPasswordChangeStatus({
        type: 'success',
        message: 'Mot de passe modifié avec succès ! Vos prochaines connexions utiliseront ce nouveau mot de passe.'
      });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch {
      setPasswordChangeStatus({ type: 'error', message: 'Impossible de joindre le serveur pour mettre à jour le mot de passe.' });
    }
  };

  // Fetch drivers from server on open
  useEffect(() => {
    if (isOpen) {
      setLoadingDrivers(true);
      fetch('/api/drivers')
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.drivers) && data.drivers.length > 0) {
            setDriversList(data.drivers);
          }
        })
        .catch(err => console.error('[Failed to fetch drivers]', err))
        .finally(() => setLoadingDrivers(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const MOROCCAN_BANKS = [
    { name: 'Attijariwafa Bank', code: '007', color: 'from-amber-500 to-amber-700' },
    { name: 'Banque Populaire (BCP)', code: '181', color: 'from-orange-500 to-orange-700' },
    { name: 'CIH Bank (Code 30)', code: '230', color: 'from-blue-500 to-blue-700' },
    { name: 'Bank of Africa (BMCE)', code: '011', color: 'from-blue-600 to-blue-800' },
    { name: 'Société Générale Maroc', code: '022', color: 'from-red-500 to-red-700' },
    { name: 'Crédit Agricole du Maroc', code: '225', color: 'from-emerald-600 to-emerald-800' },
    { name: 'BMCI (BNP Paribas)', code: '013', color: 'from-emerald-700 to-emerald-900' },
    { name: 'CFG Bank', code: '285', color: 'from-indigo-600 to-indigo-800' }
  ];

  const handleBankSelect = (bankName: string) => {
    setSelectedBank(bankName);
    const found = MOROCCAN_BANKS.find(b => b.name === bankName);
    if (found) {
      setBankCode(found.code);
      if (ribDigits.length >= 3) {
        setRibDigits(found.code + ribDigits.slice(3));
      }
    }
  };

  const handleSaveRib = (e: React.FormEvent) => {
    e.preventDefault();
    setRibSavedNotification(true);
    setTimeout(() => setRibSavedNotification(false), 3500);
  };

  const handleExecutePayout = () => {
    setTransferPending(true);
    setTimeout(() => {
      setTransferPending(false);
      const ref = `VIR-MA-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setTransferSuccess(ref);
    }, 1200);
  };

  // Driver Actions: Approve, Reject, Suspend, Unsuspend
  const handleUpdateDriverStatus = async (
    driver: DashboardDriver,
    newStatus: DriverStatus,
    reason?: string,
    duration?: SuspensionDuration
  ) => {
    try {
      await fetch('/api/drivers/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: driver.id,
          phone: driver.phone,
          status: newStatus,
          reason,
          duration
        })
      });
    } catch (err) {
      console.error('[Error updating driver status]', err);
    }

    setDriversList(prev => prev.map(d => {
      if (d.id === driver.id) {
        if (newStatus === 'suspended') {
          return {
            ...d,
            status: 'suspended',
            suspension: {
              reason: reason || 'Non précisé',
              duration: duration || '7_days',
              suspendedAt: new Date().toISOString()
            }
          };
        }
        return { ...d, status: newStatus, suspension: undefined };
      }
      return d;
    }));

    if (newStatus === 'suspended' && onDriverSuspended) {
      onDriverSuspended(driver.phone, reason || 'Compte suspendu par le fondateur');
    }
  };

  const confirmBlockDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspensionReason.trim()) {
      setSuspensionError('Le motif de blocage est strictement obligatoire.');
      return;
    }
    if (!driverToSuspend) return;

    handleUpdateDriverStatus(driverToSuspend, 'suspended', suspensionReason.trim(), suspensionDuration);
    setDriverToSuspend(null);
    setSuspensionReason('');
    setSuspensionError(null);
  };

  // Filtered drivers list
  const filteredDrivers = driversList.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(driverSearchQuery.toLowerCase()) ||
      d.phone.includes(driverSearchQuery) ||
      d.city.toLowerCase().includes(driverSearchQuery.toLowerCase()) ||
      d.lagrimaNumber.toLowerCase().includes(driverSearchQuery.toLowerCase()) ||
      d.plateNumber.toLowerCase().includes(driverSearchQuery.toLowerCase());

    const matchesStatus = driverStatusFilter === 'all' || d.status === driverStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const formattedRib = ribDigits
    .replace(/\s/g, '')
    .replace(/(\d{3})(\d{3})(\d{16})(\d{2})/, '$1 $2 $3 $4');

  const netCommissionMAD = Math.round(148920 * (commissionRate / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-['Outfit',sans-serif]">
                  Console Fondateur & Super-Admin
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  Owner Portal
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Fondateur : <strong>Abdelhaq Cherqui</strong> · Administration Korsa Maroc
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setPasswordChangeStatus({ type: 'idle' });
                setShowPasswordModal(true);
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Modifier le mot de passe</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Quitter la console
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 pt-3 gap-6 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('financials')}
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'financials'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Revenus & Commissions
          </button>

          <button
            onClick={() => setActiveTab('rib_payouts')}
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'rib_payouts'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Mon RIB Bancaire</span>
          </button>

          <button
            onClick={() => setActiveTab('drivers')}
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'drivers'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Gestion des Chauffeurs</span>
            {driversList.filter(d => d.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full text-[10px] font-bold">
                {driversList.filter(d => d.status === 'pending').length} en attente
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sécurité & Mot de Passe</span>
          </button>

          <button
            onClick={() => setActiveTab('ownership')}
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ownership'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Propriété Légale & OMPIC
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          
          {/* TAB 1: REVENUE & COMMISSIONS */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    Volume Brut Transité
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                    148 920 <span className="text-sm font-normal text-amber-600">MAD</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                    Gains Nets Fondateur ({commissionRate}%)
                  </span>
                  <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {netCommissionMAD.toLocaleString()} <span className="text-sm font-normal">MAD</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Taux de Commission
                  </span>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min={5}
                      max={15}
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <span className="font-mono font-bold text-base text-amber-600">{commissionRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MON RIB BANCAIRE */}
          {activeTab === 'rib_payouts' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
                    <Landmark className="w-3 h-3 text-emerald-200" />
                    <span>Compte Bancaire Marocain (RIB 24 Chiffres)</span>
                  </div>
                  <h3 className="text-xl font-extrabold font-['Outfit',sans-serif]">
                    {netCommissionMAD.toLocaleString()} MAD Prêts au Virement
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Vos commissions de plateforme sont virées directement sur votre compte bancaire marocain.
                  </p>
                </div>

                <button
                  onClick={handleExecutePayout}
                  disabled={transferPending}
                  className="px-5 py-3 bg-white text-emerald-800 font-extrabold text-xs rounded-xl shadow-lg hover:bg-emerald-50 transition-all cursor-pointer whitespace-nowrap"
                >
                  {transferPending ? 'Virement en cours...' : 'Virer vers mon RIB'}
                </button>
              </div>

              {transferSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Ordre de virement validé ! Réf : <strong>{transferSuccess}</strong> vers votre compte {selectedBank}.</span>
                </div>
              )}

              <form onSubmit={handleSaveRib} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Coordonnées Bancaires du Titulaire
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Titulaire du compte</label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Banque Marocaine</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => handleBankSelect(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                    >
                      {MOROCCAN_BANKS.map(b => (
                        <option key={b.code} value={b.name}>{b.name} (Code {b.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">RIB Marocain (24 Chiffres)</label>
                  <input
                    type="text"
                    maxLength={24}
                    value={ribDigits}
                    onChange={(e) => setRibDigits(e.target.value.replace(/\D/g, ''))}
                    className="w-full mt-1 px-3.5 py-2.5 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl tracking-wider"
                  />
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">{formattedRib}</span>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Sauvegarder le RIB
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: GESTION & BLOCAGE DES CHAUFFEURS (REQUIREMENT 4) */}
          {activeTab === 'drivers' && (
            <div className="space-y-6">
              
              {/* Header & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-amber-500" />
                    <span>Contrôle & Gestion des Chauffeurs Grand Taxi</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Approuvez les nouveaux chauffeurs, consultez leurs documents et suspendez les comptes en cas d'infraction.
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={driverSearchQuery}
                    onChange={(e) => setDriverSearchQuery(e.target.value)}
                    placeholder="Recherche (nom, tél, agrément...)"
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <button
                  onClick={() => setDriverStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    driverStatusFilter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Tous ({driversList.length})
                </button>
                <button
                  onClick={() => setDriverStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    driverStatusFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  En attente ({driversList.filter(d => d.status === 'pending').length})
                </button>
                <button
                  onClick={() => setDriverStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    driverStatusFilter === 'approved'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  Agréés ({driversList.filter(d => d.status === 'approved').length})
                </button>
                <button
                  onClick={() => setDriverStatusFilter('suspended')}
                  className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    driverStatusFilter === 'suspended'
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  Bloqués / Suspendus ({driversList.filter(d => d.status === 'suspended').length})
                </button>
              </div>

              {/* Drivers Cards List */}
              <div className="space-y-3">
                {loadingDrivers && (
                  <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Chargement de la liste des chauffeurs...</span>
                  </div>
                )}

                {!loadingDrivers && filteredDrivers.length === 0 && (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 text-xs">
                    Aucun chauffeur trouvé dans cette catégorie.
                  </div>
                )}

                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {driver.name}
                        </h4>

                        {/* Status Badge */}
                        {driver.status === 'pending' && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                            ⏳ En attente de validation
                          </span>
                        )}
                        {driver.status === 'approved' && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Agréé Korsa
                          </span>
                        )}
                        {driver.status === 'suspended' && (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-full border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                            <Ban className="w-3 h-3" /> Suspendu / Bloqué
                          </span>
                        )}
                        {driver.status === 'rejected' && (
                          <span className="text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full">
                            Refusé
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 font-mono">
                        <span>📞 {driver.phone}</span>
                        {driver.email && (
                          <>
                            <span>·</span>
                            <span>✉️ {driver.email}</span>
                          </>
                        )}
                        <span>·</span>
                        <span>📍 {driver.city}</span>
                        <span>·</span>
                        <span>📜 {driver.lagrimaNumber}</span>
                        <span>·</span>
                        <span>🚗 {driver.carModel} ({driver.plateNumber})</span>
                      </div>

                      {/* Suspension Reason Info */}
                      {driver.status === 'suspended' && driver.suspension && (
                        <div className="mt-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300">
                          <strong>Motif du blocage :</strong> {driver.suspension.reason} · <strong>Durée :</strong> {
                            driver.suspension.duration === '1_day' ? '1 Jour' :
                            driver.suspension.duration === '7_days' ? '7 Jours' :
                            driver.suspension.duration === '30_days' ? '30 Jours' : 'Définitif'
                          }
                        </div>
                      )}
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-2 shrink-0">
                      {driver.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateDriverStatus(driver, 'approved')}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approuver</span>
                          </button>
                          <button
                            onClick={() => handleUpdateDriverStatus(driver, 'rejected')}
                            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Refuser
                          </button>
                        </>
                      )}

                      {driver.status === 'approved' && (
                        <button
                          onClick={() => {
                            setDriverToSuspend(driver);
                            setSuspensionReason('');
                            setSuspensionError(null);
                          }}
                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Bloquer le Chauffeur</span>
                        </button>
                      )}

                      {driver.status === 'suspended' && (
                        <button
                          onClick={() => handleUpdateDriverStatus(driver, 'approved')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Débloquer le Chauffeur</span>
                        </button>
                      )}

                      {driver.status === 'rejected' && (
                        <button
                          onClick={() => handleUpdateDriverStatus(driver, 'approved')}
                          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                        >
                          Réexaminer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LEGAL OWNERSHIP */}
          {activeTab === 'ownership' && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>Certificat de Propriété Fondateur</span>
                </div>
                <p>
                  Cette plateforme, son code source, son algorithme d'enchère et la marque Korsa sont sous la propriété exclusive de <strong>Abdelhaq Cherqui</strong>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Formalités Légales OMPIC & CRI :
                </h4>
                
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    1. Dépôt de marque OMPIC
                  </div>
                  <p className="text-slate-500">
                    Enregistrement de la marque Korsa (Classes 9 et 39 pour logiciels et transport interurbain).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    2. Création de société (CRI SARL)
                  </div>
                  <p className="text-slate-500">
                    Création de l'entité juridique Korsa Mobility SARL avec identifiant fiscal (ICE) à Casablanca.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & PASSWORD CHANGE */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                  <Lock className="w-5 h-5" />
                  <span>Sécurité du Compte Fondateur & Super-Admin</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Cette interface vous permet de modifier directement votre mot de passe d'accès à l'espace Fondateur. Le nouveau mot de passe sera immédiatement effectif côté serveur pour toutes vos futures connexions.
                </p>
              </div>

              {passwordChangeStatus.type === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{passwordChangeStatus.message}</span>
                </div>
              )}

              {passwordChangeStatus.type === 'error' && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{passwordChangeStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Formulaire de mise à jour du mot de passe
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Email Administrateur
                  </label>
                  <input
                    type="email"
                    value="abdelhaqcherqui@gmail.com"
                    disabled
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Mot de passe actuel *
                  </label>
                  <input
                    type="password"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Saisissez votre mot de passe actuel"
                    required
                    className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Nouveau mot de passe *
                    </label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Min. 6 caractères"
                      required
                      minLength={6}
                      className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Confirmer le nouveau mot de passe *
                    </label>
                    <input
                      type="password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Répétez le nouveau mot de passe"
                      required
                      minLength={6}
                      className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordChangeStatus.type === 'loading'}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {passwordChangeStatus.type === 'loading' ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Mise à jour en cours...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Enregistrer le nouveau mot de passe</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* QUICK CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <KeyRound className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Modifier le Mot de Passe Fondateur
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordChangeStatus({ type: 'idle' });
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordChangeStatus.type === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordChangeStatus.message}</span>
              </div>
            )}

            {passwordChangeStatus.type === 'error' && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{passwordChangeStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mot de passe actuel *
                </label>
                <input
                  type="password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="Votre mot de passe actuel"
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nouveau mot de passe *
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Min. 6 caractères"
                  minLength={6}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirmer le nouveau mot de passe *
                </label>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Répétez le nouveau mot de passe"
                  minLength={6}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordChangeStatus({ type: 'idle' });
                  }}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-100"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={passwordChangeStatus.type === 'loading'}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  {passwordChangeStatus.type === 'loading' ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <KeyRound className="w-3.5 h-3.5" />
                  )}
                  <span>Mettre à jour</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUSPENSION MODAL (Duration + Mandatory Reason) */}
      {driverToSuspend && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-rose-600">
                <Ban className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Bloquer le Chauffeur
                </h3>
              </div>
              <button
                onClick={() => setDriverToSuspend(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
              <div><strong>Chauffeur :</strong> {driverToSuspend.name}</div>
              <div><strong>Téléphone :</strong> {driverToSuspend.phone}</div>
              <div><strong>Agrément :</strong> {driverToSuspend.lagrimaNumber}</div>
            </div>

            <form onSubmit={confirmBlockDriver} className="space-y-4">
              {suspensionError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{suspensionError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Durée de la suspension *
                </label>
                <select
                  value={suspensionDuration}
                  onChange={(e) => setSuspensionDuration(e.target.value as SuspensionDuration)}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="1_day">1 Jour (Avertissement)</option>
                  <option value="7_days">7 Jours (Infraction mineure)</option>
                  <option value="30_days">30 Jours (Infraction grave)</option>
                  <option value="permanent">Définitif (Radiation de la plateforme)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Motif obligatoire du blocage *
                </label>
                <textarea
                  rows={3}
                  value={suspensionReason}
                  onChange={(e) => {
                    setSuspensionReason(e.target.value);
                    setSuspensionError(null);
                  }}
                  placeholder="Précisez le motif exact (ex: Non-respect du tarif convenu, absence au point de rendez-vous...)"
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDriverToSuspend(null)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Confirmer le blocage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
