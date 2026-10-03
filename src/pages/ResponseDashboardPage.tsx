import React from 'react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { ActiveSosPanel } from '../../components/dashboard/ActiveSosPanel';
import { 
  ClipboardList, 
  ShieldCheck, 
  Wrench, 
  CheckCircle2, 
  AlertOctagon, 
  Map, 
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

interface ResponseDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const ResponseDashboardPage: React.FC<ResponseDashboardPageProps> = ({ onNavigate }) => {
  const { reports, sosAlerts } = useApp();

  const totalReports = reports.length;
  const verifiedCount = reports.filter(r => r.status !== 'reported').length;
  const workingCount = reports.filter(r => r.status === 'working').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const activeSosCount = sosAlerts.filter(s => s.status !== 'rescued').length;

  return (
    <div className="space-y-6 pb-16 text-left">
      
      {/* Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Tactical Operations Command • Patna Central
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Emergency & Recovery Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('/dashboard/sos')}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
          >
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            <span>SOS Queue ({activeSosCount})</span>
          </button>

          <button
            onClick={() => onNavigate('/dashboard/tasks')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
          >
            <Wrench className="w-4 h-4" />
            <span>Team Tasks</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards (Section 27) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="TOTAL REPORTS"
          value={totalReports}
          change="+8 in last hour"
          changeType="neutral"
          icon={ClipboardList}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          subtext="Logged citizen damage tickets"
        />

        <KpiCard
          title="VERIFIED"
          value={verifiedCount}
          change="82% vetted"
          changeType="positive"
          icon={ShieldCheck}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          subtext="Confirmed by control room"
        />

        <KpiCard
          title="WORKING"
          value={workingCount}
          change="3 squads active"
          changeType="positive"
          icon={Wrench}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          subtext="On-site restoration ongoing"
        />

        <KpiCard
          title="RESOLVED"
          value={resolvedCount}
          change="Completed"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          subtext="Verified safe & certified"
        />
      </div>

      {/* Main Grid: Active SOS Triage + Recent Reports Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Active SOS Alerts */}
        <div className="lg:col-span-2 space-y-6">
          <ActiveSosPanel onNavigate={onNavigate} />

          {/* Recent Reports List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-slate-900">
                Recent Citizen Incident Reports
              </h3>
              <button
                onClick={() => onNavigate('/dashboard/reports')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>View All Table</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {reports.slice(0, 3).map((r) => (
                <div key={r.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-black text-slate-900">{r.id}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white border text-slate-700">
                        {r.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">{r.title}</h4>
                    <span className="text-[11px] text-slate-500">{r.location}</span>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-xl ${
                    r.status === 'resolved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : r.status === 'working' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Tactical Map Preview + Quick Command Links */}
        <div className="space-y-6">
          
          {/* Tactical Map Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 text-left">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <Map className="w-4 h-4 text-blue-600" />
                <span>Tactical Map Preview</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">LIVE GIS</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Ward 12 active flood zones and peer-to-peer relay repeater grid.
            </p>

            <div 
              onClick={() => onNavigate('/map')}
              className="relative h-44 rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 cursor-pointer group"
            >
              <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-slate-900/90 text-white font-bold text-xs shadow-lg group-hover:scale-105 transition-transform flex items-center space-x-1.5">
                  <span>Open Full Tactical Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Quick Operations Modules */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">
              Operations Navigation
            </h3>

            <button
              onClick={() => onNavigate('/dashboard/impact')}
              className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-left transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-white">Recovery Impact Graph</div>
                <div className="text-[10px] text-slate-400">Inspect secondary lifeline cascades</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/dashboard/tasks')}
              className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-left transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-white">Team Task & Proof Verification</div>
                <div className="text-[10px] text-slate-400">Review before / working / after photos</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/dashboard/analytics')}
              className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-left transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-white">Resolution & Capacity Analytics</div>
                <div className="text-[10px] text-slate-400">Charts, metrics, and recovery velocity</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
