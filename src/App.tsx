import React, { useState, useEffect } from 'react';
import {
  Home,
  MapPin,
  Zap,
  ShieldAlert,
  Clock,
  Fingerprint,
  KeyRound,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Globe,
  Sparkles,
  LogOut,
} from 'lucide-react';
import {
  BikeSystemState,
  LanguageCode,
  ScreenId,
  UserProfile,
} from './types/smartbike';
import {
  INITIAL_BIKE_STATE,
  LANGUAGE_LABELS,
  UI_STRINGS,
} from './data/initialState';
import { SmartBikeShieldLogo } from './components/BrandVisuals';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { BiometricScreen } from './screens/BiometricScreen';
import { GpsTrackingScreen } from './screens/GpsTrackingScreen';
import { SecurityAlertsScreen } from './screens/SecurityAlertsScreen';
import { PowerChargingScreen } from './screens/PowerChargingScreen';
import { AccessManagementScreen } from './screens/AccessManagementScreen';
import { ActivityHistoryScreen } from './screens/ActivityHistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const STORAGE_KEY = 'smartbike_secure_state_v1';

export default function App() {
  const [state, setState] = useState<BikeSystemState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_BIKE_STATE, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_BIKE_STATE;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() =>
    state.isAuthenticated ? 'dashboard' : 'welcome'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    title: string;
    type: 'success' | 'warning' | 'danger';
  } | null>(null);

  // Save state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [state]);

  const showToast = (
    title: string,
    type: 'success' | 'warning' | 'danger' = 'success'
  ) => {
    setToast({ title, type });
    setTimeout(() => {
      setToast((prev) => (prev?.title === title ? null : prev));
    }, 3200);
  };

  const nowTimeStr = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const todayDateStr = () => new Date().toISOString().slice(0, 10);

  // Handlers
  const handleSelectLanguage = (language: LanguageCode) => {
    setState((prev) => ({ ...prev, language }));
    showToast(`Language changed to ${LANGUAGE_LABELS[language].name}`, 'success');
  };

  const handleLoginSuccess = (userUpdates?: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: userUpdates ? { ...prev.user, ...userUpdates } : prev.user,
    }));
    setCurrentScreen('dashboard');
    showToast('Welcome to SmartBike Secure Dashboard', 'success');
  };

  const handleLockBike = () => {
    const time = nowTimeStr();
    setState((prev) => ({
      ...prev,
      isLocked: true,
      unlockSuccessModalOpen: false,
      activeTheftAlert: false,
      alerts: [
        {
          id: `alt-${Date.now()}`,
          type: 'locked',
          category: 'Access',
          title: 'Bicycle Locked',
          description: 'Solenoid deadbolt engaged and geofence armed.',
          timestamp: `Today, ${time}`,
          severity: 'success',
          location: prev.bikeLocation.label,
          acknowledged: true,
        },
        ...prev.alerts,
      ],
      activities: [
        {
          id: `act-${Date.now()}`,
          category: 'locked',
          title: 'Bicycle Locked',
          subtitle: `Solenoid deadbolt engaged at ${prev.bikeLocation.label}`,
          timestamp: time,
          dateStr: todayDateStr(),
          period: 'Today',
        },
        ...prev.activities,
      ],
    }));
    showToast('Bicycle Locked & Protected', 'success');
  };

  const handleUnlockBike = (
    method: 'Fingerprint' | 'PIN' | 'Manual Key' | 'Dashboard Control' = 'Dashboard Control',
    detail = 'Authorized Owner Command'
  ) => {
    const time = nowTimeStr();
    setState((prev) => ({
      ...prev,
      isLocked: false,
      activeTheftAlert: false,
      lastUnlockMethod: method,
      unlockSuccessModalOpen: currentScreen === 'dashboard',
      alerts: [
        {
          id: `alt-${Date.now()}`,
          type: 'unlocked',
          category: 'Access',
          title: 'Bicycle Unlocked',
          description: `Verified via ${method} (${detail}).`,
          timestamp: `Today, ${time}`,
          severity: 'success',
          location: prev.bikeLocation.label,
          acknowledged: true,
        },
        ...prev.alerts,
      ],
      activities: [
        {
          id: `act-${Date.now()}-1`,
          category: 'unlocked',
          title: 'Bicycle Unlocked',
          subtitle: `Deadbolt disengaged via ${method} (${detail})`,
          timestamp: time,
          dateStr: todayDateStr(),
          period: 'Today',
        },
        {
          id: `act-${Date.now()}-2`,
          category: 'auth_success',
          title: 'Authentication Successful',
          subtitle: `${method} verified (${detail})`,
          timestamp: time,
          dateStr: todayDateStr(),
          period: 'Today',
        },
        ...prev.activities,
      ],
    }));
    showToast(`Bicycle Unlocked via ${method}`, 'success');
  };

  const handleAuthFailure = (reason: string) => {
    const time = nowTimeStr();
    setState((prev) => ({
      ...prev,
      alerts: [
        {
          id: `alt-${Date.now()}`,
          type: 'unauthorized',
          category: 'Access',
          title: 'Unauthorized Access Attempt',
          description: reason,
          timestamp: `Today, ${time}`,
          severity: 'critical',
          location: prev.bikeLocation.label,
          acknowledged: false,
        },
        ...prev.alerts,
      ],
      activities: [
        {
          id: `act-${Date.now()}`,
          category: 'auth_fail',
          title: 'Unauthorized Access Attempt',
          subtitle: reason,
          timestamp: time,
          dateStr: todayDateStr(),
          period: 'Today',
        },
        ...prev.activities,
      ],
    }));
    showToast('Access Denied — Security Alert Logged', 'danger');
  };

  const handleSimulateTheftAlert = () => {
    const time = nowTimeStr();
    setState((prev) => ({
      ...prev,
      isLocked: true,
      activeTheftAlert: true,
      alerts: [
        {
          id: `alt-${Date.now()}`,
          type: 'unauthorized',
          category: 'Access',
          title: 'Unauthorized Access Attempt & Theft Alert',
          description:
            'Forced lock tampering & high-G frame vibration detected! 115 dB siren activated.',
          timestamp: `Today, ${time}`,
          severity: 'critical',
          location: `${prev.bikeLocation.label} (${prev.bikeLocation.lat.toFixed(4)}° N, ${prev.bikeLocation.lng.toFixed(4)}° E)`,
          acknowledged: false,
        },
        ...prev.alerts,
      ],
      activities: [
        {
          id: `act-${Date.now()}`,
          category: 'auth_fail',
          title: 'Unauthorized Access Attempt',
          subtitle: 'Theft alarm siren triggered by forced vibration & lock tamper',
          timestamp: time,
          dateStr: todayDateStr(),
          period: 'Today',
        },
        ...prev.activities,
      ],
    }));
    showToast('CRITICAL: Theft Alert Triggered!', 'danger');
  };

  const handleSimulateMovementAlert = () => {
    const time = nowTimeStr();
    setState((prev) => ({
      ...prev,
      alerts: [
        {
          id: `alt-${Date.now()}`,
          type: 'movement',
          category: 'Movement',
          title: 'Bicycle Movement Detected',
          description:
            'MPU6050 accelerometer detected 22° frame tilt while parked.',
          timestamp: `Today, ${time}`,
          severity: 'warning',
          location: prev.bikeLocation.label,
          acknowledged: false,
        },
        ...prev.alerts,
      ],
    }));
    showToast('Warning: Bicycle Movement Detected', 'warning');
  };

  const handleClearTheftAlert = () => {
    setState((prev) => ({
      ...prev,
      activeTheftAlert: false,
      alerts: prev.alerts.map((a) => ({ ...a, acknowledged: true })),
    }));
    showToast('Alarm Silenced & Alerts Acknowledged', 'success');
  };

  const handleUpdateBikeLocation = (
    lat: number,
    lng: number,
    label: string,
    outsideGeofence: boolean
  ) => {
    const time = nowTimeStr();
    setState((prev) => {
      const nextAlerts =
        outsideGeofence && prev.geofenceEnabled
          ? [
              {
                id: `alt-${Date.now()}`,
                type: 'geofence' as const,
                category: 'Geofence' as const,
                title: 'Geofence Exit Alert',
                description: `Bicycle crossed outside the ${prev.geofenceRadiusM}m safe zone perimeter at ${label}.`,
                timestamp: `Today, ${time}`,
                severity: 'critical' as const,
                location: `${label} (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
                acknowledged: false,
              },
              ...prev.alerts,
            ]
          : prev.alerts;

      return {
        ...prev,
        bikeLocation: {
          lat,
          lng,
          label,
          updatedAt: time,
        },
        isOutsideGeofence: outsideGeofence,
        activeTheftAlert:
          outsideGeofence && prev.geofenceEnabled ? true : prev.activeTheftAlert,
        alerts: nextAlerts,
        activities: [
          {
            id: `act-${Date.now()}`,
            category: 'gps',
            title: 'GPS Location Updated',
            subtitle: `${label} (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
            timestamp: time,
            dateStr: todayDateStr(),
            period: 'Today',
          },
          ...prev.activities,
        ],
      };
    });

    if (outsideGeofence) {
      showToast('GEOFENCE BREACH: Bicycle Left Safe Zone!', 'danger');
    } else {
      showToast('GPS Coordinates Synced', 'success');
    }
  };

  const handleSimulateChargePulse = (source: 'solar' | 'dynamo' | 'combined') => {
    const time = nowTimeStr();
    const boostPct = source === 'combined' ? 5 : 3;
    setState((prev) => {
      const nextPct = Math.min(100, prev.batteryPct + boostPct);
      const nextHistory = [
        ...prev.powerHistory.slice(1),
        {
          time,
          batteryPct: nextPct,
          solarMa: prev.solarActive ? prev.solarCurrentMa : 0,
          dynamoMa: prev.dynamoActive ? prev.dynamoCurrentMa : 0,
          totalMa:
            (prev.solarActive ? prev.solarCurrentMa : 0) +
            (prev.dynamoActive ? prev.dynamoCurrentMa : 0),
          wattHours: 9.8,
        },
      ];

      return {
        ...prev,
        batteryPct: nextPct,
        powerHistory: nextHistory,
        activities: [
          {
            id: `act-${Date.now()}`,
            category: source === 'solar' ? 'solar' : 'dynamo',
            title:
              source === 'solar'
                ? 'Solar Charging'
                : source === 'dynamo'
                ? 'Dynamo Charging'
                : 'Solar + Dynamo Hybrid Charge',
            subtitle:
              source === 'solar'
                ? `Solar panel harvested +${prev.solarCurrentMa} mA`
                : `Front wheel dynamo harvested +${prev.dynamoCurrentMa} mA`,
            timestamp: time,
            dateStr: todayDateStr(),
            period: 'Today',
            deltaText: `+${boostPct}% (${time})`,
          },
          ...prev.activities,
        ],
      };
    });
    showToast(`Battery Charged +${boostPct}% (${source.toUpperCase()})`, 'success');
  };

  const t = UI_STRINGS[state.language];
  const unacknowledgedCount = state.alerts.filter((a) => !a.acknowledged).length;

  // Full-screen Welcome and Auth screens
  if (currentScreen === 'welcome') {
    return (
      <WelcomeScreen
        language={state.language}
        onSelectLanguage={handleSelectLanguage}
        onGetStarted={() => {
          setState((prev) => ({ ...prev, authTab: 'register' }));
          setCurrentScreen('auth');
        }}
        onLogin={() => {
          setState((prev) => ({ ...prev, authTab: 'login' }));
          setCurrentScreen('auth');
        }}
        onQuickExploreDemo={(target = 'dashboard') => {
          setState((prev) => ({ ...prev, isAuthenticated: true }));
          setCurrentScreen(target);
        }}
      />
    );
  }

  if (currentScreen === 'auth') {
    return (
      <AuthScreen
        initialTab={state.authTab}
        language={state.language}
        currentUser={state.user}
        onBack={() => setCurrentScreen('welcome')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  const navItems: { id: ScreenId; label: string; shortLabel: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: t.dashboard,
      shortLabel: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'biometric',
      label: t.biometric,
      shortLabel: 'Biometric',
      icon: <Fingerprint className="w-5 h-5" />,
    },
    {
      id: 'gps',
      label: t.gpsTracking,
      shortLabel: 'Map',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      id: 'power',
      label: t.powerCharging,
      shortLabel: 'Power',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: 'alerts',
      label: t.securityAlerts,
      shortLabel: 'Alerts',
      icon: <ShieldAlert className="w-5 h-5" />,
      badge: unacknowledgedCount,
    },
    {
      id: 'history',
      label: t.activityHistory,
      shortLabel: 'Activity',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: 'access',
      label: t.accessManagement,
      shortLabel: 'Access',
      icon: <KeyRound className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: t.settings,
      shortLabel: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#031326] text-white flex flex-col md:flex-row">
      {/* DESKTOP COLLAPSIBLE LEFT SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-[#071D35] border-r border-[#00D5FF]/20 shrink-0 transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-18 px-4 flex items-center justify-between border-b border-white/10">
            <button
              type="button"
              onClick={() => setCurrentScreen('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer overflow-hidden"
            >
              <SmartBikeShieldLogo size="sm" className="shrink-0" />
              {!sidebarCollapsed && (
                <div className="leading-tight truncate">
                  <div className="font-extrabold italic text-base tracking-tight">
                    <span className="text-white">SmartBike </span>
                    <span className="text-[#00D5FF]">Secure</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    IoT Security System
                  </div>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="p-1.5 rounded-lg bg-[#102B46]/80 hover:bg-[#102B46] text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Sidebar"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentScreen(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#087BFF] to-[#00B4FF] text-white shadow-[0_0_18px_rgba(8,123,255,0.4)]'
                      : 'text-slate-300 hover:text-white hover:bg-[#102B46]/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    {!sidebarCollapsed && (
                      <span className="truncate whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </div>
                  {!sidebarCollapsed && item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#FF3B4F] text-white font-mono-tabular text-[11px] font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Quick Welcome Screen & Lock Status */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => setCurrentScreen('welcome')}
            className="w-full px-3 py-2 rounded-xl bg-[#102B46]/60 hover:bg-[#102B46] border border-[#00D5FF]/25 text-xs font-semibold text-[#00D5FF] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Welcome Splash Page</span>}
          </button>

          <button
            type="button"
            onClick={() => {
              setState((prev) => ({ ...prev, isAuthenticated: false }));
              setCurrentScreen('welcome');
            }}
            className="w-full px-3 py-2 rounded-xl bg-[#2A0E1B]/70 hover:bg-[#2A0E1B] border border-[#FF3B4F]/35 text-xs font-semibold text-[#FF6B7A] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* TOP HEADER BAR (Matches Screen 4 of Reference Image 3) */}
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 bg-[#031326]/90 backdrop-blur-md border-b border-[#00D5FF]/20 flex items-center justify-between gap-4">
          {/* Left: Mobile Logo or Current Section Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setCurrentScreen('welcome')}
              className="md:hidden flex items-center gap-2 cursor-pointer"
            >
              <SmartBikeShieldLogo size="sm" />
            </button>
            <div className="truncate">
              <span className="font-extrabold italic text-lg tracking-tight">
                <span className="text-white">SmartBike </span>
                <span className="text-[#00D5FF]">Secure</span>
              </span>
              <span className="hidden sm:inline-block ml-3 text-xs text-slate-400">
                {t.demoMode}
              </span>
            </div>
          </div>

          {/* Right: Lock Quick Pill, Language Selector, Notifications, Settings & User Avatar */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Lock Status Toggle Button */}
            <button
              type="button"
              onClick={() =>
                state.isLocked
                  ? handleUnlockBike('Dashboard Control')
                  : handleLockBike()
              }
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                state.isLocked
                  ? 'bg-[#00E676]/15 border-[#00E676]/50 text-[#00E676]'
                  : 'bg-[#FFB020]/15 border-[#FFB020]/50 text-[#FFB020]'
              }`}
            >
              {state.isLocked ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
              <span>{state.isLocked ? t.locked : t.unlocked}</span>
            </button>

            {/* Quick Language Selector */}
            <div className="relative hidden sm:flex items-center">
              <Globe className="w-3.5 h-3.5 text-[#00D5FF] absolute left-2.5 pointer-events-none" />
              <select
                value={state.language}
                onChange={(e) =>
                  handleSelectLanguage(e.target.value as LanguageCode)
                }
                aria-label="Language"
                className="pl-7 pr-2.5 py-1.5 rounded-xl bg-[#071D35] border border-[#00D5FF]/30 text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map((code) => (
                  <option key={code} value={code}>
                    {code.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell with Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifPopoverOpen((prev) => !prev)}
                className="relative w-10 h-10 rounded-xl bg-[#071D35] hover:bg-[#102B46] border border-[#00D5FF]/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unacknowledgedCount > 0 && (
                  <span className=" -top-1 -right-1 absolute w-5 h-5 rounded-full bg-[#FF3B4F] text-white text-[10px] font-mono-tabular font-bold flex items-center justify-center">
                    {unacknowledgedCount}
                  </span>
                )}
              </button>

              {notifPopoverOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#071D35] border border-[#00D5FF]/45 shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      Security Notifications
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifPopoverOpen(false);
                        setCurrentScreen('alerts');
                      }}
                      className="text-xs font-semibold text-[#00D5FF] hover:underline cursor-pointer"
                    >
                      Open Alerts
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {state.alerts.slice(0, 4).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setNotifPopoverOpen(false);
                          setCurrentScreen('alerts');
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-[#102B46]/80 hover:bg-[#102B46] border border-white/5 block cursor-pointer"
                      >
                        <div className="text-xs font-bold text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-300 truncate">
                          {item.timestamp} · {item.location}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings Icon */}
            <button
              type="button"
              onClick={() => setCurrentScreen('settings')}
              className="w-10 h-10 rounded-xl bg-[#071D35] hover:bg-[#102B46] border border-[#00D5FF]/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* User Profile Avatar */}
            <button
              type="button"
              onClick={() => setCurrentScreen('settings')}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D5FF] to-[#087BFF] p-0.5 cursor-pointer"
              title={state.user.fullName}
            >
              <div className="w-full h-full rounded-[10px] bg-[#031326] flex items-center justify-center text-xs font-bold text-[#00D5FF]">
                {state.user.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </button>
          </div>
        </header>

        {/* Toast Feedback Banner */}
        {toast && (
          <div className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm px-4 py-3 rounded-2xl bg-[#071D35]/95 border border-[#00D5FF] shadow-[0_0_25px_rgba(0,213,255,0.35)] flex items-center gap-3 text-xs sm:text-sm font-semibold text-white">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                toast.type === 'danger'
                  ? 'bg-[#FF3B4F]'
                  : toast.type === 'warning'
                  ? 'bg-[#FFB020]'
                  : 'bg-[#00E676]'
              }`}
            />
            <span>{toast.title}</span>
          </div>
        )}

        {/* Active Screen Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              state={state}
              onNavigate={setCurrentScreen}
              onLockBike={handleLockBike}
              onUnlockBike={(method) =>
                handleUnlockBike(method, 'Dashboard Action')
              }
              onCloseUnlockModal={() =>
                setState((prev) => ({ ...prev, unlockSuccessModalOpen: false }))
              }
              onSimulateTheftAlert={handleSimulateTheftAlert}
              onClearTheftAlert={handleClearTheftAlert}
              onToggleGeofence={() =>
                setState((prev) => ({
                  ...prev,
                  geofenceEnabled: !prev.geofenceEnabled,
                }))
              }
            />
          )}

          {currentScreen === 'biometric' && (
            <BiometricScreen
              state={state}
              onUnlockSuccess={(method, detail) =>
                handleUnlockBike(method, detail)
              }
              onAuthFailure={handleAuthFailure}
              onLockBike={handleLockBike}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'gps' && (
            <GpsTrackingScreen
              state={state}
              onToggleGeofence={() => {
                setState((prev) => ({
                  ...prev,
                  geofenceEnabled: !prev.geofenceEnabled,
                }));
                showToast(
                  `Geofence ${!state.geofenceEnabled ? 'Enabled' : 'Disabled'}`,
                  'success'
                );
              }}
              onChangeRadius={(geofenceRadiusM) => {
                setState((prev) => ({ ...prev, geofenceRadiusM }));
                showToast(`Safe Zone Radius set to ${geofenceRadiusM} m`, 'success');
              }}
              onUpdateBikeLocation={handleUpdateBikeLocation}
            />
          )}

          {currentScreen === 'alerts' && (
            <SecurityAlertsScreen
              state={state}
              onSimulateTheftAlert={handleSimulateTheftAlert}
              onSimulateMovementAlert={handleSimulateMovementAlert}
              onClearTheftAlert={handleClearTheftAlert}
              onAcknowledgeAlert={(id) =>
                setState((prev) => ({
                  ...prev,
                  alerts: prev.alerts.map((a) =>
                    a.id === id ? { ...a, acknowledged: true } : a
                  ),
                }))
              }
            />
          )}

          {currentScreen === 'power' && (
            <PowerChargingScreen
              state={state}
              onUpdatePowerConfig={(updates) =>
                setState((prev) => ({ ...prev, ...updates }))
              }
              onSimulateChargePulse={handleSimulateChargePulse}
            />
          )}

          {currentScreen === 'access' && (
            <AccessManagementScreen
              state={state}
              onAddFingerprint={(label, finger) => {
                setState((prev) => ({
                  ...prev,
                  fingerprints: [
                    ...prev.fingerprints,
                    {
                      id: `fp-${Date.now()}`,
                      label,
                      finger,
                      enrolledAt: 'Today',
                      lastUsed: 'Just enrolled',
                      isPrimary: false,
                    },
                  ],
                }));
                showToast(`Enrolled "${label}" (${finger})`, 'success');
              }}
              onRemoveFingerprint={(id) => {
                setState((prev) => ({
                  ...prev,
                  fingerprints: prev.fingerprints.filter((f) => f.id !== id),
                }));
                showToast('Fingerprint template removed', 'warning');
              }}
              onUpdatePin={(pinCode) => {
                setState((prev) => ({ ...prev, pinCode }));
                showToast('4-Digit Security PIN Updated', 'success');
              }}
              onUpdateSecuritySettings={(updates) =>
                setState((prev) => ({ ...prev, ...updates }))
              }
            />
          )}

          {currentScreen === 'history' && <ActivityHistoryScreen state={state} />}

          {currentScreen === 'settings' && (
            <SettingsScreen
              state={state}
              onNavigate={setCurrentScreen}
              onUpdateUser={(updates) =>
                setState((prev) => ({
                  ...prev,
                  user: { ...prev.user, ...updates },
                }))
              }
              onSelectLanguage={handleSelectLanguage}
              onUpdatePreferences={(updates) =>
                setState((prev) => ({ ...prev, ...updates }))
              }
              onResetDemoState={() => {
                localStorage.removeItem(STORAGE_KEY);
                setState({ ...INITIAL_BIKE_STATE, isAuthenticated: true });
                showToast('Demo state restored to initial defaults', 'success');
              }}
              onLogout={() => {
                setState((prev) => ({ ...prev, isAuthenticated: false }));
                setCurrentScreen('welcome');
              }}
            />
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#05162B]/95 backdrop-blur-md border-t border-[#00D5FF]/25 px-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentScreen(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer ${
                isActive ? 'text-[#00D5FF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-semibold mt-0.5 whitespace-nowrap">
                {item.shortLabel}
              </span>
              {item.badge && item.badge > 0 ? (
                <span className="top-0.5 right-1 absolute w-2 h-2 rounded-full bg-[#FF3B4F]" />
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
