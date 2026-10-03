import React from 'react';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { Map, Layers, Radio } from 'lucide-react';

interface MapPageProps {
  onNavigate: (route: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-4 pb-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              GIS Operations Interface
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Disaster Recovery & Tactical Map
          </h1>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing verified community lifelines, road clearances, and active RescueMesh nodes.
        </div>
      </div>

      {/* Interactive Map Component */}
      <InteractiveMap onNavigate={onNavigate} />
    </div>
  );
};
