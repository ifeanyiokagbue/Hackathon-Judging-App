
import React, { useMemo } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResultsScreen: React.FC = () => {
    const { groups, scores, criteria } = useHackathon();

    const processedData = useMemo(() => {
        const scoreMap: Record<string, { name: string; totalScore: number; breakdown: Record<string, number> }> = {};

        groups.forEach(group => {
            scoreMap[group.id] = { 
                name: group.name, 
                totalScore: 0,
                breakdown: criteria.reduce((acc, crit) => ({...acc, [crit.name]: 0}), {})
            };
        });

        scores.forEach(scoreEntry => {
            if (scoreMap[scoreEntry.groupId]) {
                let entryTotal = 0;
                Object.entries(scoreEntry.scores).forEach(([criterionId, score]) => {
                    entryTotal += score;
                    const criterion = criteria.find(c => c.id === criterionId);
                    if (criterion) {
                      scoreMap[scoreEntry.groupId].breakdown[criterion.name] += score;
                    }
                });
                scoreMap[scoreEntry.groupId].totalScore += entryTotal;
            }
        });

        return Object.values(scoreMap).sort((a, b) => b.totalScore - a.totalScore);
    }, [groups, scores, criteria]);

    if (groups.length === 0) {
         return (
            <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400">No Data</h2>
                <p className="mt-2 text-gray-400">Please set up groups in the 'Setup' tab to see results.</p>
            </div>
        );
    }
    
    if (scores.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-blue-400">Awaiting Scores</h2>
                <p className="mt-2 text-gray-400">No scores have been submitted yet. Results will appear here live as judges vote.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-black text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Live Hackathon Leaderboard
            </h2>
            
            {/* Chart */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="name" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1A202C',
                                border: '1px solid #4A5568',
                                color: '#E2E8F0'
                            }}
                            cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                        />
                        <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                        <Bar dataKey="totalScore" fill="#6366F1" name="Total Score" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Detailed Table */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
                <h3 className="text-xl font-bold p-4 border-b border-gray-700">Detailed Score Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="p-4 font-semibold">Rank</th>
                                <th className="p-4 font-semibold">Group</th>
                                <th className="p-4 font-semibold text-right">Total Score</th>
                                {criteria.map(c => <th key={c.id} className="p-4 font-semibold text-right">{c.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {processedData.map((group, index) => (
                                <tr key={group.name} className="border-t border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-4 font-bold text-lg">{index + 1}</td>
                                    <td className="p-4 font-semibold text-indigo-400">{group.name}</td>
                                    <td className="p-4 font-bold text-right">{group.totalScore}</td>
                                    {criteria.map(c => (
                                      <td key={c.id} className="p-4 text-right">{group.breakdown[c.name] || 0}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResultsScreen;
