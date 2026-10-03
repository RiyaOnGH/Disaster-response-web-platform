import React from 'react';
import { ActiveSosPanel } from '../../components/dashboard/ActiveSosPanel';
import { AlertOctagon, Radio } from 'lucide-react';

interface SosDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const SosDashboardPage: React.FC<SosDashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 text-left">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="text-xs font-mono uppercase tracking-wider text-red-600 font-bold">
            High Priority Operations Triage
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Active Emergency SOS Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time distress beacons received via RescueMesh peer hops and normal gateways. Dispatch NDRF/SDRF units immediately.
        </p>
      </div>

      <ActiveSosPanel onNavigate={onNavigate} />
    </div>
  );
};
