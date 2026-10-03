import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, Square, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface RecoveryChecklistProps {
  onNavigate?: (route: string) => void;
}

export const RecoveryChecklist: React.FC<RecoveryChecklistProps> = ({ onNavigate }) => {
  const { checklist, toggleChecklistItem, recoveryPercentage } = useApp();

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left">
      
      {/* Header with Progress Bar */}
      <div className="p-6 sm:p-8 bg-slate-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Personalized Household Tracker
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              My Recovery Roadmap
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete these verified steps to ensure your family's safety and claim disaster benefits.
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
              {recoveryPercentage}%
            </div>
            <div className="text-xs text-slate-400 font-medium">Steps Completed</div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-3 mt-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${recoveryPercentage}%` }}
          />
        </div>
      </div>

      {/* Interactive Checklist Items */}
      <div className="p-6 sm:p-8 divide-y divide-slate-100">
        {checklist.map((item) => {
          return (
            <div
              key={item.id}
              className={`py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                item.completed ? 'opacity-85' : ''
              }`}
            >
              <div 
                className="flex items-start space-x-3.5 cursor-pointer flex-1"
                onClick={() => toggleChecklistItem(item.id)}
              >
                <button
                  type="button"
                  className={`mt-0.5 shrink-0 transition-transform active:scale-90 ${
                    item.completed ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-500'
                  }`}
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-100" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-sm font-bold ${
                      item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}>
                      {item.title}
                    </h4>
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full uppercase font-bold ${
                      item.priority === 'essential' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {item.actionRoute && onNavigate && !item.completed && (
                <button
                  type="button"
                  onClick={() => onNavigate(item.actionRoute!)}
                  className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition-colors flex items-center space-x-1 shrink-0"
                >
                  <span>{item.actionLabel || 'Take Action'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {item.completed && (
                <span className="self-start sm:self-center text-xs font-semibold text-emerald-600 flex items-center space-x-1 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Done</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
