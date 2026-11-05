export type ScreenId =
  | 'welcome'
  | 'auth'
  | 'dashboard'
  | 'biometric'
  | 'gps'
  | 'alerts'
  | 'power'
  | 'access'
  | 'history'
  | 'settings';

export type LanguageCode = 'en' | 'dz' | 'my' | 'hi' | 'zh' | 'es';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  bikeModel: string;
  deviceId: string;
  firmwareVersion: string;
}

export interface FingerprintRecord {
  id: string;
  label: string;
  finger: string;
  enrolledAt: string;
  lastUsed: string;
  isPrimary: boolean;
}

export interface SecurityAlertItem {
  id: string;
  type: 'unauthorized' | 'movement' | 'geofence' | 'locked' | 'unlocked';
  category: 'Access' | 'Movement' | 'Geofence';
  title: string;
  description: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'success';
  location: string;
  acknowledged: boolean;
}

export interface ActivityLogItem {
  id: string;
  category:
    | 'locked'
    | 'unlocked'
    | 'auth_success'
    | 'auth_fail'
    | 'gps'
    | 'solar'
    | 'dynamo';
  title: string;
  subtitle: string;
  timestamp: string;
  dateStr: string;
  period: 'Today' | 'This Week' | 'This Month';
  deltaText?: string;
}

export interface PowerHistoryPoint {
  time: string;
  batteryPct: number;
  solarMa: number;
  dynamoMa: number;
  totalMa: number;
  wattHours: number;
}

export interface BikeSystemState {
  isAuthenticated: boolean;
  authTab: 'login' | 'register';
  language: LanguageCode;
  isLocked: boolean;
  unlockSuccessModalOpen: boolean;
  lastUnlockMethod: 'Fingerprint' | 'PIN' | 'Manual Key' | 'Dashboard Control';
  batteryPct: number;
  batteryCapacityMah: number;
  batteryHealthPct: number;
  batteryTempC: number;
  solarActive: boolean;
  solarCurrentMa: number;
  solarIrradianceWm2: number;
  dynamoActive: boolean;
  dynamoCurrentMa: number;
  rideSpeedKmh: number;
  gpsOnline: boolean;
  bikeLocation: {
    lat: number;
    lng: number;
    label: string;
    updatedAt: string;
  };
  safeZoneCenter: {
    lat: number;
    lng: number;
  };
  geofenceEnabled: boolean;
  geofenceRadiusM: number;
  isOutsideGeofence: boolean;
  activeTheftAlert: boolean;
  pinCode: string;
  manualOverrideKeyId: string;
  manualOverrideDetected: boolean;
  autoLockEnabled: boolean;
  autoLockDelaySec: number;
  motionSensitivity: 'Low' | 'Medium' | 'High';
  alarmSirenEnabled: boolean;
  notificationsEnabled: boolean;
  pushAlertsEnabled: boolean;
  smsFallbackEnabled: boolean;
  darkMode: boolean;
  user: UserProfile;
  fingerprints: FingerprintRecord[];
  alerts: SecurityAlertItem[];
  activities: ActivityLogItem[];
  powerHistory: PowerHistoryPoint[];
}
