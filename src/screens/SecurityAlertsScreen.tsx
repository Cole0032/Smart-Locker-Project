import React, { useState } from 'react';
import {
  BellRing,
  Activity,
  MapPin,
  Lock,
  Unlock,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { BikeSystemState, SecurityAlertItem } from '../types/smartbike';

interface SecurityAlertsScreenProps {
  state: BikeSystemState;
  onSimulateTheftAlert: () => void;
  onSimulateMovementAlert: () => void;
  onClearTheftAlert: () => void;
  onAcknowledgeAlert: (id: string) => void;
}

export const SecurityAlertsScreen: React.FC<SecurityAlertsScreenProps> = ({
  state,
  onSimulateTheftAlert,
  onSimulateMovementAlert,
  onClearTheftAlert,
  onAcknowledgeAlert,
}) => {
  const [filter, setFilter] = useState<'All' | 'Access' | 'Movement' | 'Geofence'>('All');
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlertItem | null>(null);

  const filteredAlerts = state.alerts.filter((item) =>
    filter === 'All' ? true : item.category === filter
  );

  const renderAlertIcon = (item: SecurityAlertItem) => {
    switch (item.type) {
      case 'unauthorized':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#FF3B4F]/15 border border-[#FF3B4F]/40 flex items-center justify-center text-[#FF3B4F] shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
        );
      case 'movement':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#FFB020]/15 border border-[#FFB020]/40 flex items-center justify-center text-[#FFB020] shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        );
      case 'geofence':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#FF3B4F]/15 border border-[#00D5FF]/50 flex items-center justify-center text-[#00D5FF] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
        );
      case 'locked':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center text-[#00E676] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
        );
      case 'unlocked':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center text-[#00E676] shrink-0">
            <Unlock className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header & Simulate Theft Alert Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071D35] border border-[#00D5FF]/30 rounded-2xl p-5">
        <div>
          <span className="text-xs font-semibold text-[#00D5FF]">
            Real-Time Tamper, Biometric & Perimeter Monitoring (Demo Mode)
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            Security Alerts
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onSimulateMovementAlert}
            className="px-4 py-2.5 rounded-xl bg-[#FFB020]/15 hover:bg-[#FFB020]/25 border border-[#FFB020]/50 text-[#FFB020] font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Simulate Motion Warning</span>
          </button>

          <button
            type="button"
            onClick={onSimulateTheftAlert}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3B4F] to-[#D91B32] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(255,59,79,0.45)] flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Simulate Theft Alert</span>
          </button>
        </div>
      </div>

      {/* Animated Active Theft Alert Banner (when triggered) */}
      {state.activeTheftAlert && (
        <div className="rounded-3xl bg-gradient-to-r from-[#3B0A14] via-[#2A0812] to-[#071D35] border-2 border-[#FF3B4F] p-5 sm:p-6 shadow-[0_0_35px_rgba(255,59,79,0.4)] animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF3B4F] text-white flex items-center justify-center shrink-0 shadow-[0_0_20px_#FF3B4F]">
                <Volume2 className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#FF8A96]">
                  CRITICAL THEFT ALERT — 115 dB PIEZO SIREN ACTIVE
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  Unauthorized Tampering & Forced Movement Detected!
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Location: {state.bikeLocation.label} ({state.bikeLocation.lat.toFixed(4)}° N,{' '}
                  {state.bikeLocation.lng.toFixed(4)}° E) · Solenoid Deadbolt Locked.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClearTheftAlert}
              className="px-5 py-3 rounded-xl bg-[#00E676] hover:brightness-110 text-[#031326] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              <span>Acknowledge & Disarm Siren</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs matching Screen 8 of Reference Image 3: All | Access | Movement | Geofence */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {(['All', 'Access', 'Movement', 'Geofence'] as const).map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#087BFF] to-[#00B4FF] text-white shadow-[0_0_18px_rgba(8,123,255,0.45)]'
                  : 'bg-[#102B46]/80 hover:bg-[#102B46] border border-[#00D5FF]/25 text-slate-300 hover:text-white'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Security Alerts List (Matches Screen 8 of Reference Image 3) */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-2xl bg-[#071D35] border border-[#00D5FF]/20 p-10 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#00E676] mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">
              No Alerts in "{filter}" Category
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Your SmartBike Secure system has not recorded any events matching this filter.
            </p>
          </div>
        ) : (
          filteredAlerts.map((item) => {
            const borderColor =
              item.severity === 'critical'
                ? 'border-[#FF3B4F]/45 hover:border-[#FF3B4F]'
                : item.severity === 'warning'
                ? 'border-[#FFB020]/45 hover:border-[#FFB020]'
                : 'border-[#00E676]/35 hover:border-[#00E676]';

            const severityLabel =
              item.severity === 'critical'
                ? 'Critical Alert'
                : item.severity === 'warning'
                ? 'Warning'
                : 'Verified Event';

            const severityTextClass =
              item.severity === 'critical'
                ? 'text-[#FF3B4F]'
                : item.severity === 'warning'
                ? 'text-[#FFB020]'
                : 'text-[#00E676]';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedAlert(item)}
                className={`rounded-2xl bg-[#102B46]/85 hover:bg-[#133353] border ${borderColor} p-4 sm:p-5 flex items-center justify-between gap-4 transition-all cursor-pointer`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {renderAlertIcon(item)}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {item.title}
                      </h3>
                      <span className={`text-xs font-semibold ${severityTextClass}`}>
                        · {severityLabel}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="text-xs font-mono-tabular text-slate-400 mt-1">
                      {item.timestamp} · {item.location}
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
              </div>
            );
          })
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#071D35] border border-[#00D5FF]/45 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3.5">
              {renderAlertIcon(selectedAlert)}
              <div>
                <span className="text-xs font-semibold text-[#00D5FF]">
                  {selectedAlert.category} Telemetry Log
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedAlert.title}
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#102B46]/80 border border-white/10 space-y-2 text-xs sm:text-sm">
              <p className="text-slate-200 leading-relaxed">
                {selectedAlert.description}
              </p>
              <div className="pt-2 border-t border-white/10 flex justify-between text-xs">
                <span className="text-slate-400">Timestamp</span>
                <span className="font-mono-tabular text-white">
                  {selectedAlert.timestamp}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">GPS Coordinates</span>
                <span className="text-white">{selectedAlert.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              {!selectedAlert.acknowledged && (
                <button
                  type="button"
                  onClick={() => {
                    onAcknowledgeAlert(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#00E676] text-[#031326] font-bold text-sm cursor-pointer"
                >
                  Mark Acknowledged
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#102B46] hover:bg-[#16395C] text-white font-semibold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
