import React from 'react';
import type { MatchEvent, Team } from '../types';

interface StatsProps {
  events: MatchEvent[];
  teamNames: Record<Team, string>;
}

const Stats: React.FC<StatsProps> = ({ events, teamNames }) => {
  const getStats = (team: Team) => {
    const teamEvents = events.filter(e => e.team === team);
    return {
      shots: teamEvents.filter(e => e.type === 'Shot' || e.type === 'Shot on Target').length,
      sot: teamEvents.filter(e => e.type === 'Shot on Target').length,
      bigChances: teamEvents.filter(e => e.type === 'Big Chance').length,
      possLost: teamEvents.filter(e => e.type === 'Poss. Lost').length,
      fouls: teamEvents.filter(e => e.type === 'Foul').length,
      corners: teamEvents.filter(e => e.type === 'Corner').length,
      attacks: teamEvents.filter(e => e.type === 'Attack').length,
      xg: parseFloat(teamEvents.reduce((acc, e) => acc + (e.xg || 0), 0).toFixed(2)),
    };
  };

  const statsA = getStats('A');
  const statsB = getStats('B');

  const StatBar = ({ label, valA, valB, format = (v: number) => v.toString() }: { label: string, valA: number, valB: number, format?: (v: number) => string }) => {
    const total = valA + valB;
    const percA = total === 0 ? 50 : (valA / total) * 100;
    const percB = total === 0 ? 50 : (valB / total) * 100;

    return (
      <div className="flex flex-col gap-2 py-5 border-b border-white/[0.03]">
        <div className="flex justify-between items-center px-1">
          <span className="text-base font-mono font-black text-white tabular-nums">{format(valA)}</span>
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] text-center">{label}</span>
          <span className="text-base font-mono font-black text-white tabular-nums">{format(valB)}</span>
        </div>
        <div className="h-1.5 w-full flex gap-2 px-0.5">
          <div className="flex-1 flex justify-end">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${valA >= valB ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]' : 'bg-zinc-800'}`}
              style={{ width: `${percA}%` }}
            />
          </div>
          <div className="flex-1 flex justify-start">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${valB >= valA ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'bg-zinc-800'}`}
              style={{ width: `${percB}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full bg-[#0a0a0a] p-6 mb-24">
      <div className="flex items-center justify-between mb-10">
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1">TEAM A</span>
          <span className="text-xl font-black text-blue-500 truncate max-w-[120px]">{teamNames.A}</span>
        </div>
        <div className="h-12 w-px bg-white/10" />
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1">TEAM B</span>
          <span className="text-xl font-black text-red-500 truncate max-w-[120px] text-right">{teamNames.B}</span>
        </div>
      </div>
      
      <div className="flex flex-col">
        <StatBar label="Expected Goals (xG)" valA={statsA.xg} valB={statsB.xg} format={v => v.toFixed(2)} />
        <StatBar label="Total Shots" valA={statsA.shots} valB={statsB.shots} />
        <StatBar label="Shots on Target" valA={statsA.sot} valB={statsB.sot} />
        <StatBar label="Big Chances" valA={statsA.bigChances} valB={statsB.bigChances} />
        <StatBar label="Dangerous Attacks" valA={statsA.attacks} valB={statsB.attacks} />
        <StatBar label="Corners" valA={statsA.corners} valB={statsB.corners} />
        <StatBar label="Possession Lost" valA={statsA.possLost} valB={statsB.possLost} />
        <StatBar label="Fouls" valA={statsA.fouls} valB={statsB.fouls} />
      </div>

      <div className="mt-12 p-4 bg-white/[0.02] flex flex-col gap-2">
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-500">
          <span>Match Performance Index</span>
          <span className="text-emerald-500">Live AI Analysis</span>
        </div>
        <div className="text-[11px] text-zinc-400 italic leading-relaxed">
          {statsA.xg > statsB.xg 
            ? `${teamNames.A} is currently creating higher quality chances. Defensive stability for ${teamNames.B} is a priority.`
            : statsB.xg > statsA.xg 
            ? `${teamNames.B} is dominating the expected goals battle. ${teamNames.A} needs more clinical finishing.`
            : "The match is statistically balanced. Next big chance could be decisive."}
        </div>
      </div>
    </div>
  );
};

export default Stats;
