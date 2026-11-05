import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  BatteryCharging,
  Sun,
  Bike,
  Zap,
  HeartPulse,
  Thermometer,
  Sliders,
  PlusCircle,
  RotateCcw,
} from 'lucide-react';
import { BikeSystemState } from '../types/smartbike';
import { SegmentedChargeBar } from '../components/BrandVisuals';

interface PowerChargingScreenProps {
  state: BikeSystemState;
  onUpdatePowerConfig: (updates: {
    batteryPct?: number;
    solarActive?: boolean;
    solarCurrentMa?: number;
    dynamoActive?: boolean;
    dynamoCurrentMa?: number;
    rideSpeedKmh?: number;
  }) => void;
  onSimulateChargePulse: (source: 'solar' | 'dynamo' | 'combined') => void;
}

export const PowerChargingScreen: React.FC<PowerChargingScreenProps> = ({
  state,
  onUpdatePowerConfig,
  onSimulateChargePulse,
}) => {
  const effectiveSolarMa = state.solarActive ? state.solarCurrentMa : 0;
  const effectiveDynamoMa = state.dynamoActive ? state.dynamoCurrentMa : 0;
  const combinedMa = effectiveSolarMa + effectiveDynamoMa;

  const currentMah = Math.round((state.batteryPct / 100) * state.batteryCapacityMah);
  const remainingMah = state.batteryCapacityMah - currentMah;
  const hoursToFull =
    combinedMa > 0 ? (remainingMah / combinedMa).toFixed(1) : '—';

  const powerSourceLabel =
    state.solarActive && state.dynamoActive
      ? 'Solar + Dynamo'
      : state.solarActive
      ? 'Solar Panel Only'
      : state.dynamoActive
      ? 'Dynamo (Wheel) Only'
      : 'Battery Standby';

  // Circular SVG Gauge Math
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, state.batteryPct)) / 100) * circumference;

  const handleRideSpeedChange = (speedKmh: number) => {
    const calculatedDynamoMa = Math.round(speedKmh * 20.5);
    onUpdatePowerConfig({
      rideSpeedKmh: speedKmh,
      dynamoActive: speedKmh > 0,
      dynamoCurrentMa: calculatedDynamoMa,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner with Clear Demo Mode Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071D35] border border-[#00D5FF]/30 rounded-2xl p-4 sm:p-5">
        <div>
          <span className="text-xs font-semibold text-[#00D5FF]">
            Dual-Source Hybrid Harvesting: Monocrystalline Solar + Hub Dynamo (Simulated Demo Telemetry)
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            Power & Self-Charging
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => onSimulateChargePulse('combined')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00B862] hover:brightness-110 text-[#031326] font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_18px_rgba(0,230,118,0.4)] transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simulate +5% Charge Boost</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdatePowerConfig({
                batteryPct: 78,
                solarActive: true,
                solarCurrentMa: 220,
                dynamoActive: true,
                dynamoCurrentMa: 380,
                rideSpeedKmh: 18.4,
              })
            }
            className="px-3.5 py-2 rounded-xl bg-[#102B46] hover:bg-[#16395C] border border-[#00D5FF]/35 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Reference Values</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (Circular Gauge + Charging Details matching Screen 6) | Right Column (Interactive Simulator + Power Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Exact visual layout of Screen 6 in Reference Image 3 */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Card: Circular Battery Gauge + Capacity / Source / Status */}
          <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Circular Glowing Green Gauge (5 cols) */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#102B46"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#00E676"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 drop-shadow-[0_0_10px_rgba(0,230,118,0.65)]"
                    />
                  </svg>

                  {/* Inner Gauge Text matching Screen 6 of Reference Image 3 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                    <BatteryCharging className="w-6 h-6 text-[#00E676] mb-1" />
                    <span className="text-3xl font-extrabold font-mono-tabular text-white leading-none">
                      {state.batteryPct}%
                    </span>
                    <span className="text-[11px] font-mono-tabular text-slate-300 mt-1.5">
                      ({currentMah.toLocaleString()} / {state.batteryCapacityMah.toLocaleString()} mAh)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side Info Rows (7 cols) */}
              <div className="sm:col-span-7 space-y-2.5">
                <div className="p-3 rounded-xl bg-[#102B46]/85 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-300 block">Battery Capacity</span>
                    <span className="text-base font-bold font-mono-tabular text-white">
                      {state.batteryCapacityMah.toLocaleString()} mAh
                    </span>
                  </div>
                  <span className="text-xs text-[#00D5FF] font-semibold">
                    Li-Ion 3.7V / 5V
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#102B46]/85 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-300 block">Power Source</span>
                    <span className="text-base font-bold text-white">
                      {powerSourceLabel}
                    </span>
                  </div>
                  <Zap className="w-5 h-5 text-[#FFB020]" />
                </div>

                <div className="p-3 rounded-xl bg-[#102B46]/85 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-300 block">Status</span>
                    <span
                      className={`text-base font-bold ${
                        combinedMa > 0 ? 'text-[#00E676]' : 'text-[#FFB020]'
                      }`}
                    >
                      {combinedMa > 0 ? 'Charging' : 'Standby'}
                    </span>
                  </div>
                  <span className="text-xs font-mono-tabular font-bold text-[#00E676]">
                    +{combinedMa} mA
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#102B46]/60 border border-white/5 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-[#00E676] shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">Battery Health</span>
                      <span className="text-xs font-bold font-mono-tabular text-white">
                        {state.batteryHealthPct}% Good
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#102B46]/60 border border-white/5 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-[#00D5FF] shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">Pack Temp</span>
                      <span className="text-xs font-bold font-mono-tabular text-white">
                        {state.batteryTempC}°C
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charging Details Card (Exact Match to Screen 6 of Reference Image 3) */}
          <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Charging Details
              </h2>
              <span className="text-xs font-mono-tabular text-[#00D5FF]">
                Est. Full in {hoursToFull} hrs
              </span>
            </div>

            {/* Row 1: Solar Panel */}
            <div className="p-4 rounded-2xl bg-[#102B46]/85 border border-[#00D5FF]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FFB020]/15 border border-[#FFB020]/40 flex items-center justify-center text-[#FFB020] shrink-0">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    Solar Panel
                  </div>
                  <div className="text-xs sm:text-sm font-mono-tabular font-bold text-[#00E676]">
                    {state.solarActive ? `+ ${effectiveSolarMa} mA` : '0 mA (Paused)'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <SegmentedChargeBar
                  percentage={state.solarActive ? (effectiveSolarMa / 300) * 100 : 0}
                  color="green"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdatePowerConfig({ solarActive: !state.solarActive })
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    state.solarActive
                      ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40'
                      : 'bg-slate-700/50 text-slate-300'
                  }`}
                >
                  {state.solarActive ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Row 2: Dynamo (Wheel) */}
            <div className="p-4 rounded-2xl bg-[#102B46]/85 border border-[#00D5FF]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#00D5FF]/15 border border-[#00D5FF]/40 flex items-center justify-center text-[#00D5FF] shrink-0">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    Dynamo (Wheel)
                  </div>
                  <div className="text-xs sm:text-sm font-mono-tabular font-bold text-[#00E676]">
                    {state.dynamoActive ? `+ ${effectiveDynamoMa} mA` : '0 mA (Stopped)'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <SegmentedChargeBar
                  percentage={state.dynamoActive ? (effectiveDynamoMa / 500) * 100 : 0}
                  color="green"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdatePowerConfig({ dynamoActive: !state.dynamoActive })
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    state.dynamoActive
                      ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40'
                      : 'bg-slate-700/50 text-slate-300'
                  }`}
                >
                  {state.dynamoActive ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Row 3: Combined Hybrid Charging Output */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C2948] to-[#081F38] border border-[#00E676]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#00D5FF]">
                  Combined Hybrid Charging Output
                </div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                  MPPT Solar Controller + Bridge Rectifier Dynamo
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg sm:text-xl font-extrabold font-mono-tabular text-[#00E676]">
                  + {combinedMa} mA
                </span>
                <span className="block text-xs font-mono-tabular text-slate-300">
                  {((combinedMa * 5) / 1000).toFixed(2)} Watts @ 5.0V
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Self-Charging Simulator + Power Generation Statistics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Simulation Controls Card */}
          <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00D5FF]" />
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Interactive Charging Simulator
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-[#FFB020]">
                Demo Controls
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Adjust simulated sunlight intensity, bicycle wheel speed, or state of charge to demonstrate how SmartBike Secure harvests energy.
            </p>

            {/* Slider 1: Solar Panel Current */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Solar Panel Output (Sunlight Intensity)
                </span>
                <span className="font-mono-tabular font-bold text-[#FFB020]">
                  +{effectiveSolarMa} mA
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={350}
                step={10}
                value={effectiveSolarMa}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdatePowerConfig({
                    solarActive: val > 0,
                    solarCurrentMa: val,
                  });
                }}
                className="w-full accent-[#FFB020] cursor-pointer"
              />
            </div>

            {/* Slider 2: Bicycle Wheel Speed -> Dynamo Current */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Bicycle Wheel Speed ({state.rideSpeedKmh.toFixed(1)} km/h)
                </span>
                <span className="font-mono-tabular font-bold text-[#00D5FF]">
                  +{effectiveDynamoMa} mA
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={0.5}
                value={state.dynamoActive ? state.rideSpeedKmh : 0}
                onChange={(e) => handleRideSpeedChange(Number(e.target.value))}
                className="w-full accent-[#00D5FF] cursor-pointer"
              />
            </div>

            {/* Slider 3: Direct Battery Percentage Simulation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Simulated Battery Charge Level
                </span>
                <span className="font-mono-tabular font-bold text-[#00E676]">
                  {state.batteryPct}% ({currentMah.toLocaleString()} mAh)
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={state.batteryPct}
                onChange={(e) =>
                  onUpdatePowerConfig({ batteryPct: Number(e.target.value) })
                }
                className="w-full accent-[#00E676] cursor-pointer"
              />
            </div>

            {/* Quick Simulation Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => onSimulateChargePulse('solar')}
                className="py-2.5 px-3 rounded-xl bg-[#102B46] hover:bg-[#16395C] border border-[#FFB020]/40 text-xs font-bold text-[#FFB020] transition-colors cursor-pointer"
              >
                + Log Solar Harvest
              </button>
              <button
                type="button"
                onClick={() => onSimulateChargePulse('dynamo')}
                className="py-2.5 px-3 rounded-xl bg-[#102B46] hover:bg-[#16395C] border border-[#00D5FF]/40 text-xs font-bold text-[#00D5FF] transition-colors cursor-pointer"
              >
                + Log Dynamo Harvest
              </button>
            </div>
          </div>

          {/* Power Generation Statistics Card */}
          <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Power Generation Statistics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#102B46]/80 border border-white/5">
                <span className="text-xs text-slate-300 block">Daily Harvested</span>
                <span className="text-lg font-extrabold font-mono-tabular text-[#00E676] mt-0.5 block">
                  1,840 mAh
                </span>
                <span className="text-[11px] text-slate-400">~9.2 Wh Today</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#102B46]/80 border border-white/5">
                <span className="text-xs text-slate-300 block">Standby Autonomy</span>
                <span className="text-lg font-extrabold font-mono-tabular text-[#00D5FF] mt-0.5 block">
                  19.5 Days
                </span>
                <span className="text-[11px] text-slate-400">Zero external plug-in</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#102B46]/80 border border-white/5">
                <span className="text-xs text-slate-300 block">Solar Contribution</span>
                <span className="text-base font-bold font-mono-tabular text-[#FFB020] mt-0.5 block">
                  37% (680 mAh)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#102B46]/80 border border-white/5">
                <span className="text-xs text-slate-300 block">Dynamo Contribution</span>
                <span className="text-base font-bold font-mono-tabular text-[#00D5FF] mt-0.5 block">
                  63% (1,160 mAh)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Analytics Charts Row: Charging History (Last 24 Hours) + Solar vs Dynamo Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Charging History (Last 24 Hours) - Matches Screen 6 of Reference Image 3 */}
        <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Charging History (Last 24 Hours)
              </h3>
              <p className="text-xs text-slate-300">
                State of Charge (%) trajectory across solar & dynamo cycles
              </p>
            </div>
            <span className="text-xs font-mono-tabular font-bold text-[#00E676]">
              Peak: {state.batteryPct}%
            </span>
          </div>

          <div className="w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.powerHistory} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="batteryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E676" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#00E676" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" vertical={false} />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  tickFormatter={(v) => `${v}%`}
                  stroke="#94A3B8"
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#041428',
                    borderColor: '#00D5FF',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#FFFFFF',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="batteryPct"
                  name="Battery %"
                  stroke="#00E676"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#batteryAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Charging Current Graph (Solar vs Dynamo mA) */}
        <div className="rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Daily Charging Current Breakdown (mA)
              </h3>
              <p className="text-xs text-slate-300">
                Comparison of Solar Panel (mA) vs. Wheel Dynamo (mA)
              </p>
            </div>
            <span className="text-xs font-mono-tabular font-bold text-[#00D5FF]">
              +{combinedMa} mA Now
            </span>
          </div>

          <div className="w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={state.powerHistory} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" vertical={false} />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#041428',
                    borderColor: '#00D5FF',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#FFFFFF',
                  }}
                />
                <Bar dataKey="solarMa" name="Solar Panel (mA)" fill="#FFB020" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dynamoMa" name="Wheel Dynamo (mA)" fill="#00D5FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
