import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Droplets, 
  Utensils, 
  HeartPulse, 
  Home, 
  Zap, 
  Bus, 
  FileText, 
  Home as HouseDamage, 
  PhoneCall, 
  HelpCircle,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  Filter,
  Users
} from 'lucide-react';
import { ResourceCategory, RecoveryResource } from '../../types';

interface HelpPageProps {
  onNavigate: (route: string) => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onNavigate }) => {
  const { resources, setSelectedResource } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('water');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(true);

  const categories = [
    { id: 'water', label: 'Drinking Water', icon: Droplets, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { id: 'food', label: 'Food & Ration', icon: Utensils, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: 'medical', label: 'Medical Help', icon: HeartPulse, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'shelter', label: 'Relief Shelter', icon: Home, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'electricity', label: 'Power & Charging', icon: Zap, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    { id: 'transport', label: 'Transport / Boats', icon: Bus, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'help_center', label: 'Help Centers', icon: HelpCircle, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  ];

  let filtered = resources.filter((res) => {
    if (selectedCategory !== 'all' && res.category !== selectedCategory) return false;
    if (verifiedOnly && !res.isVerified) return false;
    return true;
  });

  if (sortByDistance) {
    filtered = [...filtered].sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 text-left">
      
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Essential Resource Directory
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          What do you need help with?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Find verified clean drinking water, mobile food kitchens, trauma clinics, and safe municipal relief camps in Patna.
        </p>
      </div>

      {/* Category Selection Grid (10 categories) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as ResourceCategory)}
              className={`p-4 rounded-3xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-100 shadow-md transform -translate-y-0.5'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${cat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm">{cat.label}</h3>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  {resources.filter(r => r.category === cat.id).length} Active Points
                </span>
              </div>
            </button>
          );
        })}

        {/* Action Direct Links to Forms */}
        <button
          onClick={() => onNavigate('/report')}
          className="p-4 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-left transition-all flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-rose-50 text-rose-600 mb-3 border border-rose-200">
            <HouseDamage className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">House Damage</h3>
            <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
              Submit Report Form →
            </span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/guidance')}
          className="p-4 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-left transition-all flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600 mb-3 border border-indigo-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Document Help</h3>
            <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
              Recovery Guides →
            </span>
          </div>
        </button>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-black text-slate-900 capitalize">
          Nearby {selectedCategory} Resources ({filtered.length})
        </h2>

        <div className="flex items-center space-x-3 text-xs font-semibold">
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-slate-600">Verified Safe Only</span>
          </label>

          <button
            onClick={() => setSortByDistance(!sortByDistance)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            {sortByDistance ? 'Sorted by Distance' : 'Standard Sort'}
          </button>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((res) => {
          return (
            <div
              key={res.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated {res.lastUpdated}</span>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    res.status === 'available'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    ● {res.status}
                  </span>
                </div>

                <h3 className="font-black text-base sm:text-lg text-slate-900 leading-snug">
                  {res.name}
                </h3>

                <div className="flex items-center space-x-2 text-xs text-slate-600 mt-2">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{res.address}, {res.ward}</span>
                </div>

                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  {res.details}
                </div>

                {res.capacity && (
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-2">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>{res.capacity}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs font-extrabold text-blue-600">
                  📍 {res.distanceKm} km away
                </span>

                <button
                  onClick={() => {
                    setSelectedResource(res);
                    onNavigate('/map');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <span>VIEW ON MAP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
