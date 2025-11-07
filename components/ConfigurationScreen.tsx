
import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { generateSampleData } from '../services/geminiService';

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
);

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><path d="M15 4V2"/><path d="M15 10V8"/><path d="M10 9H8"/><path d="M20 9H18"/><path d="m22 2-3 3"/><path d="m6 6-3-3"/><path d="M12 20.5 9 17.5l-2.5 2.5L8 21.5Z"/><path d="m14 14-2.5 2.5L10 15Z"/></svg>
);


const ConfigurationScreen: React.FC = () => {
    const { groups, criteria, dispatch } = useHackathon();
    const [groupName, setGroupName] = useState('');
    const [criterionName, setCriterionName] = useState('');
    const [maxScore, setMaxScore] = useState(10);
    const [aiTopic, setAiTopic] = useState('AI for Social Good');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (groupName.trim()) {
            dispatch({ type: 'ADD_GROUP', payload: { id: crypto.randomUUID(), name: groupName.trim() } });
            setGroupName('');
        }
    };

    const handleAddCriterion = (e: React.FormEvent) => {
        e.preventDefault();
        if (criterionName.trim() && maxScore > 0) {
            dispatch({ type: 'ADD_CRITERION', payload: { id: crypto.randomUUID(), name: criterionName.trim(), maxScore } });
            setCriterionName('');
            setMaxScore(10);
        }
    };

    const handleGenerateData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { groups, criteria } = await generateSampleData(aiTopic);
            dispatch({ type: 'SET_SAMPLE_DATA', payload: { groups, criteria } });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-indigo-400">AI-Powered Setup</h2>
                <p className="text-gray-400 mb-4">Give your hackathon a theme to instantly generate teams and criteria.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        placeholder="e.g., Sustainable Tech"
                        className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button onClick={handleGenerateData} disabled={isLoading} className="flex items-center justify-center px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? 'Generating...' : <><WandIcon /> Generate Sample Data</>}
                    </button>
                </div>
                {error && <p className="text-red-400 mt-2">{error}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Groups Panel */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Manage Groups</h2>
                    <form onSubmit={handleAddGroup} className="flex gap-4 mb-4">
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="New group name"
                            className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Add</button>
                    </form>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {groups.map(group => (
                            <li key={group.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                                <span>{group.name}</span>
                                <button onClick={() => dispatch({ type: 'REMOVE_GROUP', payload: { id: group.id } })} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Criteria Panel */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Manage Criteria</h2>
                    <form onSubmit={handleAddCriterion} className="flex flex-col sm:flex-row gap-4 mb-4">
                        <input
                            type="text"
                            value={criterionName}
                            onChange={(e) => setCriterionName(e.target.value)}
                            placeholder="New criterion name"
                            className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <input
                            type="number"
                            value={maxScore}
                            onChange={(e) => setMaxScore(parseInt(e.target.value, 10))}
                            min="1"
                            className="w-24 bg-gray-900 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Add</button>
                    </form>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {criteria.map(criterion => (
                            <li key={criterion.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                                <span>{criterion.name} (Max: {criterion.maxScore})</span>
                                <button onClick={() => dispatch({ type: 'REMOVE_CRITERION', payload: { id: criterion.id } })} className="text-red-400 hover:text-red-300"><TrashIcon/></button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ConfigurationScreen;
