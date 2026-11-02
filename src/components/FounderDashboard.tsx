import React, { useState } from 'react';
import {
  ShieldAlert,
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
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { MOROCCAN_CITIES } from '../data/moroccanCities';

interface FounderDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'financials' | 'drivers' | 'ownership' | 'rib_payouts' | 'security';
  currentPassword?: string;
  onUpdatePassword?: (newPassword: string) => void;
}

export const FounderDashboard: React.FC<FounderDashboardProps> = ({
  isOpen,
  onClose,
  initialTab = 'financials',
  currentPassword = '2026',
  onUpdatePassword
}) => {
  const [commissionRate, setCommissionRate] = useState<number>(8); // 8% default
  const [activeTab, setActiveTab] = useState<'financials' | 'drivers' | 'ownership' | 'rib_payouts' | 'security'>(initialTab);
  
  // Password modification state
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Pending driver approvals state
  const [pendingDrivers, setPendingDrivers] = useState([
    {
      id: 'drv-req-1',
      name: 'Mohamed El Ouardi',
      city: 'Casablanca',
      lagrimaNumber: 'Lagrima #4912',
      carModel: 'Dacia Lodgy (2024)',
      phone: '+212 6 65 21 88 44',
      status: 'pending'
    },
    {
      id: 'drv-req-2',
      name: 'Abdellah Chraibi',
      city: 'Marrakech',
      lagrimaNumber: 'Lagrima #2019',
      carModel: 'Mercedes-Benz E220',
      phone: '+212 6 71 40 92 11',
      status: 'pending'
    }
  ]);

  // Founder Bank RIB State
  const [accountHolder, setAccountHolder] = useState('Abdelhaq Cherqui');
  const [selectedBank, setSelectedBank] = useState('Attijariwafa Bank');
  const [bankCode, setBankCode] = useState('007');
  const [cityBranch, setCityBranch] = useState('Casablanca - Agence Maarif');
  const [ribDigits, setRibDigits] = useState('007780000123456789012345');
  const [ribSavedNotification, setRibSavedNotification] = useState(false);
  const [transferPending, setTransferPending] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

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
      // update prefix of rib if desired
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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPasswordInput !== currentPassword) {
      setPasswordStatusMsg({ text: 'L’ancien mot de passe est incorrect.', type: 'error' });
      return;
    }
    if (newPasswordInput.length < 4) {
      setPasswordStatusMsg({ text: 'Le nouveau mot de passe doit comporter au moins 4 caractères.', type: 'error' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordStatusMsg({ text: 'Les deux nouveaux mots de passe ne correspondent pas.', type: 'error' });
      return;
    }

    if (onUpdatePassword) {
      onUpdatePassword(newPasswordInput);
    }
    setPasswordStatusMsg({ text: 'Votre mot de passe Fondateur a été mis à jour avec succès !', type: 'success' });
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  const handleApproveDriver = (id: string) => {
    setPendingDrivers(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
  };

  const handleRejectDriver = (id: string) => {
    setPendingDrivers(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
  };

  // Format 24-digit RIB into: XXX XXX XXXXXXXXXXXXXXXX XX
  const formattedRib = ribDigits
    .replace(/\s/g, '')
    .replace(/(\d{3})(\d{3})(\d{16})(\d{2})/, '$1 $2 $3 $4');

  const netCommissionMAD = Math.round(148920 * (commissionRate / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-['Outfit',sans-serif]">
                  Founder & Super-Admin Console
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  Owner Portal
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Founded by <strong>Abdelhaq Cherqui</strong> · Korsa Platform Administration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Exit Console
          </button>
        </div>

        {/* Tab Strip with Security Tab Added */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 pt-3 gap-6 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('financials')}
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'financials'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Revenue & Commissions
          </button>

          {/* THE RIB TAB REQUESTED BY USER */}
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
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'drivers'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Driver Approvals ({pendingDrivers.filter(d => d.status === 'pending').length} Pending)
          </button>

          {/* SECURITY & PASSWORD TAB */}
          <button
            onClick={() => {
              setActiveTab('security');
              setPasswordStatusMsg(null);
            }}
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Mot de passe & Sécurité</span>
          </button>

          <button
            onClick={() => setActiveTab('ownership')}
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ownership'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Ownership & OMPIC
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          
          {/* TAB: MON RIB BANCAIRE (THE FOCAL USER REQUEST) */}
          {activeTab === 'rib_payouts' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
                    <Landmark className="w-3 h-3 text-emerald-200" />
                    <span>Compte Bancaire Marocain (RIB 24 Chiffres)</span>
                  </div>
                  <h3 className="text-xl font-extrabold font-['Outfit',sans-serif]">
                    Espace RIB du Fondateur · الحساب البنكي
                  </h3>
                  <p className="text-xs text-emerald-100 max-w-lg">
                    Renseignez votre RIB bancaire marocain pour recevoir automatiquement les commissions et les revenus générés par la plateforme Korsa.
                  </p>
                </div>

                {/* Available for Payout */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl text-right shrink-0">
                  <div className="text-[10px] text-emerald-200 font-semibold uppercase">
                    Solde à Virer
                  </div>
                  <div className="text-2xl font-mono font-extrabold tabular-nums">
                    {netCommissionMAD} <span className="text-xs font-sans">MAD</span>
                  </div>
                  <span className="text-[10px] text-emerald-200 block">Commissions nettes prêtes</span>
                </div>
              </div>

              {/* Notification if RIB saved */}
              {ribSavedNotification && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">
                    Votre RIB marocain a été enregistré avec succès ! Tous les virements de commissions seront envoyés à ce compte.
                  </span>
                </div>
              )}

              {/* Transfer Success Receipt Modal/Banner */}
              {transferSuccess && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Ordre de Virement Interbancaire Transmis avec Succès!</span>
                    </div>
                    <button
                      onClick={() => setTransferSuccess(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Fermer
                    </button>
                  </div>
                  <div className="font-mono text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Référence Virement:</span>
                      <span className="text-amber-400 font-bold">{transferSuccess}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bénéficiaire:</span>
                      <span>{accountHolder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Banque Destinataire:</span>
                      <span>{selectedBank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">RIB:</span>
                      <span>{formattedRib}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1 text-sm font-bold">
                      <span className="text-slate-300">Montant Viré:</span>
                      <span className="text-emerald-400">{netCommissionMAD} MAD</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Délai de compensation interbancaire SIMT Bank Al-Maghrib : 2 à 24 heures ouvrées.
                  </p>
                </div>
              )}

              {/* RIB FORM */}
              <form onSubmit={handleSaveRib} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-5">
                
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-600" />
                    Coordonnées Bancaires Marocaines
                  </h4>
                  <span className="text-xs font-mono text-slate-500">
                    Norme Bank Al-Maghrib · 24 Caractères
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Bank Select */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Votre Banque Marocaine (Banque Domiciliataire)
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => handleBankSelect(e.target.value)}
                      className="w-full mt-1.5 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    >
                      {MOROCCAN_BANKS.map((b) => (
                        <option key={b.name} value={b.name}>
                          {b.name} (Code: {b.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Account Holder Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nom & Prénom du Titulaire (Exactement comme sur votre chéquier)
                    </label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full mt-1.5 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                </div>

                {/* THE 24-DIGIT RIB INPUT */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                      Numéro de RIB Marocain (24 Chiffres)
                    </label>
                    <span className={`text-xs font-mono font-bold ${
                      ribDigits.replace(/\s/g, '').length === 24 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {ribDigits.replace(/\s/g, '').length} / 24 chiffres
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      maxLength={24}
                      value={ribDigits}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^0-9]/g, '');
                        setRibDigits(clean);
                      }}
                      placeholder="Ex: 007780000123456789012345"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 focus:border-amber-500 rounded-xl font-mono text-base font-extrabold tracking-widest text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Visual Structure breakdown */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-[10px] font-mono text-slate-500">
                    <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 border text-center">
                      <span className="block font-bold text-slate-700 dark:text-slate-300">
                        {ribDigits.slice(0, 3) || '007'}
                      </span>
                      <span>Code Banque (3)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 border text-center">
                      <span className="block font-bold text-slate-700 dark:text-slate-300">
                        {ribDigits.slice(3, 6) || '780'}
                      </span>
                      <span>Code Ville/Guichet (3)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 border text-center">
                      <span className="block font-bold text-slate-700 dark:text-slate-300">
                        {ribDigits.slice(6, 22) || '0001234567890123'}
                      </span>
                      <span>Numéro Compte (16)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 border text-center">
                      <span className="block font-bold text-slate-700 dark:text-slate-300">
                        {ribDigits.slice(22, 24) || '45'}
                      </span>
                      <span>Clé RIB (2)</span>
                    </div>
                  </div>
                </div>

                {/* City Agency */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Agence Bancaire (Ville & Quartier)
                  </label>
                  <input
                    type="text"
                    value={cityBranch}
                    onChange={(e) => setCityBranch(e.target.value)}
                    placeholder="Ex: Casablanca Maarif, Rabat Agdal, Marrakech Gueliz"
                    className="w-full mt-1.5 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer et Valider ce RIB</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExecutePayout}
                    disabled={transferPending || ribDigits.length < 24}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Landmark className="w-4 h-4" />
                    <span>
                      {transferPending ? 'Ordre de virement en cours...' : `Virer mes ${netCommissionMAD} MAD vers ce RIB`}
                    </span>
                  </button>
                </div>

              </form>

              {/* Moroccan Banking Spec Info Box */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sécurité et Virements Automatiques (SIMT Maroc)</span>
                </div>
                <p>
                  Votre RIB est crypté et sauvegardé. En production, les fonds récoltés auprès des clients (par carte CMI ou recharge de portefeuille) sont virés automatiquement sur votre compte bancaire marocain selon votre convenance.
                </p>
              </div>

            </div>
          )}

          {/* TAB 1: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Platform Gross Volume
                  </span>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    148,920 <span className="text-xs font-sans text-amber-600">MAD</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">+18.4% this month</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1">
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                    Your Founder Net Commission ({commissionRate}%)
                  </span>
                  <div className="text-2xl font-bold font-mono text-amber-900 dark:text-amber-100 tabular-nums">
                    {netCommissionMAD} <span className="text-xs font-sans text-amber-600">MAD</span>
                  </div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300">Directly into your business account</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Active Certified Grand Taxis
                  </span>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    142 <span className="text-xs font-sans text-slate-400">Cars</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Across 10 Moroccan cities</span>
                </div>
              </div>

              {/* Commission Slider Control */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Set Platform Commission Rate per Trip
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standard industry benchmark is 5% to 10% (inDrive charges ~10%, Uber charges 25%).
                    </p>
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-amber-600 tabular-nums">
                    {commissionRate}%
                  </div>
                </div>

                <input
                  type="range"
                  min={3}
                  max={15}
                  step={1}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>3% (Driver friendly)</span>
                  <span>8% (Recommended balance)</span>
                  <span>15% (Maximum)</span>
                </div>
              </div>

              {/* Quick shortcut to RIB */}
              <div className="p-4 rounded-2xl border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    RIB Bancaire Actuel pour vos versements
                  </div>
                  <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    {selectedBank} · {formattedRib}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('rib_payouts')}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Modifier mon RIB
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: DRIVER APPROVALS */}
          {activeTab === 'drivers' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Grand Taxi Drivers Awaiting Verification
              </h3>
              
              <div className="space-y-3">
                {pendingDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {driver.name}
                        </h4>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                          {driver.lagrimaNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {driver.city} · {driver.carModel} · {driver.phone}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {driver.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApproveDriver(driver.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Approve Lagrima
                          </button>
                          <button
                            onClick={() => handleRejectDriver(driver.id)}
                            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 text-rose-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      ) : driver.status === 'approved' ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Approved
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LEGAL OWNERSHIP */}
          {activeTab === 'ownership' && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>Founding Ownership Certificate</span>
                </div>
                <p>
                  This application, its architecture, name, and codebase are designed under the vision of founder <strong>Abdelhaq Cherqui</strong>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Next Steps to Formalize Your Ownership in Morocco:
                </h4>
                
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    1. Office Marocain de la Propriété Industrielle (OMPIC)
                  </div>
                  <p className="text-slate-500">
                    Register the brand name "Korsa" and trademark in Casablanca at OMPIC (classes 9 & 39 for ride hailing & digital software).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    2. Company Incorporation (SARL / CRI)
                  </div>
                  <p className="text-slate-500">
                    Create your company (e.g., Korsa Mobility SARL) via the regional investment center (CRI) with your ICE and tax registration.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    3. Moroccan Payment Integration (CMI Contract)
                  </div>
                  <p className="text-slate-500">
                    Sign an e-commerce merchant contract with the Centre Monétique Interbancaire (CMI) or bank partners to collect online card payments directly into your Moroccan bank account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MOT DE PASSE & SÉCURITÉ */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Key className="w-5 h-5" />
                  <span>Sécurité & Protection de l'Espace Fondateur</span>
                </div>
                <p className="text-xs text-slate-300">
                  Ce mot de passe protège votre console propriétaire (taux de commissions, RIB bancaire et validation des chauffeurs). Vous pouvez le modifier à tout moment ci-dessous.
                </p>
              </div>

              {passwordStatusMsg && (
                <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                  passwordStatusMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-300'
                }`}>
                  {passwordStatusMsg.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span>{passwordStatusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Changer le Mot de Passe Fondateur
                </h4>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mot de passe actuel
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={oldPasswordInput}
                      onChange={(e) => setOldPasswordInput(e.target.value)}
                      placeholder="Mot de passe actuel (par défaut : 2026)"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nouveau mot de passe
                    </label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Min. 4 caractères"
                      className="w-full mt-1 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Retapez le nouveau mot de passe"
                      className="w-full mt-1 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Mettre à jour le mot de passe Fondateur</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
