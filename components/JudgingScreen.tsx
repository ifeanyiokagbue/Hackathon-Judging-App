
import React, { useState, useEffect } from 'react';
import { useHackathon } from '../context/HackathonContext';
import type { Score } from '../types';

const JudgingScreen: React.FC = () => {
    const { groups, criteria, dispatch } = useHackathon();
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [currentScores, setCurrentScores] = useState<Record<string, number>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (groups.length > 0 && !selectedGroupId) {
            setSelectedGroupId(groups[0].id);
        }
    }, [groups, selectedGroupId]);

    useEffect(() => {
        // Reset scores when group or criteria change
        const initialScores: Record<string, number> = {};
        criteria.forEach(c => {
            initialScores[c.id] = 0;
        });
        setCurrentScores(initialScores);
    }, [selectedGroupId, criteria]);
    
    const handleScoreChange = (criterionId: string, value: number) => {
        setCurrentScores(prev => ({ ...prev, [criterionId]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGroupId || Object.keys(currentScores).length === 0) return;

        const newScore: Score = {
            groupId: selectedGroupId,
            scores: currentScores,
        };
        dispatch({ type: 'SUBMIT_SCORE', payload: newScore });

        // Show success message and reset for next entry
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Optionally, move to the next group
        const currentIndex = groups.findIndex(g => g.id === selectedGroupId);
        if (currentIndex < groups.length - 1) {
            setSelectedGroupId(groups[currentIndex + 1].id);
        } else {
            // Or reset scores for the same group
            const initialScores: Record<string, number> = {};
            criteria.forEach(c => {
                initialScores[c.id] = 0;
            });
            setCurrentScores(initialScores);
        }
    };

    if (groups.length === 0 || criteria.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400">Setup Required</h2>
                <p className="mt-2 text-gray-400">Please add at least one group and one criterion in the 'Setup' tab before judging.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sm:p-8 shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400">Judge Submission</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="group-select" className="block text-sm font-medium text-gray-300 mb-2">Select Group</label>
                        <select
                            id="group-select"
                            value={selectedGroupId}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                            className="block w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-6">
                        {criteria.map(criterion => (
                            <div key={criterion.id}>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor={`score-${criterion.id}`} className="font-medium text-gray-300">{criterion.name}</label>
                                    <span className="text-lg font-bold text-indigo-400">{currentScores[criterion.id] || 0} / {criterion.maxScore}</span>
                                </div>
                                <input
                                    type="range"
                                    id={`score-${criterion.id}`}
                                    min="0"
                                    max={criterion.maxScore}
                                    value={currentScores[criterion.id] || 0}
                                    onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value, 10))}
                                    className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-indigo-500"
                                />
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="w-full py-3 px-4 font-bold text-lg text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-105">
                        Submit Scores
                    </button>
                    {showSuccess && (
                        <p className="text-center text-green-400 mt-4 animate-pulse">Scores submitted successfully!</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default JudgingScreen;
