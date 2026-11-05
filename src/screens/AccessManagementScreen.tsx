import React, { useState } from 'react';
import {
  Fingerprint,
  Plus,
  Trash2,
  KeyRound,
  Lock,
  ShieldCheck,
  Clock,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { BikeSystemState, FingerprintRecord } from '../types/smartbike';

interface AccessManagementScreenProps {
  state: BikeSystemState;
  onAddFingerprint: (label: string, finger: string) => void;
  onRemoveFingerprint: (id: string) => void;
  onUpdatePin: (newPin: string) => void;
  onUpdateSecuritySettings: (updates: {
    autoLockEnabled?: boolean;
    autoLockDelaySec?: number;
    motionSensitivity?: 'Low' | 'Medium' | 'High';
    alarmSirenEnabled?: boolean;
  }) => void;
}

export const AccessManagementScreen: React.FC<AccessManagementScreenProps> = ({
  state,
  onAddFingerprint,
  onRemoveFingerprint,
  onUpdatePin,
  onUpdateSecuritySettings,
}) => {
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [newFpLabel, setNewFpLabel] = useState('');
  const [newFpFinger, setNewFpFinger] = useState('Left Index');
  const [enrollStep, setEnrollStep] = useState<0 | 1 | 2 | 3>(0);

  // PIN change state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMsg, setPinMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleOpenEnroll = () => {
    setNewFpLabel('');
    setNewFpFinger('Left Index');
    setEnrollStep(0);
    setEnrollModalOpen(true);
  };

  const handleAdvanceScanStep = () => {
    if (!newFpLabel.trim()) return;
    if (enrollStep < 3) {
      const next = (enrollStep + 1) as 1 | 2 | 3;
      setEnrollStep(next);
      if (next === 3) {
        setTimeout(() => {
          onAddFingerprint(newFpLabel.trim(), newFpFinger);
          setEnrollModalOpen(false);
        }, 700);
      }
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMsg(null);

    if (currentPin !== state.pinCode) {
      setPinMsg({
        type: 'error',
        text: `Current PIN is incorrect (Hint: demo PIN is ${state.pinCode}).`,
      });
      return;
    }
    if (!/^\d{4}$/.test(newPin)) {
      setPinMsg({
        type: 'error',
        text: 'New PIN must be exactly 4 numeric digits (0–9).',
      });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMsg({
        type: 'error',
        text: 'New PIN and Confirm PIN do not match.',
      });
      return;
    }

    onUpdatePin(newPin);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setPinMsg({
      type: 'success',
      text: `Backup 4-digit PIN updated to ${newPin} successfully.`,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071D35] border border-[#00D5FF]/30 rounded-2xl p-5">
        <div>
          <span className="text-xs font-semibold text-[#00D5FF]">
            Biometric Templates, Backup PIN & Fail-Safe Mechanical Key Configuration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            Access Management
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenEnroll}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00EAFF] to-[#087BFF] hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,213,255,0.4)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Fingerprint</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Fingerprint Management & Manual Override Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Enrolled Fingerprints Card */}
          <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Fingerprint className="w-5 h-5 text-[#00D5FF]" />
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Fingerprint Management ({state.fingerprints.length}/10 Slots)
                </h2>
              </div>
              <span className="text-xs text-slate-300">R307 Flash Memory</span>
            </div>

            <div className="space-y-3">
              {state.fingerprints.map((fp: FingerprintRecord) => (
                <div
                  key={fp.id}
                  className="p-4 rounded-2xl bg-[#102B46]/85 border border-[#00D5FF]/25 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#00D5FF]/15 border border-[#00D5FF]/40 flex items-center justify-center text-[#00D5FF] shrink-0">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-white truncate">
                          {fp.label}
                        </span>
                        {fp.isPrimary && (
                          <span className="text-xs font-semibold text-[#00E676]">
                            · Primary Owner
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {fp.finger} · Enrolled {fp.enrolledAt} · Last used: {fp.lastUsed}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveFingerprint(fp.id)}
                    disabled={state.fingerprints.length <= 1}
                    title={
                      state.fingerprints.length <= 1
                        ? 'At least one fingerprint must remain enrolled'
                        : 'Remove Fingerprint'
                    }
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      state.fingerprints.length <= 1
                        ? 'border-white/5 text-slate-600 cursor-not-allowed'
                        : 'border-[#FF3B4F]/40 bg-[#FF3B4F]/10 hover:bg-[#FF3B4F]/25 text-[#FF6B7A]'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Override Information Card */}
          <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-5 h-5 text-[#FFB020]" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Manual Override Key Information
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The mechanical override lock provides emergency physical access if the battery is ever completely drained or the biometric sensor is obstructed. A Hall-effect reed switch inside the keyway records every physical unlock event.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#102B46]/80 border border-white/10">
                <span className="text-slate-400 block">Key Cylinder Serial</span>
                <span className="font-mono-tabular font-bold text-[#00D5FF] text-sm mt-1 block">
                  {state.manualOverrideKeyId}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#102B46]/80 border border-white/10">
                <span className="text-slate-400 block">Keyway Sensor Status</span>
                <span className="font-bold text-[#00E676] text-sm mt-1 block">
                  Armed & Sealed
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#102B46]/80 border border-white/10">
                <span className="text-slate-400 block">Physical Keys Issued</span>
                <span className="font-mono-tabular font-bold text-white text-sm mt-1 block">
                  2 Laser-Cut Keys
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Change PIN + Automatic Lock & Security Configuration */}
        <div className="lg:col-span-5 space-y-6">
          {/* Change PIN Card */}
          <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#00D5FF]" />
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Change Backup PIN
                </h2>
              </div>
              <span className="text-xs font-mono-tabular text-slate-300">
                Current: {state.pinCode}
              </span>
            </div>

            {pinMsg && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  pinMsg.type === 'success'
                    ? 'bg-[#00E676]/15 border-[#00E676]/50 text-[#00E676]'
                    : 'bg-[#FF3B4F]/15 border-[#FF3B4F]/50 text-[#FF8A96]'
                }`}
              >
                {pinMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{pinMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Current 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="Enter current PIN (e.g. 2580)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#102B46] border border-[#00D5FF]/30 text-sm font-mono-tabular text-white focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    New 4-Digit PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="4 digits"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#102B46] border border-[#00D5FF]/30 text-sm font-mono-tabular text-white focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Confirm PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="4 digits"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#102B46] border border-[#00D5FF]/30 text-sm font-mono-tabular text-white focus:outline-none focus:border-[#00D5FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00D5FF] to-[#087BFF] hover:brightness-110 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Update Security PIN
              </button>
            </form>
          </div>

          {/* Automatic Lock & Security Configuration Card */}
          <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#00E676]" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Automatic Lock & Security Config
              </h2>
            </div>

            {/* Auto-Lock Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#00D5FF]" />
                <div>
                  <div className="text-sm font-bold text-white">Automatic Re-Lock</div>
                  <div className="text-xs text-slate-300">
                    Engage deadbolt when bicycle is stationary
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateSecuritySettings({
                    autoLockEnabled: !state.autoLockEnabled,
                  })
                }
                className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  state.autoLockEnabled ? 'bg-[#00E676]' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    state.autoLockEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Auto-Lock Delay Timer Selector */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300">Auto-Lock Stationary Delay</span>
                <span className="font-mono-tabular font-bold text-[#00D5FF]">
                  {state.autoLockDelaySec} seconds
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 60, 120].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() =>
                      onUpdateSecuritySettings({ autoLockDelaySec: sec })
                    }
                    className={`py-2 rounded-xl text-xs font-mono-tabular font-bold border transition-all cursor-pointer ${
                      state.autoLockDelaySec === sec
                        ? 'bg-[#087BFF] border-[#00EAFF] text-white'
                        : 'bg-[#102B46]/70 border-white/10 text-slate-300'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Motion Sensitivity */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300">MPU6050 Motion Sensitivity</span>
                <span className="font-bold text-[#00E676]">
                  {state.motionSensitivity}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      onUpdateSecuritySettings({ motionSensitivity: level })
                    }
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      state.motionSensitivity === level
                        ? 'bg-[#087BFF] border-[#00EAFF] text-white'
                        : 'bg-[#102B46]/70 border-white/10 text-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* 115 dB Alarm Siren Toggle */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-[#FFB020]" />
                <div>
                  <div className="text-sm font-bold text-white">
                    115 dB Anti-Theft Piezo Siren
                  </div>
                  <div className="text-xs text-slate-300">
                    Sound audible alarm on forced tamper
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateSecuritySettings({
                    alarmSirenEnabled: !state.alarmSirenEnabled,
                  })
                }
                className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  state.alarmSirenEnabled ? 'bg-[#00E676]' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    state.alarmSirenEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Fingerprint Modal */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#071D35] border border-[#00D5FF]/50 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Enroll New Fingerprint (Demo)
              </h3>
              <span className="text-xs font-mono-tabular text-[#00D5FF]">
                Step {enrollStep}/3
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Fingerprint Label
                </label>
                <input
                  type="text"
                  value={newFpLabel}
                  onChange={(e) => setNewFpLabel(e.target.value)}
                  placeholder="e.g. Owner Left Index"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#102B46] border border-[#00D5FF]/35 text-sm text-white focus:outline-none focus:border-[#00D5FF]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Finger Position
                </label>
                <select
                  value={newFpFinger}
                  onChange={(e) => setNewFpFinger(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#102B46] border border-[#00D5FF]/35 text-sm text-white focus:outline-none"
                >
                  <option value="Right Thumb">Right Thumb</option>
                  <option value="Right Index">Right Index</option>
                  <option value="Right Middle">Right Middle</option>
                  <option value="Left Thumb">Left Thumb</option>
                  <option value="Left Index">Left Index</option>
                </select>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#031326] border border-[#00D5FF]/30 flex flex-col items-center text-center">
              <Fingerprint
                className={`w-16 h-16 mb-2 transition-colors ${
                  enrollStep === 3
                    ? 'text-[#00E676]'
                    : enrollStep > 0
                    ? 'text-[#00D5FF] animate-pulse'
                    : 'text-slate-400'
                }`}
              />
              <p className="text-xs sm:text-sm font-semibold text-white">
                {enrollStep === 0 && 'Enter a label above and tap Scan Ridge Sample'}
                {enrollStep === 1 && 'Sample 1/3 captured! Lift and touch sensor again'}
                {enrollStep === 2 && 'Sample 2/3 captured! One final touch to confirm'}
                {enrollStep === 3 && 'Template Stored in Flash Memory!'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEnrollModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#102B46] text-slate-200 font-semibold text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdvanceScanStep}
                disabled={!newFpLabel.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00EAFF] to-[#087BFF] disabled:opacity-40 text-white font-bold text-sm cursor-pointer"
              >
                {enrollStep === 0
                  ? 'Scan Sample (1/3)'
                  : enrollStep === 1
                  ? 'Scan Sample (2/3)'
                  : 'Complete Enrollment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
