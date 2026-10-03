import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileEdit, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { ReportCategory, EmergencySeverity } from '../../types';

interface ReportWizardProps {
  onSuccessNavigate?: (route: string) => void;
}

export const ReportWizard: React.FC<ReportWizardProps> = ({ onSuccessNavigate }) => {
  const { addReport, currentLocation, networkStatus } = useApp();

  const [step, setStep] = useState(1);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState<ReportCategory>('road_blocked');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationAddress, setLocationAddress] = useState('Bailey Road Junction, Near Pillar 48');
  const [ward, setWard] = useState('Ward 12, Patna');
  const [severity, setSeverity] = useState<EmergencySeverity>('high');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { id: 'road_blocked', label: 'Road Blocked / Submerged', icon: '🚧', desc: 'Debris, floodwaters, or impassable road' },
    { id: 'fallen_tree', label: 'Fallen Tree / Powerline', icon: '🌳', desc: 'Tree blocking lane, hospital access, or electric cable' },
    { id: 'electricity', label: 'Electricity / Transformer', icon: '⚡', desc: 'Submerged transformer, live sparking, or blackout' },
    { id: 'water', label: 'Water Supply Burst', icon: '💧', desc: 'Broken municipal pipeline, contaminated supply' },
    { id: 'building_damage', label: 'Building / Wall Damage', icon: '🏚️', desc: 'Partial collapse, cracked foundation, wall breach' },
    { id: 'transportation', label: 'Transport / Bus Stranded', icon: '🚍', desc: 'Stranded relief vehicles, broken ferry pontoon' },
    { id: 'other', label: 'Other Hazardous Problem', icon: '➕', desc: 'General community disruption or public safety issue' },
  ];

  const demoPhotos = [
    { label: 'Submerged Road', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80' },
    { label: 'Fallen Tree', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80' },
    { label: 'Flooded Substation', url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80' },
    { label: 'Pipeline Rupture', url: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!title.trim()) {
        newErrors.title = 'Please provide a brief problem headline';
      }
    } else if (step === 2) {
      if (!locationAddress.trim()) {
        newErrors.locationAddress = 'Address or landmark is required';
      }
    } else if (step === 3) {
      if (!description.trim() || description.trim().length < 10) {
        newErrors.description = 'Description must be at least 10 characters with specific details';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(step + 1);
  };

  const handleSubmit = () => {
    const created = addReport({
      category,
      title: title || `${categories.find(c => c.id === category)?.label} at ${locationAddress}`,
      description,
      location: locationAddress,
      ward,
      coordinates: { x: 45 + Math.floor(Math.random() * 10), y: 48 + Math.floor(Math.random() * 10) },
      severity,
      photoUrl,
      beforePhoto: photoUrl
    });

    setSubmittedReportId(created.id);
  };

  // SUCCESS SCREEN
  if (submittedReportId) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
            {submittedReportId}
          </span>
          <span className="text-xs text-slate-400 font-mono">Logged into Dispatch System</span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mt-2">
          Problem Report Submitted Successfully
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Your damage report has been registered in the Municipal Disaster Control Room and assigned ticket <strong className="text-slate-900 font-mono">{submittedReportId}</strong>.
        </p>

        {/* Workflow Timeline Preview */}
        <div className="my-8 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Response & Verification Workflow:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-xs">
              <div className="text-[10px] opacity-80">1</div>
              <div>Reported</div>
              <div className="text-[9px] font-mono mt-0.5">● Active</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400">
              <div className="text-[10px] opacity-80">2</div>
              <div>Verified</div>
              <div className="text-[9px] font-mono mt-0.5">○ Pending</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400">
              <div className="text-[10px] opacity-80">3</div>
              <div>Assigned</div>
              <div className="text-[9px] font-mono mt-0.5">○ Field Team</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400">
              <div className="text-[10px] opacity-80">4</div>
              <div>Working</div>
              <div className="text-[9px] font-mono mt-0.5">○ On-Site</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400">
              <div className="text-[10px] opacity-80">5</div>
              <div>Proof</div>
              <div className="text-[9px] font-mono mt-0.5">○ Verification</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400">
              <div className="text-[10px] opacity-80">6</div>
              <div>Resolved</div>
              <div className="text-[9px] font-mono mt-0.5">○ Complete</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {onSuccessNavigate && (
            <>
              <button
                onClick={() => onSuccessNavigate('/recovery')}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <span>Track in My Recovery</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSuccessNavigate('/dashboard/reports')}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <span>View on Response Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left">
      
      {/* Wizard Header with Steps Progress */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Step {step} of 4:
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {step === 1 && 'Incident Category'}
            {step === 2 && 'Location & Ward'}
            {step === 3 && 'Evidence & Details'}
            {step === 4 && 'Review & Submit'}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white">
          {step === 1 && 'What happened?'}
          {step === 2 && 'Where is the incident?'}
          {step === 3 && 'Add photographic evidence'}
          {step === 4 && 'Review incident submission'}
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: CATEGORY */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Select Incident Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id as ReportCategory);
                      if (!title) setTitle(`${cat.label} in Ward 12`);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                      category === cat.id
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-100 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <div className="font-extrabold text-xs">{cat.label}</div>
                      <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{cat.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Brief Headline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Main road underpass inundated with 4ft water"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="text-xs text-red-600 font-semibold mt-1">⚠ {errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Assessed Severity Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['critical', 'high', 'medium', 'low'] as EmergencySeverity[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider border capitalize transition-all ${
                      severity === lvl
                        ? lvl === 'critical'
                          ? 'bg-red-600 text-white border-red-700 shadow-xs'
                          : lvl === 'high'
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                          : 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-blue-900">Current Device Location Available</div>
                  <div className="text-xs text-blue-700">{currentLocation}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLocationAddress('Near Plot 44, Lane 3, Kankarbagh Main');
                  setWard('Ward 12, Patna');
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow-xs hover:bg-blue-700"
              >
                Use Current GPS
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Detailed Street Address / Landmark <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="e.g. Bailey Road Flyover Junction, Near Saguna More"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.locationAddress && <p className="text-xs text-red-600 font-semibold mt-1">⚠ {errors.locationAddress}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Municipal Ward / Area
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ward 12, Patna">Ward 12, Patna (Kankarbagh / Bailey East)</option>
                <option value="Ward 14, Patna">Ward 14, Patna (Rajendra Nagar)</option>
                <option value="Ward 8, Patna">Ward 8, Patna (Ashok Rajpath / PMCH)</option>
                <option value="Ward 10, Patna">Ward 10, Patna (Boring Road / Canal)</option>
                <option value="Ward 5, Patna">Ward 5, Patna (Gandhi Maidan)</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: EVIDENCE & PHOTO */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Photo Evidence <span className="text-slate-400 font-normal">(Select preset or upload)</span>
              </label>

              {/* Sample Photo Presets for seamless testing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {demoPhotos.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setPhotoUrl(p.url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all group ${
                      photoUrl === p.url ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-16 object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[9px] font-bold py-0.5 px-1 truncate">
                      {p.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Preview selected image */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                <img src={photoUrl} alt="Selected evidence" className="w-full h-44 object-cover" />
                <div className="absolute top-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-mono flex items-center space-x-1">
                  <Camera className="w-3 h-3" />
                  <span>Geo-Tagged (Patna)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Description of Damage & Disruption <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current water depth, number of trapped residents, or secondary hazards (minimum 10 characters)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>Minimum 10 characters</span>
                <span className={description.length >= 10 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  {description.length} chars
                </span>
              </div>
              {errors.description && <p className="text-xs text-red-600 font-semibold mt-1">⚠ {errors.description}</p>}
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Category:</span>
                <span className="font-extrabold text-slate-900 capitalize">
                  {categories.find(c => c.id === category)?.label}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Location:</span>
                <span className="font-extrabold text-slate-900">{locationAddress}, {ward}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Severity:</span>
                <span className="font-extrabold uppercase font-mono text-red-600">{severity}</span>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1">Description:</span>
                <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {description || 'No detailed description provided.'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1">Attached Photo:</span>
                <img src={photoUrl} alt="Preview" className="w-full h-36 object-cover rounded-xl border border-slate-200" />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              ℹ Submitting will log this report into the public recovery feed and notify nearby field engineering squads.
            </div>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center space-x-1.5 transition-colors"
          >
            <span>NEXT STEP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all transform hover:scale-[1.02]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>SUBMIT DAMAGE REPORT</span>
          </button>
        )}
      </div>

    </div>
  );
};
