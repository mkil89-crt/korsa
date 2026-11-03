import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Moroccan phone number validation regex:
// Valid: +212[5-7]XXXXXXXX, 00212[5-7]XXXXXXXX, 0[5-7]XXXXXXXX
export const MOROCCAN_PHONE_REGEX = /^(?:\+212|00212|0)[5-7]\d{8}$/;

interface OtpRecord {
  code: string;
  expiresAt: number;
  attemptsCount: number;
  lastSentAt: number;
}

// In-memory OTP storage (keyed by normalized phone number)
const otpStore = new Map<string, OtpRecord>();

// Normalize Moroccan phone to 212XXXXXXXXX
export function normalizeMoroccanPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('00212')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '212' + cleaned.substring(1);
  } else if (!cleaned.startsWith('212') && cleaned.length === 9) {
    cleaned = '212' + cleaned;
  }
  return cleaned;
}

// --- Driver Storage on Server ---
export interface ServerDriver {
  id: string;
  name: string;
  phone: string;
  city: string;
  carModel: string;
  carYear: number;
  lagrimaNumber: string;
  plateNumber: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  suspension?: {
    reason: string;
    duration: '1_day' | '7_days' | '30_days' | 'permanent';
    suspendedAt: string;
    expiresAt?: string;
  };
}

const driversDatabase = new Map<string, ServerDriver>();

// Seed initial certified drivers
driversDatabase.set('212661489210', {
  id: 'drv-hassan-1',
  name: 'Hassan El Amrani',
  phone: '+212 6 61 48 92 10',
  city: 'Casablanca',
  carModel: 'Dacia Lodgy 7-Places',
  carYear: 2023,
  lagrimaNumber: 'Lagrima #3108',
  plateNumber: '61492 - A - 6',
  status: 'approved'
});

// ================= API ROUTES =================

// 1. Request OTP (Sends genuine 6-digit code via external service or secure server log)
app.post('/api/auth/request-otp', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone || typeof phone !== 'string') {
    return res.status(400).json({ error: 'Le numéro de téléphone est obligatoire.' });
  }

  const trimmed = phone.trim();
  if (!MOROCCAN_PHONE_REGEX.test(trimmed)) {
    return res.status(400).json({
      error: 'Numéro de téléphone marocain invalide. Formats acceptés : 06XXXXXXXX, 07XXXXXXXX ou +2126XXXXXXXX.'
    });
  }

  const normalized = normalizeMoroccanPhone(trimmed);
  const now = Date.now();
  const existing = otpStore.get(normalized);

  // Rate limiting: 60 seconds cooldown between resends
  if (existing && now - existing.lastSentAt < 60000) {
    const remainingSec = Math.ceil((60000 - (now - existing.lastSentAt)) / 1000);
    return res.status(429).json({
      error: `Veuillez patienter ${remainingSec} secondes avant de demander un nouveau code.`,
      remainingSeconds: remainingSec
    });
  }

  // Rate limiting: 5 attempts max
  if (existing && existing.attemptsCount >= 5 && existing.expiresAt > now) {
    return res.status(429).json({
      error: 'Nombre maximal de tentatives atteint (5 essais). Veuillez réessayer dans 5 minutes.'
    });
  }

  // Generate 6-digit secure code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + 5 * 60 * 1000; // 5 min expiry

  otpStore.set(normalized, {
    code,
    expiresAt,
    attemptsCount: existing ? existing.attemptsCount : 0,
    lastSentAt: now
  });

  // Optional External SMS Gateway Dispatch (e.g. Twilio or Meta WhatsApp)
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioAuth && twilioPhone) {
    const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
    const bodyParams = new URLSearchParams({
      To: '+' + normalized,
      From: twilioPhone,
      Body: `Korsa : Votre code de vérification est ${code}. Ne le partagez avec personne.`
    });
    fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams.toString()
    }).catch(err => console.error('[SMS Dispatch Error]', err));
  } else {
    // Secure server log (never exposed to client browser)
    console.log(`[AUTH SMS GATEWAY] Code 6-chiffres pour +${normalized}: ${code}`);
  }

  // NEVER return the code in the JSON response
  return res.json({
    success: true,
    message: 'Code de confirmation à 6 chiffres envoyé par SMS.',
    cooldownSeconds: 60
  });
});

// 2. Verify OTP
app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: 'Numéro de téléphone et code requis.' });
  }

  const normalized = normalizeMoroccanPhone(String(phone).trim());
  const record = otpStore.get(normalized);
  const now = Date.now();

  if (!record || record.expiresAt < now) {
    return res.status(400).json({ error: 'Code expiré ou inexistant. Veuillez demander un nouveau code.' });
  }

  if (record.attemptsCount >= 5) {
    otpStore.delete(normalized);
    return res.status(429).json({ error: 'Nombre maximal de tentatives dépassé. Veuillez demander un nouveau code.' });
  }

  if (record.code !== String(code).trim()) {
    record.attemptsCount += 1;
    const remaining = 5 - record.attemptsCount;
    return res.status(400).json({
      error: `Code incorrect. Il vous reste ${remaining} tentative${remaining > 1 ? 's' : ''}.`
    });
  }

  // Valid! Clear OTP
  otpStore.delete(normalized);

  // Check if driver is suspended
  const driver = driversDatabase.get(normalized);
  if (driver && driver.status === 'suspended') {
    return res.status(403).json({
      error: `Votre compte chauffeur est suspendu. Motif : ${driver.suspension?.reason || 'Non précisé'}. Durée : ${driver.suspension?.duration || 'Définitif'}.`
    });
  }

  return res.json({
    success: true,
    verified: true,
    phone: normalized
  });
});

