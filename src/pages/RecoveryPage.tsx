import React from 'react';
import { RecoveryChecklist } from '../../components/recovery/RecoveryChecklist';
import { TrackedReportsList } from '../../components/recovery/TrackedReportsList';
import { UserCheck, Sparkles, Plus, ArrowRight } from 'lucide-react';

interface RecoveryPageProps {
  onNavigate: (route: string) => void;
}

export const RecoveryPage: React.FC<RecoveryPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 text-left">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Citizen Personal Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            My Recovery & Claims Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor your household restoration progress, relief checklist, and active municipal repair tickets.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/report')}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Damage</span>
        </button>
      </div>

      {/* Recovery Checklist Component */}
      <RecoveryChecklist onNavigate={onNavigate} />

      {/* Tracked Reports Component */}
      <TrackedReportsList onNavigate={onNavigate} />

    </div>
  );
};
