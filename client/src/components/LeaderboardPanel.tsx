import React, { useState } from 'react';
import { usePlayerStore } from '../store';
import { apiClient } from '../api';

interface LeaderboardEntry {
  id: string;
  username: string;
  level: number;
  xp: number;
  enemies_defeated: number;
}

export default function LeaderboardPanel() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.getLeaderboard();
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass p-6 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">LEADERBOARD</h2>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyan-500/30 text-gray-400">
                  <th className="text-left py-2">RANK</th>
                  <th className="text-left py-2">PLAYER</th>
                  <th className="text-right py-2">LEVEL</th>
                  <th className="text-right py-2">XP</th>
                  <th className="text-right py-2">DEFEATED</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                {entries.map((entry, i) => (
                  <tr key={entry.id} className="border-b border-gray-900 hover:bg-gray-900/50">
                    <td className="py-2 text-cyan-400 font-bold">#{i + 1}</td>
                    <td className="py-2 text-white">{entry.username}</td>
                    <td className="py-2 text-right text-yellow-400">{entry.level}</td>
                    <td className="py-2 text-right text-gray-400">{entry.xp}</td>
                    <td className="py-2 text-right text-green-400">{entry.enemies_defeated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
