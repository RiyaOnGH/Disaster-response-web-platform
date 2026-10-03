import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Droplets,
  HeartPulse,
  Home,
  Utensils,
  Zap,
  Bus,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import { RecoveryResource, CitizenReport, SOSAlert } from '../../types';

interface ResourceDrawerProps {
  item: RecoveryResource | CitizenReport | SOSAlert | null;
  type: 'resource' | 'report' | 'sos' | null;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

export const ResourceDrawer: React.FC<ResourceDrawerProps> = ({ item, type, onClose, onNavigate }) => {
  const [directionsActive, setDirectionsActive] = useState(false);

  if (!item) return null;

  const isResource = type === 'resource';
  const isReport = type === 'report';
  const isSos = type === 'sos';

  const res = isResource ? (item as RecoveryResource) : null;
  const rep = isReport ? (item as CitizenReport) : null;
  const sos = isSos ? (item as SOSAlert) : null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 max-w-md w-full bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-900 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
              isSos 
                ? 'bg-red-600 text-white' 
                : isReport 
                ? 'bg-amber-500 text-slate-950' 
                : 'bg-blue-600 text-white'
            }`}>
              {isSos ? '🚨 Active SOS' : isReport ? '📝 Citizen Incident' : '📍 Verified Resource'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {isReport ? rep?.id : isSos ? sos?.id : res?.operatingHours}
            </span>
          </div>

          <h3 className="font-extrabold text-lg text-white mt-1.5 leading-snug">
            {isResource && res?.name}
            {isReport && rep?.title}
            {isSos && sos?.emergencyType}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Scrollable Body */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 text-left">
        
        {/* Status Chip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${
              (res?.status === 'available' || rep?.status === 'resolved') 
                ? 'bg-emerald-500' 
                : (res?.status === 'limited' || rep?.status === 'working')
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`} />
            <span className="font-bold text-sm text-slate-800 capitalize">
              {isResource && `${res?.status} for public access`}
              {isReport && `Status: ${rep?.status.replace('_', ' ')}`}
              {isSos && `Status: ${sos?.status}`}
            </span>
          </div>

          {isResource && res?.isVerified && (
            <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Safe</span>
            </div>
          )}
        </div>

        {/* Location & Distance */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-800">
                {isResource && res?.address}
                {isReport && rep?.location}
                {isSos && sos?.location}
              </div>
              <div className="text-slate-500">
                {isResource && res?.ward}
                {isReport && rep?.ward}
                {isSos && sos?.ward}
              </div>
            </div>
          </div>

          {isResource && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
              <span className="text-slate-500">Radial Distance:</span>
              <span className="font-bold text-slate-900 font-mono">{res?.distanceKm} km from you</span>
            </div>
          )}
        </div>

        {/* Resource Details / Report Photo */}
        {isResource && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resource Specs</h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {res?.details}
            </p>

            {res?.capacity && (
              <div className="flex items-center space-x-2 text-xs text-slate-600 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>Capacity:</strong> {res.capacity}</span>
              </div>
            )}
          </div>
        )}

        {isReport && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Incident Details</h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {rep?.description}
            </p>

            {rep?.photoUrl && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500">Uploaded Evidence Photo:</span>
                <img 
                  src={rep.photoUrl} 
                  alt={rep.title} 
                  className="w-full h-44 object-cover rounded-2xl border border-slate-200 shadow-xs" 
                />
              </div>
            )}

            {rep?.assignedTeam && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Assigned Team</div>
                <div className="font-bold text-slate-800">{rep.assignedTeam}</div>
                {rep.teamContact && <div className="text-blue-600 text-[11px] mt-0.5">{rep.teamContact}</div>}
              </div>
            )}
          </div>
        )}

        {isSos && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Distress Telemetry</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase">Victim</span>
                <div className="font-bold text-slate-800">{sos?.victimName}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase">Routing</span>
                <div className="font-bold text-slate-800 font-mono">{sos?.networkRoute}</div>
              </div>
            </div>
          </div>
        )}

        {/* Turn-by-Turn Directions Simulation Box */}
        {directionsActive && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-950 animate-in fade-in duration-200">
            <div className="flex items-center space-x-1.5 font-bold">
              <Navigation className="w-4 h-4 text-emerald-700" />
              <span>Simulated Route via Safe Corridors</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-emerald-900 pl-2 border-l-2 border-emerald-400">
              <div>1. Head South on Lane 3 toward Main Road (Avoid underpass) (300m)</div>
              <div>2. Turn right onto Elevated Bailey Corridor (Dry route) (700m)</div>
              <div>3. Destination is on your left marked with Green Rescue Pennant (200m)</div>
            </div>
            <div className="text-[10px] text-emerald-700 font-sans mt-1">
              Estimated walking time: 14 mins (Water depth &lt; 6 inches)
            </div>
          </div>
        )}

      </div>

      {/* Drawer Action Bar */}
      <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {isResource && res?.contactNumber && (
            <a
              href={`tel:${res.contactNumber}`}
              className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>Call Helpline</span>
            </a>
          )}

          <button
            onClick={() => setDirectionsActive(!directionsActive)}
            className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/20"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{directionsActive ? 'Hide Directions' : 'Get Directions'}</span>
          </button>
        </div>

        {isReport && onNavigate && (
          <button
            onClick={() => onNavigate('/dashboard/reports')}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center space-x-1"
          >
            <span>Manage in Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};
