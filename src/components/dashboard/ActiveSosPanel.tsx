import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertOctagon, 
  MapPin, 
  Clock, 
  Battery, 
  Compass, 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  Navigation,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { SOSAlert } from '../../types';

interface ActiveSosPanelProps {
  onNavigate?: (route: string) => void;
}

export const ActiveSosPanel: React.FC<ActiveSosPanelProps> = ({ onNavigate }) => {
  const { sosAlerts, updateSosStatus } = useApp();

  const getStatusBadge = (status: SOSAlert['status']) => {
    switch (status) {
      case 'searching':
        return { label: 'Searching Mesh', color: 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' };
      case 'relaying':
        return { label: 'Relaying Packet', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'delivered':
        return { label: 'Response Required', color: 'bg-red-600 text-white font-black animate-pulse' };
      case 'dispatched':
        return { label: 'Unit Dispatched', color: 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold' };
      case 'rescued':
        return { label: 'Rescued & Safe', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left">
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">
              Command Dispatch Queue
            </div>
            <h3 className="font-extrabold text-lg text-white">
              Active Emergency SOS Distress Calls
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
          {sosAlerts.filter(s => s.status !== 'rescued').length} Critical Unresolved
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {sosAlerts.map((sos) => {
          const badge = getStatusBadge(sos.status);
          const isResolved = sos.status === 'rescued';

          return (
            <div key={sos.id} className={`p-6 transition-colors ${isResolved ? 'bg-slate-50/60 opacity-75' : 'hover:bg-red-50/20'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left Distress Information */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-200">
                      {sos.id}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {sos.timestamp}
                    </span>
                  </div>

                  <h4 className="font-black text-base sm:text-lg text-slate-900">
                    {sos.emergencyType}
                  </h4>

                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                    <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Victim: <strong>{sos.victimName}</strong></span>
                  </div>

                  {/* Telemetry Chips */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{sos.location}, {sos.ward}</span>
                    </div>

                    <div className="flex items-center space-x-1 font-mono">
                      <Compass className="w-3.5 h-3.5 text-blue-500" />
                      <span>GPS: {sos.gpsAccuracy}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Batt: {sos.batteryLevel}%</span>
                    </div>

                    <div className="flex items-center space-x-1 font-mono text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      <Radio className="w-3.5 h-3.5" />
                      <span>Route: {sos.networkRoute}</span>
                    </div>
                  </div>

                  {sos.assignedUnit && (
                    <div className="text-xs text-indigo-700 font-medium bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100 inline-block">
                      <strong>Assigned Unit:</strong> {sos.assignedUnit}
                    </div>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 self-start lg:self-center">
                  {sos.status === 'delivered' && (
                    <button
                      onClick={() => updateSosStatus(sos.id, 'dispatched')}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>DISPATCH RESCUE TEAM</span>
                    </button>
                  )}

                  {sos.status === 'dispatched' && (
                    <button
                      onClick={() => updateSosStatus(sos.id, 'rescued')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>MARK AS RESCUED</span>
                    </button>
                  )}

                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('/map')}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>Locate on Map</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
