import React from 'react';
import type { EventType } from '../types';
import { EVENT_COLORS } from '../types';

interface ControlsProps {
  activeType: EventType;
  setActiveType: (type: EventType) => void;
  isPaused: boolean;
  onToggleTimer: () => void;
  onReset: () => void;
}

const EVENT_TYPES: EventType[] = [
  'Shot', 'Shot on Target', 'Big Chance', 'Poss. Lost', 'Foul', 'Corner', 'Attack'
];

const Controls: React.FC<ControlsProps> = ({
  activeType, setActiveType,
  isPaused, onToggleTimer, onReset,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-transparent pb-6 sm:pb-5">
      {/* 1. Timer & Reset Row */}
      <div className="flex gap-3 items-center">
        <button 
          onClick={onToggleTimer}
          className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
            isPaused 
            ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
            : 'bg-zinc-800 text-emerald-500 border border-emerald-500/30'
          }`}
        >
          {isPaused ? '▶ Start Match' : '⏸ Active'}
        </button>

        <button 
          onClick={onReset}
          className="w-10 h-10 bg-black border border-white/[0.05] rounded-xl flex items-center justify-center text-zinc-700 hover:text-red-500 transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* 2. Tactical Event Matrix */}
      <div className="grid grid-cols-4 gap-1.5">
        {EVENT_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`py-2.5 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all border-2 ${
              activeType === type 
              ? 'border-white/40 ring-1 ring-white/10 scale-[0.96]' 
              : 'border-transparent bg-black/[0.3] text-zinc-500 hover:text-zinc-300'
            }`}
            style={{ 
              backgroundColor: activeType === type ? `${EVENT_COLORS[type]}33` : undefined,
              color: activeType === type ? (type === 'Attack' ? '#fff' : EVENT_COLORS[type]) : undefined,
              borderColor: activeType === type ? EVENT_COLORS[type] : undefined
            }}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Controls;
