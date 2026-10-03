import React from 'react';
import { AnalyticsCharts } from '../../components/dashboard/AnalyticsCharts';
import { BarChart3 } from 'lucide-react';

export const AnalyticsDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 text-left">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Disaster Response Analytics
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Recovery Velocity & Resource Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Metrics on municipal ticket resolution, emergency shelter occupancy, and potable water stock levels.
        </p>
      </div>

      <AnalyticsCharts />
    </div>
  );
};
