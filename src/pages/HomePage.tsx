import React from 'react';
import { 
  AlertOctagon, 
  Map, 
  HeartHandshake, 
  BellRing, 
  FileEdit, 
  UserCheck, 
  Compass, 
  Radio, 
  ShieldCheck, 
  ArrowRight,
  Droplets,
  HeartPulse,
  Home as HomeIcon,
  Zap,
  Activity,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { recoveryPercentage, userSos, networkStatus } = useApp();

  const quickActions = [
    {
      title: 'I NEED HELP',
      subtitle: 'Find clean drinking water, food kitchens, medical posts, and safe shelters.',
      icon: HeartHandshake,
      route: '/help',
      badge: 'Immediate Relief',
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400',
      iconBg: 'bg-blue-600 text-white'
    },
    {
      title: 'RECOVERY MAP',
      subtitle: 'Explore live GPS locations of shelters, open roads, and active relief units.',
      icon: Map,
      route: '/map',
      badge: 'Live Map',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-600 text-white'
    },
    {
      title: 'LOCAL UPDATES',
      subtitle: 'Access municipal verified bulletins on flood levels, drinking water, and grid power.',
      icon: BellRing,
      route: '/updates',
      badge: 'Verified Info',
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:border-indigo-400',
      iconBg: 'bg-indigo-600 text-white'
    },
    {
      title: 'REPORT A PROBLEM',
      subtitle: 'Submit geo-tagged photos of submerged underpasses, fallen trees, and severed cables.',
      icon: FileEdit,
      route: '/report',
      badge: 'Damage Form',
      color: 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-400',
      iconBg: 'bg-amber-500 text-slate-950'
    },
    {
      title: 'MY RECOVERY',
      subtitle: `Track your household relief checklist (${recoveryPercentage}% done) and check repair tickets.`,
      icon: UserCheck,
      route: '/recovery',
      badge: `${recoveryPercentage}% Progress`,
      color: 'bg-purple-50 text-purple-900 border-purple-200 hover:border-purple-400',
      iconBg: 'bg-purple-600 text-white'
    },
    {
      title: 'RECOVERY GUIDANCE',
      subtitle: 'Know what to do next for house damage surveys, lost Aadhaar/documents, and insurance.',
      icon: Compass,
      route: '/guidance',
      badge: 'Citizen Guides',
      color: 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-400',
      iconBg: 'bg-slate-800 text-white'
    },
  ];

  const journeySteps = [
    { label: 'Disaster', icon: '🚨' },
    { label: 'Emergency', icon: '🆘' },
    { label: 'RescueMesh', icon: '📡' },
    { label: 'Rescue', icon: '🚑' },
    { label: 'Response', icon: '🏢' },
    { label: 'Resources', icon: '🗺️' },
    { label: 'Verified Info', icon: '📢' },
    { label: 'Report', icon: '📝' },
    { label: 'Recovery Work', icon: '👷' },
    { label: 'Proof & Verify', icon: '📸' },
    { label: 'Track Recovery', icon: '👤' },
    { label: 'Recovered', icon: '✅' },
  ];

  return (
    <div className="space-y-10 pb-16 text-left">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-navy-900 text-white p-6 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold mb-6">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>COMMUNITY DISASTER RESILIENCE PLATFORM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Emergency <span className="text-red-500">→</span> Rescue <span className="text-blue-400">→</span> Response <span className="text-emerald-400">→</span> Recovery
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 font-medium mt-4 max-w-2xl leading-relaxed">
            One connected platform to send emergency SOS, find essential resources, report local damage, and track complete community recovery.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8">
            <button
              onClick={() => onNavigate('/emergency')}
              className={`px-6 py-3.5 rounded-2xl font-black text-sm text-white shadow-xl transition-all transform hover:scale-[1.02] flex items-center space-x-2.5 ${
                userSos
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-300'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/40'
              }`}
            >
              <AlertOctagon className="w-5 h-5 animate-bounce" />
              <span>{userSos ? 'VIEW ACTIVE SOS BEACON' : '🆘 SEND EMERGENCY SOS'}</span>
            </button>

            <button
              onClick={() => onNavigate('/help')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm shadow-md transition-all flex items-center space-x-2"
            >
              <span>🗺️ FIND HELP & RESOURCES</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('/rescue-mesh')}
              className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs border border-slate-700 flex items-center space-x-2 transition-colors"
            >
              <Radio className="w-4 h-4" />
              <span>RescueMesh Simulator</span>
            </button>
          </div>

        </div>

        {/* Decorative Grid and Background Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* CORE JOURNEY PROGRESSION STRIP */}
      <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm overflow-x-auto scrollbar-none">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
          Complete Disaster-to-Restoration Lifecycle
        </div>
        <div className="flex items-center space-x-2 min-w-[780px]">
          {journeySteps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shrink-0">
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </div>
              {idx < journeySteps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* QUICK-ACTION DASHBOARD CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Immediate Citizen Assistance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an action below to access life-support resources or report community disruptions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                onClick={() => onNavigate(action.route)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer transform hover:-translate-y-1 shadow-xs hover:shadow-md flex flex-col justify-between ${action.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold bg-white text-slate-800 shadow-xs border border-slate-200">
                      {action.badge}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-slate-900 tracking-tight">
                    {action.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                    {action.subtitle}
                  </p>
                </div>

                <div className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                  <span>Open Section</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TAGLINE BANNER */}
      <section className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            The RescueMesh + RecoveryBoard Promise
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
            “When the network goes down, RescueMesh keeps the SOS moving. When the network comes back, RecoveryBoard keeps the recovery moving.”
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Designed for municipal disaster authorities, frontline first responders, and affected citizens.
          </p>
        </div>
      </section>

    </div>
  );
};
