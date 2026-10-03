import React, { useState } from 'react';
import { GUIDANCE_SECTIONS } from '../../data/mockData';
import { 
  Compass, 
  Home, 
  FileText, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Download,
  Printer
} from 'lucide-react';

interface GuidancePageProps {
  onNavigate: (route: string) => void;
}

export const GuidancePage: React.FC<GuidancePageProps> = ({ onNavigate }) => {
  const [selectedTopic, setSelectedTopic] = useState('house_damage');

  const currentSection = GUIDANCE_SECTIONS.find(g => g.id === selectedTopic) || GUIDANCE_SECTIONS[0];

  const getIcon = (id: string) => {
    switch (id) {
      case 'house_damage':
        return <Home className="w-5 h-5 text-rose-600" />;
      case 'lost_documents':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case 'utilities':
        return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'insurance':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <Compass className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 text-left">
      
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Disaster Recovery Handbook
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Step-by-Step Citizen Recovery Guidance
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Follow verified operational timelines to expedite insurance payouts, structural assessments, and document reissuance.
        </p>
      </div>

      {/* Topic Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GUIDANCE_SECTIONS.map((sec) => {
          const isSelected = selectedTopic === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedTopic(sec.id)}
              className={`p-4 rounded-3xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-100 shadow-sm font-bold'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="w-9 h-9 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-2">
                {getIcon(sec.id)}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black">{sec.title}</h3>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  {sec.steps.length} Steps
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Guidance Vertical Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Timeline Header */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold uppercase">
                {currentSection.badge}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {currentSection.title} Protocol
            </h2>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Guide</span>
          </button>
        </div>

        {/* Vertical Stepper Timeline */}
        <div className="p-6 sm:p-8">
          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8">
            {currentSection.steps.map((st, idx) => (
              <div key={st.step} className="relative group text-left">
                
                {/* Step Circle Marker */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center ring-4 ring-white shadow-md">
                  {st.step}
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">
                    Phase {st.step}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {st.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>

          {/* Quick CTA to Form */}
          {selectedTopic === 'house_damage' && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => onNavigate('/report')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
              >
                <span>Log House Damage Report Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
