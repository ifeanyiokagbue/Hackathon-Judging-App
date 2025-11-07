import React, { useState, useCallback } from 'react';
import { useHackathon } from '../context/HackathonContext';
import ConfigurationScreen from './ConfigurationScreen';
import JudgingScreen from './JudgingScreen';
import ResultsScreen from './ResultsScreen';

type Screen = 'setup' | 'judge' | 'results';

const NavButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
            active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {children}
    </button>
);

const MainDashboard: React.FC = () => {
    const { userRole, judgeName, hackathons, activeHackathonId, logout, dispatch } = useHackathon();
    
    const getDefaultScreen = () => {
        if (userRole === 'admin') return 'setup';
        if (userRole === 'judge') return 'judge';
        return 'results';
    }

    const [activeScreen, setActiveScreen] = useState<Screen>(getDefaultScreen());

    const renderScreen = useCallback(() => {
        switch (activeScreen) {
            case 'setup':
                return userRole === 'admin' ? <ConfigurationScreen /> : <p>Access Denied</p>;
            case 'judge':
                 return (userRole === 'admin' || userRole === 'judge') ? <JudgingScreen /> : <p>Access Denied</p>;
            case 'results':
                return <ResultsScreen />;
            default:
                return userRole === 'admin' ? <ConfigurationScreen /> : <JudgingScreen />;
        }
    }, [activeScreen, userRole]);

    const handleHackathonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: 'SWITCH_HACKATHON', payload: { id: e.target.value } });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold tracking-tight text-white">Hackathon Dashboard</h1>
                             <select
                                value={activeHackathonId || ''}
                                onChange={handleHackathonChange}
                                className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                {Object.values(hackathons).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(h => (
                                    <option key={h.id} value={h.id}>{h.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <nav className="hidden sm:flex items-center space-x-2 bg-gray-800 p-1 rounded-lg">
                                {userRole === 'admin' && (
                                    <NavButton active={activeScreen === 'setup'} onClick={() => setActiveScreen('setup')}>
                                        Setup
                                    </NavButton>
                                )}
                                {(userRole === 'admin' || userRole === 'judge') && (
                                    <NavButton active={activeScreen === 'judge'} onClick={() => setActiveScreen('judge')}>
                                        Judge
                                    </NavButton>
                                )}
                                <NavButton active={activeScreen === 'results'} onClick={() => setActiveScreen('results')}>
                                    Results
                                </NavButton>
                            </nav>
                             <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400 hidden md:block">
                                    Welcome, {judgeName || userRole}
                                </span>
                                <button onClick={logout} className="px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-colors">
                                    Logout
                                </button>
                             </div>
                        </div>
                    </div>
                     <nav className="sm:hidden flex items-center justify-center space-x-2 bg-gray-800 p-1 rounded-lg my-2">
                        {userRole === 'admin' && (
                            <NavButton active={activeScreen === 'setup'} onClick={() => setActiveScreen('setup')}>
                                Setup
                            </NavButton>
                        )}
                        {(userRole === 'admin' || userRole === 'judge') && (
                            <NavButton active={activeScreen === 'judge'} onClick={() => setActiveScreen('judge')}>
                                Judge
                            </NavButton>
                        )}
                        <NavButton active={activeScreen === 'results'} onClick={() => setActiveScreen('results')}>
                            Results
                        </NavButton>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderScreen()}
            </main>
        </div>
    );
};

export default MainDashboard;
