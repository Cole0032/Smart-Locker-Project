import React from 'react';
import { Lock, Unlock, Fingerprint } from 'lucide-react';

interface ShieldProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SmartBikeShieldLogo: React.FC<ShieldProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-10 h-11',
    md: 'w-20 h-22',
    lg: 'w-28 h-32',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${dimensions} ${className}`}>
      {/* Outer ambient neon glow */}
      <div className="absolute inset-0 rounded-full bg-[#00D5FF]/20 blur-xl pointer-events-none" />
      <svg
        viewBox="0 0 120 136"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_14px_rgba(0,213,255,0.45)]"
      >
        <defs>
          <linearGradient id="shieldBorderGrad" x1="60" y1="4" x2="60" y2="132" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00EAFF" />
            <stop offset="55%" stopColor="#00A3FF" />
            <stop offset="100%" stopColor="#0858FF" />
          </linearGradient>
          <linearGradient id="shieldFillGrad" x1="60" y1="8" x2="60" y2="128" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#072242" />
            <stop offset="100%" stopColor="#021022" />
          </linearGradient>
        </defs>

        {/* Shield Path */}
        <path
          d="M60 6L12 24V62C12 95.5 32.6 119.8 60 130C87.4 119.8 108 95.5 108 62V24L60 6Z"
          fill="url(#shieldFillGrad)"
          stroke="url(#shieldBorderGrad)"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />

        {/* Bicycle Silhouette inside Shield */}
        {/* Left Wheel */}
        <circle cx="38" cy="64" r="13.5" stroke="#FFFFFF" strokeWidth="3.8" />
        {/* Right Wheel */}
        <circle cx="82" cy="64" r="13.5" stroke="#FFFFFF" strokeWidth="3.8" />
        {/* Frame */}
        <path
          d="M38 64L52 43H74L58 64H38Z"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M58 64L49 40M44 40H54"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M82 64L72 37H66M72 37L77 34"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom Padlock Icon inside Shield */}
        <rect x="51" y="92" width="18" height="15" rx="3" fill="#00D5FF" />
        <path
          d="M55 92V87C55 84.2386 57.2386 82 60 82C62.7614 82 65 84.2386 65 87V92"
          stroke="#00D5FF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="60" cy="98.5" r="1.8" fill="#031326" />
        <path d="M60 100V103.5" stroke="#031326" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  align?: 'center' | 'left';
}

export const SmartBikeWordmark: React.FC<WordmarkProps> = ({
  size = 'md',
  subtitle,
  align = 'center',
}) => {
  const titleClasses = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-3xl sm:text-4xl',
    lg: 'text-4xl sm:text-5xl',
  }[size];

  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      <div className={`font-extrabold italic tracking-tight leading-none ${titleClasses}`}>
        <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">SmartBike </span>
        <span className="bg-gradient-to-r from-[#00EAFF] via-[#00D5FF] to-[#087BFF] bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(0,213,255,0.35)]">
          Secure
        </span>
      </div>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-slate-200/90 font-medium max-w-md mx-auto leading-snug">
          {subtitle}
        </p>
      )}
    </div>
  );
};

interface SegmentedBarProps {
  percentage: number;
  segments?: number;
  color?: 'green' | 'cyan' | 'orange';
}

export const SegmentedChargeBar: React.FC<SegmentedBarProps> = ({
  percentage,
  segments = 10,
  color = 'green',
}) => {
  const activeCount = Math.round((Math.max(0, Math.min(100, percentage)) / 100) * segments);
  const activeColor = {
    green: 'bg-[#00E676] shadow-[0_0_8px_rgba(0,230,118,0.65)]',
    cyan: 'bg-[#00D5FF] shadow-[0_0_8px_rgba(0,213,255,0.65)]',
    orange: 'bg-[#FFB020] shadow-[0_0_8px_rgba(255,176,32,0.65)]',
  }[color];

  return (
    <div className="flex items-center gap-1" aria-label={`Charge level ${percentage}%`}>
      {Array.from({ length: segments }).map((_, idx) => {
        const isActive = idx < activeCount;
        return (
          <span
            key={idx}
            className={`inline-block h-3.5 w-2 -skew-x-12 rounded-[2px] transition-all duration-300 ${
              isActive ? activeColor : 'bg-slate-700/60'
            }`}
          />
        );
      })}
    </div>
  );
};

interface InteractiveBikeProps {
  isLocked: boolean;
  solarActive?: boolean;
  dynamoActive?: boolean;
  theftAlert?: boolean;
  compact?: boolean;
  onToggleLock?: () => void;
}

export const InteractiveBikeIllustration: React.FC<InteractiveBikeProps> = ({
  isLocked,
  solarActive = true,
  dynamoActive = true,
  theftAlert = false,
  compact = false,
  onToggleLock,
}) => {
  return (
    <div className={`relative w-full flex flex-col items-center justify-center select-none ${compact ? 'py-2' : 'py-4'}`}>
      {/* Neon Horizon & Curved Light Arcs matching Welcome Page Reference */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl transition-colors duration-500 ${
            theftAlert
              ? 'bg-[#FF3B4F]/30'
              : isLocked
              ? 'bg-[#00D5FF]/25'
              : 'bg-[#00E676]/25'
          }`}
        />
        {/* Ground reflection line */}
        <div className="absolute bottom-3 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#00D5FF]/80 to-transparent shadow-[0_0_16px_#00D5FF]" />
      </div>

      {/* Main High-Precision Smart Bicycle SVG */}
      <div className="relative z-10 w-full max-w-[430px] px-2">
        <svg
          viewBox="0 0 500 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-[0_8px_24px_rgba(0,213,255,0.28)]"
        >
          <defs>
            <linearGradient id="neonFrame" x1="100" y1="60" x2="400" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E3A5F" />
              <stop offset="50%" stopColor="#0F2540" />
              <stop offset="100%" stopColor="#081629" />
            </linearGradient>
            <linearGradient id="cyanRim" x1="0" y1="0" x2="500" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00EAFF" />
              <stop offset="100%" stopColor="#087BFF" />
            </linearGradient>
            <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
              <stop offset="65%" stopColor="#00D5FF" stopOpacity="0" />
              <stop offset="100%" stopColor="#00D5FF" stopOpacity="0.35" />
            </radialGradient>
          </defs>

          {/* Background Neon Swooshes */}
          <path
            d="M15 70 Q 140 165 250 155 T 485 85"
            stroke="#00D5FF"
            strokeOpacity="0.35"
            strokeWidth="2"
            fill="none"
          />

          {/* Ground Contact Glows under Tires */}
          <ellipse cx="115" cy="248" rx="52" ry="7" fill="#00D5FF" fillOpacity="0.38" />
          <ellipse cx="385" cy="248" rx="52" ry="7" fill="#00D5FF" fillOpacity="0.38" />

          {/* Rear Wheel (Left) */}
          <g>
            <circle cx="115" cy="182" r="64" fill="url(#wheelGlow)" />
            <circle cx="115" cy="182" r="62" stroke="#0B192C" strokeWidth="11" />
            <circle cx="115" cy="182" r="56" stroke="#00D5FF" strokeWidth="2" strokeOpacity="0.75" />
            <circle cx="115" cy="182" r="49" stroke="#334155" strokeWidth="1.2" strokeDasharray="6 8" />
            {/* Spokes */}
            <g stroke="#64748B" strokeWidth="1" strokeOpacity="0.55">
              <line x1="115" y1="126" x2="115" y2="238" />
              <line x1="59" y1="182" x2="171" y2="182" />
              <line x1="75" y1="142" x2="155" y2="222" />
              <line x1="155" y1="142" x2="75" y2="222" />
            </g>
            <circle cx="115" cy="182" r="11" fill="#0F2942" stroke="#00D5FF" strokeWidth="2.5" />
          </g>

          {/* Front Wheel (Right) with Hub Dynamo */}
          <g>
            <circle cx="385" cy="182" r="64" fill="url(#wheelGlow)" />
            <circle cx="385" cy="182" r="62" stroke="#0B192C" strokeWidth="11" />
            <circle cx="385" cy="182" r="56" stroke="#00D5FF" strokeWidth="2" strokeOpacity="0.75" />
            <circle cx="385" cy="182" r="49" stroke="#334155" strokeWidth="1.2" strokeDasharray="6 8" />
            {/* Spokes */}
            <g stroke="#64748B" strokeWidth="1" strokeOpacity="0.55">
              <line x1="385" y1="126" x2="385" y2="238" />
              <line x1="329" y1="182" x2="441" y2="182" />
              <line x1="345" y1="142" x2="425" y2="222" />
              <line x1="425" y1="142" x2="345" y2="222" />
            </g>
            {/* Front Hub Dynamo Core */}
            <circle
              cx="385"
              cy="182"
              r="14"
              fill="#071D35"
              stroke={dynamoActive ? '#00E676' : '#00D5FF'}
              strokeWidth="3"
            />
            {dynamoActive && (
              <circle cx="385" cy="182" r="6" fill="#00E676" />
            )}
          </g>

          {/* Rear Mudguard & Solar Rack */}
          <path
            d="M52 162 A 68 68 0 0 1 162 132"
            stroke="#1E3A5F"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Rear Solar Carrier Deck */}
          <path
            d="M90 122 H178 L195 152 M115 182 L106 122"
            stroke="#00D5FF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Solar Panel Module on Rear Rack */}
          <rect
            x="84"
            y="113"
            width="78"
            height="9"
            rx="3"
            fill="#072242"
            stroke={solarActive ? '#FFB020' : '#00D5FF'}
            strokeWidth="2"
          />

          {/* Glowing Red Tail Light (matches Reference Image 1) */}
          <circle
            cx="65"
            cy="142"
            r="6"
            fill="#FF3B4F"
            className={theftAlert ? 'animate-ping' : ''}
          />
          <circle cx="65" cy="142" r="4" fill="#FF6B7A" />

          {/* Bicycle Main Frame */}
          {/* Chainstay & Seatstay */}
          <path
            d="M115 182 L228 184 L192 98 L115 182 Z"
            stroke="url(#cyanRim)"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Main Triangle (Top tube, Down tube, Seat tube) */}
          <path
            d="M192 98 L338 84 L228 184 Z"
            fill="#061529"
            fillOpacity="0.45"
            stroke="#163558"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          {/* Neon Cyan Highlight on Top & Down Tube */}
          <path
            d="M192 98 L338 84 L228 184"
            stroke="#00D5FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Front Fork & Handlebars */}
          <path
            d="M385 182 L332 64 L316 54 H348"
            stroke="#1E3A5F"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M385 182 L334 68"
            stroke="#00D5FF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Seat Post & Ergonomic Saddle */}
          <path d="M192 98 L183 68" stroke="#1E3A5F" strokeWidth="6.5" strokeLinecap="round" />
          <path
            d="M158 66 C165 59, 198 61, 212 67 C200 73, 170 74, 158 66 Z"
            fill="#0B1D33"
            stroke="#00D5FF"
            strokeWidth="2"
          />

          {/* Crankset & Pedals */}
          <circle cx="228" cy="184" r="16" fill="#071D35" stroke="#00D5FF" strokeWidth="2.8" />
          <circle cx="228" cy="184" r="7" fill="#102B46" />
          <line x1="228" y1="184" x2="255" y2="194" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

          {/* Center Frame Smart Biometric Padlock Unit (Exact match to Welcome Page Reference) */}
          <g
            onClick={onToggleLock}
            className={onToggleLock ? 'cursor-pointer' : ''}
          >
            {/* Shackle */}
            <path
              d={
                isLocked
                  ? 'M243 121 V107 C243 98.5 267 98.5 267 107 V121'
                  : 'M243 114 V101 C243 92.5 267 92.5 267 101 V105'
              }
              stroke={theftAlert ? '#FF3B4F' : isLocked ? '#00D5FF' : '#00E676'}
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            {/* Lock Body */}
            <rect
              x="233"
              y="119"
              width="44"
              height="48"
              rx="10"
              fill="#051426"
              stroke={theftAlert ? '#FF3B4F' : isLocked ? '#00D5FF' : '#00E676'}
              strokeWidth="3"
            />
            {/* Glowing Fingerprint Ring inside Lock Body */}
            <circle
              cx="255"
              cy="143"
              r="13"
              fill="#072242"
              stroke={theftAlert ? '#FF3B4F' : isLocked ? '#00D5FF' : '#00E676'}
              strokeWidth="1.8"
            />
            <path
              d="M250 146 C250 139 260 139 260 146 M247 143 C247 134 263 134 263 143 M253 148 V142 C253 140.5 257 140.5 257 142 V148"
              stroke={theftAlert ? '#FF3B4F' : isLocked ? '#00EAFF' : '#00E676'}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

