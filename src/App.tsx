import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PassengerFlow } from './components/PassengerFlow';
import { DriverConsole } from './components/DriverConsole';
import { PaymentSystemModal } from './components/PaymentSystemModal';
import { ActiveTripTracker } from './components/ActiveTripTracker';
import { DirectContactCard } from './components/DirectContactCard';
import { FounderDashboard } from './components/FounderDashboard';
import { AuthModal } from './components/AuthModal';
import { RideRequest, DriverBid, WalletTransaction, PaymentMethod, UserSession } from './types/index';
import { MOCK_CERTIFIED_DRIVERS, INITIAL_WALLET_TRANSACTIONS } from './data/mockDrivers';
import { IMAGINARY_DEMO_RIDES, IMAGINARY_DEMO_DRIVERS } from './data/imaginaryExamples';
import {
  Car,
  ShieldCheck,
  PhoneCall,
  Wallet,
  MapPin,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Share2,
  Users,
  Lock,
  Key,
  X
} from 'lucide-react';

export default function App() {
  // Connected User Session - Clean initial state (no mock user prefilled)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialTab, setAuthInitialTab] = useState<'passenger' | 'driver' | 'founder'>('passenger');

  // Check if currently connected driver has been suspended by founder
  useEffect(() => {
    if (currentUser?.role === 'driver' && currentUser.phone) {
      const checkDriverStatus = async () => {
        try {
          const res = await fetch(`/api/drivers/status?phone=${encodeURIComponent(currentUser.phone)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'suspended') {
              alert(`Votre compte chauffeur a été suspendu par le fondateur (${data.suspensionReason || 'Non spécifié'}). Vous êtes déconnecté.`);
              setCurrentUser(null);
            }
          }
        } catch {
          // offline or server fallback
        }
      };
      checkDriverStatus();
    }
  }, [currentUser]);

  // Mode: Passenger vs Driver (Chauffeur Moul Taxi)
  const [currentRole, setCurrentRole] = useState<'passenger' | 'driver'>('passenger');
  
  // Wallet States - clean initial state for production
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [driverWalletBalance, setDriverWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  // Active Passenger Ride
  const [currentPassengerRide, setCurrentPassengerRide] = useState<RideRequest | null>(null);

  // Pool of Pending Rides (Visible on Driver Radar - initialized with realistic imaginary demo rides)
  const [pendingRides, setPendingRides] = useState<RideRequest[]>(IMAGINARY_DEMO_RIDES);

  // Active Driver Mission
  const [activeDriverRide, setActiveDriverRide] = useState<RideRequest | null>(null);

  // Active Trip Full View Modal / Panel
  const [showActiveTripTracker, setShowActiveTripTracker] = useState<boolean>(false);

  // Founder Dashboard Modal
  const [isFounderModalOpen, setIsFounderModalOpen] = useState<boolean>(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Passenger publishes a new ride
  const handlePublishRide = (newRide: RideRequest) => {
    setCurrentPassengerRide(newRide);
    setPendingRides(prev => [newRide, ...prev]);
    // Scroll down to booking view
    window.scrollTo({ top: 400, behavior: 'smooth' });

    // Automatically simulate an authentic incoming offer from an imaginary certified driver after 2.5 seconds
    setTimeout(() => {
      setCurrentPassengerRide(prev => {
        if (!prev || prev.id !== newRide.id || prev.status !== 'bidding') return prev;
        if (prev.activeBids.length > 0) return prev;
        const initialBid: DriverBid = {
          ...IMAGINARY_DEMO_DRIVERS[0],
          id: `bid-auto-${Date.now()}`,
          offeredPriceMAD: newRide.proposedPriceMAD
        };
        return {
          ...prev,
          activeBids: [initialBid]
        };
      });
    }, 2500);
  };

  // Helper to simulate additional driver bids manually
  const handleSimulateImaginaryBid = () => {
    if (!currentPassengerRide) return;
    const currentCount = currentPassengerRide.activeBids.length;
    const template = IMAGINARY_DEMO_DRIVERS[currentCount % IMAGINARY_DEMO_DRIVERS.length];
    const newBid: DriverBid = {
      ...template,
      id: `bid-sim-${Date.now()}-${currentCount}`,
      offeredPriceMAD: currentPassengerRide.proposedPriceMAD + (currentCount === 1 ? 10 : 0)
    };
    setCurrentPassengerRide(prev => prev ? {
      ...prev,
      activeBids: [newBid, ...prev.activeBids]
    } : null);
  };

  // Passenger accepts a driver's bid
  const handleAcceptDriverBid = (driver: DriverBid) => {
    if (!currentPassengerRide) return;
    const updatedRide: RideRequest = {
      ...currentPassengerRide,
      status: 'driver_accepted',
      driverOfferAccepted: driver,
      proposedPriceMAD: driver.offeredPriceMAD
    };
    setCurrentPassengerRide(updatedRide);

    // Also update in pending list or assign
    setPendingRides(prev => prev.filter(r => r.id !== updatedRide.id));
  };

  // Passenger cancels active ride and returns to step 1
  const handleCancelRide = () => {
    if (currentPassengerRide) {
      setPendingRides(prev => prev.filter(r => r.id !== currentPassengerRide.id));
    }
    setCurrentPassengerRide(null);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Chauffeur accepts a passenger request on radar
  const handleDriverAcceptRide = (rideId: string, customPrice?: number) => {
    const target = pendingRides.find(r => r.id === rideId);
    if (!target) return;

    const driverName = (currentUser?.role === 'driver' && currentUser.name)
      ? currentUser.name
      : 'Chauffeur Moul Taxi';
    const driverPhone = (currentUser?.role === 'driver' && currentUser.phone)
      ? currentUser.phone
      : '';
    const driverCarModel = currentUser?.driverDetails?.carModel || 'Grand Taxi Agréé';
    const driverCarYear = currentUser?.driverDetails?.carYear || 2024;
    const driverLicense = currentUser?.driverDetails?.lagrimaNumber || 'Agrément Grand Taxi';
    const driverPlate = currentUser?.driverDetails?.plateNumber || 'Immatriculation Grand Taxi';
    const driverCity = currentUser?.city || currentUser?.driverDetails?.taxiCity || target.fromCity;

    const acceptedDriverBid: DriverBid = {
      id: `bid-chauffeur-${Date.now()}`,
      driverId: currentUser?.id || `drv-${Date.now()}`,
      driverName,
      driverPhone,
      driverRating: 5.0,
      tripsCount: 1,
      carModel: driverCarModel,
      carYear: driverCarYear,
      carColor: 'Blanc & Jaune',
      taxiCity: driverCity,
      taxiLicenseNumber: driverLicense,
      plateNumber: driverPlate,
      photoUrl: currentUser?.avatar || '/assets/images/korsa_driver_moul_1793551615472.jpg',
      offeredPriceMAD: customPrice || target.proposedPriceMAD,
      etaMinutes: 6,
      message: 'Course acceptée. En route pour votre prise en charge.',
      timestamp: 'À l’instant'
    };

    const updatedRide: RideRequest = {
      ...target,
      status: 'driver_accepted',
      driverOfferAccepted: acceptedDriverBid,
      proposedPriceMAD: customPrice || target.proposedPriceMAD
    };

    setActiveDriverRide(updatedRide);
    setPendingRides(prev => prev.filter(r => r.id !== rideId));

    // If the passenger view was also looking at this ride, sync it
    if (currentPassengerRide?.id === rideId) {
      setCurrentPassengerRide(updatedRide);
    }
  };

  // Driver updates ride status
  const handleDriverUpdateRideStatus = (newStatus: RideRequest['status']) => {
    if (!activeDriverRide) return;
    const updated = { ...activeDriverRide, status: newStatus };
    setActiveDriverRide(updated);
    if (currentPassengerRide?.id === updated.id) {
      setCurrentPassengerRide(updated);
    }

    // If completed, credit chauffeur wallet
    if (newStatus === 'completed') {
      const fare = activeDriverRide.proposedPriceMAD;
      setDriverWalletBalance(prev => prev + fare);
      const newTx: WalletTransaction = {
        id: `tx-drv-${Date.now()}`,
        type: 'driver_earnings',
        amountMAD: fare,
        date: 'Just now',
        description: `Trip Earnings: ${activeDriverRide.fromCity} → ${activeDriverRide.toCity}`,
        referenceCode: `KRS-EARN-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'completed'
      };
      setTransactions(prev => [newTx, ...prev]);
      setTimeout(() => {
        setActiveDriverRide(null);
      }, 2000);
    }
  };

  // Payment System Handlers
  const handleUpdateWallet = (newBalance: number, newTx: WalletTransaction) => {
    setWalletBalance(newBalance);
    setTransactions(prev => [newTx, ...prev]);
  };

  const handlePaymentSuccess = (method: PaymentMethod, receiptId: string) => {
    if (currentPassengerRide) {
      setCurrentPassengerRide(prev => prev ? {
        ...prev,
        paymentStatus: 'paid',
        paymentMethod: method,
        paymentReceiptId: receiptId
      } : null);
    }
  };

  const handleVerifyMutualPin = (pin: string) => {
    return pin === (currentPassengerRide?.mutualPin || activeDriverRide?.mutualPin);
  };

  const handleDriverWithdraw = () => {
    if (driverWalletBalance <= 0) {
      alert('Your chauffeur balance is currently 0 MAD.');
      return;
    }
    const amt = driverWalletBalance;
    setDriverWalletBalance(0);
    alert(`Transfer of ${amt} MAD successfully initiated to your Moroccan bank account (CIH / Attijariwafa / BCP). Expect deposit within 2 hours.`);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'booking') {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. Header with Top Bar Contract */}
      <Header
        currentRole={currentRole}
        onToggleRole={() => setCurrentRole(r => r === 'passenger' ? 'driver' : 'passenger')}
        walletBalance={walletBalance}
        onOpenWallet={() => setIsPaymentModalOpen(true)}
        onNavigateSection={handleNavigateSection}
        activeTripCount={currentPassengerRide?.status === 'driver_accepted' || currentPassengerRide?.status === 'in_progress' ? 1 : 0}
        onOpenFounderDashboard={() => {
          if (currentUser?.role === 'founder') {
            setIsFounderModalOpen(true);
          } else {
            setAuthInitialTab('founder');
            setIsAuthModalOpen(true);
          }
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Role Banner Indicator */}
      <div className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Active Mode: <strong className="text-amber-600 dark:text-amber-400 uppercase">{currentRole === 'passenger' ? 'Passenger (المسافر)' : 'Chauffeur Moul Taxi (السائق)'}</strong>
            </span>
          </div>
          <span className="text-slate-500 hidden sm:inline">
            Toggle mode anytime in top-right to test passenger bidding or driver radar.
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Active Trip Tracker Modal if opened */}
        {showActiveTripTracker && currentPassengerRide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-2xl">
              <ActiveTripTracker
                ride={currentPassengerRide}
                onOpenPayment={() => setIsPaymentModalOpen(true)}
                onCompleteTrip={() => {
                  setShowActiveTripTracker(false);
                  alert('Course completed! Thank you for traveling with Korsa.');
                  setCurrentPassengerRide(null);
                }}
                onClose={() => setShowActiveTripTracker(false)}
              />
            </div>
          </div>
        )}

        {/* PASSENGER VIEW */}
        {currentRole === 'passenger' && (
          <div className="space-y-12">
            {/* Hero Banner and Visuals */}
            <HeroSection
              onStartBooking={() => handleNavigateSection('booking')}
              onExploreRoutes={() => handleNavigateSection('routes')}
            />

            {/* Interactive Booking & Bidding Flow */}
            <div id="booking">
              <PassengerFlow
                currentRide={currentPassengerRide}
                currentUser={currentUser}
                onPublishRide={handlePublishRide}
                onAcceptDriverBid={handleAcceptDriverBid}
                onCancelRide={handleCancelRide}
                onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
                onVerifyMutualPin={handleVerifyMutualPin}
                onSimulateTestBid={handleSimulateImaginaryBid}
              />
            </div>
          </div>
        )}

        {/* DRIVER CHAUFFEUR VIEW */}
        {currentRole === 'driver' && (
          <div className="space-y-8">
            <DriverConsole
              pendingRides={pendingRides}
              currentUser={currentUser}
              onDriverAcceptRide={handleDriverAcceptRide}
              activeDriverRide={activeDriverRide}
              onUpdateRideStatus={handleDriverUpdateRideStatus}
              driverWalletBalance={driverWalletBalance}
              onDriverWithdraw={handleDriverWithdraw}
              onVerifyMutualPin={handleVerifyMutualPin}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onReloadImaginaryRides={() => setPendingRides(IMAGINARY_DEMO_RIDES)}
            />
          </div>
        )}

        {/* Direct Contact & Safety Guidance Section */}
        <section id="safety" className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 border border-slate-800">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Moroccan Taxi Rendez-Vous & Safety
            </span>
            <h2 className="text-2xl font-bold font-['Outfit',sans-serif]">
              How Driver & Passenger Find Each Other Effortlessly
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              No more confusion at chaotic crossroads or roundabout exits. Korsa provides three layers of instant mutual contact:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                1-Click Direct Phone Calling
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A prominent direct call button connects your phone directly to the Moroccan mobile number of your chauffeur or passenger (+212 6...).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Instant WhatsApp Coordination
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pre-written messages in Moroccan Darija and French immediately share your exact landmark and live location with one tap.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                4-Digit Mutual Security PIN
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Before boarding, both parties verify the 4-digit Korsa PIN displayed on their screens to ensure 100% authenticity.
              </p>
            </div>

          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section id="faq" className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-slate-900 dark:text-white">
              Frequently Asked Questions · أسئلة شائعة
            </h2>
            <p className="text-xs text-slate-500">
              Everything you need to know about riding and driving with Korsa in Morocco.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 pt-4">
            {[
              {
                q: 'What is the meaning of "Korsa" in Moroccan culture?',
                a: 'In Moroccan Darija, "Korsa" (كورصة) refers to hiring a taxi for a specific direct run or private course. Korsa modernizes this tradition by connecting travelers directly with licensed Grand Taxis for intercity journeys from doorstep to doorstep, without having to go to a crowded taxi station.'
              },
              {
                q: 'How does the inDrive-style fare bidding work?',
                a: 'When you choose your departure city and destination, Korsa shows the standard Moroccan benchmark rate. You propose your desired price in MAD. Nearby certified Grand Taxi drivers review your proposal and can accept it immediately or offer a fair counter-bid. You choose which driver to ride with based on price, car model, and rating.'
              },
              {
                q: 'Can I book a single seat (Blasa) or the whole Grand Taxi (Korsa Kamla)?',
                a: 'Yes! You can choose shared seats (Blasa - 1 to 6 seats) to split costs with other travelers on that corridor, or choose "Korsa Kamla" to privatize the entire 6-seat Grand Taxi for yourself, family, and extra luggage.'
              },
              {
                q: 'How does the payment system work?',
                a: 'Korsa offers a flexible Moroccan payment system: (1) In-app Korsa Wallet with instant Dirham balance, (2) Moroccan bank cards via CMI gateway (Attijariwafa, CIH, BCP, BMCE) with 3D Secure verification, and (3) Traditional cash on board with driver digital confirmation receipt.'
              },
              {
                q: 'Are all drivers licensed Grand Taxis?',
                a: 'Yes. Only verified Moroccan drivers holding official Ministry transport permits (Lagrima) with inspected vehicles (Dacia Lodgy, Mercedes, etc.) and valid taxi city badges are admitted onto Korsa.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white hover:text-amber-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Moroccan Payment Modal */}
      <PaymentSystemModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        walletBalance={walletBalance}
        onUpdateWallet={handleUpdateWallet}
        rideToPay={currentPassengerRide}
        onPaymentSuccess={handlePaymentSuccess}
        transactions={transactions}
      />

      {/* Founder Super-Admin Portal Modal */}
      <FounderDashboard
        isOpen={isFounderModalOpen}
        onClose={() => setIsFounderModalOpen(false)}
        onDriverSuspended={(suspendedDriverId) => {
          if (currentUser?.id === suspendedDriverId || (currentUser?.driverDetails && currentUser.id === suspendedDriverId)) {
            setCurrentUser(null);
          }
        }}
      />

      {/* Authentication Modal for Passengers, Drivers & Founder */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        initialRoleTab={authInitialTab}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'founder') {
            setIsFounderModalOpen(true);
          } else if (user.role === 'driver') {
            setCurrentRole('driver');
          } else {
            setCurrentRole('passenger');
          }
        }}
        onLogout={() => {
          setCurrentUser(null);
        }}
      />

      {/* Footer with Founder Access Below */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">Korsa (كورصة)</span>
              <span>·</span>
              <span>Morocco Grand Taxi Intercity Platform</span>
            </div>
            <div className="text-center sm:text-right">
              <span>Casablanca · Rabat · Marrakech · Tangier · Fes · Agadir</span>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Founded & Owned by <strong>Abdelhaq Cherqui</strong>. Built for Moroccan Intercity Transport.
              </div>
            </div>
          </div>

          {/* Founder Button Au-dessous (Below) with Password Protection */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
            <span className="text-[11px] text-slate-400">
              © 2026 Korsa · Plateforme marocaine certifiée de transport interurbain
            </span>
            <button
              onClick={() => {
                if (currentUser?.role === 'founder') {
                  setIsFounderModalOpen(true);
                } else {
                  setAuthInitialTab('founder');
                  setIsAuthModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/40 text-slate-600 hover:text-amber-700 dark:text-slate-400 dark:hover:text-amber-300 text-xs font-semibold transition-all cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-amber-400"
              title="Accès réservé au fondateur avec email et mot de passe"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>👑 Espace Fondateur (Accès Sécurisé)</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
