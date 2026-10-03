import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  MapPin, 
  Wrench, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  X,
  ArrowRight
} from 'lucide-react';
import { CitizenReport, ReportStatus, ReportCategory } from '../../types';

interface ReportsDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const ReportsDashboardPage: React.FC<ReportsDashboardPageProps> = ({ onNavigate }) => {
  const { reports, updateReportStatus } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);

  const filtered = reports.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'reported':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'verified':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'assigned':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'working':
        return 'bg-blue-600 text-white font-bold animate-pulse';
      case 'proof_submitted':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-16 text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Municipal Incident Database
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Citizen Incident & Damage Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, triage, verify, and monitor damage tickets reported across Patna wards.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 self-start sm:self-auto">
          {filtered.length} Reports Found
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        
        {/* Search */}
        <div className="flex-1 flex items-center bg-slate-50 rounded-2xl px-3 py-2 border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search report ID (#RB-1042), title, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="reported">Reported (Pending Triage)</option>
          <option value="verified">Verified</option>
          <option value="assigned">Assigned</option>
          <option value="working">Working</option>
          <option value="proof_submitted">Proof Submitted</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="road_blocked">Road Blocked</option>
          <option value="fallen_tree">Fallen Tree</option>
          <option value="electricity">Electricity / Substation</option>
          <option value="water">Water Supply</option>
          <option value="building_damage">Building Damage</option>
        </select>

      </div>

      {/* Reports Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-900 text-white font-mono uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Category & Title</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Unit</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {rep.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{rep.title}</div>
                    <span className="text-[10px] text-slate-400 capitalize">{rep.category.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800">{rep.location}</div>
                    <span className="text-[10px] text-slate-400">{rep.ward}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                      rep.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rep.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getStatusBadge(rep.status)}`}>
                      {rep.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {rep.assignedTeam || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedReport(rep)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.map((rep) => (
            <div key={rep.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-900">{rep.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getStatusBadge(rep.status)}`}>
                  {rep.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{rep.title}</h4>
              <div className="text-xs text-slate-500">{rep.location}</div>
              <button
                onClick={() => setSelectedReport(rep)}
                className="w-full mt-2 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs"
              >
                Inspect Ticket
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Report Detail Modal / Drawer (Section 31) */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden text-left animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-blue-400">{selectedReport.id}</span>
                <h3 className="text-lg font-black text-white mt-1">{selectedReport.title}</h3>
                <span className="text-xs text-slate-400">{selectedReport.location}</span>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">Description:</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.photoUrl && (
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">Citizen Evidence Photo:</span>
                  <img src={selectedReport.photoUrl} alt="Photo" className="w-full h-44 object-cover rounded-2xl border" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Status</span>
                  <div className="font-extrabold text-sm capitalize text-slate-900">{selectedReport.status.replace('_', ' ')}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Team</span>
                  <div className="font-extrabold text-sm text-slate-900">{selectedReport.assignedTeam || 'None Assigned'}</div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                {selectedReport.status === 'reported' && (
                  <button
                    onClick={() => {
                      updateReportStatus(selectedReport.id, 'verified');
                      setSelectedReport({ ...selectedReport, status: 'verified' });
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xs"
                  >
                    VERIFY REPORT
                  </button>
                )}

                {(selectedReport.status === 'reported' || selectedReport.status === 'verified') && (
                  <button
                    onClick={() => {
                      updateReportStatus(selectedReport.id, 'assigned');
                      setSelectedReport({ ...selectedReport, status: 'assigned', assignedTeam: 'Road Clearance Team Alpha' });
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs"
                  >
                    ASSIGN SQUAD ALPHA
                  </button>
                )}

                {selectedReport.status === 'assigned' && (
                  <button
                    onClick={() => {
                      updateReportStatus(selectedReport.id, 'working');
                      setSelectedReport({ ...selectedReport, status: 'working' });
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xs"
                  >
                    START WORK
                  </button>
                )}

                {selectedReport.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      updateReportStatus(selectedReport.id, 'resolved');
                      setSelectedReport({ ...selectedReport, status: 'resolved' });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
                  >
                    RESOLVE TICKET
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
