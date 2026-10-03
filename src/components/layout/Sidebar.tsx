import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  AlertOctagon, 
  Radio, 
  HeartHandshake, 
  Map, 
  BellRing, 
  FileEdit, 
  UserCheck, 
  Compass, 
  LayoutDashboard, 
  Siren, 
  ClipboardList, 
  Wrench, 
  GitFork, 
  BarChart3,
  Layers,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate }) => {
  const { role, sosAlerts, reports, recoveryPercentage, userSos } = useApp();

  const activeSosCount = sosAlerts.filter(a => a.status !== 'rescued').length;
  const pendingReportsCount = reports.filter(r => r.status === 'reported' || r.status === 'verified').length;

  const citizenNav = [
    { label: 'Home', icon: Home, route: '/' },
    { 
      label: 'Emergency SOS', 
      icon: AlertOctagon, 
      route: '/emergency', 
      highlight: true, 
      badge: userSos ? 'ACTIVE' : undefined 
    },
    { label: 'RescueMesh', icon: Radio, route: '/rescue-mesh', badge: 'Mesh Hop' },
    { label: 'I Need Help', icon: HeartHandshake, route: '/help' },
    { label: 'Recovery Map', icon: Map, route: '/map' },
    { label: 'Verified Updates', icon: BellRing, route: '/updates' },
    { label: 'Report a Problem', icon: FileEdit, route: '/report' },
    { 
      label: 'My Recovery', 
      icon: UserCheck, 
      route: '/recovery',
      progress: `${recoveryPercentage}%`
    },
    { label: 'Recovery Guidance', icon: Compass, route: '/guidance' },
  ];

  const responderNav = [
    { label: 'Operations Command', icon: LayoutDashboard, route: '/dashboard' },
    { 
      label: 'Active SOS Alerts', 
      icon: Siren, 
      route: '/dashboard/sos',
      badge: `${activeSosCount} Active`,
      badgeColor: 'bg-red-600 text-white'
    },
    { 
      label: 'Citizen Reports', 
      icon: ClipboardList, 
      route: '/dashboard/reports',
      badge: `${pendingReportsCount}`,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { label: 'Field Team Tasks', icon: Wrench, route: '/dashboard/tasks' },
    { label: 'Tactical Map', icon: Map, route: '/map' },
    { label: 'Recovery Impact Graph', icon: GitFork, route: '/dashboard/impact' },
    { label: 'Recovery Analytics', icon: BarChart3, route: '/dashboard/analytics' },
  ];

  const authorityNav = [
    { label: 'System Overview', icon: LayoutDashboard, route: '/dashboard' },
    { 
      label: 'SOS Operations', 
      icon: Siren, 
      route: '/dashboard/sos',
      badge: `${activeSosCount}`,
      badgeColor: 'bg-red-600 text-white'
    },
    { label: 'All Incident Reports', icon: ClipboardList, route: '/dashboard/reports' },
    { label: 'Task Management', icon: Wrench, route: '/dashboard/tasks' },
    { label: 'Publish Updates', icon: BellRing, route: '/updates' },
    { label: 'Cascade Impact', icon: GitFork, route: '/dashboard/impact' },
    { label: 'Analytics & KPIs', icon: BarChart3, route: '/dashboard/analytics' },
  ];

  const currentNav = role === 'citizen' ? citizenNav : role === 'responder' ? responderNav : authorityNav;

  return (
    <aside aria-label="Main sidebar navigation" className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none">
      
      {/* Role Context Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Active Portal:
            </span>
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {role}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {role === 'citizen' && 'Citizen Emergency & Restoration Portal'}
          {role === 'responder' && 'Disaster Response Tactical Console'}
          {role === 'authority' && 'District Disaster Management Authority'}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {currentNav.map((item) => {
          const isActive = currentRoute === item.route;
          const Icon = item.icon;

          return (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                item.highlight
                  ? isActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-900/40'
                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold border border-red-500/30'
                  : isActive
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${item.highlight ? (isActive ? 'text-white' : 'text-red-400') : isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                {item.progress && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                    {item.progress}
                  </span>
                )}
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && !item.progress && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Citizen Recovery Mini Progress Widget */}
      {role === 'citizen' && (
        <div className="p-4 m-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-300">My Recovery</span>
            <span className="font-mono font-bold text-emerald-400">{recoveryPercentage}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${recoveryPercentage}%` }}
            />
          </div>
          <button
            onClick={() => onNavigate('/recovery')}
            className="w-full py-1.5 text-center text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline"
          >
            Manage Checklist →
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Ward 12 Node #401</span>
        <span className="font-mono text-emerald-400">v1.0 Demo</span>
      </div>

    </aside>
  );
};
