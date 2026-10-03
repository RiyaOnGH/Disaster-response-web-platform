import React, { useState, useRef, useEffect } from 'react';
import { AlertOctagon, MapPin, Battery, Signal, WifiOff, Compass, ShieldAlert, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SOSModal } from './SOSModal';

interface SOSButtonProps {
  onTriggered: (type: string) => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onTriggered }) => {
  const { networkStatus, currentLocation, userSos } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 2000; // 2 seconds hold

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(timerRef.current!);
        setIsHolding(false);
        setHoldProgress(0);
        onTriggered('Person Trapped (Water Ingress)');
      }
    }, 50);
  };

  const endHold = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center px-4 py-8">
      
      {/* Visual Beacon Ring & Primary SOS Action */}
      <div className="relative my-6 select-none">
        
        {/* Animated Radar Pulse Rings */}
        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-signal-ripple pointer-events-none -z-0" />
        <div className="absolute -inset-6 rounded-full bg-red-600/15 animate-ping pointer-events-none -z-0 opacity-40" />

        {/* Hold Progress SVG Ring */}
        <svg className="absolute -inset-4 w-[240px] h-[240px] pointer-events-none -rotate-90 z-20">
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="8"
          />
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="transparent"
            stroke="#facc15"
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={2 * Math.PI * 110 * (1 - holdProgress / 100)}
            strokeLinecap="round"
            className="transition-all duration-75"
          />
        </svg>

        {/* The Huge Button */}
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onClick={() => {
            // Also allow click to open detailed modal if not holding
            if (holdProgress < 20) {
              setIsModalOpen(true);
            }
          }}
          className={`relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-red-700 text-white font-black text-2xl sm:text-3xl shadow-2xl flex flex-col items-center justify-center transition-all transform active:scale-95 border-4 border-red-400 ${
            userSos ? 'ring-8 ring-amber-400 animate-sos-pulse' : 'hover:scale-105'
          }`}
          aria-label="Send Emergency SOS"
        >
          <AlertOctagon className="w-16 h-16 sm:w-20 sm:h-20 mb-2 drop-shadow-md text-white animate-bounce" />
          <span className="tracking-wider drop-shadow-md">
            {userSos ? 'SOS ACTIVE' : 'SEND SOS'}
          </span>
          <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-red-100 opacity-90 mt-1">
            {isHolding ? `HOLD: ${Math.round(holdProgress)}%` : 'TAP OR HOLD 2S'}
          </span>
        </button>

      </div>

      {/* Helper instruction */}
      <p className="text-xs text-slate-500 font-medium mt-2">
        Press & hold for 2 seconds for instant dispatch, or tap to choose distress reason.
      </p>

      {/* Telemetry Status Bar */}
      <div className="w-full mt-8 p-5 bg-white rounded-3xl border border-slate-200 shadow-lg text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Emergency Hardware & Sensor Telemetry
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Sensors Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          
          <div className="flex items-start space-x-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Location</div>
              <div className="font-extrabold text-slate-900 mt-0.5">{currentLocation}</div>
              <div className="text-[10px] text-slate-500">Patna, Bihar</div>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">GPS Precision</div>
              <div className="font-extrabold text-slate-900 mt-0.5">Available</div>
              <div className="text-[10px] text-emerald-600 font-semibold font-mono">Accuracy ±4m</div>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <Battery className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Battery</div>
              <div className="font-extrabold text-slate-900 mt-0.5">64% Remaining</div>
              <div className="text-[10px] text-slate-500">~14 hrs Standby</div>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <div className={`p-2 rounded-xl shrink-0 ${networkStatus === 'offline' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {networkStatus === 'offline' ? <WifiOff className="w-4 h-4" /> : <Signal className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Network State</div>
              <div className="font-extrabold text-slate-900 mt-0.5">
                {networkStatus === 'offline' ? 'Cellular Outage' : 'Connected'}
              </div>
              <div className={`text-[10px] font-semibold ${networkStatus === 'offline' ? 'text-amber-600' : 'text-emerald-600'}`}>
                {networkStatus === 'offline' ? 'RescueMesh Fallback' : 'Direct Gateway'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <SOSModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(type) => {
          onTriggered(type);
        }}
      />

    </div>
  );
};