// 3. Founder Login Endpoint (verified server-side, no hardcoded password on client)
app.post('/api/auth/founder-login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const founderEmail = (process.env.FOUNDER_EMAIL || 'abdelhaqcherqui@gmail.com').trim().toLowerCase();
  const founderPassword = (process.env.FOUNDER_PASSWORD || 'AbdelhaqKorsa2026!').trim();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  if (String(email).trim().toLowerCase() !== founderEmail || String(password).trim() !== founderPassword) {
    return res.status(401).json({ error: 'Email ou mot de passe administrateur incorrect.' });
  }

  return res.json({
    success: true,
    user: {
      role: 'founder',
      id: 'usr-founder-abdelhaq',
      name: 'Abdelhaq Cherqui',
      email: founderEmail,
      phone: '+212 7 08 13 24 61',
      isVerified: true
    }
  });
});

// 4. Drivers Management Endpoints
app.get('/api/drivers', (_req: Request, res: Response) => {
  const list = Array.from(driversDatabase.values());
  res.json({ success: true, drivers: list });
});

app.post('/api/drivers/register', (req: Request, res: Response) => {
  const { name, phone, city, carModel, carYear, lagrimaNumber, plateNumber } = req.body;
  if (!name || !phone || !lagrimaNumber || !carModel || !plateNumber) {
    return res.status(400).json({ error: 'Tous les champs (Nom, Téléphone, Agrément, Modèle, Matricule) sont obligatoires.' });
  }

  const normalized = normalizeMoroccanPhone(phone);
  const existing = driversDatabase.get(normalized);
  if (existing && existing.status === 'suspended') {
    return res.status(403).json({
      error: `Ce chauffeur est actuellement suspendu. Motif : ${existing.suspension?.reason || ''}.`
    });
  }

  const newDriver: ServerDriver = {
    id: `drv-${Date.now()}`,
    name: name.trim(),
    phone: phone.trim(),
    city: city || 'Casablanca',
    carModel: carModel.trim(),
    carYear: carYear || 2023,
    lagrimaNumber: lagrimaNumber.trim(),
    plateNumber: plateNumber.trim(),
    status: 'pending' // Initial status is ALWAYS pending!
  };

  driversDatabase.set(normalized, newDriver);
  return res.json({ success: true, driver: newDriver });
});

app.post('/api/drivers/status', (req: Request, res: Response) => {
  const { driverId, phone, status, reason, duration } = req.body;
  let targetDriver: ServerDriver | undefined;

  for (const drv of driversDatabase.values()) {
    if (drv.id === driverId || (phone && normalizeMoroccanPhone(drv.phone) === normalizeMoroccanPhone(phone))) {
      targetDriver = drv;
      break;
    }
  }

  if (!targetDriver) {
    return res.status(404).json({ error: 'Chauffeur introuvable.' });
  }

  if (status === 'suspended') {
    if (!reason || !String(reason).trim()) {
      return res.status(400).json({ error: 'Le motif de suspension est obligatoire.' });
    }
    const dur = duration || '7_days';
    let expiresAt: string | undefined;
    const now = new Date();
    if (dur === '1_day') {
      expiresAt = new Date(now.getTime() + 24 * 3600 * 1000).toISOString();
    } else if (dur === '7_days') {
      expiresAt = new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString();
    } else if (dur === '30_days') {
      expiresAt = new Date(now.getTime() + 30 * 24 * 3600 * 1000).toISOString();
    } else {
      expiresAt = undefined; // permanent
    }

    targetDriver.status = 'suspended';
    targetDriver.suspension = {
      reason: String(reason).trim(),
      duration: dur,
      suspendedAt: now.toISOString(),
      expiresAt
    };
  } else if (status === 'approved') {
    targetDriver.status = 'approved';
    targetDriver.suspension = undefined;
  } else if (status === 'rejected') {
    targetDriver.status = 'rejected';
    targetDriver.suspension = undefined;
  } else if (status === 'pending') {
    targetDriver.status = 'pending';
    targetDriver.suspension = undefined;
  }

  return res.json({ success: true, driver: targetDriver });
});

app.get('/api/drivers/check-suspension/:phone', (req: Request, res: Response) => {
  const normalized = normalizeMoroccanPhone(req.params.phone);
  const driver = driversDatabase.get(normalized);
  if (!driver) {
    return res.json({ suspended: false });
  }

  if (driver.status === 'suspended') {
    // Check if expired
    if (driver.suspension?.expiresAt && new Date(driver.suspension.expiresAt).getTime() < Date.now()) {
      driver.status = 'approved';
      driver.suspension = undefined;
      return res.json({ suspended: false });
    }
    return res.json({
      suspended: true,
      reason: driver.suspension?.reason,
      duration: driver.suspension?.duration,
      expiresAt: driver.suspension?.expiresAt
    });
  }

  return res.json({ suspended: false, status: driver.status });
});

// ================= VITE DEV / PRODUCTION MOUNT =================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Korsa Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Korsa Server Startup Error]', err);
});
