import React from 'react';
import { Home, HeartHandshake, AlertOctagon, Map, UserCheck, FileEdit, LayoutDashboard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentRoute, onNavigate }) => {
  const { role, userSos } = useApp();

  return (
    <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg pb-safe">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => onNavigate('/')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            currentRoute === '/' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Help (Citizen) or Dashboard (Responder) */}
        {role === 'citizen' ? (
          <button
            onClick={() => onNavigate('/help')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
              currentRoute.startsWith('/help') ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-5 h-5 mb-0.5" />
            <span>Help</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('/dashboard')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
              currentRoute === '/dashboard' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Ops</span>
          </button>
        )}

        {/* SOS - Elevated Center Hero Button */}
        <button
          onClick={() => onNavigate('/emergency')}
          className="relative -top-4 flex flex-col items-center focus:outline-none"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-transform active:scale-95 ${
            userSos 
              ? 'bg-red-600 animate-sos-pulse ring-4 ring-red-300' 
              : 'bg-red-600 hover:bg-red-700 shadow-red-600/40'
          }`}>
            <AlertOctagon className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 mt-1">
            {userSos ? 'Active SOS' : 'SOS'}
          </span>
        </button>

        {/* Map */}
        <button
          onClick={() => onNavigate('/map')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            currentRoute === '/map' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span>Map</span>
        </button>

        {/* Report (Citizen) or Tasks (Responder) */}
        {role === 'citizen' ? (
          <button
            onClick={() => onNavigate('/recovery')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
              currentRoute === '/recovery' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-5 h-5 mb-0.5" />
            <span>Recovery</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('/dashboard/tasks')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
              currentRoute === '/dashboard/tasks' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileEdit className="w-5 h-5 mb-0.5" />
            <span>Tasks</span>
          </button>
        )}

      </div>
    </nav>
  );
};
