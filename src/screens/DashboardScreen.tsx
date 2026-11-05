import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  BatteryCharging,
  Zap,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  BellRing,
  Navigation,
  Clock,
  ChevronRight,
  Sun,
  Gauge,
  CheckCircle2,
} from 'lucide-react';
import { BikeSystemState, ScreenId } from '../types/smartbike';
import { UI_STRINGS } from '../data/initialState';
import {
  DashboardCenterLockOrb,
  InteractiveBikeIllustration,
} from '../components/BrandVisuals';

interface DashboardScreenProps {
  state: BikeSystemState;
  onNavigate: (screen: ScreenId) => void;
  onLockBike: () => void;
  onUnlockBike: (method?: 'Fingerprint' | 'PIN' | 'Manual Key' | 'Dashboard Control') => void;
  onCloseUnlockModal: () => void;
  onSimulateTheftAlert: () => void;
  onClearTheftAlert: () => void;
  onToggleGeofence: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  state,
  onNavigate,
  onLockBike,
  onUnlockBike,
  onCloseUnlockModal,
  onSimulateTheftAlert,
  onClearTheftAlert,
  onToggleGeofence,
}) => {
  const [visualMode, setVisualMode] = useState<'orb' | 'illustration'>('orb');
  const t = UI_STRINGS[state.language];

  const totalCurrentMa =
    (state.solarActive ? state.solarCurrentMa : 0) +
    (state.dynamoActive ? state.dynamoCurrentMa : 0);

  const chargingSourceLabel =
    state.solarActive && state.dynamoActive
      ? 'Solar + Dynamo'
      : state.solarActive
      ? 'Solar Panel'
      : state.dynamoActive
      ? 'Hub Dynamo'
      : 'Standby Battery';

  const currentMah = Math.round((state.batteryPct / 100) * state.batteryCapacityMah);

  return (
    <div className="space-y-6 pb-8">
      {/* User Greeting Banner (Matches Screen 4 of Reference Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071D35]/90 border border-[#00D5FF]/25 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#00D5FF] to-[#087BFF] p-0.5 shrink-0">
            <div className="w-full h-full rounded-full bg-[#031326] flex items-center justify-center font-bold text-base text-[#00D5FF]">
              {state.user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              {t.hello}, {state.user.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {state.activeTheftAlert
                ? 'CRITICAL: Unauthorized motion or tamper alarm active!'
                : state.isLocked
                ? t.protectedMsg
                : t.unprotectedMsg}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => onNavigate('biometric')}
            className="px-3.5 py-2 rounded-xl bg-[#102B46] hover:bg-[#163759] border border-[#00D5FF]/35 text-xs font-semibold text-[#00D5FF] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Fingerprint className="w-4 h-4" />
            <span>Biometric Unlock</span>
          </button>
          <button
            type="button"
            onClick={() =>
              state.activeTheftAlert ? onClearTheftAlert() : onSimulateTheftAlert()
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              state.activeTheftAlert
                ? 'bg-[#00E676]/20 border border-[#00E676] text-[#00E676]'
                : 'bg-[#FF3B4F]/15 hover:bg-[#FF3B4F]/25 border border-[#FF3B4F]/45 text-[#FF6B7A]'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>
              {state.activeTheftAlert ? 'Silence Alarm' : 'Simulate Theft Alert'}
            </span>
          </button>
        </div>
      </div>

      {/* Top Grid: Main Bicycle Lock Status Card + 4 Core Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Status Card (7 cols on desktop) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#071D35] border border-[#00D5FF]/30 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.45)]">
          {/* Card Header with View Mode Switch */}
          <div className="flex items-center justify-between gap-2 z-10">
            <div>
              <span className="text-xs font-medium text-[#00D5FF]">
                {state.user.bikeModel} · {state.user.deviceId}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                Primary Security & Solenoid Lock
              </h2>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#031326] border border-[#102B46]">
              <button
                type="button"
                onClick={() => setVisualMode('orb')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  visualMode === 'orb'
                    ? 'bg-[#102B46] text-[#00D5FF]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Status Orb
              </button>
              <button
                type="button"
                onClick={() => setVisualMode('illustration')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  visualMode === 'illustration'
                    ? 'bg-[#102B46] text-[#00D5FF]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bike View
              </button>
            </div>
          </div>

          {/* Center Orb or Full Bicycle Illustration */}
          <div className="my-2 z-10">
            {visualMode === 'orb' ? (
              <DashboardCenterLockOrb
                isLocked={state.isLocked}
                theftAlert={state.activeTheftAlert}
                onActionClick={() =>
                  state.isLocked
                    ? onUnlockBike('Dashboard Control')
                    : onLockBike()
                }
              />
            ) : (
              <InteractiveBikeIllustration
                isLocked={state.isLocked}
                solarActive={state.solarActive}
                dynamoActive={state.dynamoActive}
                theftAlert={state.activeTheftAlert}
                compact
                onToggleLock={() =>
                  state.isLocked
                    ? onUnlockBike('Dashboard Control')
                    : onLockBike()
                }
              />
            )}
          </div>

          {/* Dual Lock / Unlock Control Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3 z-10">
            <button
              type="button"
              onClick={onLockBike}
              disabled={state.isLocked && !state.activeTheftAlert}
              className={`py-3.5 px-5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                state.isLocked
                  ? 'bg-[#00E676]/20 border border-[#00E676]/60 text-[#00E676]'
                  : 'bg-gradient-to-r from-[#00E676] to-[#00B862] text-[#031326] shadow-[0_0_20px_rgba(0,230,118,0.4)] hover:brightness-110'
              }`}
            >
              <Lock className="w-5 h-5 stroke-[2.5]" />
              <span>{state.isLocked ? 'Bicycle Locked' : t.lockBike}</span>
            </button>

            <button
              type="button"
              onClick={() => onUnlockBike('Dashboard Control')}
              className={`py-3.5 px-5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                !state.isLocked
                  ? 'bg-[#FFB020]/20 border border-[#FFB020]/60 text-[#FFB020]'
                  : 'bg-gradient-to-r from-[#00EAFF] via-[#00B4FF] to-[#087BFF] text-white shadow-[0_0_24px_rgba(0,213,255,0.45)] hover:brightness-110'
              }`}
            >
              <Unlock className="w-5 h-5 stroke-[2.5]" />
              <span>{t.unlockBike}</span>
            </button>
          </div>
        </div>

        {/* 4 Information Cards (5 cols on desktop, 2x2 grid) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {/* 1. Battery Level Card */}
          <button
            type="button"
            onClick={() => onNavigate('power')}
            className="text-left rounded-2xl bg-[#102B46]/90 hover:bg-[#143556] border border-[#00D5FF]/25 hover:border-[#00D5FF] p-4 flex flex-col justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#00E676]/15 flex items-center justify-center text-[#00E676]">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono-tabular text-[#00E676] font-semibold">
                {currentMah.toLocaleString()} mAh
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono-tabular text-white">
                {state.batteryPct}%
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">
                Battery Level
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#031326] mt-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00E676] to-[#00D5FF]"
                  style={{ width: `${state.batteryPct}%` }}
                />
              </div>
            </div>
          </button>

          {/* 2. Charging Status Card */}
          <button
            type="button"
            onClick={() => onNavigate('power')}
            className="text-left rounded-2xl bg-[#102B46]/90 hover:bg-[#143556] border border-[#00D5FF]/25 hover:border-[#00D5FF] p-4 flex flex-col justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#FFB020]/15 flex items-center justify-center text-[#FFB020]">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono-tabular text-[#00E676] font-semibold">
                +{totalCurrentMa} mA
              </span>
            </div>
            <div className="mt-4">
              <div className="text-lg sm:text-xl font-bold text-white leading-tight">
                {totalCurrentMa > 0 ? 'Charging' : 'Idle'}
              </div>
              <div className="text-xs text-[#00D5FF] font-medium mt-1">
                ({chargingSourceLabel})
              </div>
              <div className="text-[11px] text-slate-300 mt-1.5">
                Solar: +{state.solarActive ? state.solarCurrentMa : 0}mA · Dynamo: +{state.dynamoActive ? state.dynamoCurrentMa : 0}mA
              </div>
            </div>
          </button>

          {/* 3. GPS Connection Card */}
          <button
            type="button"
            onClick={() => onNavigate('gps')}
            className="text-left rounded-2xl bg-[#102B46]/90 hover:bg-[#143556] border border-[#00D5FF]/25 hover:border-[#00D5FF] p-4 flex flex-col justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#00D5FF]/15 flex items-center justify-center text-[#00D5FF]">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#00E676]">
                {state.gpsOnline ? '9 Sats' : 'Offline'}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-lg sm:text-xl font-bold text-[#00E676]">
                {state.gpsOnline ? 'GPS Online' : 'Signal Lost'}
              </div>
              <div className="text-xs font-medium text-slate-200 mt-0.5 truncate">
                {state.bikeLocation.label}
              </div>
              <div className="text-[11px] font-mono-tabular text-slate-400 mt-1">
                {state.bikeLocation.lat.toFixed(4)}° N, {state.bikeLocation.lng.toFixed(4)}° E
              </div>
            </div>
          </button>

          {/* 4. Security Status Card */}
          <button
            type="button"
            onClick={() => onNavigate('alerts')}
            className="text-left rounded-2xl bg-[#102B46]/90 hover:bg-[#143556] border border-[#00D5FF]/25 hover:border-[#00D5FF] p-4 flex flex-col justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  state.activeTheftAlert
                    ? 'bg-[#FF3B4F]/20 text-[#FF3B4F]'
                    : 'bg-[#00E676]/15 text-[#00E676]'
                }`}
              >
                {state.activeTheftAlert ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <span className="text-xs font-semibold text-slate-300">
                Geofence {state.geofenceEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="mt-4">
              <div
                className={`text-lg sm:text-xl font-bold ${
                  state.activeTheftAlert
                    ? 'text-[#FF3B4F]'
                    : state.isLocked
                    ? 'text-[#00E676]'
                    : 'text-[#FFB020]'
                }`}
              >
                {state.activeTheftAlert
                  ? 'Breach Alert'
                  : state.isLocked
                  ? 'Armed & Safe'
                  : 'Disarmed'}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Security Status
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Safe Radius: {state.geofenceRadiusM} m
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="rounded-2xl bg-[#071D35] border border-[#00D5FF]/20 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm sm:text-base font-bold text-white">
            Quick IoT Controls
          </h3>
          <span className="text-xs text-slate-400">
            Instant hardware simulation shortcuts
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('biometric')}
            className="p-3 rounded-xl bg-[#102B46]/80 hover:bg-[#102B46] border border-[#00D5FF]/25 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <Fingerprint className="w-5 h-5 text-[#00D5FF] shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">Scan Finger</div>
              <div className="text-[11px] text-slate-300">Biometric / PIN</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('gps')}
            className="p-3 rounded-xl bg-[#102B46]/80 hover:bg-[#102B46] border border-[#00D5FF]/25 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <Navigation className="w-5 h-5 text-[#00E676] shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">Locate Bike</div>
              <div className="text-[11px] text-slate-300">Live GPS Map</div>
            </div>
          </button>

          <button
            type="button"
            onClick={onToggleGeofence}
            className="p-3 rounded-xl bg-[#102B46]/80 hover:bg-[#102B46] border border-[#00D5FF]/25 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <ShieldCheck
              className={`w-5 h-5 shrink-0 ${
                state.geofenceEnabled ? 'text-[#00E676]' : 'text-slate-400'
              }`}
            />
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">
                Geofence: {state.geofenceEnabled ? 'ON' : 'OFF'}
              </div>
              <div className="text-[11px] text-slate-300">
                Radius {state.geofenceRadiusM} m
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('power')}
            className="p-3 rounded-xl bg-[#102B46]/80 hover:bg-[#102B46] border border-[#00D5FF]/25 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <Sun className="w-5 h-5 text-[#FFB020] shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">Self-Charging</div>
              <div className="text-[11px] text-slate-300">+{totalCurrentMa} mA Active</div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom 3-Section Grid: Security Notifications, Recent Activity, Last Known Location */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Notifications */}
        <div className="rounded-2xl bg-[#071D35] border border-[#00D5FF]/25 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Security Notifications</h3>
              <button
                type="button"
                onClick={() => onNavigate('alerts')}
                className="text-xs font-semibold text-[#00D5FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {state.alerts.slice(0, 3).map((alert) => {
                const iconColor =
                  alert.severity === 'critical'
                    ? 'text-[#FF3B4F] bg-[#FF3B4F]/15'
                    : alert.severity === 'warning'
                    ? 'text-[#FFB020] bg-[#FFB020]/15'
                    : 'text-[#00E676] bg-[#00E676]/15';

                return (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={() => onNavigate('alerts')}
                    className="w-full text-left p-3 rounded-xl bg-[#102B46]/75 hover:bg-[#102B46] border border-white/5 flex items-start gap-3 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${iconColor}`}
                    >
                      <BellRing className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-semibold text-white truncate">
                        {alert.title}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {alert.timestamp}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-[#071D35] border border-[#00D5FF]/25 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Recent Activity</h3>
              <button
                type="button"
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-[#00D5FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {state.activities.slice(0, 3).map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => onNavigate('history')}
                  className="w-full text-left p-3 rounded-xl bg-[#102B46]/75 hover:bg-[#102B46] border border-white/5 flex items-start justify-between gap-3 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#00D5FF]/15 text-[#00D5FF] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-white truncate">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-slate-300 truncate mt-0.5">
                        {act.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono-tabular text-slate-400 shrink-0">
                    {act.timestamp}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Last Known Location Card */}
        <div className="rounded-2xl bg-[#071D35] border border-[#00D5FF]/25 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white">Last Known Location</h3>
              <span className="text-xs font-semibold text-[#00E676]">
                Live Telemetry
              </span>
            </div>

            <div className="rounded-xl bg-[#102B46] border border-[#00D5FF]/30 p-4 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-[#00D5FF] shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">
                    {state.bikeLocation.label}
                  </div>
                  <div className="text-xs font-mono-tabular text-slate-300">
                    ({state.bikeLocation.lat.toFixed(4)}° N, {state.bikeLocation.lng.toFixed(4)}° E)
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>Safe Zone Perimeter</span>
                <span className="font-mono-tabular font-semibold text-[#00E676]">
                  {state.geofenceRadiusM} m ({state.geofenceEnabled ? 'Active' : 'Paused'})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Last GPS Sync</span>
                <span className="font-mono-tabular text-slate-200">
                  {state.bikeLocation.updatedAt}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('gps')}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#087BFF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Interactive GPS Map</span>
          </button>
        </div>
      </div>

      {/* Screen 5 Unlock Confirmation Modal (Matches Screen 5 of Reference Image 3) */}
      {state.unlockSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#0B223E] border-2 border-[#00D5FF]/50 shadow-[0_0_50px_rgba(0,213,255,0.35)] p-7 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center mx-auto mb-4 text-[#00E676] shadow-[0_0_25px_rgba(0,230,118,0.3)]">
              <Unlock className="w-11 h-11 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              Bicycle Unlocked!
            </h3>
            <p className="text-sm text-slate-200 mt-2">
              You can now ride your bicycle.
            </p>
            <p className="text-xs text-[#00D5FF] mt-1">
              Verified via {state.lastUnlockMethod}
            </p>
            <button
              type="button"
              onClick={onCloseUnlockModal}
              className="mt-6 w-full py-3 rounded-full bg-gradient-to-r from-[#00B4FF] to-[#087BFF] hover:brightness-110 text-white font-bold text-base shadow-[0_0_20px_rgba(8,123,255,0.5)] transition-all cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
