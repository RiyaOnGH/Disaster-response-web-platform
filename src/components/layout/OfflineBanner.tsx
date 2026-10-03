import React from 'react';
import { useApp } from '../../context/AppContext';
import { WifiOff, Radio, ArrowRight, ShieldCheck } from 'lucide-react';

interface OfflineBannerProps {
  onNavigate: (route: string) => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onNavigate }) => {
  const { networkStatus, userSos } = useApp();

  if (networkStatus === 'connected') {
    return null;
  }

  if (networkStatus === 'limited') {
    return (
      <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2 max-w-5xl mx-auto w-full justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 animate-pulse text-amber-950" />
            <span>
              <strong>Limited Bandwidth Detected:</strong> Essential distress messages and RescueMesh telemetry prioritized over high-resolution imagery.
            </span>
          </div>
          <button
            onClick={() => onNavigate('/rescue-mesh')}
            className="hidden sm:flex items-center space-x-1 underline text-amber-950 hover:text-black font-bold text-xs"
          >
            <span>Mesh Telemetry</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside aria-label="Offline network alert" className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 text-white px-4 py-3 shadow-md border-b border-red-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2 bg-black/20 rounded-lg shrink-0 mt-0.5 sm:mt-0">
            <WifiOff className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wide uppercase text-xs px-2 py-0.5 bg-white text-red-700 rounded font-mono">
                🔴 OFFLINE SIMULATION
              </span>
              <span className="font-bold text-sm">Normal cellular & broadband network unavailable.</span>
            </div>
            <p className="text-xs text-red-100 mt-0.5">
              RescueMesh simulation is attempting to route your SOS and emergency drafts hop-by-hop via nearby Bluetooth/Wi-Fi Direct peer relays.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 pt-1 sm:pt-0">
          <button
            onClick={() => onNavigate('/rescue-mesh')}
            className="px-3.5 py-1.5 rounded-lg bg-white text-red-700 hover:bg-red-50 text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all transform hover:scale-[1.02]"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>VIEW RESCUEMESH STATUS</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
