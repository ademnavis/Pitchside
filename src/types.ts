export type Team = 'A' | 'B';

export type EventType = 
  | 'Shot' 
  | 'Shot on Target' 
  | 'Big Chance' 
  | 'Poss. Lost' 
  | 'Foul' 
  | 'Corner' 
  | 'Attack';

export interface MatchEvent {
  id: string;
  team: Team;
  type: EventType;
  x: number; // 0-100
  y: number; // 0-100
  timestamp: number;
  xg?: number;
}

export interface MatchState {
  events: MatchEvent[];
  isPaused: boolean;
  startTime: number | null;
  elapsedTime: number; // in seconds
  activeTeam: Team;
  activeType: EventType;
  teamNames: Record<Team, string>;
  score: Record<Team, number>;
}

export const EVENT_COLORS: Record<EventType, string> = {
  'Shot': '#3b82f6', // Blue
  'Shot on Target': '#22c55e', // Green
  'Big Chance': '#eab308', // Gold/Yellow
  'Poss. Lost': '#ef4444', // Red
  'Foul': '#f97316', // Orange
  'Corner': '#a855f7', // Purple
  'Attack': '#ffffff', // White
};
