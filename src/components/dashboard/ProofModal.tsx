import React, { useState } from 'react';
import { X, Camera, CheckCircle2, ShieldCheck, AlertTriangle, Upload } from 'lucide-react';
import { CitizenReport } from '../../types';

interface ProofModalProps {
  report: CitizenReport | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitProof: (reportId: string, proofData: { workingPhoto: string; afterPhoto: string; note: string }) => void;
  onVerifyAndResolve: (reportId: string) => void;
  isAdmin?: boolean;
}

export const ProofModal: React.FC<ProofModalProps> = ({
  report,
  isOpen,
  onClose,
  onSubmitProof,
  onVerifyAndResolve,
  isAdmin = false
}) => {
  const [workingPhoto, setWorkingPhoto] = useState(
    report?.workingPhoto || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80'
  );
  const [afterPhoto, setAfterPhoto] = useState(
    report?.afterPhoto || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80'
  );
  const [note, setNote] = useState('Heavy pump deployed. Standing water evacuated and road opened to emergency ambulances.');

  if (!isOpen || !report) return null;

  const isProofSubmitted = report.status === 'proof_submitted';
  const isResolved = report.status === 'resolved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden text-left animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                {report.id}
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Recovery Proof & Verification
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              {report.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Location: {report.location}, {report.ward}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: 3-Stage Visual Proof Comparison */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* 1. BEFORE */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-red-600">1. BEFORE (Reported)</span>
                <span className="text-[10px] font-mono text-slate-400">{report.reportedAt}</span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-36">
                <img
                  src={report.beforePhoto || report.photoUrl}
                  alt="Before Damage"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white">
                  Damage Verified
                </span>
              </div>
            </div>

            {/* 2. WORKING */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-600">2. WORKING (In Progress)</span>
                <span className="text-[10px] font-mono text-slate-400">Crew on Site</span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-36">
                <img
                  src={workingPhoto}
                  alt="Crew Working"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white">
                  Restoration Team
                </span>
              </div>
            </div>

            {/* 3. AFTER */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-600">3. AFTER (Resolved)</span>
                <span className="text-[10px] font-mono text-slate-400">Safe Clearance</span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-36">
                <img
                  src={afterPhoto}
                  alt="Cleared Site"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white">
                  Cleared & Tested
                </span>
              </div>
            </div>

          </div>

          {/* Field Log Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Field Engineers Resolution Note:
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isResolved}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            />
          </div>

          {/* Workflow Status Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 uppercase font-semibold">Current State:</span>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5 capitalize">
                {report.status.replace('_', ' ')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-400 uppercase font-semibold">Assigned Team:</span>
              <div className="font-bold text-slate-800">{report.assignedTeam || 'Road Clearance Team Alpha'}</div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            CLOSE
          </button>

          <div className="flex items-center space-x-2">
            {!isProofSubmitted && !isResolved && (
              <button
                type="button"
                onClick={() => {
                  onSubmitProof(report.id, { workingPhoto, afterPhoto, note });
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>SUBMIT FIELD PROOF</span>
              </button>
            )}

            {(isProofSubmitted || isAdmin) && !isResolved && (
              <button
                type="button"
                onClick={() => {
                  onVerifyAndResolve(report.id);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all transform hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>VERIFY & MARK RESOLVED</span>
              </button>
            )}

            {isResolved && (
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
                <span>TICKET RESOLVED & VERIFIED</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
