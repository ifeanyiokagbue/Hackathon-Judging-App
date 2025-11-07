export interface Criterion {
  id: string;
  name: string;
  maxScore: number;
}

export interface Group {
  id: string;
  name: string;
}

export interface Score {
  groupId: string;
  judgeName: string; // Added to track who judged
  scores: Record<string, number>; // criterionId -> score
}

// Represents a single hackathon event
export interface Hackathon {
  id: string;
  name: string;
  createdAt: string;
  criteria: Criterion[];
  groups: Group[];
  scores: Score[];
}

// The main application state, renamed from HackathonState
export interface AppState {
  hackathons: Record<string, Hackathon>;
  activeHackathonId: string | null;
  userRole: 'admin' | 'judge' | 'public' | null;
  judgeName: string | null;
}

export type HackathonAction =
  | { type: 'ADD_CRITERION'; payload: Criterion }
  | { type: 'REMOVE_CRITERION'; payload: { id: string } }
  | { type: 'ADD_GROUP'; payload: Group }
  | { type: 'REMOVE_GROUP'; payload: { id: string } }
  | { type: 'SUBMIT_SCORE'; payload: Score }
  | { type: 'SET_SAMPLE_DATA'; payload: { groups: Group[]; criteria: Criterion[] } }
  | { type: 'CREATE_HACKATHON'; payload: { name: string } }
  | { type: 'SWITCH_HACKATHON'; payload: { id: string } }
  | { type: 'LOGIN'; payload: { role: 'admin' | 'judge' | 'public'; name?: string } }
  | { type: 'LOGOUT' };

export interface HackathonContextType extends AppState {
  dispatch: React.Dispatch<HackathonAction>;
  activeHackathon: Hackathon | null;
  login: (code: string, name?: string) => boolean;
  logout: () => void;
  viewAsPublic: () => void;
}
