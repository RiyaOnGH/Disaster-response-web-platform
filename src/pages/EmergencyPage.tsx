import React from 'react';
import { useApp } from '../../context/AppContext';
import { SOSButton } from '../../components/emergency/SOSButton';
import { AlertOctagon, Radio, ShieldAlert, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

interface EmergencyPageProps {
  onNavigate: (route: string) => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onNavigate }) => {
  const { triggerSos, userSos, cancelSos, networkStatus } = useApp();

  const handleSosTriggered = async (emergencyType: string) => {
    await triggerSos(emergencyType);
    onNavigate('/rescue-mesh');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 text-left">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-red-600 font-bold">
              Immediate Life-Safety Distress Mode
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Emergency SOS Beacon
          </h1>
        </div>

        {/* Toll-Free Disaster Helpline */}
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
          <PhoneCall className="w-4 h-4 text-emerald-600" />
          <span>Disaster Helpline: <strong className="font-mono text-slate-900">1070 / 112</strong></span>
        </div>
      </div>

      {/* If SOS is already active */}
      {userSos && (
        <div className="p-6 rounded-3xl bg-red-600 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertOctagon className="w-8 h-8 text-white animate-bounce shrink-0 mt-1" />
            <div>
              <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded font-bold">
                {userSos.id} • BEACON ACTIVE
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl text-white mt-1">
                {userSos.emergencyType}
              </h3>
              <p className="text-xs text-red-100 mt-0.5">
                Routing: {userSos.networkRoute} • Ward 12, Patna • Status: {userSos.status.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onNavigate('/rescue-mesh')}
              className="px-4 py-2 rounded-xl bg-white text-red-700 font-bold text-xs shadow-md hover:bg-red-50 flex items-center space-x-1"
            >
              <span>View Mesh Hops</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={cancelSos}
              className="px-3 py-2 rounded-xl bg-red-800 text-white font-semibold text-xs hover:bg-red-900"
            >
              Stand Down
            </button>
          </div>
        </div>
      )}

      {/* Main SOS Trigger Centerpiece */}
      <SOSButton onTriggered={handleSosTriggered} />

      {/* Offline Mode Alert */}
      {networkStatus === 'offline' && (
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
          <Radio className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-950">Cellular Outage Detected</h4>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              Commercial tower connectivity is unavailable in Ward 12. Triggering SOS will automatically transmit via <strong>RescueMesh</strong> over nearby peer relay nodes until it reaches an active satellite or command gateway.
            </p>
          </div>
        </div>
      )}

      {/* Guidance Note */}
      <div className="p-5 rounded-3xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
          Important Emergency Guidelines:
        </h4>
        <ul className="list-disc pl-4 space-y-1">
          <li>Keep your phone turned ON to allow neighboring RescueMesh nodes to forward packets.</li>
          <li>If in standing floodwaters, move to an elevated roof or high ground if safe to do so.</li>
          <li>Do not touch submerged electrical cables, poles, or meters.</li>
        </ul>
      </div>

    </div>
  );
};
