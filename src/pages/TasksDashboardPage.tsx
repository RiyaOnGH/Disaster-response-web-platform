import React from 'react';
import { TaskManager } from '../../components/dashboard/TaskManager';
import { Wrench, ShieldCheck } from 'lucide-react';

interface TasksDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const TasksDashboardPage: React.FC<TasksDashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 text-left">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Field Unit Operations
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Field Tasks & Recovery Evidence
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute assignments, manage on-site restoration workflows, and submit before/working/after proof photos.
        </p>
      </div>

      <TaskManager onNavigate={onNavigate} />
    </div>
  );
};
