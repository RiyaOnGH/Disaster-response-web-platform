import React from 'react';
import { ReportWizard } from '../../components/reports/ReportWizard';
import { FileEdit, ShieldAlert } from 'lucide-react';

interface ReportPageProps {
  onNavigate: (route: string) => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 text-left">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Citizen Field Reporting
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Report Damage or Infrastructure Problem
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit photo evidence and GPS coordinates to deploy specialized clearance squads and damage surveyors.
        </p>
      </div>

      <ReportWizard onSuccessNavigate={onNavigate} />
    </div>
  );
};
