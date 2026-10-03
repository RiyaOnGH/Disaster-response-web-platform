import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Play, 
  Upload, 
  ShieldCheck, 
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { ProofModal } from './ProofModal';
import { CitizenReport } from '../../types';

interface TaskManagerProps {
  onNavigate?: (route: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ onNavigate }) => {
  const { reports, updateReportStatus, role } = useApp();
  const [selectedReportForProof, setSelectedReportForProof] = useState<CitizenReport | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter tasks from reports
  const tasks = reports.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const handleStartWork = (id: string) => {
    updateReportStatus(id, 'working', {
      note: 'Field response team arrived on site and commenced de-watering / clearance operations.'
    });
  };

  const handleOpenProof = (report: CitizenReport) => {
    setSelectedReportForProof(report);
    setIsProofModalOpen(true);
  };

  const handleSubmitProof = (id: string, proofData: { workingPhoto: string; afterPhoto: string; note: string }) => {
    updateReportStatus(id, 'proof_submitted', {
      workingPhoto: proofData.workingPhoto,
      afterPhoto: proofData.afterPhoto,
      note: `Proof submitted by team lead: ${proofData.note}`
    });
  };

  const handleVerifyAndResolve = (id: string) => {
    updateReportStatus(id, 'resolved', {
      note: 'Verified and certified safe by Municipal Disaster Assessor. Service restored.'
    });
  };

  const getStatusBadge = (status: CitizenReport['status']) => {
    switch (status) {
      case 'assigned':
        return { label: 'Assigned', color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' };
      case 'working':
        return { label: 'Working (On Site)', color: 'bg-blue-600 text-white font-black animate-pulse' };
      case 'proof_submitted':
        return { label: 'Proof Submitted', color: 'bg-cyan-100 text-cyan-900 border-cyan-300 font-bold' };
      case 'resolved':
        return { label: 'Resolved', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              Field Execution Engine
            </span>
          </div>
          <h3 className="font-extrabold text-lg text-white mt-0.5">
            Recovery Team Task Management
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Assign units, initiate on-site restoration work, and upload verified proof.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {['all', 'assigned', 'working', 'proof_submitted', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-slate-100">
        {tasks.map((task) => {
          const badge = getStatusBadge(task.status);
          const isResolved = task.status === 'resolved';

          return (
            <div key={task.id} className="p-6 transition-colors hover:bg-slate-50/50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-200">
                      {task.id}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Reported: {task.reportedAt}
                    </span>
                  </div>

                  <h4 className="font-black text-base text-slate-900">
                    {task.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{task.location}, {task.ward}</span>
                    </div>

                    <div className="flex items-center space-x-1 font-semibold text-slate-700">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      <span>Team: {task.assignedTeam || 'Road Clearance Team Alpha'}</span>
                    </div>

                    {task.teamContact && (
                      <div className="text-blue-600 font-mono text-[11px]">
                        {task.teamContact}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status-Aware Action Controls */}
                <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 self-start lg:self-center">
                  
                  {task.status === 'assigned' && (
                    <button
                      onClick={() => handleStartWork(task.id)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>START WORK</span>
                    </button>
                  )}

                  {task.status === 'working' && (
                    <button
                      onClick={() => handleOpenProof(task)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>UPLOAD PROOF</span>
                    </button>
                  )}

                  {task.status === 'proof_submitted' && (
                    <button
                      onClick={() => handleOpenProof(task)}
                      className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>REVIEW PROOF</span>
                    </button>
                  )}

                  {isResolved && (
                    <button
                      onClick={() => handleOpenProof(task)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>VIEW PROOF ARCHIVE</span>
                    </button>
                  )}

                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('/map')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                    >
                      View on Map
                    </button>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Proof Modal */}
      <ProofModal
        report={selectedReportForProof}
        isOpen={isProofModalOpen}
        onClose={() => {
          setIsProofModalOpen(false);
          setSelectedReportForProof(null);
        }}
        onSubmitProof={handleSubmitProof}
        onVerifyAndResolve={handleVerifyAndResolve}
        isAdmin={role === 'authority' || role === 'responder'}
      />

    </div>
  );
};
