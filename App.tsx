
import React, { useState, useCallback } from 'react';
import { HackathonProvider } from './context/HackathonContext';
import ConfigurationScreen from './components/ConfigurationScreen';
import JudgingScreen from './components/JudgingScreen';
import ResultsScreen from './components/ResultsScreen';

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

const App: React.FC = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>('setup');

    const renderScreen = useCallback(() => {
        switch (activeScreen) {
            case 'setup':
                return <ConfigurationScreen />;
            case 'judge':
                return <JudgingScreen />;
            case 'results':
                return <ResultsScreen />;
            default:
                return <ConfigurationScreen />;
        }
    }, [activeScreen]);

    return (
        <HackathonProvider>
            <div className="min-h-screen bg-gray-900 text-gray-100">
                <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <h1 className="text-xl font-bold tracking-tight text-white">Hackathon Dashboard</h1>
                            <nav className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg">
                                <NavButton active={activeScreen === 'setup'} onClick={() => setActiveScreen('setup')}>
                                    Setup
                                </NavButton>
                                <NavButton active={activeScreen === 'judge'} onClick={() => setActiveScreen('judge')}>
                                    Judge
                                </NavButton>
                                <NavButton active={activeScreen === 'results'} onClick={() => setActiveScreen('results')}>
                                    Results
                                </NavButton>
                            </nav>
                        </div>
                    </div>
                </header>
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {renderScreen()}
                </main>
            </div>
        </HackathonProvider>
    );
};

export default App;
