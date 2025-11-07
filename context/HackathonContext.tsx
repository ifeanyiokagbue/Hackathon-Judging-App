import React, { createContext, useReducer, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import type { AppState, HackathonAction, HackathonContextType, Hackathon } from '../types';

const ADMIN_CODE = "admin123";
const JUDGE_CODE = "judge123";

const createNewHackathon = (name: string): Hackathon => {
    return {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        criteria: [],
        groups: [],
        scores: [],
    };
};

const getInitialState = (): AppState => {
    try {
        const storedState = localStorage.getItem('hackathonAppState');
        if (storedState) {
            const parsed = JSON.parse(storedState);
            // Add auth state which is not persisted
            return { ...parsed, userRole: null, judgeName: null };
        }
    } catch (error) {
        console.error("Could not parse app state from localStorage", error);
    }
    
    // Default initial state if nothing in storage
    const firstHackathon = createNewHackathon("My First Hackathon");
    return {
        hackathons: { [firstHackathon.id]: firstHackathon },
        activeHackathonId: firstHackathon.id,
        userRole: null,
        judgeName: null,
    };
};

const appReducer = (state: AppState, action: HackathonAction): AppState => {
    // Operations that affect the active hackathon
    const activeHackathonId = state.activeHackathonId;
    if (activeHackathonId) {
        const activeHackathon = state.hackathons[activeHackathonId];
        switch (action.type) {
            case 'ADD_CRITERION':
                return { ...state, hackathons: { ...state.hackathons, [activeHackathonId]: { ...activeHackathon, criteria: [...activeHackathon.criteria, action.payload] } } };
            case 'REMOVE_CRITERION':
                return { ...state, hackathons: { ...state.hackathons, [activeHackathonId]: { ...activeHackathon, criteria: activeHackathon.criteria.filter(c => c.id !== action.payload.id) } } };
            case 'ADD_GROUP':
                return { ...state, hackathons: { ...state.hackathons, [activeHackathonId]: { ...activeHackathon, groups: [...activeHackathon.groups, action.payload] } } };
            case 'REMOVE_GROUP':
                 return { ...state, hackathons: { ...state.hackathons, [activeHackathonId]: { ...activeHackathon, groups: activeHackathon.groups.filter(g => g.id !== action.payload.id) } } };
            case 'SUBMIT_SCORE':
                return { ...state, hackathons: { ...state.hackathons, [activeHackathonId]: { ...activeHackathon, scores: [...activeHackathon.scores, action.payload] } } };
            case 'SET_SAMPLE_DATA':
                return { ...state, hackathons: { ...state.hackathons, [activeHackathonId]: { ...activeHackathon, groups: action.payload.groups, criteria: action.payload.criteria, scores: [] } } };
        }
    }

    // Global state operations
    switch (action.type) {
        case 'CREATE_HACKATHON': {
            const newHackathon = createNewHackathon(action.payload.name);
            return { ...state, hackathons: { ...state.hackathons, [newHackathon.id]: newHackathon }, activeHackathonId: newHackathon.id, };
        }
        case 'SWITCH_HACKATHON':
            return { ...state, activeHackathonId: action.payload.id };
        case 'LOGIN':
            return { ...state, userRole: action.payload.role, judgeName: action.payload.name || null };
        case 'LOGOUT':
            return { ...state, userRole: null, judgeName: null };
        default:
            return state;
    }
};

const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

export const HackathonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, getInitialState());

    useEffect(() => {
        try {
            // Persist everything except auth state
            const { userRole, judgeName, ...stateToPersist } = state;
            localStorage.setItem('hackathonAppState', JSON.stringify(stateToPersist));
        } catch (error) {
            console.error("Could not save app state to localStorage", error);
        }
    }, [state]);

    const activeHackathon = useMemo(() => {
        if (!state.activeHackathonId) return null;
        return state.hackathons[state.activeHackathonId] || null;
    }, [state.hackathons, state.activeHackathonId]);

    const login = useCallback((code: string, name?: string): boolean => {
        if (code === ADMIN_CODE) {
            dispatch({ type: 'LOGIN', payload: { role: 'admin' } });
            return true;
        }
        if (code === JUDGE_CODE && name) {
            dispatch({ type: 'LOGIN', payload: { role: 'judge', name } });
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        dispatch({ type: 'LOGOUT' });
    }, []);

    const viewAsPublic = useCallback(() => {
        dispatch({ type: 'LOGIN', payload: { role: 'public' } });
    }, []);


    return (
        <HackathonContext.Provider value={{ ...state, activeHackathon, dispatch, login, logout, viewAsPublic }}>
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
