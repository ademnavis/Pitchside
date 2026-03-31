import { useState, useEffect, useCallback } from 'react';
import type { MatchEvent, Team, EventType, MatchState } from '../types';
import { calculateXG } from '../utils/xg';

const STORAGE_KEY = 'pitchside_match_state';

export const useMatch = () => {
  const [state, setState] = useState<MatchState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        isPaused: true, // Always start paused on reload
        teamNames: parsed.teamNames || { A: 'Team A', B: 'Team B' },
        score: parsed.score || { A: 0, B: 0 }
      };
    }
    return {
      events: [],
      isPaused: true,
      startTime: null,
      elapsedTime: 0,
      activeTeam: 'A',
      activeType: 'Shot',
      teamNames: { A: 'Team A', B: 'Team B' },
      score: { A: 0, B: 0 }
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    let interval: number;
    if (!state.isPaused) {
      interval = setInterval(() => {
        setState(s => ({ ...s, elapsedTime: s.elapsedTime + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isPaused]);

  const toggleTimer = useCallback(() => {
    setState(s => ({ ...s, isPaused: !s.isPaused }));
  }, []);

  const resetMatch = useCallback(() => {
    if (window.confirm('Reset all match data?')) {
      setState({
        events: [],
        isPaused: true,
        startTime: null,
        elapsedTime: 0,
        activeTeam: 'A',
        activeType: 'Shot',
        teamNames: { A: 'Team A', B: 'Team B' },
        score: { A: 0, B: 0 }
      });
    }
  }, []);

  const addEvent = useCallback((x: number, y: number, team: Team) => {
    if (state.isPaused) {
      alert('Start the timer to record events');
      return;
    }

    const isShot = state.activeType === 'Shot' || state.activeType === 'Shot on Target';
    const newEvent: MatchEvent = {
      id: crypto.randomUUID(),
      team: team,
      type: state.activeType,
      x,
      y,
      timestamp: state.elapsedTime,
      xg: isShot ? calculateXG(x, y, team) : undefined,
    };

    setState(s => ({
      ...s,
      events: [...s.events, newEvent],
    }));
  }, [state.activeType, state.isPaused, state.elapsedTime]);

  const setActiveTeam = (team: Team) => setState(s => ({ ...s, activeTeam: team }));
  const setActiveType = (type: EventType) => setState(s => ({ ...s, activeType: type }));
  const setTeamName = (team: Team, name: string) => 
    setState(s => ({ ...s, teamNames: { ...s.teamNames, [team]: name } }));
  const setScore = (team: Team, val: number) =>
    setState(s => ({ ...s, score: { ...s.score, [team]: Math.max(0, val) } }));

  return {
    state,
    addEvent,
    toggleTimer,
    resetMatch,
    setActiveTeam,
    setActiveType,
    setTeamName,
    setScore,
  };
};
