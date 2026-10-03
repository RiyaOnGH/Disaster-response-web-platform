import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  MapPin, 
  Bell, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  User, 
  Check, 
  ChevronDown, 
  ExternalLink,
  Activity,
  Layers
} from 'lucide-react';
import { UserRole, NetworkStatus } from '../../types';

interface HeaderProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentRoute }) => {
  const { 
    role, 
    setRole, 
    networkStatus, 
    setNetworkStatus, 
    currentLocation, 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    userSos
  } = useApp();

  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const getNetworkBadge = () => {
    switch (networkStatus) {
      case 'connected':
        return {
          icon: <Wifi className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Connected',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'limited':
        return {
          icon: <Activity className="w-3.5 h-3.5 text-amber-600 animate-pulse" />,
          label: 'Limited Net',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'offline':
        return {
          icon: <WifiOff className="w-3.5 h-3.5 text-red-600 animate-pulse" />,
          label: 'No Network',
          badgeClass: 'bg-red-50 text-red-700 border-red-200'
        };
    }
  };

  const netBadge = getNetworkBadge();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Recovery<span className="text-red-600">Board</span></span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded border border-slate-200">
                  + RescueMesh
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">Disaster Response & Community Recovery</p>
            </div>
          </div>

          {/* Center Info: Current Ward & Live SOS Beacon if active */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{currentLocation}</span>
            </div>

            {userSos && (
              <button 
                onClick={() => onNavigate('/rescue-mesh')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-xs animate-bounce"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>ACTIVE SOS BEACON</span>
              </button>
            )}
          </div>

          {/* Right Controls: Network Simulator, Notifications, Role Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Network Simulator Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNetworkMenu(!showNetworkMenu);
                  setShowRoleMenu(false);
                  setShowNotifMenu(false);
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${netBadge.badgeClass}`}
                title="Simulate network connection state"
              >
                {netBadge.icon}
                <span className="hidden sm:inline">{netBadge.label}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
              </button>

              {showNetworkMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Network Simulator
                  </div>
                  <button
                    onClick={() => { setNetworkStatus('connected'); setShowNetworkMenu(false); }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-50 ${networkStatus === 'connected' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>Connected (Normal)</div>
                        <div className="text-[10px] text-slate-400">Full 4G/5G Broadband</div>
                      </div>
                    </div>
                    {networkStatus === 'connected' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => { setNetworkStatus('limited'); setShowNetworkMenu(false); }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-50 ${networkStatus === 'limited' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-amber-600" />
                      <div>
                        <div>Limited Connection</div>
                        <div className="text-[10px] text-slate-400">Degraded bandwidth</div>
                      </div>
                    </div>
                    {networkStatus === 'limited' && <Check className="w-4 h-4 text-amber-600" />}
                  </button>

                  <button
                    onClick={() => { setNetworkStatus('offline'); setShowNetworkMenu(false); }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-50 ${networkStatus === 'offline' ? 'bg-red-50 text-red-900 font-semibold' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center space-x-2">
                      <WifiOff className="w-4 h-4 text-red-600" />
                      <div>
                        <div>No Normal Network</div>
                        <div className="text-[10px] text-slate-400">RescueMesh Peer Routing</div>
                      </div>
                    </div>
                    {networkStatus === 'offline' && <Check className="w-4 h-4 text-red-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowNetworkMenu(false);
                  setShowRoleMenu(false);
                }}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Live Alerts ({notifications.length})</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[11px] text-blue-600 font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          if (n.linkRoute) {
                            onNavigate(n.linkRoute);
                            setShowNotifMenu(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer text-left ${
                          !n.read ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-0.5">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowNetworkMenu(false);
                  setShowNotifMenu(false);
                }}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                  {role === 'citizen' ? 'C' : role === 'responder' ? 'R' : 'A'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] uppercase text-slate-400 leading-none">Role</div>
                  <div className="capitalize font-bold text-slate-900 leading-tight">
                    {role === 'citizen' ? 'Citizen' : role === 'responder' ? 'Response Team' : 'Authority'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona
                  </div>
                  
                  <button
                    onClick={() => { setRole('citizen'); setShowRoleMenu(false); }}
                    className={`w-full flex items-start space-x-2.5 p-2.5 rounded-xl text-left hover:bg-slate-50 ${
                      role === 'citizen' ? 'bg-blue-50 text-blue-950 font-bold border border-blue-200' : 'text-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <div>Citizen (Shikha Verma)</div>
                      <div className="text-[11px] text-slate-500 font-normal">Send SOS, find water/food, report damage</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setRole('responder'); setShowRoleMenu(false); onNavigate('/dashboard'); }}
                    className={`w-full flex items-start space-x-2.5 p-2.5 rounded-xl text-left hover:bg-slate-50 ${
                      role === 'responder' ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200' : 'text-slate-700'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <div>Response Team (Alpha Lead)</div>
                      <div className="text-[11px] text-slate-500 font-normal">Manage field tasks, triage SOS, upload proof</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setRole('authority'); setShowRoleMenu(false); onNavigate('/dashboard'); }}
                    className={`w-full flex items-start space-x-2.5 p-2.5 rounded-xl text-left hover:bg-slate-50 ${
                      role === 'authority' ? 'bg-purple-50 text-purple-950 font-bold border border-purple-200' : 'text-slate-700'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-purple-600 mt-0.5" />
                    <div>
                      <div>Authority / Control Room</div>
                      <div className="text-[11px] text-slate-500 font-normal">System verification, publish alerts, analytics</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
