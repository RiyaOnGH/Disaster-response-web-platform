import React, { useState } from 'react';
import { 
  GitFork, 
  ArrowDown, 
  ArrowRight, 
  AlertTriangle, 
  ShieldAlert, 
  Droplet, 
  Zap, 
  Hospital, 
  Ambulance, 
  Bus, 
  Users, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { IMPACT_NODES } from '../../data/mockData';
import { ImpactNode } from '../../types';

export const ImpactGraph: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState<'transport' | 'power'>('transport');

  const getIcon = (name: string) => {
    switch (name) {
      case 'Road':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'Hospital':
        return <Hospital className="w-5 h-5 text-amber-600" />;
      case 'Ambulance':
        return <Ambulance className="w-5 h-5 text-rose-600" />;
      case 'Bus':
        return <Bus className="w-5 h-5 text-purple-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-blue-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-indigo-600" />;
      default:
        return <Activity className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Cascading Risk Analysis
            </span>
          </div>
          <h3 className="font-extrabold text-lg text-white mt-0.5">
            Recovery Impact & System Dependency Graph
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            Visual decision-support revealing how physical infrastructure failures propagate to critical emergency services.
          </p>
        </div>

        {/* Chain Switcher */}
        <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setSelectedChain('transport')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedChain === 'transport' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bailey Road Corridor Chain
          </button>
          <button
            onClick={() => setSelectedChain('power')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedChain === 'power' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            11kV Grid & Water Supply Chain
          </button>
        </div>
      </div>

      {/* Main Cascade Visualization */}
      <div className="p-6 lg:p-8 bg-slate-50/50">
        
        {/* Cascade 1: Transportation & Medical */}
        {selectedChain === 'transport' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Level 1: Primary Obstruction */}
            <div className="p-5 rounded-3xl bg-red-50 border-2 border-red-300 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold uppercase">
                    Level 1: Primary Damage Node
                  </span>
                  <span className="text-xs font-bold text-red-900 font-mono">ID: #RB-1042</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-red-700">IMPACT: HIGH</span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-3 bg-red-100 rounded-2xl shrink-0 mt-0.5">
                  <ShieldAlert className="w-6 h-6 text-red-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-red-950">
                    Bailey Road Flyover Underpass Submerged (4ft Depth)
                  </h4>
                  <p className="text-xs text-red-800 mt-1 leading-relaxed">
                    Primary East-West arterial road blocked by inundation. Heavy debris and stranded vehicles prevent vehicular access.
                  </p>
                  <div className="text-[11px] font-mono text-red-700 mt-2">
                    Location: Ward 12, Patna • Status: Working (Road Clearance Team Alpha)
                  </div>
                </div>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="flex justify-center text-slate-400">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                  Cascades Downstream to Essential Services
                </span>
                <div className="w-0.5 h-6 bg-slate-300" />
                <ArrowDown className="w-5 h-5 text-slate-500 -mt-1" />
              </div>
            </div>

            {/* Level 2: Affected Service */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-mono font-bold uppercase">
                    Level 2: Service Disrupted
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-800">Critical Access</span>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-3 bg-amber-100 rounded-2xl shrink-0 mt-0.5">
                    <Hospital className="w-6 h-6 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-950">
                      Patna City Hospital & PMCH Access Route Blocked
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      Main ambulance corridor impassable. Emergency vehicles forced to use narrow, unpaved residential bylanes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-purple-50 border-2 border-purple-300 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-mono font-bold uppercase">
                    Level 2: Public Evacuation
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-800">Relief Transit</span>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-3 bg-purple-100 rounded-2xl shrink-0 mt-0.5">
                    <Bus className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-purple-950">
                      Evacuation Bus & Tanker Convoy Diverted
                    </h4>
                    <p className="text-xs text-purple-800 mt-1 leading-relaxed">
                      Relief supply trucks to Ward 12 delayed by 35-45 minutes via Saguna More detour.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Connecting Arrow */}
            <div className="flex justify-center text-slate-400">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-500 font-bold mb-1">
                  Secondary Population Impact
                </span>
                <div className="w-0.5 h-6 bg-rose-300" />
                <ArrowDown className="w-5 h-5 text-rose-500 -mt-1" />
              </div>
            </div>

            {/* Level 3: Secondary Impact */}
            <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold uppercase">
                  Level 3: Secondary Public Impact
                </span>
                <span className="text-xs font-mono font-bold text-rose-800">High Risk to Life</span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-3 bg-rose-100 rounded-2xl shrink-0 mt-0.5">
                  <Ambulance className="w-6 h-6 text-rose-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-rose-950">
                    Emergency Medical Triage & Oxygen Response Delayed
                  </h4>
                  <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                    Average emergency response time escalated from 12 mins to 34 mins for residents in Kankarbagh and Ward 12. De-watering Bailey Road is <strong>Priority Tier 1</strong> to restore hospital lifelines.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Cascade 2: Power Grid & Water Supply */}
        {selectedChain === 'power' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Level 1: Substation Flood */}
            <div className="p-5 rounded-3xl bg-yellow-50 border-2 border-yellow-300 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-yellow-500 text-slate-950 text-[10px] font-mono font-bold uppercase">
                  Level 1: Utility Failure
                </span>
                <span className="text-xs font-mono font-bold text-yellow-800">#RB-1038 (Resolved)</span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-3 bg-yellow-100 rounded-2xl shrink-0 mt-0.5">
                  <Zap className="w-6 h-6 text-yellow-800" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-yellow-950">
                    Boring Canal Road 11kV Substation Submerged
                  </h4>
                  <p className="text-xs text-yellow-900 mt-1 leading-relaxed">
                    Main distribution transformer flooded. Power safely isolated to prevent massive electrocution hazards across 4 neighborhoods.
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center text-slate-400">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-slate-300" />
                <ArrowDown className="w-5 h-5 text-slate-500 -mt-1" />
              </div>
            </div>

            {/* Level 2: Water Pump Station Down */}
            <div className="p-5 rounded-3xl bg-blue-50 border-2 border-blue-300 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold uppercase">
                  Level 2: Service Disruption
                </span>
                <span className="text-xs font-mono font-bold text-blue-800">Pumping Stoppage</span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-3 bg-blue-100 rounded-2xl shrink-0 mt-0.5">
                  <Droplet className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-blue-950">
                    Municipal Water Pumping Station #3 Power Starved
                  </h4>
                  <p className="text-xs text-blue-900 mt-1 leading-relaxed">
                    Electrical motors lost grid feed. High-capacity water treatment and filtration pumps stopped running.
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center text-slate-400">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-slate-300" />
                <ArrowDown className="w-5 h-5 text-slate-500 -mt-1" />
              </div>
            </div>

            {/* Level 3: Citizen Clean Water Shortage */}
            <div className="p-5 rounded-3xl bg-indigo-50 border-2 border-indigo-300 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-mono font-bold uppercase">
                  Level 3: Community Crisis
                </span>
                <span className="text-xs font-mono font-bold text-indigo-800">20,000 Citizens Affected</span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-3 bg-indigo-100 rounded-2xl shrink-0 mt-0.5">
                  <Users className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-indigo-950">
                    Drinking Water Scarcity & Dehydration Risk
                  </h4>
                  <p className="text-xs text-indigo-900 mt-1 leading-relaxed">
                    Tap supply disrupted in Kankarbagh Colony. Emergency mobile water tankers dispatched to prevent residents from drinking contaminated flood runoff.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Decision Support Factor Checklist */}
      <div className="p-6 bg-slate-100 border-t border-slate-200">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Triage Decision-Support Matrix:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Severity Rating</span>
            <div className="font-extrabold text-red-600 text-sm mt-0.5">Level 4 (Severe)</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Critical Lifelines</span>
            <div className="font-extrabold text-slate-900 text-sm mt-0.5">Hospital Access + Water</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Affected Population</span>
            <div className="font-extrabold text-slate-900 text-sm mt-0.5">~35,000 Residents</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Recommended Priority</span>
            <div className="font-extrabold text-blue-600 text-sm mt-0.5">Immediate De-watering</div>
          </div>
        </div>
      </div>

    </div>
  );
};
