import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BellRing, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Plus, 
  MapPin, 
  X,
  Share2
} from 'lucide-react';
import { LocalUpdate } from '../../types';

interface UpdatesPageProps {
  onNavigate?: (route: string) => void;
}

export const UpdatesPage: React.FC<UpdatesPageProps> = () => {
  const { updates, addUpdate, role } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // New update form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<LocalUpdate['category']>('roads');
  const [newStatus, setNewStatus] = useState<LocalUpdate['status']>('VERIFIED');
  const [newStatusType, setNewStatusType] = useState<LocalUpdate['statusType']>('success');
  const [newContent, setNewContent] = useState('');
  const [newArea, setNewArea] = useState('Ward 12, Patna');

  const categories = [
    { id: 'all', label: 'All Updates' },
    { id: 'roads', label: 'Roads & Bridges' },
    { id: 'water', label: 'Drinking Water' },
    { id: 'electricity', label: 'Power Grid' },
    { id: 'medical', label: 'Hospitals & Medical' },
    { id: 'shelters', label: 'Shelters & Relief' },
  ];

  const filteredUpdates = updates.filter(u => {
    if (activeCategory !== 'all' && u.category !== activeCategory) return false;
    return true;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addUpdate({
      title: newTitle,
      category: newCategory,
      status: newStatus,
      statusType: newStatusType,
      source: role === 'authority' ? 'District Disaster Management Authority (DDMA)' : 'Municipal Response Team',
      isVerified: true,
      content: newContent,
      affectedArea: newArea
    });

    setNewTitle('');
    setNewContent('');
    setIsPublishModalOpen(false);
  };

  const getStatusBadge = (statusType: LocalUpdate['statusType'], status: LocalUpdate['status']) => {
    switch (statusType) {
      case 'danger':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 text-left">
      
      {/* Title & Publish Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Official Disaster Communications
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Verified Local Updates & Bulletins
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed emergency notices vetted by Patna District Control Room and Municipal Response Units.
          </p>
        </div>

        {(role === 'authority' || role === 'responder') && (
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Official Update</span>
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeCategory === c.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Feed Cards */}
      <div className="space-y-4">
        {filteredUpdates.map((u) => {
          const badgeClass = getStatusBadge(u.statusType, u.status);

          return (
            <div
              key={u.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                    {u.status}
                  </span>

                  {u.isVerified && (
                    <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{u.timestamp}</span>
                </div>
              </div>

              <div className="pt-3">
                <h3 className="font-black text-lg text-slate-900 leading-snug">
                  {u.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed mt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {u.content}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Area: <strong>{u.affectedArea}</strong></span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium">
                    Source: <strong className="text-slate-800">{u.source}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Official Update Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-left animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">Broadcast Console</span>
                <h3 className="text-lg font-black text-white">Publish Official Citizen Update</h3>
              </div>
              <button onClick={() => setIsPublishModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Ganga Water Level Receding at Gandhi Ghat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="roads">Roads & Bridges</option>
                    <option value="water">Drinking Water</option>
                    <option value="electricity">Power Grid</option>
                    <option value="medical">Medical Facility</option>
                    <option value="shelters">Relief Shelters</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Status Badge</label>
                  <select
                    value={newStatus}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setNewStatus(val);
                      if (val === 'CLOSED') setNewStatusType('danger');
                      else if (val === 'RESTORATION ONGOING') setNewStatusType('warning');
                      else setNewStatusType('success');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="RESTORATION ONGOING">RESTORATION ONGOING</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Detailed Content</label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide precise safety advisories and estimated restoration windows..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Affected Area</label>
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Publish Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
