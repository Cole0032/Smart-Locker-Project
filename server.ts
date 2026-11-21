import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_BIKE_STATE } from './src/data/initialState.ts';
import type { BikeSystemState } from './src/types/smartbike.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use ./data locally, or fall back to os.tmpdir() in Cloud Run containers if needed
const LOCAL_DATA_DIR = path.join(__dirname, 'data');
let activeDbFile = path.join(LOCAL_DATA_DIR, 'smartbike-db.json');

function getWritableDbPath(): string {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    return activeDbFile;
  } catch {
    activeDbFile = path.join(os.tmpdir(), 'smartbike-db.json');
    return activeDbFile;
  }
}

function loadStateFromDisk(): BikeSystemState {
  try {
    const dbPath = getWritableDbPath();
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      return { ...INITIAL_BIKE_STATE, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed to read smartbike-db.json, using default state:', err);
  }
  return structuredClone(INITIAL_BIKE_STATE);
}

function saveStateToDisk(state: BikeSystemState): void {
  try {
    const dbPath = getWritableDbPath();
    fs.writeFileSync(dbPath, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write smartbike-db.json:', err);
  }
}

let systemState: BikeSystemState = loadStateFromDisk();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  // 1. Backend & IoT Gateway Health Check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'online',
      service: 'SmartBike Secure IoT Backend API',
      deviceId: systemState.user.deviceId,
      firmwareVersion: systemState.user.firmwareVersion,
      storage: activeDbFile,
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Get Complete System State
  app.get('/api/state', (_req, res) => {
    res.json(systemState);
  });

  // 3. Synchronize / Update Complete System State from Frontend
  app.put('/api/state', (req, res) => {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({ error: 'Invalid state payload' });
      return;
    }
    systemState = { ...systemState, ...req.body };
    saveStateToDisk(systemState);
    res.json({ ok: true, state: systemState });
  });

  // 4. Reset Backend State to Initial Defaults
  app.post('/api/state/reset', (_req, res) => {
    systemState = structuredClone(INITIAL_BIKE_STATE);
    systemState.isAuthenticated = true;
    saveStateToDisk(systemState);
    res.json({ ok: true, state: systemState });
  });

  // 5. Authentication Endpoints
  app.post('/api/auth/login', (req, res) => {
    const { identifier, password } = req.body || {};
    if (!identifier || !password || String(password).length < 4) {
      res.status(400).json({ error: 'Valid identifier and password required' });
      return;
    }
    const isEmail = String(identifier).includes('@');
    systemState.isAuthenticated = true;
    if (isEmail) {
      systemState.user.email = String(identifier).trim();
    } else {
      systemState.user.fullName = String(identifier).trim();
    }
    saveStateToDisk(systemState);
    res.json({ ok: true, user: systemState.user, state: systemState });
  });

  app.post('/api/auth/register', (req, res) => {
    const { fullName, email, phone } = req.body || {};
    if (!fullName || !email) {
      res.status(400).json({ error: 'Full name and email are required' });
      return;
    }
    systemState.isAuthenticated = true;
    systemState.user = {
      ...systemState.user,
      fullName: String(fullName).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : systemState.user.phone,
    };
    saveStateToDisk(systemState);
    res.json({ ok: true, user: systemState.user, state: systemState });
  });

  // 6. Lock / Unlock Bicycle Endpoints
  app.post('/api/bike/lock', (_req, res) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    systemState.isLocked = true;
    systemState.activeTheftAlert = false;
    systemState.activities.unshift({
      id: `act-${Date.now()}`,
      category: 'locked',
      title: 'Bicycle Locked (Backend API)',
      subtitle: `Solenoid deadbolt engaged at ${systemState.bikeLocation.label}`,
      timestamp: time,
      dateStr: new Date().toISOString().slice(0, 10),
      period: 'Today',
    });
    saveStateToDisk(systemState);
    res.json({ ok: true, isLocked: systemState.isLocked, state: systemState });
  });

  app.post('/api/bike/unlock', (req, res) => {
    const { method = 'Dashboard Control', detail = 'Backend API Request' } = req.body || {};
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    systemState.isLocked = false;
    systemState.activeTheftAlert = false;
    systemState.lastUnlockMethod = method;
    systemState.activities.unshift({
      id: `act-${Date.now()}`,
      category: 'unlocked',
      title: 'Bicycle Unlocked (Backend API)',
      subtitle: `Disengaged via ${method} (${detail})`,
      timestamp: time,
      dateStr: new Date().toISOString().slice(0, 10),
      period: 'Today',
    });
    saveStateToDisk(systemState);
    res.json({ ok: true, isLocked: systemState.isLocked, state: systemState });
  });

  // 7. ESP32 Hardware Telemetry Webhook Endpoint
  app.post('/api/esp32/telemetry', (req, res) => {
    const {
      batteryPct,
      solarCurrentMa,
      dynamoCurrentMa,
      lat,
      lng,
      label,
      isLocked,
      tamperDetected,
    } = req.body || {};

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (typeof batteryPct === 'number') {
      systemState.batteryPct = Math.max(0, Math.min(100, batteryPct));
    }
    if (typeof solarCurrentMa === 'number') {
      systemState.solarCurrentMa = Math.max(0, solarCurrentMa);
      systemState.solarActive = solarCurrentMa > 0;
    }
    if (typeof dynamoCurrentMa === 'number') {
      systemState.dynamoCurrentMa = Math.max(0, dynamoCurrentMa);
      systemState.dynamoActive = dynamoCurrentMa > 0;
    }
    if (typeof lat === 'number' && typeof lng === 'number') {
      systemState.bikeLocation = {
        lat,
        lng,
        label: label || systemState.bikeLocation.label,
        updatedAt: time,
      };
    }
    if (typeof isLocked === 'boolean') {
      systemState.isLocked = isLocked;
    }
    if (tamperDetected === true) {
      systemState.activeTheftAlert = true;
      systemState.alerts.unshift({
        id: `alt-${Date.now()}`,
        type: 'unauthorized',
        category: 'Access',
        title: 'ESP32 Hardware Tamper Alert',
        description: 'Physical vibration / unauthorized access reported by onboard ESP32.',
        timestamp: `Today, ${time}`,
        severity: 'critical',
        location: `${systemState.bikeLocation.label} (${systemState.bikeLocation.lat.toFixed(4)}° N, ${systemState.bikeLocation.lng.toFixed(4)}° E)`,
        acknowledged: false,
      });
    }

    saveStateToDisk(systemState);

    res.json({
      ok: true,
      commands: {
        solenoidLocked: systemState.isLocked,
        activateSiren: systemState.activeTheftAlert && systemState.alarmSirenEnabled,
        geofenceEnabled: systemState.geofenceEnabled,
        geofenceRadiusM: systemState.geofenceRadiusM,
      },
      state: systemState,
    });
  });

  const distPath = path.join(__dirname, 'dist');
  const isDev =
    process.env.npm_lifecycle_event === 'dev' &&
    process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartBike Secure Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
