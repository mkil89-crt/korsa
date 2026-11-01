import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Wallet,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Receipt,
  Download,
  AlertCircle
} from 'lucide-react';
import { PaymentMethod, WalletTransaction, RideRequest } from '../types';

interface PaymentSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onUpdateWallet: (newBalance: number, newTx: WalletTransaction) => void;
  rideToPay?: RideRequest | null;
  onPaymentSuccess?: (method: PaymentMethod, receiptId: string) => void;
  transactions: WalletTransaction[];
}

export const PaymentSystemModal: React.FC<PaymentSystemModalProps> = ({
  isOpen,
  onClose,
  walletBalance,
  onUpdateWallet,
  rideToPay,
  onPaymentSuccess,
  transactions
}) => {
  const [activeTab, setActiveTab] = useState<'pay_ride' | 'wallet_topup' | 'transactions'>('pay_ride');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wallet');
  
  // Card form state
  const [cardHolder, setCardHolder] = useState('Anas El Mansouri');
  const [cardNumber, setCardNumber] = useState('4230 8912 3456 7890');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('382');
  const [selectedBank, setSelectedBank] = useState<string>('Attijariwafa Bank');

  // Top-up amount state
  const [topupAmount, setTopupAmount] = useState<number>(100);

  // 3D Secure OTP step state
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState('841920');
  const [paymentDoneReceipt, setPaymentDoneReceipt] = useState<string | null>(null);

  if (!isOpen) return null;

  const fareAmount = rideToPay?.proposedPriceMAD || 45;

  const handleExecutePayment = () => {
    setIsProcessing(true);

    if (selectedMethod === 'wallet') {
      if (walletBalance < fareAmount) {
        setIsProcessing(false);
        alert('Insufficient wallet balance. Please top up your Korsa wallet or use a bank card.');
        return;
      }
      setTimeout(() => {
        const receiptCode = `KRS-WLT-${Math.floor(100000 + Math.random() * 900000)}`;
        const newTx: WalletTransaction = {
          id: `tx-${Date.now()}`,
          type: 'trip_fare',
          amountMAD: -fareAmount,
          date: 'Just now',
          description: `Korsa Trip: ${rideToPay?.fromCity || 'Casablanca'} → ${rideToPay?.toCity || 'Rabat'}`,
          referenceCode: receiptCode,
          status: 'completed'
        };
        onUpdateWallet(walletBalance - fareAmount, newTx);
        setIsProcessing(false);
        setPaymentDoneReceipt(receiptCode);
        if (onPaymentSuccess) onPaymentSuccess('wallet', receiptCode);
      }, 900);
    } else if (selectedMethod === 'card') {
      // Simulate Moroccan 3D Secure / CMI gateway
      setTimeout(() => {
        setIsProcessing(false);
        setShowOtpScreen(true);
      }, 700);
    } else if (selectedMethod === 'cash') {
      setTimeout(() => {
        const receiptCode = `KRS-CSH-${Math.floor(100000 + Math.random() * 900000)}`;
        setIsProcessing(false);
        setPaymentDoneReceipt(receiptCode);
        if (onPaymentSuccess) onPaymentSuccess('cash', receiptCode);
      }, 600);
    }
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const receiptCode = `KRS-CMI-${Math.floor(100000 + Math.random() * 900000)}`;
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'trip_fare',
        amountMAD: -fareAmount,
        date: 'Just now',
        description: `CMI Card Payment: ${selectedBank}`,
        referenceCode: receiptCode,
        status: 'completed'
      };
      // Keep wallet unchanged, record payment
      onUpdateWallet(walletBalance, newTx);
      setIsProcessing(false);
      setShowOtpScreen(false);
      setPaymentDoneReceipt(receiptCode);
      if (onPaymentSuccess) onPaymentSuccess('card', receiptCode);
    }, 1100);
  };

  const handleExecuteTopup = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const receiptCode = `KRS-DEP-${Math.floor(100000 + Math.random() * 900000)}`;
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'deposit',
        amountMAD: topupAmount,
        date: 'Just now',
        description: `Wallet Recharge (+${topupAmount} MAD)`,
        referenceCode: receiptCode,
        status: 'completed'
      };
      onUpdateWallet(walletBalance + topupAmount, newTx);
      setIsProcessing(false);
      setActiveTab('pay_ride');
      alert(`Success! ${topupAmount} MAD added to your Korsa Wallet.`);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                Korsa Payment System · الأداء
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Moroccan Dirham (MAD) Secure Checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 p-1 gap-1">
          <button
            onClick={() => { setActiveTab('pay_ride'); setPaymentDoneReceipt(null); setShowOtpScreen(false); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'pay_ride'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Pay Korsa Fare ({fareAmount} MAD)
          </button>
          <button
            onClick={() => { setActiveTab('wallet_topup'); setPaymentDoneReceipt(null); setShowOtpScreen(false); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'wallet_topup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Top-up Wallet ({walletBalance} MAD)
          </button>
          <button
            onClick={() => { setActiveTab('transactions'); setPaymentDoneReceipt(null); setShowOtpScreen(false); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* SUCCESS RECEIPT VIEW */}
          {paymentDoneReceipt && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit',sans-serif]">
                  Paiement Confirmé! · تم الأداء بنجاح
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your ride has been successfully settled with your Grand Taxi chauffeur.
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2.5 max-w-sm mx-auto font-mono text-xs">
                <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 font-sans">Reference:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{paymentDoneReceipt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Method:</span>
                  <span className="uppercase font-bold text-amber-600">{selectedMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Amount Settled:</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">{fareAmount} MAD</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span className="font-sans">Date & Stamp:</span>
                  <span>{new Date().toLocaleDateString('fr-MA')} · Certified</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Close & Return to Ride
                </button>
              </div>
            </div>
          )}

          {/* 3D SECURE OTP SIMULATION SCREEN */}
          {!paymentDoneReceipt && showOtpScreen && (
            <form onSubmit={handleConfirmOtp} className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold">Centre Monétique Interbancaire (CMI) 3D-Secure</div>
                  <p>
                    An SMS authentication code was sent to your phone associated with your {selectedBank} card.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter SMS OTP Code (Default test: 841920)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 text-center text-lg font-mono font-bold tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpScreen(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? 'Verifying with Bank...' : `Confirm & Pay ${fareAmount} MAD`}
                </button>
              </div>
            </form>
          )}

          {/* TAB 1: PAY RIDE */}
          {!paymentDoneReceipt && !showOtpScreen && activeTab === 'pay_ride' && (
            <div className="space-y-5">
              
              {/* Fare summary card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    Grand Taxi Intercity Fare
                  </span>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {rideToPay?.fromCity || 'Casablanca'} ➔ {rideToPay?.toCity || 'Rabat'} ({rideToPay?.rideType === 'korsa_kamla' ? 'Private Taxi' : `${rideToPay?.seatsRequested || 1} Seat(s)`})
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                    {fareAmount} <span className="text-sm font-sans font-bold text-amber-600">MAD</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Toll highway included</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Select Payment Method
                </label>

                {/* Option 1: Korsa Wallet */}
                <div
                  onClick={() => setSelectedMethod('wallet')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedMethod === 'wallet'
                      ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Korsa Wallet (محفظة)</span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                          Instant
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        Current balance: {walletBalance} MAD
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment_choice"
                    checked={selectedMethod === 'wallet'}
                    onChange={() => setSelectedMethod('wallet')}
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                </div>

                {/* Option 2: CMI Bank Card */}
                <div
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedMethod === 'card'
                      ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Moroccan Bank Card (CMI / Visa / Mastercard)
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Attijariwafa, CIH, BCP, BMCE Bank
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment_choice"
                    checked={selectedMethod === 'card'}
                    onChange={() => setSelectedMethod('card')}
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                </div>

                {/* Option 3: Cash on Board */}
                <div
                  onClick={() => setSelectedMethod('cash')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedMethod === 'cash'
                      ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-600/10 text-amber-600 flex items-center justify-center font-bold">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Cash on Board (Espèces au Chauffeur)
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Pay Dirhams directly to driver at destination with digital receipt
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment_choice"
                    checked={selectedMethod === 'cash'}
                    onChange={() => setSelectedMethod('cash')}
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Conditional Card Form */}
              {selectedMethod === 'card' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Card Details
                    </span>
                    <div className="flex gap-1.5 text-[10px] font-bold text-slate-500">
                      <span className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border rounded">CMI</span>
                      <span className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border rounded">VISA</span>
                      <span className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border rounded">MC</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Issuing Moroccan Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <option>Attijariwafa Bank</option>
                      <option>CIH Bank (Code 30)</option>
                      <option>Banque Populaire (BCP)</option>
                      <option>Bank of Africa (BMCE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full mt-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">CVV (3 digits)</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full mt-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Insufficient wallet note */}
              {selectedMethod === 'wallet' && walletBalance < fareAmount && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Wallet balance too low for this ride ({walletBalance} MAD &lt; {fareAmount} MAD).</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('wallet_topup')}
                    className="font-bold underline cursor-pointer"
                  >
                    Top-up now
                  </button>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                onClick={handleExecutePayment}
                disabled={isProcessing || (selectedMethod === 'wallet' && walletBalance < fareAmount)}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Processing Moroccan Payment...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {fareAmount} MAD with {selectedMethod === 'wallet' ? 'Wallet' : selectedMethod === 'card' ? 'Bank Card' : 'Cash'}</span>
                  </>
                )}
              </button>

            </div>
          )}

          {/* TAB 2: TOP-UP WALLET */}
          {!paymentDoneReceipt && activeTab === 'wallet_topup' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Current Balance</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {walletBalance} <span className="text-sm font-sans text-amber-600">MAD</span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>Guaranteed safe storage</span>
                  <div className="text-[11px] text-emerald-600 font-semibold">Zero transaction fees</div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Quick Recharge Amount:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 200, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className={`py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        topupAmount === amt
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      +{amt} DH
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Or Custom Amount (MAD):
                </label>
                <input
                  type="number"
                  min={10}
                  step={5}
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(Number(e.target.value))}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleExecuteTopup}
                disabled={isProcessing || topupAmount <= 0}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? 'Crediting Wallet...' : `Confirm Top-up (+${topupAmount} MAD)`}
              </button>
            </div>
          )}

          {/* TAB 3: TRANSACTION HISTORY */}
          {!paymentDoneReceipt && activeTab === 'transactions' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recent Dirham Operations
              </div>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {tx.description}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {tx.date} · {tx.referenceCode}
                      </div>
                    </div>
                    <div className={`font-mono font-bold tabular-nums text-sm ${
                      tx.amountMAD > 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {tx.amountMAD > 0 ? `+${tx.amountMAD}` : tx.amountMAD} MAD
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
