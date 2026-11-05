import React, { useState } from 'react';
import {
  Fingerprint,
  Grid,
  KeyRound,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Lock,
  Unlock,
  Delete,
  Sparkles,
  Info,
} from 'lucide-react';
import { BikeSystemState, ScreenId } from '../types/smartbike';

interface BiometricScreenProps {
  state: BikeSystemState;
  onUnlockSuccess: (method: 'Fingerprint' | 'PIN' | 'Manual Key', detail: string) => void;
  onAuthFailure: (reason: string) => void;
  onLockBike: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const BiometricScreen: React.FC<BiometricScreenProps> = ({
  state,
  onUnlockSuccess,
  onAuthFailure,
  onLockBike,
  onNavigate,
}) => {
  const [mode, setMode] = useState<'fingerprint' | 'pin' | 'manual'>('fingerprint');
  const [selectedFingerId, setSelectedFingerId] = useState<string>(
    state.fingerprints[0]?.id || 'fp-1'
  );
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'granted' | 'denied'>('idle');
  const [pinInput, setPinInput] = useState<string>('');
  const [pinStatus, setPinStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [manualKeyInserted, setManualKeyInserted] = useState<boolean>(false);

  const handleStartFingerprintScan = (simulateIntruder = false) => {
    if (scanState === 'scanning') return;
    setScanState('scanning');

    setTimeout(() => {
      if (simulateIntruder || selectedFingerId === 'intruder') {
        setScanState('denied');
        onAuthFailure('Unrecognized fingerprint scan rejected at R307 optical sensor');
      } else {
        const fp = state.fingerprints.find((f) => f.id === selectedFingerId);
        setScanState('granted');
        onUnlockSuccess('Fingerprint', fp ? fp.label : 'Enrolled Fingerprint');
      }
    }, 1350);
  };

  const handlePinDigit = (digit: string) => {
    if (pinInput.length >= 4) return;
    const nextPin = pinInput + digit;
    setPinInput(nextPin);
    setPinStatus('idle');

    if (nextPin.length === 4) {
      if (nextPin === state.pinCode) {
        setPinStatus('granted');
        onUnlockSuccess('PIN', '4-Digit Security Keypad');
      } else {
        setPinStatus('denied');
        onAuthFailure(`Invalid 4-digit PIN code entered (${nextPin.replace(/./g, '*')})`);
      }
    }
  };

  const handleManualOverrideUnlock = () => {
    setManualKeyInserted(true);
    onUnlockSuccess(
      'Manual Key',
      `Mechanical Override Cylinder (${state.manualOverrideKeyId})`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Top Banner: Demo Mode Hardware Notice */}
      <div className="rounded-2xl bg-[#071D35] border border-[#00D5FF]/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-[#00D5FF]">
            R307 Optical Biometric Module + Keypad + Mechanical Cylinder (Demo Mode)
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            Unlock Your Bicycle
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              state.isLocked
                ? 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/40'
                : 'bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/40'
            }`}
          >
            {state.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{state.isLocked ? 'Lock Engaged' : 'Unlocked'}</span>
          </span>

          {!state.isLocked && (
            <button
              type="button"
              onClick={() => {
                onLockBike();
                setScanState('idle');
                setPinStatus('idle');
                setPinInput('');
                setManualKeyInserted(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#102B46] hover:bg-[#16385B] border border-[#00D5FF]/40 text-xs font-semibold text-white cursor-pointer"
            >
              Re-Lock Bike
            </button>
          )}
        </div>
      </div>

      {/* Main Authentication Container Card (Matches Screen 3 of Reference Image 3) */}
      <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6 sm:p-8 shadow-[0_14px_45px_rgba(0,0,0,0.5)]">
        {/* 3 Mode Selector Cards: Fingerprint | PIN | Manual Key */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
          <button
            type="button"
            onClick={() => setMode('fingerprint')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'fingerprint'
                ? 'bg-gradient-to-b from-[#087BFF] to-[#0051B3] border-[#00EAFF] text-white shadow-[0_0_24px_rgba(8,123,255,0.5)]'
                : 'bg-[#102B46]/80 border-[#00D5FF]/25 text-slate-300 hover:text-white hover:bg-[#102B46]'
            }`}
          >
            <Fingerprint className="w-6 h-6" />
            <span className="text-xs sm:text-sm font-bold">Fingerprint</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('pin')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'pin'
                ? 'bg-gradient-to-b from-[#087BFF] to-[#0051B3] border-[#00EAFF] text-white shadow-[0_0_24px_rgba(8,123,255,0.5)]'
                : 'bg-[#102B46]/80 border-[#00D5FF]/25 text-slate-300 hover:text-white hover:bg-[#102B46]'
            }`}
          >
            <Grid className="w-6 h-6" />
            <span className="text-xs sm:text-sm font-bold">PIN</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'manual'
                ? 'bg-gradient-to-b from-[#087BFF] to-[#0051B3] border-[#00EAFF] text-white shadow-[0_0_24px_rgba(8,123,255,0.5)]'
                : 'bg-[#102B46]/80 border-[#00D5FF]/25 text-slate-300 hover:text-white hover:bg-[#102B46]'
            }`}
          >
            <KeyRound className="w-6 h-6" />
            <span className="text-xs sm:text-sm font-bold">Manual Key</span>
          </button>
        </div>

        {/* MODE 1: FINGERPRINT AUTHENTICATION */}
        {mode === 'fingerprint' && (
          <div className="flex flex-col items-center">
            {/* Enrolled Finger Profile Selector for Demo Simulation */}
            <div className="w-full max-w-md mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2 text-center">
                Select Simulated Biometric Input (Frontend Simulation)
              </label>
              <select
                value={selectedFingerId}
                onChange={(e) => {
                  setSelectedFingerId(e.target.value);
                  setScanState('idle');
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#102B46] border border-[#00D5FF]/40 text-sm text-white focus:outline-none focus:border-[#00D5FF]"
              >
                {state.fingerprints.map((fp) => (
                  <option key={fp.id} value={fp.id}>
                    ✓ Authorized: {fp.label} ({fp.finger})
                  </option>
                ))}
                <option value="intruder">
                  ✕ Unregistered Finger (Simulate Intruder / Access Denied)
                </option>
              </select>
            </div>

            {/* Large Glowing Fingerprint Scanner Ring (Matches Screen 3 of Reference Image 3) */}
            <div className="relative my-2 flex items-center justify-center">
              {scanState === 'scanning' && (
                <div className="absolute inset-0 rounded-full border-2 border-[#00D5FF] animate-radar pointer-events-none" />
              )}

              <button
                type="button"
                onClick={() => handleStartFingerprintScan(false)}
                className={`relative w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-b from-[#072242] to-[#021024] border-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer ${
                  scanState === 'granted'
                    ? 'border-[#00E676] shadow-[0_0_45px_rgba(0,230,118,0.5)]'
                    : scanState === 'denied'
                    ? 'border-[#FF3B4F] shadow-[0_0_45px_rgba(255,59,79,0.5)]'
                    : 'border-[#00D5FF] shadow-[0_0_45px_rgba(0,213,255,0.45)] hover:scale-[1.02]'
                }`}
              >
                <div className="absolute inset-3 rounded-full border border-[#00D5FF]/30 pointer-events-none" />

                {/* Animated Laser Scanline when scanning */}
                {scanState === 'scanning' && (
                  <div className="absolute inset-x-4 h-1.5 bg-gradient-to-r from-transparent via-[#00EAFF] to-transparent shadow-[0_0_18px_#00EAFF] animate-scanline z-20" />
                )}

                <Fingerprint
                  className={`w-28 h-28 sm:w-32 sm:h-32 transition-colors duration-300 ${
                    scanState === 'granted'
                      ? 'text-[#00E676]'
                      : scanState === 'denied'
                      ? 'text-[#FF3B4F]'
                      : scanState === 'scanning'
                      ? 'text-[#00EAFF] animate-pulse'
                      : 'text-white'
                  }`}
                />
              </button>
            </div>

            <p className="mt-4 text-base sm:text-lg font-bold text-white">
              {scanState === 'scanning'
                ? 'Reading Optical Ridges...'
                : 'Scan Your Fingerprint'}
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Tap the glowing biometric sensor above or use the action buttons below
            </p>

            {/* Primary Scan Action & Intruder Test Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5 w-full max-w-md">
              <button
                type="button"
                onClick={() => handleStartFingerprintScan(false)}
                disabled={scanState === 'scanning'}
                className="flex-1 min-w-[180px] py-3 px-5 rounded-full bg-gradient-to-r from-[#00EAFF] via-[#00B4FF] to-[#087BFF] hover:brightness-110 text-white font-bold text-sm shadow-[0_0_20px_rgba(0,213,255,0.4)] transition-all cursor-pointer"
              >
                {scanState === 'scanning' ? 'Scanning Sensor...' : 'Scan Fingerprint'}
              </button>

              <button
                type="button"
                onClick={() => handleStartFingerprintScan(true)}
                disabled={scanState === 'scanning'}
                className="py-3 px-4 rounded-full bg-[#FF3B4F]/15 hover:bg-[#FF3B4F]/25 border border-[#FF3B4F]/45 text-[#FF8A96] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Simulate Failed Scan
              </button>
            </div>

            {/* Result Card matching bottom of Screen 3 in Reference Image 3 */}
            <div className="w-full max-w-md mt-6">
              {scanState === 'granted' && (
                <div className="p-4 rounded-2xl bg-[#102B46]/90 border border-[#00E676]/60 flex items-center gap-4 shadow-[0_0_25px_rgba(0,230,118,0.2)]">
                  <div className="w-11 h-11 rounded-full bg-[#00E676]/20 flex items-center justify-center text-[#00E676] shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">
                      Fingerprint Verified
                    </div>
                    <div className="text-sm font-semibold text-[#00E676]">
                      Access Granted — Solenoid Lock Opened
                    </div>
                  </div>
                </div>
              )}

              {scanState === 'denied' && (
                <div className="p-4 rounded-2xl bg-[#FF3B4F]/15 border border-[#FF3B4F]/60 flex items-center gap-4 shadow-[0_0_25px_rgba(255,59,79,0.2)]">
                  <div className="w-11 h-11 rounded-full bg-[#FF3B4F]/25 flex items-center justify-center text-[#FF3B4F] shrink-0">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">
                      Fingerprint Not Recognized
                    </div>
                    <div className="text-sm font-semibold text-[#FF6B7A]">
                      Access Denied — Security Alert Logged
                    </div>
                  </div>
                </div>
              )}

              {scanState === 'idle' && (
                <div className="p-4 rounded-2xl bg-[#102B46]/50 border border-[#00D5FF]/20 flex items-center justify-between text-xs text-slate-300">
                  <span>Enrolled Templates: {state.fingerprints.length}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('access')}
                    className="font-semibold text-[#00D5FF] hover:underline cursor-pointer"
                  >
                    Manage Fingerprints →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 2: PIN AUTHENTICATION ALTERNATIVE */}
        {mode === 'pin' && (
          <div className="max-w-sm mx-auto flex flex-col items-center">
            <p className="text-sm text-slate-200 text-center">
              Enter your 4-digit backup PIN code to disengage the bicycle lock.
            </p>
            <p className="text-xs text-[#00D5FF] mt-1 font-mono-tabular">
              Demo Configured PIN: <strong className="text-white">{state.pinCode}</strong>
            </p>

            {/* 4 PIN Dots Display */}
            <div className="flex items-center justify-center gap-4 my-6">
              {[0, 1, 2, 3].map((idx) => {
                const filled = idx < pinInput.length;
                return (
                  <div
                    key={idx}
                    className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-bold font-mono-tabular transition-all ${
                      pinStatus === 'granted'
                        ? 'border-[#00E676] bg-[#00E676]/20 text-[#00E676]'
                        : pinStatus === 'denied'
                        ? 'border-[#FF3B4F] bg-[#FF3B4F]/20 text-[#FF3B4F]'
                        : filled
                        ? 'border-[#00D5FF] bg-[#102B46] text-white shadow-[0_0_12px_rgba(0,213,255,0.4)]'
                        : 'border-[#102B46] bg-[#031326] text-slate-500'
                    }`}
                  >
                    {filled ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handlePinDigit(digit)}
                  className="py-3.5 rounded-2xl bg-[#102B46] hover:bg-[#173A5E] border border-[#00D5FF]/25 hover:border-[#00D5FF] text-lg font-bold font-mono-tabular text-white transition-all active:scale-95 cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setPinInput('');
                  setPinStatus('idle');
                }}
                className="py-3.5 rounded-2xl bg-[#102B46]/60 hover:bg-[#102B46] border border-white/10 text-xs font-bold text-slate-300 transition-all cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="py-3.5 rounded-2xl bg-[#102B46] hover:bg-[#173A5E] border border-[#00D5FF]/25 hover:border-[#00D5FF] text-lg font-bold font-mono-tabular text-white transition-all active:scale-95 cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => {
                  setPinInput((prev) => prev.slice(0, -1));
                  setPinStatus('idle');
                }}
                className="py-3.5 rounded-2xl bg-[#102B46]/60 hover:bg-[#102B46] border border-white/10 flex items-center justify-center text-slate-300 transition-all cursor-pointer"
                aria-label="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {pinStatus === 'granted' && (
              <div className="mt-5 w-full p-3.5 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/50 flex items-center gap-3 text-sm text-[#00E676] font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>PIN Verified — Access Granted!</span>
              </div>
            )}

            {pinStatus === 'denied' && (
              <div className="mt-5 w-full p-3.5 rounded-2xl bg-[#FF3B4F]/15 border border-[#FF3B4F]/50 flex items-center gap-3 text-sm text-[#FF6B7A] font-semibold">
                <ShieldAlert className="w-5 h-5 shrink-0 text-[#FF3B4F]" />
                <span>Incorrect PIN — Access Denied!</span>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: MANUAL OVERRIDE KEY INFORMATION & SIMULATION */}
        {mode === 'manual' && (
          <div className="max-w-lg mx-auto space-y-5">
            <div className="p-5 rounded-2xl bg-[#102B46]/85 border border-[#00D5FF]/35 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#00D5FF]/15 border border-[#00D5FF]/40 flex items-center justify-center text-[#00D5FF] shrink-0">
                <KeyRound className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Physical Manual Override Key System
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Designed for fail-safe operation if the 6,000 mAh battery is ever fully depleted or the biometric glass is damaged. A laser-cut mechanical cylinder bypasses the solenoid while triggering a Hall-effect switch to log the event.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-[#031326] border border-white/10">
                <span className="text-slate-400 block text-xs">Registered Key Serial</span>
                <span className="font-mono-tabular font-bold text-[#00D5FF] mt-0.5 block">
                  {state.manualOverrideKeyId}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#031326] border border-white/10">
                <span className="text-slate-400 block text-xs">Cylinder Port Location</span>
                <span className="font-semibold text-white mt-0.5 block">
                  Protected Down-Tube Dust Cap
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleManualOverrideUnlock}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#00EAFF] via-[#00B4FF] to-[#087BFF] hover:brightness-110 text-white font-bold text-sm sm:text-base shadow-[0_0_24px_rgba(0,213,255,0.4)] transition-all cursor-pointer"
            >
              Simulate Manual Key Override Unlock
            </button>

            {manualKeyInserted && (
              <div className="p-4 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/50 flex items-center gap-3 text-sm text-[#00E676] font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  Mechanical Override Key Engaged — Deadbolt Disengaged & Logged!
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
