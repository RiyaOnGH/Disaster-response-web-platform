import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardCheck, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  Wrench,
  Camera,
  ExternalLink
} from 'lucide-react';
import { CitizenReport } from '../../types';

interface TrackedReportsListProps {
  onNavigate?: (route: string) => void;
}

export const TrackedReportsList: React.FC<TrackedReportsListProps> = ({ onNavigate }) => {
  const { reports } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusBadge = (status: CitizenReport['status']) => {
    switch (status) {
      case 'reported':
        return { label: 'Reported', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'verified':
        return { label: 'Verified', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'assigned':
        return { label: 'Team Assigned', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'working':
        return { label: 'Restoration Ongoing', color: 'bg-amber-500 text-white border-amber-600' };
      case 'proof_submitted':
        return { label: 'Proof Submitted', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'resolved':
        return { label: 'Resolved & Safe', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left">
      <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
            My Incident Reports & Tracked Tickets
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status of reports you have submitted or are tracking in Ward 12.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
          {reports.length} Tracked
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {reports.map((report) => {
          const isExpanded = expandedId === report.id;
          const badge = getStatusBadge(report.status);

          return (
            <div key={report.id} className="p-5 sm:p-6 transition-colors hover:bg-slate-50/50">
              <div 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : report.id)}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {report.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Reported at {report.reportedAt}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1.5">
                    {report.title}
                  </h4>

                  <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{report.location}</span>
                    </span>
                    {report.assignedTeam && (
                      <span className="flex items-center space-x-1 font-semibold text-slate-700">
                        <Wrench className="w-3.5 h-3.5 text-blue-600" />
                        <span>{report.assignedTeam}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <button
                    type="button"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 text-xs animate-in fade-in duration-200">
                  <p className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                    {report.description}
                  </p>

                  {/* Photo Evidence Gallery */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {report.beforePhoto && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">1. Citizen Damage Photo</span>
                        <img src={report.beforePhoto} alt="Before" className="w-full h-28 object-cover rounded-xl border border-slate-200" />
                      </div>
                    )}

                    {report.workingPhoto && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-amber-500">2. Field Team in Progress</span>
                        <img src={report.workingPhoto} alt="Working" className="w-full h-28 object-cover rounded-xl border border-slate-200" />
                      </div>
                    )}

                    {report.afterPhoto && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-600">3. Verified Cleaned / Safe</span>
                        <img src={report.afterPhoto} alt="After" className="w-full h-28 object-cover rounded-xl border border-slate-200" />
                      </div>
                    )}
                  </div>

                  {/* Notes / Action Log */}
                  {report.notes && report.notes.length > 0 && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px] text-slate-600">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Official Action History:
                      </span>
                      {report.notes.map((n, i) => (
                        <div key={i} className="flex items-start space-x-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{n}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {onNavigate && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => onNavigate('/map')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <span>View incident coordinates on Recovery Map</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
