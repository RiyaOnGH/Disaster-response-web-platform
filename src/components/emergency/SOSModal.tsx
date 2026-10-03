import React, { useState } from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  Battery, 
  Signal, 
  WifiOff, 
  AlertTriangle, 
  X, 
  Send,
  ShieldAlert,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: string) => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { networkStatus, currentLocation } = useApp();
  const [selectedType, setSelectedType] = useState('Person Trapped (Water Ingress)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const emergencyTypes = [
    { id: 'Person Trapped (Water Ingress)', label: 'Person Trapped (Flooding / Water)', icon: '🌊', severity: 'Critical' },
    { id: 'Critical Medical / Oxygen Depletion', label: 'Urgent Medical Emergency / Oxygen', icon: '🏥', severity: 'Life Threatening' },
    { id: 'Structural Wall / Roof Collapse', label: 'Building Collapse / Debris Entrapment', icon: '🏚️', severity: 'Critical' },
    { id: 'Electrical Sparking / Fire Hazard', label: 'Substation Sparking / Fire Hazard', icon: '⚡', severity: 'High' },
    { id: 'Elderly / Infant Immediate Evacuation', label: 'Elderly / Infant Evacuation Needed', icon: '👶', severity: 'High' }
  ];

  const handleSend = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(selectedType);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-red-200 shadow-2xl overflow-hidden text-left animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-red-600 text-white p-6 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <AlertOctagon className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-red-100 font-bold">
                Emergency Distress Protocol
              </div>
              <h3 className="text-xl font-black text-white">Send Emergency SOS</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-900 text-xs font-medium leading-relaxed">
            <strong>Are you sure you want to send an emergency SOS?</strong>
            <p className="mt-1 text-red-800">
              Your exact location, device battery status, and distress code will be broadcast directly to municipal response units and nearby RescueMesh relays.
            </p>
          </div>

          {/* Telemetry Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Location</div>
              <div className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate">{currentLocation}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">GPS Precision</div>
              <div className="font-bold text-emerald-700 flex items-center space-x-1 mt-0.5">
                <span>±4m (High)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Battery</div>
              <div className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                <Battery className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>64%</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Routing</div>
              <div className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                {networkStatus === 'offline' ? (
                  <span className="text-amber-600 font-mono text-[11px]">RescueMesh</span>
                ) : (
                  <span className="text-emerald-600 font-mono text-[11px]">Direct IP</span>
                )}
              </div>
            </div>
          </div>

          {/* Select Distress Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Distress Nature:
            </label>
            <div className="space-y-2">
              {emergencyTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    selectedType === type.id
                      ? 'border-red-600 bg-red-50/70 text-red-950 ring-2 ring-red-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-lg">{type.icon}</span>
                    <span>{type.label}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-white text-red-700 border border-red-200">
                    {type.severity}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all transform hover:scale-[1.02]"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{isSubmitting ? 'DISPATCHING SOS...' : 'CONFIRM & SEND SOS'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
