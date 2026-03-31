import { useState } from 'react'
import Pitch from './components/Pitch'
import Controls from './components/Controls'
import Stats from './components/Stats'
import { useMatch } from './hooks/useMatch'
import type { Team } from './types'

function App() {
  const { 
    state, addEvent, toggleTimer, resetMatch, 
    setActiveType, setTeamName, setScore
  } = useMatch();

  const [filters, setFilters] = useState({
    Shots: false,
    'Shots on Target': false,
    'Poss. Lost': false,
    xG: true,
    Heatmap: false
  });

  const [viewTeam, setViewTeam] = useState<Team | 'Both'>('Both');
  const [activeTab, setActiveTab] = useState<'Pitch' | 'Stats'>('Pitch');

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(f => ({ ...f, [key]: !f[key] }));
  };

  const getStats = (team: Team) => {
    const teamEvents = state.events.filter(e => e.team === team);
    return {
      xg: teamEvents.reduce((acc, e) => acc + (e.xg || 0), 0).toFixed(2),
    };
  };

  const statsA = getStats('A');
  const statsB = getStats('B');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#e4e4e7] max-w-lg mx-auto overflow-hidden font-sans">
      {/* 1. Technical Header: Inputs & Scoreboard */}
      <div className="bg-[#0f0f0f] border-b border-white/[0.05] px-5 py-5 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-emerald-500/20 blur-xl" />
        
        <div className="flex justify-between items-start relative z-10 gap-4">
          {/* Team A Management */}
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Team A (Upper)</span>
            <input 
              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-black uppercase outline-none focus:border-blue-500/50 transition-all w-full"
              value={state.teamNames.A}
              onChange={(e) => setTeamName('A', e.target.value)}
              placeholder="Name"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-blue-500">{state.score.A} <span className="text-[8px] text-zinc-600 ml-1">PTS</span></span>
              <span className="text-[9px] font-mono text-zinc-500 font-bold">xG {statsA.xg}</span>
            </div>
          </div>

          {/* Center: Timer & Global Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-2 border border-emerald-500/20">
              <span className={`w-1 h-1 rounded-full ${state.isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-[10px] font-mono font-black text-emerald-500">
                {formatTime(state.elapsedTime)}
              </span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setScore('A', state.score.A + 1)} className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black text-xs active:scale-95 transition-all">+A</button>
              <button onClick={() => setScore('B', state.score.B + 1)} className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-black text-xs active:scale-95 transition-all">+B</button>
            </div>
          </div>

          {/* Team B Management */}
          <div className="flex-1 flex flex-col gap-1.5 items-end">
            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Team B (Lower)</span>
            <input 
              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-black uppercase outline-none focus:border-red-500/50 transition-all w-full text-right"
              value={state.teamNames.B}
              onChange={(e) => setTeamName('B', e.target.value)}
              placeholder="Name"
            />
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] font-mono text-zinc-500 font-bold">xG {statsB.xg}</span>
              <span className="text-[10px] font-black text-red-500">{state.score.B} <span className="text-[8px] text-zinc-600 ml-1">PTS</span></span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mt-6 border-t border-white/[0.03] -mx-5 px-5 pt-3 justify-center gap-12">
          {(['Pitch', 'Stats'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-4">
        {activeTab === 'Pitch' ? (
          <>
            {/* Filters Row */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide shrink-0 pb-1">
              <div className="bg-[#0f0f0f] border border-white/[0.05] rounded-xl p-1 flex gap-1">
                {(['Shots', 'Shots on Target', 'Poss. Lost', 'xG', 'Heatmap'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => toggleFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all border whitespace-nowrap ${
                      filters[f] 
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'bg-black border-transparent text-zinc-500'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical Pitch Viewer */}
            <div className="flex-1 bg-[#0a0a0a] border border-white/[0.05] rounded-[32px] p-2 relative min-h-[400px] flex items-center justify-center overflow-hidden shadow-2xl">
              <Pitch 
                events={state.events} 
                onPitchTap={addEvent}
                filters={filters}
                activeTeam={viewTeam}
                activeType={state.activeType}
                teamNames={state.teamNames}
              />
              
              <div className="absolute top-6 right-6 flex flex-col gap-2 scale-75 origin-top-right z-30">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-1 rounded-xl flex flex-col shadow-2xl">
                  <button onClick={() => setViewTeam('Both')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${viewTeam === 'Both' ? 'bg-white text-black' : 'text-zinc-500'}`}>Both</button>
                  <button onClick={() => setViewTeam('A')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${viewTeam === 'A' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>A Only</button>
                  <button onClick={() => setViewTeam('B')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${viewTeam === 'B' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}>B Only</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <Stats events={state.events} teamNames={state.teamNames} />
          </div>
        )}
      </div>

      {/* 3. Footer Controller */}
      <div className="bg-[#0f0f0f] border-t border-white/[0.05] shrink-0 safe-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <Controls 
          activeType={state.activeType}
          setActiveType={setActiveType}
          isPaused={state.isPaused}
          onToggleTimer={toggleTimer}
          onReset={resetMatch}
        />
      </div>
    </div>
  )
}

export default App
