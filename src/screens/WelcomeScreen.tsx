import React, { useState } from 'react';
import {
  Fingerprint,
  MapPin,
  Lock,
  ArrowRight,
  Globe,
  ChevronDown,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { LanguageCode, ScreenId } from '../types/smartbike';
import { LANGUAGE_LABELS, UI_STRINGS } from '../data/initialState';
import {
  SmartBikeShieldLogo,
  SmartBikeWordmark,
  InteractiveBikeIllustration,
} from '../components/BrandVisuals';

interface WelcomeScreenProps {
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onGetStarted: () => void;
  onLogin: () => void;
  onQuickExploreDemo: (target?: ScreenId) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  onSelectLanguage,
  onGetStarted,
  onLogin,
  onQuickExploreDemo,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = UI_STRINGS[language];

  const features = [
    {
      id: 'power' as ScreenId,
      title: 'Self-Charging',
      subtitle: '(Solar + Dynamo)',
      icon: (
        <div className="relative flex flex-col items-center">
          <Sun className="w-4 h-4 text-[#FFB020] -mb-0.5" />
          <svg viewBox="0 0 36 22" className="w-8 h-5" fill="none">
            <path
              d="M6 2H30L34 20H2L6 2Z"
              fill="#087BFF"
              fillOpacity="0.25"
              stroke="#00D5FF"
              strokeWidth="2"
            />
            <line x1="12" y1="2" x2="10" y2="20" stroke="#00D5FF" strokeWidth="1.5" />
            <line x1="24" y1="2" x2="26" y2="20" stroke="#00D5FF" strokeWidth="1.5" />
            <line x1="4" y1="11" x2="32" y2="11" stroke="#00D5FF" strokeWidth="1.5" />
          </svg>
        </div>
      ),
    },
    {
      id: 'biometric' as ScreenId,
      title: 'Biometric',
      subtitle: 'Access',
      icon: <Fingerprint className="w-8 h-8 text-[#00D5FF]" />,
    },
    {
      id: 'gps' as ScreenId,
      title: 'GPS',
      subtitle: 'Tracking',
      icon: <MapPin className="w-8 h-8 text-[#00D5FF]" />,
    },
    {
      id: 'alerts' as ScreenId,
      title: 'Theft Alert',
      subtitle: '& Geofence',
      icon: <Lock className="w-8 h-8 text-[#00D5FF]" />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#031326] text-white flex flex-col justify-between relative overflow-hidden px-4 py-8 sm:py-10">
      {/* Ambient Radial Neon Backlight */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[620px] h-[420px] rounded-full bg-[#087BFF]/15 blur-[110px]" />
        <div className="absolute top-[34%] left-1/2 -translate-x-1/2 w-[540px] h-[340px] rounded-full bg-[#00D5FF]/15 blur-[95px]" />
      </div>

      {/* Main Centered Welcome Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center my-auto">
        {/* Top Shield Logo */}
        <SmartBikeShieldLogo size="lg" className="mb-3" />

        {/* Project Title & Subtitle */}
        <SmartBikeWordmark size="lg" subtitle={t.subtitle} />

        {/* Interactive Hero Bicycle Illustration */}
        <div className="w-full my-2">
          <InteractiveBikeIllustration isLocked={true} solarActive={true} dynamoActive={true} />
        </div>

        {/* 4 Feature Cards Grid (Matches uploaded Welcome Page reference) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-2 mb-7">
          {features.map((feat) => (
            <button
              key={feat.title}
              type="button"
              onClick={() => onQuickExploreDemo(feat.id)}
              className="group flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-[#071D35]/90 border border-[#00D5FF]/30 hover:border-[#00D5FF] hover:bg-[#102B46] shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 focus:outline-none"
            >
              <div className="h-10 flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-110">
                {feat.icon}
              </div>
              <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                {feat.title}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 leading-tight mt-0.5">
                {feat.subtitle}
              </span>
            </button>
          ))}
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div className="w-full max-w-md space-y-3.5">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#00EAFF] via-[#00B4FF] to-[#087BFF] hover:brightness-110 text-white font-bold text-base sm:text-lg shadow-[0_0_25px_rgba(0,213,255,0.45)] flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            <span>{t.getStarted}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={onLogin}
            className="w-full py-3.5 px-6 rounded-full bg-[#071D35]/80 hover:bg-[#102B46] border border-[#00D5FF]/55 hover:border-[#00D5FF] text-white font-bold text-base sm:text-lg shadow-[0_0_15px_rgba(0,213,255,0.15)] transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            {t.login}
          </button>
        </div>

        {/* Language Selector Dropdown Pill + Instant Prototype Launch */}
        <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              className="px-5 py-2.5 rounded-full bg-[#071D35]/90 border border-[#00D5FF]/35 hover:border-[#00D5FF] flex items-center gap-3 text-sm font-medium text-slate-100 transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#00D5FF]" />
              <span>Language: {LANGUAGE_LABELS[language].name}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-300 transition-transform ${
                  langMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {langMenuOpen && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 rounded-2xl bg-[#071D35] border border-[#00D5FF]/40 shadow-2xl py-1.5 z-30">
                {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      onSelectLanguage(code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs sm:text-sm flex items-center justify-between hover:bg-[#102B46] transition-colors ${
                      language === code ? 'text-[#00D5FF] font-bold bg-[#102B46]/60' : 'text-slate-200'
                    }`}
                  >
                    <span>{LANGUAGE_LABELS[code].name}</span>
                    <span className="text-xs text-slate-400">{LANGUAGE_LABELS[code].native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onQuickExploreDemo('dashboard')}
            className="px-4 py-2.5 rounded-full bg-[#102B46]/70 hover:bg-[#102B46] border border-[#00E676]/40 text-xs font-semibold text-[#00E676] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Instant Demo Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
