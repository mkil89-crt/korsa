# Korsa (كورصة) - Moroccan Inter-City Grand Taxi & Bidding Platform

Korsa is a digital ride-hailing and fare-negotiation platform inspired by inDrive and markoub.ma, specifically engineered for Moroccan inter-city Grand Taxis. It connects travelers directly with licensed Grand Taxi drivers (*Mouline Taxi*) for seamless city-to-city travel without the noise, waiting, and chaos of physical taxi stations (*Mahattat*).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Summary of Confirmed Architecture Based on Your Requirements:**
> - **Platform Brand & Cultural Identity**: Named **Korsa (كورصة)**, celebrating the authentic Moroccan tradition of booking a private or shared taxi course (*korsa*).
> - **Direct City-to-City Without The Station**: Passengers book inter-city journeys directly from their home, hotel, or chosen neighborhood pickup point (e.g. Casablanca Maarif to Marrakech Gueliz, Rabat Agdal to Tangier City Center) eliminating the need to physically travel to stations like Oulad Ziane or Kamra.
> - **inDrive Dynamic Bidding Engine**: Passenger sets the route, selects seats (1 to 6 seats or private *Korsa Kamla* / full vehicle), and offers an initial price in Moroccan Dirhams (MAD). Nearby certified Grand Taxi drivers review requests and can either accept or submit counter-offers with estimated arrival times.
> - **Direct Match & Contact System**: A prominent **Direct Call / WhatsApp Button** (`+212` Moroccan format) for both passenger and driver, accompanied by a dynamic 4-digit mutual **Korsa Security PIN** and real-time landmark notes (e.g., "Near Mosque Badr / next to BIM") so both parties immediately spot each other on the street.
> - **Moroccan Payment System**:
>   1. **Korsa Wallet (محفظة)**: Digital Moroccan Dirham balance with instant top-up and driver instant payouts.
>   2. **CMI / Bank Card Checkout**: Secure simulated Moroccan debit/credit card gateway (Attijariwafa, BCP, BMCE, CIH).
>   3. **Cash on Board with Verification Code**: Traditional cash payment validated upon drop-off via driver receipt confirmation.
> - **Dual Passenger & Driver Mode**: Seamless role switcher between Passenger (requesting rides, comparing driver bids) and Driver (*Chauffeur Grand Taxi* console with ride radar, passenger bids, vehicle setup, earnings tracker).

---

### 1. Overview & Core Concept

- **The Problem**: Traveling between Moroccan cities by Grand Taxi traditionally requires passengers to commute to packed, chaotic taxi stations (like *Mahatta Oulad Ziane* in Casablanca or *Bab Doukkala* in Marrakech), haul luggage through crowds, wait indeterminately for seats to fill up, and accept arbitrary fixed prices.
- **The Solution**: **Korsa** brings the flexibility of inDrive's fare negotiation and the inter-city connectivity of markoub.ma into a modern web and mobile platform. Travelers request rides from their preferred pickup address, propose their fare, and negotiate in real time with licensed Grand Taxi chauffeurs driving modern vehicles (Dacia Lodgy, Mercedes 240/250, Fiat Tipo).
- **Core Personas**:
  - **The Inter-City Traveler**: Commuters, students, tourists, and families seeking safe, direct inter-city transport with transparent pricing and verified drivers.
  - **The Grand Taxi Driver (*Moul Taxi*)**: Licensed drivers looking for guaranteed return trips, full car bookings (*korsa*), and direct passenger connections without paying station touts (*Courtia*).

---

### 2. User Experience & Visual Design

#### Visual Identity & Theme
- **Color Palette**:
  - Dominant Neutral: Rich warm slate and crisp white backgrounds (`#0F172A`, `#F8FAFC`, `#FFFFFF`).
  - Moroccan Grand Taxi Accent: Authentic Warm Moroccan Ochre/Amber Gold (`#D97706`, `#B45309`, `#F59E0B`) reminiscent of national taxi iconography and warm terracotta cities.
  - Emerald Green Success (`#059669`, `#10B981`) representing payment confirmations, Moroccan palm trees, and verified trust badges.
- **Typography & Formatting**:
  - Display Font: Modern geometric sans with high visual impact (`Plus Jakarta Sans` / `Outfit`).
  - Body Prose: Clear, accessible modern typeface (`Plus Jakarta Sans` / `DM Sans`).
  - Numbers & Pricing: Strict tabular numbers (`font-mono tabular-nums`) with clear Moroccan currency notation (`MAD` / `د.م.`).
- **Moroccan Touch & Darija Familiarity**:
  - Natural multilingual support / Darija friendly micro-copy (*Korsa Kamla*, *Blasa*, *Chauffeur*, *Mahatta Direct*).
  - Clean unboxed metadata discipline (e.g., `Dacia Lodgy · 4.9 ★ · 340 trips · Casablanca License #4218`).

#### Key User Flows

```
[PASSENGER FLOW]
Choose Origin & Destination City -> Select Seats (1-6 or Full Korsa) -> Propose MAD Price -> 
Publish Request -> Live Driver Radar receives bids -> Compare Driver Offers (Price, Rating, ETA, Car) -> 
Accept Driver -> Direct Call/WhatsApp Button & Korsa PIN reveal -> Ride Tracking -> Payment (Wallet/Card/Cash) -> Rating

[DRIVER CHAUFFEUR FLOW]
Toggle to Driver Mode -> Set Vehicle Details & License -> View Live City Radar -> 
Inspect Passenger Requests -> Accept Price or Send Counter-Offer in MAD -> Passenger Accepts -> 
Instant Client Contact Button (+212 Call / WhatsApp) -> Verify Pickup PIN -> Start & Complete Trip -> Receive Payment & Wallet Balance
```

