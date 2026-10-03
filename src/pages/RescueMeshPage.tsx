import React from 'react';
import { MeshVisualizer } from '../../components/rescue-mesh/MeshVisualizer';
import { Radio, ShieldCheck, ArrowRight, Info, AlertOctagon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RescueMeshPageProps {
  onNavigate: (route: string) => void;
}

export const RescueMeshPage: React.FC<RescueMeshPageProps> = ({ onNavigate }) => {
  const { userSos, triggerSos } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 text-left">
      
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-600 font-bold">
              Autonomous Mesh Relay Simulation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            RescueMesh Telemetry & Packet Routing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Decentralized peer-to-peer ad-hoc network operating over Bluetooth Low Energy, Wi-Fi Direct, and Solar LoRa Relays.
          </p>
        </div>

        {!userSos && (
          <button
            onClick={() => triggerSos('Person Trapped (Water Ingress)')}
            className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 shrink-0 self-start sm:self-auto"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Simulate Active SOS Distress</span>
          </button>
        )}
      </div>

      {/* Mesh Visualizer Core Component */}
      <MeshVisualizer onNavigate={onNavigate} />

      {/* Technical Architecture Specs & How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm text-xs">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-2">
            1
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Store & Forward Relay</h4>
          <p className="text-slate-500 mt-1 leading-relaxed">
            When towers lose grid power, devices securely cache encrypted distress bursts and pass them anonymously across any phone within 80-100 meters.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm text-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2">
            2
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">End-to-End Cryptography</h4>
          <p className="text-slate-500 mt-1 leading-relaxed">
            Intermediate peer nodes cannot inspect or tamper with emergency messages. Only the verified Disaster Control Room decrypts victim identity and GPS.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm text-xs">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-2">
            3
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Satellite Gateway Bridge</h4>
          <p className="text-slate-500 mt-1 leading-relaxed">
            As soon as any node reaches an operational cellular perimeter, solar LoRa repeater, or satellite terminal, packets inject directly into dispatch.
          </p>
        </div>
      </div>

    </div>
  );
};
