import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Minus, 
  Crosshair, 
  Layers, 
  Droplets, 
  HeartPulse, 
  Home, 
  Utensils, 
  Zap, 
  Bus, 
  AlertOctagon, 
  ShieldAlert, 
  Filter, 
  MapPin,
  Compass,
  Radio,
  Search
} from 'lucide-react';
import { ResourceDrawer } from './ResourceDrawer';
import { RecoveryResource, CitizenReport, SOSAlert } from '../../types';

interface InteractiveMapProps {
  onNavigate?: (route: string) => void;
  initialFilter?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onNavigate, initialFilter = 'all' }) => {
  const { resources, reports, sosAlerts, userSos } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  
  // Layer toggles
  const [showFloodLayer, setShowFloodLayer] = useState(true);
  const [showMeshCoverage, setShowMeshCoverage] = useState(true);
  const [showEvacCorridors, setShowEvacCorridors] = useState(true);
  const [showLayersMenu, setShowLayersMenu] = useState(false);

  // Selected item drawer
  const [selectedItem, setSelectedItem] = useState<RecoveryResource | CitizenReport | SOSAlert | null>(null);
  const [drawerType, setDrawerType] = useState<'resource' | 'report' | 'sos' | null>(null);

  const filterOptions = [
    { id: 'all', label: 'All Items', icon: Filter },
    { id: 'water', label: 'Water', icon: Droplets, color: 'text-cyan-600' },
    { id: 'medical', label: 'Medical', icon: HeartPulse, color: 'text-emerald-600' },
    { id: 'shelter', label: 'Shelters', icon: Home, color: 'text-indigo-600' },
    { id: 'food', label: 'Food', icon: Utensils, color: 'text-orange-600' },
    { id: 'roads', label: 'Road Blocks', icon: ShieldAlert, color: 'text-amber-600' },
    { id: 'electricity', label: 'Power Hubs', icon: Zap, color: 'text-yellow-600' },
    { id: 'transport', label: 'Transport', icon: Bus, color: 'text-purple-600' },
    { id: 'sos', label: 'Active SOS', icon: AlertOctagon, color: 'text-red-600' },
  ];

  // Filtering items
  const filteredResources = resources.filter(res => {
    if (activeFilter !== 'all' && res.category !== activeFilter) return false;
    if (searchQuery && !res.name.toLowerCase().includes(searchQuery.toLowerCase()) && !res.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredReports = reports.filter(rep => {
    if (activeFilter === 'roads' && rep.category === 'road_blocked') return true;
    if (activeFilter === 'electricity' && rep.category === 'electricity') return true;
    if (activeFilter === 'all') return true;
    return false;
  });

  const filteredSos = sosAlerts.filter(sos => {
    if (activeFilter === 'sos' || activeFilter === 'all') return true;
    return false;
  });

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.8), 2.2));
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[calc(100vh-8.5rem)] min-h-[550px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-xl flex flex-col select-none">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
        
        {/* Search & Location Bar */}
        <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-1.5 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Search resources, hospitals, Ward 12..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold">
              ×
            </button>
          )}
        </div>

        {/* Layer Toggles & Mode */}
        <div className="pointer-events-auto flex items-center space-x-2 self-end sm:self-auto">
          <div className="relative">
            <button
              onClick={() => setShowLayersMenu(!showLayersMenu)}
              className="px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-700 hover:bg-white text-xs font-bold shadow-lg border border-slate-200 flex items-center space-x-1.5 transition-colors"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Tactical Layers</span>
            </button>

            {showLayersMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 text-xs space-y-2.5 z-30 text-left">
                <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                  Map Tactical Overlays
                </div>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFloodLayer}
                    onChange={(e) => setShowFloodLayer(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-700">Flood Inundation Zones</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMeshCoverage}
                    onChange={(e) => setShowMeshCoverage(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-700">RescueMesh Node Radius</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEvacCorridors}
                    onChange={(e) => setShowEvacCorridors(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-700">Safe Dry Evac Corridors</span>
                </label>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Filter Chips Horizontal Scroller */}
      <div className="absolute top-20 left-4 right-4 z-20 overflow-x-auto scrollbar-none py-1 flex items-center space-x-1.5 pointer-events-auto">
        {filterOptions.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md backdrop-blur-md ${
                isActive
                  ? 'bg-slate-900 text-white ring-2 ring-slate-400'
                  : 'bg-white/95 text-slate-700 hover:bg-white border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${f.color || ''}`} />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Tactical SVG Map Canvas */}
      <div className="w-full h-full relative overflow-hidden bg-slate-900 cursor-grab active:cursor-grabbing">
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: '50% 50%'
          }}
        >
          {/* Map Grid Definition */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
            <pattern id="flood-hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="2" />
            </pattern>
          </defs>

          {/* Base Background */}
          <rect width="1000" height="700" fill="#0f172a" />
          <rect width="1000" height="700" fill="url(#grid)" />

          {/* River Ganga along the North/Top */}
          <path
            d="M 0,90 Q 200,60 450,85 T 800,70 Q 900,85 1000,65 L 1000,0 L 0,0 Z"
            fill="#0369a1"
            opacity="0.75"
          />
          <text x="450" y="45" fill="#38bdf8" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold" letterSpacing="3">
            RIVER GANGA (FLOW: WEST → EAST)
          </text>

          {/* Flood Inundation Zones (Translucent Layer) */}
          {showFloodLayer && (
            <g id="flood-layer">
              {/* Kankarbagh Low Basin Inundation */}
              <ellipse cx="450" cy="480" rx="140" ry="80" fill="url(#flood-hatch)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="380" y="490" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono" opacity="0.8">
                WATER DEPTH 3-4 FT
              </text>

              {/* Bailey Road Underpass Inundation */}
              <ellipse cx="380" cy="340" rx="90" ry="40" fill="url(#flood-hatch)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="320" y="345" fill="#f87171" fontSize="10" fontFamily="JetBrains Mono" opacity="0.9">
                SUBMERGED ROADWAY
              </text>
            </g>
          )}

          {/* Major Road Arteries */}
          <g id="roads" stroke="#334155" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Bailey Road East-West */}
            <path d="M 50,340 L 950,340" />
            {/* Ashok Rajpath North Highway */}
            <path d="M 120,130 Q 500,140 920,120" />
            {/* Kankarbagh Main North-South */}
            <path d="M 450,140 L 450,650" />
            {/* Boring Canal Road */}
            <path d="M 280,140 L 280,550" />
            {/* Patna Bypass Outer Ring */}
            <path d="M 60,600 Q 500,620 940,580" />
          </g>

          {/* Active Safe Dry Evac Corridors (High Ground) */}
          {showEvacCorridors && (
            <g id="evac-corridors" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="8 6" opacity="0.85">
              <path d="M 450,220 L 450,340 L 680,340 L 680,180" />
              <path d="M 280,260 L 450,260 L 720,260" />
            </g>
          )}

          {/* Road labels */}
          <text x="80" y="330" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">BAILEY ROAD ARTERY</text>
          <text x="460" y="240" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">KANKARBAGH MAIN</text>
          <text x="140" y="160" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">ASHOK RAJPATH</text>
          <text x="100" y="630" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">NEW PATNA BYPASS CORRIDOR</text>

          {/* RescueMesh Coverage Radii (Circles around relay repeaters) */}
          {showMeshCoverage && (
            <g id="mesh-nodes" fill="none">
              <circle cx="450" cy="520" r="90" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="450" cy="520" r="4" fill="#06b6d4" />
              
              <circle cx="380" cy="340" r="80" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="380" cy="340" r="4" fill="#06b6d4" />

              <circle cx="680" cy="220" r="95" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="680" cy="220" r="4" fill="#06b6d4" />

              {/* Hop relay communication beams */}
              <line x1="450" y1="520" x2="380" y2="340" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <line x1="380" y1="340" x2="680" y2="220" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            </g>
          )}

          {/* User Location Marker (Ward 12, Patna) */}
          <g transform="translate(420, 500)">
            <circle cx="0" cy="0" r="24" fill="rgba(239, 68, 68, 0.2)" className="animate-ping" />
            <circle cx="0" cy="0" r="14" fill="#3b82f6" stroke="#ffffff" strokeWidth="3" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
            <text x="18" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              YOU (Ward 12)
            </text>
          </g>

          {/* PLOTTED MARKERS: Resources */}
          {filteredResources.map((res) => {
            const cx = (res.coordinates.x / 100) * 1000;
            const cy = (res.coordinates.y / 100) * 700;

            const isWater = res.category === 'water';
            const isMed = res.category === 'medical';
            const isShelter = res.category === 'shelter';
            const isFood = res.category === 'food';
            const isPower = res.category === 'electricity';
            const isTrans = res.category === 'transport';

            const fillColor = isWater ? '#0284c7' : isMed ? '#059669' : isShelter ? '#4f46e5' : isFood ? '#ea580c' : isPower ? '#ca8a04' : '#7c3aed';
            const symbol = isWater ? '💧' : isMed ? '🏥' : isShelter ? '🏠' : isFood ? '🍲' : isPower ? '⚡' : '🚌';

            return (
              <g
                key={res.id}
                transform={`translate(${cx}, ${cy})`}
                onClick={() => {
                  setSelectedItem(res);
                  setDrawerType('resource');
                }}
                className="cursor-pointer group"
              >
                <circle cx="0" cy="0" r="16" fill={fillColor} stroke="#ffffff" strokeWidth="2.5" className="transition-transform group-hover:scale-125" />
                <text x="0" y="4" fontSize="12" textAnchor="middle">{symbol}</text>
                <text x="0" y="28" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle" className="drop-shadow">
                  {res.name.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* PLOTTED MARKERS: Citizen Reports (Obstructions & Incidents) */}
          {filteredReports.map((rep) => {
            const cx = (rep.coordinates.x / 100) * 1000;
            const cy = (rep.coordinates.y / 100) * 700;

            const isResolved = rep.status === 'resolved';

            return (
              <g
                key={rep.id}
                transform={`translate(${cx}, ${cy})`}
                onClick={() => {
                  setSelectedItem(rep);
                  setDrawerType('report');
                }}
                className="cursor-pointer group"
              >
                <circle 
                  cx="0" 
                  cy="0" 
                  r="15" 
                  fill={isResolved ? '#059669' : '#d97706'} 
                  stroke="#ffffff" 
                  strokeWidth="2.5" 
                  className="transition-transform group-hover:scale-125" 
                />
                <text x="0" y="4" fontSize="11" textAnchor="middle">
                  {isResolved ? '✅' : '🚧'}
                </text>
                <text x="0" y="26" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle" className="drop-shadow">
                  {rep.id}
                </text>
              </g>
            );
          })}

          {/* PLOTTED MARKERS: Active SOS Beacons */}
          {filteredSos.map((sos) => {
            const cx = (sos.coordinates.x / 100) * 1000;
            const cy = (sos.coordinates.y / 100) * 700;

            return (
              <g
                key={sos.id}
                transform={`translate(${cx}, ${cy})`}
                onClick={() => {
                  setSelectedItem(sos);
                  setDrawerType('sos');
                }}
                className="cursor-pointer group"
              >
                <circle cx="0" cy="0" r="22" fill="rgba(220, 38, 38, 0.4)" className="animate-ping" />
                <circle cx="0" cy="0" r="16" fill="#dc2626" stroke="#ffffff" strokeWidth="3" className="transition-transform group-hover:scale-125" />
                <text x="0" y="4" fontSize="12" textAnchor="middle">🆘</text>
                <text x="0" y="28" fill="#fca5a5" fontSize="10" fontWeight="extrabold" textAnchor="middle" className="drop-shadow">
                  {sos.id}
                </text>
              </g>
            );
          })}

        </svg>
      </div>

      {/* Floating Bottom Left: Legend */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700 text-[11px] text-slate-300">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Water</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Hospital</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span>Shelter</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Obstruction</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span>Active SOS</span>
        </div>
      </div>

      {/* Floating Bottom Right: Zoom & Reset Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2 pointer-events-auto">
        <button
          onClick={() => handleZoom(0.2)}
          className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center shadow-xl border border-slate-200 transition-colors font-bold"
          title="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center shadow-xl border border-slate-200 transition-colors font-bold"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={resetView}
          className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center shadow-xl border border-slate-200 transition-colors"
          title="Locate Me / Reset View"
        >
          <Crosshair className="w-5 h-5 text-red-600" />
        </button>
      </div>

      {/* Selected Item Drawer (Slide Over) */}
      <ResourceDrawer
        item={selectedItem}
        type={drawerType}
        onClose={() => {
          setSelectedItem(null);
          setDrawerType(null);
        }}
        onNavigate={onNavigate}
      />

    </div>
  );
};
