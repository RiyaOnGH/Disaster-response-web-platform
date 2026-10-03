import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Smartphone, 
  Server, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Pause, 
  Check, 
  MapPin, 
  Battery, 
  Signal, 
  ArrowRight,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MeshVisualizerProps {
  onComplete?: () => void;
  onNavigate?: (route: string) => void;
}

export const MeshVisualizer: React.FC<MeshVisualizerProps> = ({ onComplete, onNavigate }) => {
  const { userSos, networkStatus, updateSosStatus } = useApp();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [logs, setLogs] = useState<string[]>([
    '14:32:01 - SOS Beacon broadcast initiated via Bluetooth Low Energy & Wi-Fi Direct',
    '14:32:04 - Scanning local 2.4GHz & 5GHz mesh sub-bands...'
  ]);

  const nodes = [
    {
      id: 'you',
      label: 'YOU (Victim)',
      sub: 'Phone #RB-Client',
      role: 'Distress Originator',
      status: 'Broadcasting BLE/Wi-Fi Direct',
      icon: Smartphone,
      color: 'border-red-500 bg-red-50 text-red-600',
      badge: 'Origination'
    },
    {
      id: 'peer',
      label: 'Nearby Device',
      sub: 'Citizen Device #84-B',
      role: 'Ad-hoc Peer Relay',
      status: 'Relaying Encrypted Packet',
      icon: Smartphone,
      color: 'border-amber-500 bg-amber-50 text-amber-600',
      badge: 'Hop 1 (45m)'
    },
    {
      id: 'relay',
      label: 'Relay Node',
      sub: 'Solar Street Pole Node #12',
      role: 'Autonomous LoRa/Mesh Repeater',
      status: 'Amplifying & Routing Upstream',
      icon: Radio,
      color: 'border-blue-500 bg-blue-50 text-blue-600',
      badge: 'Hop 2 (280m)'
    },
    {
      id: 'gateway',
      label: 'Connected Gateway',
      sub: 'District Satellite / Fiber Up-link',
      role: 'Emergency IP Gateway',
      status: 'Bridging Mesh to Command Net',
      icon: Server,
      color: 'border-indigo-500 bg-indigo-50 text-indigo-600',
      badge: 'Hop 3 (Gateway)'
    },
    {
      id: 'team',
      label: 'Response Team',
      sub: 'Patna Central Command Console',
      role: 'NDRF / Control Room',
      status: 'Alert Received & Dispatched',
      icon: ShieldAlert,
      color: 'border-emerald-500 bg-emerald-50 text-emerald-600',
      badge: 'Dispatched'
    }
  ];

  const stepDetails = [
    { title: '1. Searching for peer relays...', desc: 'Device broadcasting encrypted SOS payload over Bluetooth 5.0 and Wi-Fi Aware ad-hoc channels.' },
    { title: '2. Relay Found (Hop 1)', desc: 'Neighboring citizen device accepted store-and-forward encrypted packet without inspecting payload.' },
    { title: '3. Message Forwarding (Hop 2)', desc: 'Packet bounced to elevated solar street repeater on Bailey Road corridor.' },
    { title: '4. Gateway Connected (Hop 3)', desc: 'Bypassed cellular outage by reaching satellite emergency terminal at BSNL Exchange.' },
    { title: '5. SOS Delivered to Response Team', desc: 'Emergency dispatch acknowledgment received. GPS coordinates ±4m confirmed.' }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    if (activeStep < 4) {
      const timer = setTimeout(() => {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const stepLogs = [
          `${timestamp} - Peer handshake accepted by Device #84-B via BLE mesh`,
          `${timestamp} - Hop 2 established: Bailey Road Solar Pole Node #12 received burst`,
          `${timestamp} - Satellite uplink locked at BSNL Exchange Gateway`,
          `${timestamp} - ✅ ACK Received from NDRF Command: Distress ticket confirmed`
        ];

        setLogs((prev) => [...prev, stepLogs[activeStep]]);

        if (nextStep === 4) {
          if (userSos) {
            updateSosStatus(userSos.id, 'delivered');
          }
          if (onComplete) onComplete();
        }
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [activeStep, isPlaying]);

  const restartSimulation = () => {
    setActiveStep(0);
    setIsPlaying(true);
    setLogs([
      `${new Date().toLocaleTimeString()} - Re-initiating mesh broadcast sequence...`,
      `${new Date().toLocaleTimeString()} - Scanning 2.4GHz & LoRa frequencies for nearest mesh node...`
    ]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left">
      
      {/* Simulation Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
              RescueMesh Ad-Hoc Routing Engine
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono uppercase tracking-wider border border-cyan-400/30">
              Demo Simulation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Simulating peer-to-peer store-and-forward mesh telemetry for when commercial cellular grids fail.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={restartSimulation}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Main Flow Stage */}
      <div className="p-6 lg:p-8 bg-slate-50/50">
        
        {/* Status Indicator Banner */}
        <div className={`p-4 rounded-2xl mb-8 border transition-all ${
          activeStep === 4 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-blue-50 border-blue-200 text-blue-950'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeStep === 4 ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white animate-spin'
              }`}>
                {activeStep === 4 ? <Check className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-extrabold text-sm sm:text-base">
                  {stepDetails[activeStep].title}
                </div>
                <div className="text-xs opacity-80 mt-0.5">
                  {stepDetails[activeStep].desc}
                </div>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-60">Status Phase</div>
              <div className="font-mono text-sm font-extrabold">Step {activeStep + 1} of 5</div>
            </div>
          </div>
        </div>

        {/* 5-Node Interactive Visual Pipeline */}
        <div className="relative">
          
          {/* Connector Line behind nodes */}
          <div className="hidden lg:block absolute top-12 left-10 right-10 h-1 bg-slate-200 -z-0">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-blue-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${(activeStep / 4) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {nodes.map((node, index) => {
              const isCurrent = activeStep === index;
              const isPassed = activeStep > index;
              const isPending = activeStep < index;
              const Icon = node.icon;

              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-2xl border transition-all text-left relative ${
                    isCurrent
                      ? 'bg-white border-blue-600 ring-4 ring-blue-100 shadow-xl transform -translate-y-1'
                      : isPassed
                      ? 'bg-white border-emerald-300 shadow-xs'
                      : 'bg-white/60 border-slate-200 opacity-60'
                  }`}
                >
                  {/* Step status chip */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isPassed 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isCurrent 
                        ? 'bg-blue-100 text-blue-800 animate-pulse' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {node.badge}
                    </span>

                    {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {isCurrent && <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />}
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                    isPassed 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : isCurrent 
                      ? node.color 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm">{node.label}</h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{node.sub}</div>
                  <p className="text-[11px] text-slate-600 font-medium mt-2 leading-snug">
                    {isCurrent ? node.status : node.role}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Final Success Box when step === 4 */}
        {activeStep === 4 && (
          <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl shrink-0 mt-1">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-lg sm:text-xl">✅ SOS DELIVERED VIA RESCUEMESH</span>
                    <span className="px-2 py-0.5 bg-white/20 text-xs font-mono rounded">ACK-200</span>
                  </div>
                  <p className="text-xs text-emerald-100 mt-1 max-w-xl">
                    Your encrypted distress message successfully bypassed the commercial cellular outage and reached the NDRF Emergency Response Room.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-emerald-100 font-mono">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Ward 12, Patna (±4m)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Delivered: {new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Signal className="w-3.5 h-3.5" />
                      <span>3 Hops, 420m Line of Sight</span>
                    </div>
                  </div>
                </div>
              </div>

              {onNavigate && (
                <div className="shrink-0 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onNavigate('/dashboard/sos')}
                    className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <span>View in Response Command</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Packet Log Console */}
        <div className="mt-8 rounded-2xl bg-slate-900 border border-slate-800 p-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-300">
                RescueMesh Telemetry Stream [Simulation Console]
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Protocol: RM-BLE-V2</span>
          </div>

          <div className="space-y-1 font-mono text-xs text-slate-300 max-h-36 overflow-y-auto pr-1">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                <span className="text-cyan-400 select-none">&gt;</span>
                <span className={log.includes('✅') ? 'text-emerald-400 font-bold' : log.includes('SOS') ? 'text-amber-300' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
