import React from 'react';
import { ImpactGraph } from '../../components/dashboard/ImpactGraph';
import { GitFork } from 'lucide-react';

export const ImpactDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 text-left">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Cascade Decision Support
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Infrastructure Dependency & Recovery Impact
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Map physical damage nodes to hospital access, water pumping stations, and community lifelines.
        </p>
      </div>

      <ImpactGraph />
    </div>
  );
};
