import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isEmergency = toast.type === 'emergency';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-3.5 rounded-2xl shadow-2xl border transition-all transform animate-in slide-in-from-right duration-300 ${
              isEmergency
                ? 'bg-red-600 text-white border-red-700 shadow-red-600/30'
                : isSuccess
                ? 'bg-slate-900 text-white border-slate-800'
                : isWarning
                ? 'bg-amber-500 text-slate-950 border-amber-600'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isEmergency && <AlertCircle className="w-5 h-5 text-white animate-pulse" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-slate-950" />}
              {!isEmergency && !isSuccess && !isWarning && <Info className="w-5 h-5 text-blue-500" />}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
              <p className="text-xs opacity-90 leading-snug mt-0.5">{toast.message}</p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg hover:bg-black/10 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
