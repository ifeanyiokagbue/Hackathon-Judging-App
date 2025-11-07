
import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import type { HackathonState, HackathonAction, HackathonContextType } from '../types';

const initialState: HackathonState = {
    criteria: [],
    groups: [],
    scores: [],
};

const hackathonReducer = (state: HackathonState, action: HackathonAction): HackathonState => {
    switch (action.type) {
        case 'ADD_CRITERION':
            return { ...state, criteria: [...state.criteria, action.payload] };
        case 'REMOVE_CRITERION':
            return { ...state, criteria: state.criteria.filter(c => c.id !== action.payload.id) };
        case 'ADD_GROUP':
            return { ...state, groups: [...state.groups, action.payload] };
        case 'REMOVE_GROUP':
            return { ...state, groups: state.groups.filter(g => g.id !== action.payload.id) };
        case 'SUBMIT_SCORE':
            // Each submission is a new entry
            return { ...state, scores: [...state.scores, action.payload] };
        case 'SET_SAMPLE_DATA':
            return { ...state, groups: action.payload.groups, criteria: action.payload.criteria, scores: [] };
        default:
            return state;
    }
};

const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

const getInitialState = (): HackathonState => {
  try {
    const storedState = localStorage.getItem('hackathonState');
    return storedState ? JSON.parse(storedState) : initialState;
  } catch (error) {
    console.error("Could not parse hackathon state from localStorage", error);
    return initialState;
  }
}

export const HackathonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(hackathonReducer, getInitialState());

    useEffect(() => {
        try {
            localStorage.setItem('hackathonState', JSON.stringify(state));
        } catch (error) {
            console.error("Could not save hackathon state to localStorage", error);
        }
    }, [state]);

    return (
        <HackathonContext.Provider value={{ ...state, dispatch }}>
            {children}
        </HackathonContext.Provider>
    );
};

export const useHackathon = (): HackathonContextType => {
    const context = useContext(HackathonContext);
    if (context === undefined) {
        throw new Error('useHackathon must be used within a HackathonProvider');
    }
    return context;
};
