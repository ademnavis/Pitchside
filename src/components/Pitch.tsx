import React, { useState, useRef } from 'react';
import type { MatchEvent, Team, EventType } from '../types';
import { EVENT_COLORS } from '../types';

interface PitchProps {
  events: MatchEvent[];
  onPitchTap: (x: number, y: number, team: Team) => void;
  filters: {
    Shots: boolean;
    'Shots on Target': boolean;
    'Poss. Lost': boolean;
    xG: boolean;
    Heatmap: boolean;
  };
  activeTeam: Team | 'Both';
  activeType: EventType;
  teamNames: Record<Team, string>;
}

const Pitch: React.FC<PitchProps> = ({ events, onPitchTap, filters, activeTeam, activeType, teamNames }) => {
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleStart = (clientX: number, clientY: number) => {
    setTouchStart({ x: clientX, y: clientY });
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    handleEnd(e.clientX, e.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.changedTouches.length > 0) {
      handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  };

  const handleEnd = (endX: number, endY: number) => {
    if (!touchStart || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const startXRelative = ((touchStart.x - rect.left) / rect.width) * 100;
    const startYRelative = ((touchStart.y - rect.top) / rect.height) * 100;
    const endXRelative = ((endX - rect.left) / rect.width) * 100;
    const endYRelative = ((endY - rect.top) / rect.height) * 100;

    const dx = endXRelative - startXRelative;
    const dy = endYRelative - startYRelative;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If activeType is Poss. Lost, check for swipe
    if (activeType === 'Poss. Lost') {
      if (distance > 5) { // Swipe detected
        // Swipe up -> Team A lost possession
        // Swipe down -> Team B lost possession
        const team: Team = dy < 0 ? 'A' : 'B';
        onPitchTap(startXRelative, startYRelative, team);
      }
    } else {
      // Regular click logic
      // Click on top half (y < 50) -> Team B attacking
      // Click on bottom half (y > 50) -> Team A attacking
      const team: Team = startYRelative < 50 ? 'B' : 'A';
      onPitchTap(startXRelative, startYRelative, team);
    }

    setTouchStart(null);
  };

  const filteredEvents = events.filter(event => {
    const matchesTeam = activeTeam === 'Both' || event.team === activeTeam;
    const matchesFilter = 
      (!filters.Shots || event.type === 'Shot' || event.type === 'Shot on Target') &&
      (!filters['Shots on Target'] || event.type === 'Shot on Target') &&
      (!filters['Poss. Lost'] || event.type === 'Poss. Lost');
    
    return matchesTeam && matchesFilter;
  });

  return (
    <div className="w-full h-full relative flex flex-col items-center">
      {/* Team A Label (Top) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 bg-white/5 px-6 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
          {teamNames.A}
        </span>
      </div>

      <div className="pitch-container w-full h-full shadow-2xl rounded-[32px] overflow-hidden border border-white/10 glass-card relative">
        <svg 
          ref={svgRef}
          viewBox="0 0 100 100" 
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a2e18" />
              <stop offset="50%" stopColor="#1e3a1a" />
              <stop offset="100%" stopColor="#1a2e18" />
            </linearGradient>
            
            <radialGradient id="heatGradient">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          <rect x="0" y="0" width="100" height="100" fill="url(#pitchGrad)" />
          
          {/* Pitch Lines */}
          <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          
          {/* Top Half (Team A Area) */}
          <rect x="15" y="0" width="70" height="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <rect x="35" y="0" width="30" height="6" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <path d="M 40 18 A 10 10 0 0 0 60 18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          
          {/* Bottom Half (Team B Area) */}
          <rect x="15" y="82" width="70" height="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <rect x="35" y="94" width="30" height="6" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <path d="M 40 82 A 10 10 0 0 1 60 82" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

          {/* Center Line and Circle */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.3)" />

          {/* Goals */}
          <rect x="42.5" y="-1" width="15" height="1" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <rect x="42.5" y="100" width="15" height="1" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

          {/* Events */}
          {filteredEvents.map(event => {
            const isShot = event.type === 'Shot' || event.type === 'Shot on Target';
            let radius = 1.8;
            
            if (filters.xG && isShot && event.xg) {
              radius = 0.8 + (event.xg * 4.5);
            } else if (event.type === 'Big Chance') {
              radius = 2.5;
            }

            return (
              <g key={event.id}>
                <circle 
                  cx={event.x} 
                  cy={event.y} 
                  r={radius} 
                  fill={EVENT_COLORS[event.type]} 
                  className="transition-all duration-300 animate-in zoom-in"
                  stroke="white"
                  strokeWidth="0.2"
                  opacity="0.9"
                />
                {filters.xG && isShot && event.xg && (
                  <text 
                    x={event.x} 
                    y={event.y - radius - 1} 
                    fontSize="2.5" 
                    fill="white" 
                    textAnchor="middle"
                    className="pointer-events-none font-bold tabular-nums"
                  >
                    {event.xg.toFixed(2)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Team B Label (Bottom) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 bg-white/5 px-6 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
          {teamNames.B}
        </span>
      </div>
    </div>
  );
};

export default Pitch;
