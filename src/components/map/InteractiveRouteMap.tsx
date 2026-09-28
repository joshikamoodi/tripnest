import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Plane, 
  Train, 
  Bus, 
  Car, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Info,
  Maximize2
} from 'lucide-react';
import { TransportType } from '../../types/travel';
import { POPULAR_DESTINATIONS } from '../../data/mockData';

interface InteractiveRouteMapProps {
  startLocation: string;
  destination: string;
  selectedTransport?: TransportType;
  onTransportChange?: (type: TransportType) => void;
}

interface Waypoint {
  name: string;
  type: 'start' | 'stop' | 'scenic' | 'destination';
  note: string;
  km: number;
}

export const InteractiveRouteMap: React.FC<InteractiveRouteMapProps> = ({
  startLocation,
  destination,
  selectedTransport = 'train',
  onTransportChange
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapStyle, setMapStyle] = useState<'terrain' | 'satellite' | 'vector'>('vector');
  const [activeStopTooltip, setActiveStopTooltip] = useState<string | null>(null);

  // Match destinations coordinates or fallback
  const startDest = POPULAR_DESTINATIONS.find(d => 
    d.name.toLowerCase().includes(startLocation.toLowerCase()) || 
    startLocation.toLowerCase().includes(d.name.toLowerCase())
  );

  const endDest = POPULAR_DESTINATIONS.find(d => 
    d.name.toLowerCase().includes(destination.toLowerCase()) || 
    destination.toLowerCase().includes(d.name.toLowerCase())
  ) || POPULAR_DESTINATIONS[0]; // fallback to Kerala

  // Calculate coordinates in SVG coordinate system (width: 700, height: 420)
  const startX = startDest?.coords.x ? (startDest.coords.x / 100) * 650 + 25 : 220;
  const startY = startDest?.coords.y ? (startDest.coords.y / 100) * 360 + 30 : 160;
  const endX = endDest?.coords.x ? (endDest.coords.x / 100) * 650 + 25 : 480;
  const endY = endDest?.coords.y ? (endDest.coords.y / 100) * 360 + 30 : 320;

  // Check if international route
  const isIntlRoute = Boolean(endDest?.isInternational || startDest?.isInternational);

  // Approximate distance based on travel pairs
  const approximateDistanceKm = isIntlRoute 
    ? Math.round(Math.hypot(endX - startX, endY - startY) * 18.5) + 4200
    : Math.round(Math.hypot(endX - startX, endY - startY) * 3.4) + 120;

  // Mode-specific metrics
  const modeData = {
    flight: { 
      time: isIntlRoute ? '8h 45m' : '1h 45m', 
      speed: isIntlRoute ? '880 km/h' : '680 km/h', 
      co2: isIntlRoute ? '280 kg CO2e' : '78 kg CO2e', 
      curve: -45, 
      color: '#0284c7' 
    },
    train: { 
      time: isIntlRoute ? '32h+' : '4h 50m', 
      speed: '160 km/h', 
      co2: isIntlRoute ? '45 kg CO2e' : '18 kg CO2e', 
      curve: 15, 
      color: '#059669' 
    },
    bus: { 
      time: isIntlRoute ? 'N/A (Sea/Air barrier)' : '8h 30m', 
      speed: '65 km/h', 
      co2: '28 kg CO2e', 
      curve: 35, 
      color: '#d97706' 
    },
    car: { 
      time: isIntlRoute ? 'Cross-Border Overland' : '6h 15m', 
      speed: '85 km/h', 
      co2: '65 kg CO2e', 
      curve: 25, 
      color: '#7c3aed' 
    }
  }[selectedTransport];

  // Route control point for curved path
  const midX = (startX + endX) / 2 + (modeData.curve * 1.2);
  const midY = (startY + endY) / 2 - (modeData.curve * 0.8);
  const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

  // Intermediate realistic stops along route
  const intermediateWaypoints: Waypoint[] = isIntlRoute ? [
    { name: `${startLocation || 'Origin'} International Hub`, type: 'start', note: 'Passport control & departure gate', km: 0 },
    { name: 'Trans-Continental Flight Corridor', type: 'scenic', note: 'Cruising altitude 37,000 ft (In-flight dining)', km: Math.round(approximateDistanceKm * 0.45) },
    { name: 'Airspace Handover Waypoint', type: 'stop', note: 'International navigation corridor', km: Math.round(approximateDistanceKm * 0.72) },
    { name: `${destination || 'Destination'} International Airport`, type: 'destination', note: 'Arrivals, customs & baggage claim', km: approximateDistanceKm }
  ] : [
    { name: startLocation || 'Origin Station', type: 'start', note: 'Journey departure point', km: 0 },
    { name: 'Western Ghats Scenic Pass', type: 'scenic', note: 'Lush mountain tunnels & viaducts', km: Math.round(approximateDistanceKm * 0.4) },
    { name: 'Junction Transit Hub', type: 'stop', note: 'Brief 10-minute scheduled stop', km: Math.round(approximateDistanceKm * 0.72) },
    { name: destination || 'Destination City', type: 'destination', note: 'Final arrival station / terminal', km: approximateDistanceKm }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Map Header Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Route Visualization: {startLocation || 'Origin'} → {destination || 'Destination'}
          </h3>
          {isIntlRoute && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              🌐 International Corridor
            </span>
          )}
        </div>

        {/* Transportation Mode Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
          {(['flight', 'train', 'bus', 'car'] as const).map(type => (
            <button
              key={type}
              onClick={() => onTransportChange && onTransportChange(type)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                selectedTransport === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {type === 'flight' && <Plane className="w-3.5 h-3.5" />}
              {type === 'train' && <Train className="w-3.5 h-3.5" />}
              {type === 'bus' && <Bus className="w-3.5 h-3.5" />}
              {type === 'car' && <Car className="w-3.5 h-3.5" />}
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Area */}
      <div className="relative w-full h-[340px] sm:h-[400px] bg-slate-900 overflow-hidden select-none">
        
        {/* Vector Background Grid & Relief Contours */}
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* Subtle topographical canvas background */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* SVG Map Path & Coordinates Canvas */}
          <svg className="w-full h-full" viewBox="0 0 700 420" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              {/* Pulsing route glow */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Geographical outline landmarks */}
            <g className="opacity-20 text-slate-400 font-mono text-[10px]">
              <path d="M 50,40 Q 200,60 380,45 T 650,90" stroke="#475569" strokeWidth="1" fill="none" strokeDasharray="3 3" />
              <path d="M 80,180 Q 280,210 440,160 T 670,240" stroke="#475569" strokeWidth="1" fill="none" strokeDasharray="3 3" />
              <path d="M 120,310 Q 320,340 520,300 T 680,360" stroke="#475569" strokeWidth="1" fill="none" strokeDasharray="3 3" />
            </g>

            {/* Simulated coastal & state boundary curves */}
            <path
              d="M 160,20 C 190,90 210,180 230,260 C 250,340 320,390 380,410 C 460,380 540,280 580,180 C 620,90 590,40 550,20"
              fill="rgba(30, 41, 59, 0.45)"
              stroke="#334155"
              strokeWidth="1.5"
            />

            {/* Other Indian cities as subtle background nodes */}
            {POPULAR_DESTINATIONS.map(d => {
              const cx = d.coords.x ?? 50;
              const cy = d.coords.y ?? 50;
              const dx = (cx / 100) * 650 + 25;
              const dy = (cy / 100) * 360 + 30;
              const isSelected = d.name.toLowerCase() === destination.toLowerCase() || d.name.toLowerCase() === startLocation.toLowerCase();
              if (isSelected) return null;
              return (
                <g key={d.id} className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                  <circle cx={dx} cy={dy} r="2.5" fill="#94a3b8" />
                  <text x={dx + 6} y={dy + 3} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
                    {d.name}
                  </text>
                </g>
              );
            })}

            {/* Active Route Path Layer */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(16, 185, 129, 0.25)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            <path
              d={pathD}
              fill="none"
              stroke={modeData.color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={selectedTransport === 'flight' ? '8 6' : undefined}
              filter="url(#glow)"
            />

            {/* Animated Transit Vehicle Indicator */}
            <circle r="4.5" fill="#ffffff" stroke={modeData.color} strokeWidth="2.5">
              <animateMotion
                path={pathD}
                dur={selectedTransport === 'flight' ? '3s' : '5s'}
                repeatCount="indefinite"
              />
            </circle>

            {/* Waypoint: Scenic Midpoint */}
            <g
              transform={`translate(${midX}, ${midY})`}
              className="cursor-pointer"
              onClick={() => setActiveStopTooltip('Western Ghats Viewpoint')}
            >
              <circle cx="0" cy="0" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
              <text x="7" y="3" fill="#fbbf24" fontSize="9" fontWeight="600">
                Scenic Pass
              </text>
            </g>

            {/* Start Node */}
            <g transform={`translate(${startX}, ${startY})`} className="cursor-pointer">
              <circle cx="0" cy="0" r="14" fill="rgba(16, 185, 129, 0.2)" className="animate-ping" />
              <circle cx="0" cy="0" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text
                x="0"
                y="-12"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
                className="drop-shadow"
              >
                {startLocation || 'Origin'}
              </text>
            </g>

            {/* Destination Node */}
            <g transform={`translate(${endX}, ${endY})`} className="cursor-pointer">
              <circle cx="0" cy="0" r="16" fill="rgba(6, 182, 212, 0.25)" className="animate-pulse" />
              <circle cx="0" cy="0" r="8" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" />
              <text
                x="0"
                y="20"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="12"
                fontWeight="bold"
                className="drop-shadow"
              >
                {destination || 'Destination'}
              </text>
            </g>
          </svg>
        </div>

        {/* Map Control Tools (Zoom & Layer) */}
        <div className="absolute right-4 top-4 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
            className="w-8 h-8 rounded-lg bg-slate-800/90 text-slate-200 hover:text-white hover:bg-slate-700 flex items-center justify-center border border-slate-700 transition-colors shadow"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            className="w-8 h-8 rounded-lg bg-slate-800/90 text-slate-200 hover:text-white hover:bg-slate-700 flex items-center justify-center border border-slate-700 transition-colors shadow"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Live Trip Telemetry HUD Box */}
        <div className="absolute left-4 bottom-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-white max-w-xs sm:max-w-sm shadow-xl">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Live Transit Route Matrix
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {approximateDistanceKm} km Total
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-1.5 rounded-lg bg-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Est. Time</span>
              <span className="font-bold text-slate-100">{modeData.time}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Avg. Speed</span>
              <span className="font-bold text-slate-100">{modeData.speed}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Footprint</span>
              <span className="font-bold text-emerald-400">{modeData.co2}</span>
            </div>
          </div>
        </div>

        {/* API Integration Placeholder Ribbon */}
        <div className="absolute right-4 bottom-4 z-10 text-[10px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Interactive Vector Engine · Maps API Ready</span>
        </div>
      </div>

      {/* Route Waypoints & Stops Strip */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Key Stops & Highway Waypoints ({intermediateWaypoints.length})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {intermediateWaypoints.map((w, idx) => (
            <div 
              key={idx} 
              className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-start gap-2.5"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 ${
                w.type === 'start' ? 'bg-emerald-600' :
                w.type === 'destination' ? 'bg-cyan-600' :
                w.type === 'scenic' ? 'bg-amber-500' : 'bg-slate-600'
              }`}>
                {idx + 1}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{w.name}</p>
                <p className="text-[11px] text-slate-500 leading-tight truncate">{w.note}</p>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{w.km} km marker</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
