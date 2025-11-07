import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import ResultsScreen from './ResultsScreen';

const LoginScreen: React.FC<{ isPublicDirectView: boolean }> = ({ isPublicDirectView }) => {
    const { login, viewAsPublic } = useHackathon();
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isJudge, setIsJudge] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = login(code, name);

        if (!success) {
            if (code.toLowerCase() === 'judge123' && !name) {
                setIsJudge(true);
                setError('Please enter your name to continue as a judge.');
            } else {
                setError('Invalid code or name provided.');
                setIsJudge(false);
            }
        }
    };
    
    if (isPublicDirectView) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100">
                <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                             <h1 className="text-xl font-bold tracking-tight text-white">Hackathon Dashboard</h1>
                             <button onClick={() => window.location.reload()} className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 text-gray-300 hover:bg-gray-700 hover:text-white">
                                Back to Login
                            </button>
                        </div>
                    </div>
                </header>
                 <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ResultsScreen />
                </main>
            </div>
        );
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
                    <h1 className="text-3xl font-bold mb-2 text-white">Hackathon Dashboard</h1>
                    <p className="text-gray-400 mb-8">Enter your access code to begin.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Access Code"
                            className="block w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            aria-label="Access Code"
                        />
                        {(isJudge || code.toLowerCase() === 'judge123') && (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name (Judges)"
                                className="block w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                required
                                aria-label="Your Name for Judging"
                            />
                        )}
                        <button type="submit" className="w-full py-3 px-4 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                            Enter
                        </button>
                    </form>

                    {error && <p className="text-red-400 mt-4">{error}</p>}
                    
                    <div className="mt-6 flex items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <button onClick={viewAsPublic} className="mt-6 w-full py-3 px-4 font-bold text-indigo-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                        View Live Results
                    </button>
                    <p className="text-xs text-gray-500 mt-8">Admin Code: admin123 | Judge Code: judge123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
