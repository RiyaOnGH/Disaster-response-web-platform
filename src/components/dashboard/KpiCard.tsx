import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  subtext?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  iconColor,
  iconBg,
  subtext
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm text-left transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${iconBg} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline space-x-2">
        <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
          {value}
        </span>
        {change && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            changeType === 'positive' 
              ? 'bg-emerald-50 text-emerald-700' 
              : changeType === 'negative' 
              ? 'bg-red-50 text-red-700' 
              : 'bg-slate-100 text-slate-600'
          }`}>
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-slate-400 font-medium mt-1">
          {subtext}
        </p>
      )}
    </div>
  );
};
