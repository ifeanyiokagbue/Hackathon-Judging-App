
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
  scores: Record<string, number>; // criterionId -> score
}

export interface HackathonState {
  criteria: Criterion[];
  groups: Group[];
  scores: Score[];
}

export type HackathonAction =
  | { type: 'ADD_CRITERION'; payload: Criterion }
  | { type: 'REMOVE_CRITERION'; payload: { id: string } }
  | { type: 'ADD_GROUP'; payload: Group }
  | { type: 'REMOVE_GROUP'; payload: { id: string } }
  | { type: 'SUBMIT_SCORE'; payload: Score }
  | { type: 'SET_SAMPLE_DATA'; payload: { groups: Group[]; criteria: Criterion[] } };

export interface HackathonContextType extends HackathonState {
  dispatch: React.Dispatch<HackathonAction>;
}
