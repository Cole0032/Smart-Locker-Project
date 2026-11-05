import React, { useState } from 'react';
import {
  User,
  Fingerprint,
  Bell,
  Globe,
  Palette,
  Info,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Cpu,
  RotateCcw,
  Shield,
} from 'lucide-react';
import { BikeSystemState, LanguageCode, ScreenId, UserProfile } from '../types/smartbike';
import { LANGUAGE_LABELS } from '../data/initialState';

interface SettingsScreenProps {
  state: BikeSystemState;
  onNavigate: (screen: ScreenId) => void;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onSelectLanguage: (lang: LanguageCode) => void;
  onUpdatePreferences: (updates: {
    notificationsEnabled?: boolean;
    pushAlertsEnabled?: boolean;
    smsFallbackEnabled?: boolean;
    darkMode?: boolean;
  }) => void;
  onResetDemoState: () => void;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  state,
  onNavigate,
  onUpdateUser,
  onSelectLanguage,
  onUpdatePreferences,
  onResetDemoState,
  onLogout,
}) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(state.user.fullName);
  const [email, setEmail] = useState(state.user.email);
  const [phone, setPhone] = useState(state.user.phone);
  const [bikeModel, setBikeModel] = useState(state.user.bikeModel);
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'device' | 'help'>('none');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      fullName: fullName.trim() || state.user.fullName,
      email: email.trim() || state.user.email,
      phone: phone.trim() || state.user.phone,
      bikeModel: bikeModel.trim() || state.user.bikeModel,
    });
    setEditingProfile(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071D35] border border-[#00D5FF]/30 rounded-2xl p-5">
        <div>
          <span className="text-xs font-semibold text-[#00D5FF]">
            Account Preferences, Multilingual Interface & ESP32 Hardware Specs
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            Settings
          </h1>
        </div>

        <button
          type="button"
          onClick={onResetDemoState}
          className="px-3.5 py-2 rounded-xl bg-[#102B46] hover:bg-[#16395C] border border-[#00D5FF]/35 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#00D5FF]" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/50 flex items-center gap-2.5 text-xs sm:text-sm text-[#00E676] font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>User profile and account information saved to localStorage.</span>
        </div>
      )}

      {/* Main List Container (Matches Screen 10 of Reference Image 3) */}
      <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-5 sm:p-7 space-y-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        {/* 1. My Profile / Account Information */}
        <div className="rounded-2xl bg-[#102B46]/85 border border-[#00D5FF]/25 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#00D5FF]/15 border border-[#00D5FF]/40 flex items-center justify-center text-[#00D5FF] shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-white">
                  My Profile & Account Information
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {state.user.fullName} · {state.user.email} · {state.user.phone}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingProfile((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-xl bg-[#071D35] hover:bg-[#0B2545] border border-[#00D5FF]/40 text-xs font-bold text-[#00D5FF] transition-colors cursor-pointer"
            >
              {editingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editingProfile && (
            <form onSubmit={handleSaveProfile} className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#071D35] border border-[#00D5FF]/35 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#071D35] border border-[#00D5FF]/35 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#071D35] border border-[#00D5FF]/35 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Bicycle Model</label>
                <input
                  type="text"
                  value={bikeModel}
                  onChange={(e) => setBikeModel(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#071D35] border border-[#00D5FF]/35 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00EAFF] to-[#087BFF] text-white font-bold text-xs sm:text-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 2. Access Management Row (Matches Screen 10 of Reference Image 3) */}
        <button
          type="button"
          onClick={() => onNavigate('access')}
          className="w-full text-left rounded-2xl bg-[#102B46]/85 hover:bg-[#143556] border border-[#00D5FF]/25 p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#00D5FF]/15 border border-[#00D5FF]/40 flex items-center justify-center text-[#00D5FF] shrink-0">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white">
                Access Management
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                (Fingerprint / PIN / Manual Key) · {state.fingerprints.length} Fingerprints Enrolled
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
        </button>

        {/* 3. Notifications Settings Row */}
        <div className="rounded-2xl bg-[#102B46]/85 border border-[#00D5FF]/25 p-4 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center text-[#00E676] shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-white">
                  Notifications
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Real-time theft, movement, and geofence push notifications
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onUpdatePreferences({
                  notificationsEnabled: !state.notificationsEnabled,
                })
              }
              className={`w-13 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                state.notificationsEnabled ? 'bg-[#00E676]' : 'bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  state.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {state.notificationsEnabled && (
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300 pl-14">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.pushAlertsEnabled}
                  onChange={(e) =>
                    onUpdatePreferences({ pushAlertsEnabled: e.target.checked })
                  }
                  className="accent-[#00D5FF]"
                />
                <span>Mobile Push Alerts</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.smsFallbackEnabled}
                  onChange={(e) =>
                    onUpdatePreferences({ smsFallbackEnabled: e.target.checked })
                  }
                  className="accent-[#00D5FF]"
                />
                <span>GSM SMS Fallback Alerts</span>
              </label>
            </div>
          )}
        </div>

        {/* 4. Language Settings Row */}
        <div className="rounded-2xl bg-[#102B46]/85 border border-[#00D5FF]/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#00D5FF]/15 border border-[#00D5FF]/40 flex items-center justify-center text-[#00D5FF] shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white">
                Language
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {LANGUAGE_LABELS[state.language].name} ({LANGUAGE_LABELS[state.language].native})
              </div>
            </div>
          </div>

          <select
            value={state.language}
            onChange={(e) => onSelectLanguage(e.target.value as LanguageCode)}
            className="px-4 py-2 rounded-xl bg-[#071D35] border border-[#00D5FF]/40 text-xs sm:text-sm font-semibold text-white focus:outline-none"
          >
            {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map((code) => (
              <option key={code} value={code}>
                {LANGUAGE_LABELS[code].name} — {LANGUAGE_LABELS[code].native}
              </option>
            ))}
          </select>
        </div>

        {/* 5. App Theme / Dark Mode Row */}
        <div className="rounded-2xl bg-[#102B46]/85 border border-[#00D5FF]/25 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#087BFF]/20 border border-[#087BFF]/40 flex items-center justify-center text-[#00D5FF] shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white">
                App Theme
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {state.darkMode ? 'Dark Navy Neon (Default Reference Theme)' : 'High-Contrast Midnight'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onUpdatePreferences({ darkMode: !state.darkMode })}
            className="px-3.5 py-1.5 rounded-xl bg-[#071D35] border border-[#00D5FF]/40 text-xs font-bold text-[#00D5FF] cursor-pointer"
          >
            {state.darkMode ? 'Dark Mode Active' : 'Switch to Dark'}
          </button>
        </div>

        {/* 6. Security Settings Quick Access */}
        <button
          type="button"
          onClick={() => onNavigate('access')}
          className="w-full text-left rounded-2xl bg-[#102B46]/85 hover:bg-[#143556] border border-[#00D5FF]/25 p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center text-[#00E676] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white">
                Security Settings
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Auto-Lock: {state.autoLockDelaySec}s · Motion Sensitivity: {state.motionSensitivity} · Siren: {state.alarmSirenEnabled ? '115 dB ON' : 'Muted'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
        </button>

        {/* 7. Device Information Row (Matches Screen 10 of Reference Image 3: ID: SB-2026-004 | v1.0) */}
        <button
          type="button"
          onClick={() => setActiveModal('device')}
          className="w-full text-left rounded-2xl bg-[#102B46]/85 hover:bg-[#143556] border border-[#00D5FF]/25 p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#00D5FF]/15 border border-[#00D5FF]/40 flex items-center justify-center text-[#00D5FF] shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white">
                Device Information
              </div>
              <div className="text-xs font-mono-tabular text-slate-300 mt-0.5">
                ID: {state.user.deviceId} | {state.user.firmwareVersion}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
        </button>

        {/* 8. Help & Support Row */}
        <button
          type="button"
          onClick={() => setActiveModal('help')}
          className="w-full text-left rounded-2xl bg-[#102B46]/85 hover:bg-[#143556] border border-[#00D5FF]/25 p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FFB020]/15 border border-[#FFB020]/40 flex items-center justify-center text-[#FFB020] shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white">
                Help and Support
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                System architecture guide, troubleshooting & patent presentation overview
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
        </button>

        {/* 9. Logout Button (Matches Screen 10 bottom crimson button in Reference Image 3) */}
        <div className="pt-3">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#2A0E1B] hover:bg-[#3D1224] border border-[#FF3B4F]/60 text-[#FF5263] font-bold text-base flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(255,59,79,0.2)] transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Modal: Device Information & ESP32 Hardware Architecture */}
      {activeModal === 'device' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#071D35] border border-[#00D5FF]/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-[#00D5FF]" />
              <div>
                <h3 className="text-lg font-bold text-white">
                  SmartBike Secure Hardware Specification
                </h3>
                <p className="text-xs font-mono-tabular text-[#00D5FF]">
                  Device ID: {state.user.deviceId} · Firmware {state.user.firmwareVersion}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#102B46] border border-white/10">
                <span className="text-slate-400 block">Microcontroller Unit</span>
                <span className="font-bold text-white mt-0.5 block">
                  ESP32-S3 Dual-Core Wi-Fi/BLE
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#102B46] border border-white/10">
                <span className="text-slate-400 block">Biometric Sensor</span>
                <span className="font-bold text-white mt-0.5 block">
                  R307 Optical Fingerprint Module
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#102B46] border border-white/10">
                <span className="text-slate-400 block">GPS & Cellular Module</span>
                <span className="font-bold text-white mt-0.5 block">
                  u-blox NEO-6M + SIM800L GSM
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#102B46] border border-white/10">
                <span className="text-slate-400 block">Motion & Tilt Sensor</span>
                <span className="font-bold text-white mt-0.5 block">
                  MPU6050 6-DOF Gyro/Accelerometer
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#102B46] border border-white/10">
                <span className="text-slate-400 block">Energy Harvesting</span>
                <span className="font-bold text-[#00E676] mt-0.5 block">
                  6V Solar Panel + 6V Front Hub Dynamo
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#102B46] border border-white/10">
                <span className="text-slate-400 block">Energy Storage Pack</span>
                <span className="font-bold text-[#00D5FF] mt-0.5 block">
                  6,000 mAh Li-Ion 18650 + TP4056/MPPT
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#087BFF] text-white font-bold text-sm cursor-pointer"
            >
              Close Specification
            </button>
          </div>
        </div>
      )}

      {/* Modal: Help & Support */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#071D35] border border-[#00D5FF]/50 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              Help, Support & Prototype Guide
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <p>
                <strong>1. Self-Charging Hybrid Architecture:</strong> SmartBike Secure combines a rear-rack solar panel (+220 mA) and a front-wheel hub dynamo (+380 mA) to continuously charge the onboard 6,000 mAh battery pack.
              </p>
              <p>
                <strong>2. Triple-Redundancy Access:</strong> Unlock via the R307 optical fingerprint scanner, 4-digit backup PIN code (<code className="text-[#00D5FF]">{state.pinCode}</code>), or the laser-cut physical Manual Override Key (<code className="text-[#00D5FF]">{state.manualOverrideKeyId}</code>).
              </p>
              <p>
                <strong>3. Active Geofence & Anti-Theft:</strong> If the bicycle is moved while locked or exits the configured {state.geofenceRadiusM}m safe zone around LPU, Punjab, an instant alert is logged and the 115 dB siren is triggered.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#087BFF] text-white font-bold text-sm cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