---

### 3. Key Product Decisions & Trade-Offs

- **Bidding vs. Fixed Price**:
  - *Decision*: Dynamic inDrive-style negotiation with smart Moroccan reference price hints (e.g. suggesting realistic benchmark prices like Casablanca <-> Rabat at 40–50 MAD/seat or 250–300 MAD full korsa).
  - *Why*: Gives both passenger and driver mutual freedom to agree on fair pricing depending on rush hours, weather, or door-to-door detour distance.
- **Direct Matching & Anti-Lost Button**:
  - *Decision*: Prominent call button linking directly to tel:`+212...` and direct WhatsApp chat link, combined with a 4-digit mutual safety code ("Korsa PIN") and exact pickup landmark notes.
  - *Why*: Eliminates the universal Moroccan struggle of driver and client searching for each other at busy intersections, roundabouts, or station entrances.
- **Payment Architecture**:
  - *Decision*: Full-featured tripartite payment engine with digital MAD wallet, interactive Moroccan card checkout simulator (generating genuine transaction receipts), and cash-on-drop with driver receipt confirmation.
  - *Why*: Reflects real Moroccan market behavior where digital card adoption is growing rapidly alongside mobile wallets and cash.
- **Client & Driver Synchronization**:
  - *Decision*: Unified reactive state store with simulated active drivers responding to passenger bids dynamically, plus a manual driver console allowing test users to play both sides in real time.

---

### 4. Technical Architecture & System Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Korsa Platform Application                      │
│                                                                        │
│  ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────┐ │
│  │    Top Navigation     │   │   City Route Finder   │   │ Mode Switch│ │
│  │   Brand: Korsa (كورصة) │   │ Casa ⇄ Rbt ⇄ Mrk ⇄ Tng│   │Pass / Moul│ │
│  └───────────┬───────────┘   └───────────┬───────────┘   └─────┬─────┘ │
│              │                           │                     │       │
│  ┌───────────▼───────────────────────────▼─────────────────────▼─────┐ │
│  │                         Active Mode View                          │ │
│  │                                                                   │ │
│  │   [PASSENGER MODE]                    [DRIVER CHAUFFEUR MODE]     │ │
│  │   • City & Doorstep Pickup Input      • Live Radar of City Runs   │ │
│  │   • Seat Selector (Blasa / Full Car)  • Bid / Counter-offer Box   │ │
│  │   • Propose Fare in MAD               • Active Trip Navigator     │ │
│  │   • Live Incoming Bids Carousel       • Passenger Contact Modal   │ │
│  │   • Driver Profile & Car Details      • Earnings & Daily Payouts  │ │
│  │   • Call / WhatsApp (+212) Button     • License & Vehicle Setup   │ │
│  │   • 4-Digit Pickup PIN Verification   • Security PIN Verification │ │
│  └─────────────────────────────────┬─────────────────────────────────┘ │
│                                    │                                   │
│  ┌─────────────────────────────────▼─────────────────────────────────┐ │
│  │                    Moroccan Payment System                        │ │
│  │   • Korsa Wallet (Balance, Top-up, Transaction Ledger in MAD)      │ │
│  │   • CMI / Moroccan Bank Card Gateway (Attijari, CIH, BCP, BMCE)    │ │
│  │   • Cash on Board with Driver Digital Code & Receipt              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Modules to Implement:
1. **Interactive Route & Booking Engine**:
   - Moroccan city database (Casablanca, Rabat, Marrakech, Tangier, Fes, Agadir, Meknes, Oujda, Essaouira, Kenitra, Tetouan, etc.) with real intercity distances and baseline fares.
   - Exact doorstep pickup and drop-off landmark inputs (e.g. "Maarif near Twin Center", "Hay Riad Ave Annakhil").
   - Seat selection: Shared per-seat (*Blasa*) or private full Grand Taxi (*Korsa Kamla* 6 seats).
2. **Real-Time inDrive Bidding Engine**:
   - Passenger publishes ride proposal with target MAD price.
   - Driver bid responses with price offers, vehicle photos/models, driver ratings, and estimated arrival time.
   - Accept, decline, or counter-offer negotiations.
3. **Driver-Client Direct Contact & Find-Each-Other System**:
   - One-tap phone button (`tel:` with Moroccan numbers) and WhatsApp direct chat link.
   - Unique 4-digit Korsa PIN for mutual authentication when meeting.
   - Real-time ride status lifecycle: Requested → Counter-bids → Confirmed → Driver Arriving → On Board → Completed.
4. **Moroccan Payment Engine**:
   - Dirham Digital Wallet with balance management, deposit options, and instant settlement.
   - Moroccan Credit/Debit Card Checkout flow with card visual, 3D secure simulation, and digital receipt generation.
   - Cash receipt confirmation modal.
5. **Driver Console (*Chauffeur Moul Taxi*)**:
   - Live radar feed of ride requests across Moroccan corridors.
   - Quick counter-bidding shortcuts (`+10 DH`, `+20 DH`, `Accept Proposed`).
   - Earnings analytics, daily revenue, and completed korsat history.
