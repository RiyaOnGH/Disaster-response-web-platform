import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, PieChart, TrendingUp, ShieldCheck, Droplet, HeartPulse, Home, Zap } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { reports, resources, sosAlerts, checklist } = useApp();

  const totalReports = reports.length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const workingCount = reports.filter(r => r.status === 'working').length;
  const assignedCount = reports.filter(r => r.status === 'assigned').length;
  const reportedCount = reports.filter(r => r.status === 'reported').length;

  const roadCount = reports.filter(r => r.category === 'road_blocked').length;
  const elecCount = reports.filter(r => r.category === 'electricity').length;
  const treeCount = reports.filter(r => r.category === 'fallen_tree').length;
  const waterCount = reports.filter(r => r.category === 'water').length;

  const categories = [
    { label: 'Road Blocked', count: roadCount, color: 'bg-red-500', pct: Math.round((roadCount / totalReports) * 100) || 40 },
    { label: 'Electricity / Grid', count: elecCount, color: 'bg-amber-500', pct: Math.round((elecCount / totalReports) * 100) || 25 },
    { label: 'Fallen Trees', count: treeCount, color: 'bg-emerald-500', pct: Math.round((treeCount / totalReports) * 100) || 20 },
    { label: 'Water Pipelines', count: waterCount, color: 'bg-blue-500', pct: Math.round((waterCount / totalReports) * 100) || 15 },
  ];

  const statuses = [
    { label: 'Resolved & Safe', count: resolvedCount, color: 'bg-emerald-500', text: 'text-emerald-700' },
    { label: 'Working (On-Site)', count: workingCount, color: 'bg-amber-500', text: 'text-amber-700' },
    { label: 'Team Assigned', count: assignedCount, color: 'bg-blue-500', text: 'text-blue-700' },
    { label: 'Awaiting Triage', count: reportedCount, color: 'bg-purple-500', text: 'text-purple-700' },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Reports by Category */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">Volume Breakdown</span>
              <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                Incident Reports by Category
              </h3>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {categories.map((cat) => (
              <div key={cat.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">{cat.label}</span>
                  <span className="font-mono text-slate-900">{cat.count} reports ({cat.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${cat.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(cat.pct, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Resolution Status Pipeline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">Resolution Velocity</span>
              <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                Incident Lifecycle Distribution
              </h3>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <PieChart className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {statuses.map((st) => (
              <div key={st.label} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                  <span className="text-xs font-bold text-slate-700">{st.label}</span>
                </div>
                <div className={`text-2xl font-black font-mono mt-1 ${st.text}`}>
                  {st.count}
                </div>
                <span className="text-[10px] text-slate-400">
                  {Math.round((st.count / (totalReports || 1)) * 100)}% of total
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar combining all */}
          <div className="w-full bg-slate-100 rounded-full h-3.5 mt-5 flex overflow-hidden">
            <div style={{ width: `${(resolvedCount / (totalReports || 1)) * 100}%` }} className="bg-emerald-500 h-full" title="Resolved" />
            <div style={{ width: `${(workingCount / (totalReports || 1)) * 100}%` }} className="bg-amber-500 h-full" title="Working" />
            <div style={{ width: `${(assignedCount / (totalReports || 1)) * 100}%` }} className="bg-blue-500 h-full" title="Assigned" />
            <div style={{ width: `${(reportedCount / (totalReports || 1)) * 100}%` }} className="bg-purple-500 h-full" title="Reported" />
          </div>
        </div>

      </div>

      {/* Chart 3: Essential Resource Capacities */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 font-bold">Field Reserves</span>
            <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
              Community Resource Operational Capacity
            </h3>
          </div>
          <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {resources.length} Verified Facilities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200">
            <div className="flex items-center space-x-2 text-cyan-700 font-bold text-xs">
              <Droplet className="w-4 h-4" />
              <span>Potable Water Reserves</span>
            </div>
            <div className="text-2xl font-black font-mono text-cyan-950 mt-1">20,000 Liters</div>
            <div className="w-full bg-cyan-200 rounded-full h-2 mt-2">
              <div className="bg-cyan-600 h-2 rounded-full w-[78%]" />
            </div>
            <span className="text-[10px] text-cyan-700 mt-1 block">78% of daily emergency quota</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
              <HeartPulse className="w-4 h-4" />
              <span>Trauma Beds Available</span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-950 mt-1">38 Beds</div>
            <div className="w-full bg-emerald-200 rounded-full h-2 mt-2">
              <div className="bg-emerald-600 h-2 rounded-full w-[62%]" />
            </div>
            <span className="text-[10px] text-emerald-700 mt-1 block">62% occupancy rate</span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs">
              <Home className="w-4 h-4" />
              <span>Relief Shelter Cots</span>
            </div>
            <div className="text-2xl font-black font-mono text-indigo-950 mt-1">170 Cots Free</div>
            <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
              <div className="bg-indigo-600 h-2 rounded-full w-[65%]" />
            </div>
            <span className="text-[10px] text-indigo-700 mt-1 block">280 of 450 capacity filled</span>
          </div>
        </div>
      </div>

    </div>
  );
};
