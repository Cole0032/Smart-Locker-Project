import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Minus,
  Radio,
  Compass,
  RefreshCw,
} from 'lucide-react';
import { BikeSystemState } from '../types/smartbike';

interface GpsTrackingScreenProps {
  state: BikeSystemState;
  onToggleGeofence: () => void;
  onChangeRadius: (radiusM: number) => void;
  onUpdateBikeLocation: (
    lat: number,
    lng: number,
    label: string,
    outsideGeofence: boolean
  ) => void;
}

export const GpsTrackingScreen: React.FC<GpsTrackingScreenProps> = ({
  state,
  onToggleGeofence,
  onChangeRadius,
  onUpdateBikeLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const bikeMarkerRef = useRef<L.Marker | null>(null);
  const geofenceCircleRef = useRef<L.Circle | null>(null);

  const createBikeDivIcon = (isOutside: boolean) =>
    L.divIcon({
      className: 'custom-smartbike-pin',
      html: `
        <div style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;inset:0;border-radius:9999px;background:${
            isOutside ? 'rgba(255,59,79,0.35)' : 'rgba(0,213,255,0.32)'
          };filter:blur(6px);"></div>
          <div style="position:relative;width:40px;height:40px;border-radius:9999px;background:${
            isOutside ? '#FF3B4F' : '#087BFF'
          };border:3px solid #FFFFFF;box-shadow:0 4px 14px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="5.5" cy="17.5" r="3.5"/>
              <circle cx="18.5" cy="17.5" r="3.5"/>
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [state.bikeLocation.lat, state.bikeLocation.lng],
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const circle = L.circle([state.safeZoneCenter.lat, state.safeZoneCenter.lng], {
      radius: state.geofenceRadiusM,
      color: state.isOutsideGeofence ? '#FF3B4F' : '#00E676',
      weight: 2.5,
      fillColor: state.isOutsideGeofence ? '#FF3B4F' : '#00E676',
      fillOpacity: state.geofenceEnabled ? 0.22 : 0.04,
      dashArray: state.geofenceEnabled ? undefined : '6 6',
    }).addTo(map);

    const marker = L.marker([state.bikeLocation.lat, state.bikeLocation.lng], {
      icon: createBikeDivIcon(state.isOutsideGeofence),
    }).addTo(map);

    mapInstanceRef.current = map;
    geofenceCircleRef.current = circle;
    bikeMarkerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync marker and geofence circle when state updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = bikeMarkerRef.current;
    const circle = geofenceCircleRef.current;
    if (!map || !marker || !circle) return;

    marker.setLatLng([state.bikeLocation.lat, state.bikeLocation.lng]);
    marker.setIcon(createBikeDivIcon(state.isOutsideGeofence));

    circle.setLatLng([state.safeZoneCenter.lat, state.safeZoneCenter.lng]);
    circle.setRadius(state.geofenceRadiusM);
    circle.setStyle({
      color: state.isOutsideGeofence ? '#FF3B4F' : '#00E676',
      fillColor: state.isOutsideGeofence ? '#FF3B4F' : '#00E676',
      fillOpacity: state.geofenceEnabled ? 0.22 : 0.03,
      opacity: state.geofenceEnabled ? 0.95 : 0.25,
    });
  }, [
    state.bikeLocation.lat,
    state.bikeLocation.lng,
    state.safeZoneCenter.lat,
    state.safeZoneCenter.lng,
    state.geofenceRadiusM,
    state.geofenceEnabled,
    state.isOutsideGeofence,
  ]);

  const handleLocateBicycle = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [state.bikeLocation.lat, state.bikeLocation.lng],
        16,
        { duration: 0.8 }
      );
    }
    onUpdateBikeLocation(
      state.safeZoneCenter.lat,
      state.safeZoneCenter.lng,
      'Near LPU, Punjab',
      false
    );
  };

  const handleSimulateSafeMove = () => {
    const jitterLat = state.safeZoneCenter.lat + (Math.random() - 0.5) * 0.0012;
    const jitterLng = state.safeZoneCenter.lng + (Math.random() - 0.5) * 0.0012;
    onUpdateBikeLocation(
      Number(jitterLat.toFixed(4)),
      Number(jitterLng.toFixed(4)),
      'Campus Bike Stand, Near LPU, Punjab',
      false
    );
    mapInstanceRef.current?.panTo([jitterLat, jitterLng]);
  };

  const handleSimulateGeofenceExit = () => {
    const exitLat = Number((state.safeZoneCenter.lat + 0.0042).toFixed(4));
    const exitLng = Number((state.safeZoneCenter.lng + 0.0038).toFixed(4));
    onUpdateBikeLocation(
      exitLat,
      exitLng,
      'GT Road Highway (Outside Safe Zone)',
      true
    );
    mapInstanceRef.current?.flyTo([exitLat, exitLng], 15, { duration: 0.8 });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#071D35] border border-[#00D5FF]/30 rounded-2xl p-4 sm:p-5">
        <div>
          <span className="text-xs font-semibold text-[#00D5FF]">
            NEO-6M GPS Receiver + GSM Telemetry (Demo Mode Location)
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            Live GPS Tracking & Geofence
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-[#102B46] border border-[#00E676]/40 text-xs font-semibold text-[#00E676] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>GPS Online · Updated {state.bikeLocation.updatedAt}</span>
          </div>

          <button
            type="button"
            onClick={handleLocateBicycle}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00EAFF] to-[#087BFF] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,213,255,0.35)] hover:brightness-110 transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Locate Bicycle</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Interactive Map + Geofence & Simulation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Map Container (Matches Screen 7 of Reference Image 3) */}
        <div className="lg:col-span-8 rounded-3xl bg-[#071D35] border border-[#00D5FF]/35 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative">
          <div className="smartbike-map relative w-full h-[380px] sm:h-[460px]">
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Floating "My Bicycle" Info Overlay Card (Exact Match to Screen 7 of Reference Image 3) */}
            <div className="absolute top-4 right-4 z-[400] max-w-xs rounded-2xl bg-[#06182E]/95 border border-[#00D5FF]/45 p-3.5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-white">My Bicycle</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    state.isOutsideGeofence
                      ? 'bg-[#FF3B4F]/25 text-[#FF6B7A]'
                      : 'bg-[#00E676]/20 text-[#00E676]'
                  }`}
                >
                  {state.isOutsideGeofence ? 'Outside Zone' : 'Safe Zone'}
                </span>
              </div>
              <div className="text-xs text-slate-200 mt-1 font-medium">
                {state.bikeLocation.label}
              </div>
              <div className="text-xs font-mono-tabular text-[#00D5FF] mt-0.5">
                ({state.bikeLocation.lat.toFixed(4)}° N, {state.bikeLocation.lng.toFixed(4)}° E)
              </div>
            </div>

            {/* Custom Zoom +/- Controls on Bottom Right (Matches Screen 7 of Reference Image 3) */}
            <div className="absolute bottom-5 right-4 z-[400] flex flex-col rounded-xl overflow-hidden border border-[#00D5FF]/40 shadow-xl bg-[#071D35]/95">
              <button
                type="button"
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="p-2.5 text-white hover:bg-[#102B46] border-b border-white/10 transition-colors cursor-pointer"
                aria-label="Zoom in"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="p-2.5 text-white hover:bg-[#102B46] transition-colors cursor-pointer"
                aria-label="Zoom out"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Geofence Controls & Demo Movement Simulator */}
        <div className="lg:col-span-4 space-y-4">
          {/* Geofence Card (Matches Screen 7 bottom card in Reference Image 3) */}
          <div className="rounded-2xl bg-[#071D35] border border-[#00D5FF]/30 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    state.geofenceEnabled
                      ? 'bg-[#00E676]/15 text-[#00E676]'
                      : 'bg-slate-700/40 text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Geofence</h2>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Get alert if the bicycle leaves this safe zone
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={state.geofenceEnabled}
                onClick={onToggleGeofence}
                className={`w-13 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  state.geofenceEnabled ? 'bg-[#00E676]' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    state.geofenceEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Safe Zone Radius Selector */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2.5">
                <span className="font-semibold text-slate-200">Safe Zone Radius</span>
                <span className="font-mono-tabular font-bold text-[#00D5FF]">
                  {state.geofenceRadiusM} m
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[100, 200, 300, 500].map((rad) => (
                  <button
                    key={rad}
                    type="button"
                    onClick={() => onChangeRadius(rad)}
                    className={`py-2 rounded-xl text-xs font-mono-tabular font-bold border transition-all cursor-pointer ${
                      state.geofenceRadiusM === rad
                        ? 'bg-[#087BFF] border-[#00EAFF] text-white shadow-[0_0_12px_rgba(8,123,255,0.4)]'
                        : 'bg-[#102B46]/70 border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    {rad} m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Demo GPS Movement & Breach Simulator Card */}
          <div className="rounded-2xl bg-[#071D35] border border-[#00D5FF]/30 p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#00D5FF]" />
              <h3 className="text-sm sm:text-base font-bold text-white">
                GPS Telemetry Simulator (Demo)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Test live GPS coordinate updates and automatic Geofence perimeter breach alerts without physical hardware movement.
            </p>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleSimulateSafeMove}
                className="w-full py-2.5 px-4 rounded-xl bg-[#102B46] hover:bg-[#16395C] border border-[#00D5FF]/35 text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#00D5FF]" />
                <span>Simulate Campus Ride (Inside Safe Zone)</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateGeofenceExit}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FF3B4F]/15 hover:bg-[#FF3B4F]/25 border border-[#FF3B4F]/50 text-xs sm:text-sm font-semibold text-[#FF8A96] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-[#FF3B4F]" />
                <span>Simulate Geofence Exit Breach</span>
              </button>

              {state.isOutsideGeofence && (
                <button
                  type="button"
                  onClick={handleLocateBicycle}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00E676]/20 hover:bg-[#00E676]/30 border border-[#00E676]/60 text-xs sm:text-sm font-bold text-[#00E676] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Return Bicycle to LPU Safe Zone</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