interface CircularDashboardGaugeProps {
  isLocked: boolean;
  theftAlert: boolean;
  onActionClick: () => void;
}

export const DashboardCenterLockOrb: React.FC<CircularDashboardGaugeProps> = ({
  isLocked,
  theftAlert,
  onActionClick,
}) => {
  const ringColor = theftAlert
    ? 'border-[#FF3B4F] shadow-[0_0_36px_rgba(255,59,79,0.5)]'
    : isLocked
    ? 'border-[#00D5FF] shadow-[0_0_36px_rgba(0,213,255,0.42)]'
    : 'border-[#00E676] shadow-[0_0_36px_rgba(0,230,118,0.42)]';

  return (
    <div className="relative flex flex-col items-center justify-center py-2">
      {/* Outer glowing orb (Matches Screen 4 of Reference Image 3) */}
      <button
        type="button"
        onClick={onActionClick}
        className={`group relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-[#0C2B4E] to-[#041428] border-4 ${ringColor} flex flex-col items-center justify-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none`}
        title={isLocked ? 'Click to authenticate & unlock' : 'Click to lock bicycle'}
      >
        {/* Subtle inner ring */}
        <div className="absolute inset-2.5 rounded-full border border-[#00D5FF]/25 pointer-events-none" />

        {/* Bicycle Vector Icon inside Orb */}
        <svg
          viewBox="0 0 120 75"
          fill="none"
          className="w-28 h-20 sm:w-32 sm:h-24 mb-4 drop-shadow-[0_0_10px_rgba(0,213,255,0.4)]"
        >
          <circle cx="28" cy="48" r="16" stroke="#FFFFFF" strokeWidth="3.5" />
          <circle cx="92" cy="48" r="16" stroke="#FFFFFF" strokeWidth="3.5" />
          <path
            d="M28 48L46 24H76L56 48H28Z"
            stroke="#00D5FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M56 48L43 19M38 19H49"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M92 48L78 16H70"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Overlapping Status Button at bottom of Orb (Matches Screen 4 in Reference Image 3) */}
        <div
          className={`absolute -bottom-3.5 px-5 py-1.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transition-colors ${
            theftAlert
              ? 'bg-[#FF3B4F] text-white shadow-[#FF3B4F]/40'
              : isLocked
              ? 'bg-[#00E676] text-[#031326] shadow-[#00E676]/40'
              : 'bg-[#FFB020] text-[#031326] shadow-[#FFB020]/40'
          }`}
        >
          {isLocked ? <Lock className="w-4 h-4 stroke-[2.5]" /> : <Unlock className="w-4 h-4 stroke-[2.5]" />}
          <span>{theftAlert ? 'Alarm Active' : isLocked ? 'Locked' : 'Unlocked'}</span>
        </div>
      </button>

      <p className="mt-6 text-sm font-semibold text-slate-200">
        {theftAlert
          ? 'Security Breach Detected — Alarm Triggered'
          : isLocked
          ? 'Bicycle is Secured'
          : 'Bicycle Unlocked — Ready to Ride'}
      </p>
    </div>
  );
};
