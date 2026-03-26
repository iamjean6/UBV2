import { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import { Users as UsersIcon, ShoppingCart, Trophy, Activity, Star, Award, Zap, Target, Percent } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '/api';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [playerSummary, setPlayerSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [statsRes, playersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/dashboard-stats`, { headers }),
                    fetch(`${API_BASE_URL}/admin/player-stats-summary`, { headers })
                ]);

                const statsData = await statsRes.json();
                const playersData = await playersRes.json();

                if (statsData.status === 'success') setStats(statsData.data);
                if (playersData.status === 'success') setPlayerSummary(playersData.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const { leaders } = playerSummary || {};

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-1">Real-time overview of Urbanville sports and stock metrics.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>System Live</span>
                </div>
            </div>

            {/* Main KPI Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard title="Total Teams" value={stats?.teamCount || 0} icon={Trophy} change="+0" changeType="positive" />
                <KPICard title="Active Players" value={stats?.playerCount || 0} icon={UsersIcon} change="+0" changeType="positive" />
                <KPICard title="Games Completed" value={stats?.gamesPlayed || 0} icon={Activity} change="+0" changeType="positive" />
                <KPICard title="Inventory Stock" value={stats?.totalStock || 0} icon={ShoppingCart} change="low" changeType="neutral" />
            </div>

            {/* Performance Leaders Grid */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Star className="text-amber-500" size={20} />
                    Statistical Leaders
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <LeaderCard title="Leading Scorer" player={leaders?.leadingScorer} metric="PPG" value={leaders?.leadingScorer?.ppg} icon={Award} color="bg-orange-500" />
                    <LeaderCard title="Top Rebounder" player={leaders?.leadingRebounder} metric="RPG" value={leaders?.leadingRebounder?.rpg} icon={Zap} color="bg-blue-500" />
                    <LeaderCard title="Assist Leader" player={leaders?.leadingPasser} metric="APG" value={leaders?.leadingPasser?.apg} icon={Target} color="bg-emerald-500" />
                    <LeaderCard title="FT Specialist" player={leaders?.ftShooter} metric="FT%" value={leaders?.ftShooter?.ft_pct + '%'} icon={Star} color="bg-purple-500" />
                    <LeaderCard title="FG Efficiency" player={leaders?.highestFGPct} metric="FG%" value={leaders?.highestFGPct?.fg_pct + '%'} icon={Percent} color="bg-rose-500" />
                    <LeaderCard title="3PT Sniper" player={leaders?.threePtShooter} metric="3P%" value={leaders?.threePtShooter?.three_p_pct + '%'} icon={Zap} color="bg-amber-500" />
                </div>
            </div>

            {/* Player Stats Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Comprehensive Player Statistics</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4">Player</th>
                                <th className="px-6 py-4">GP</th>
                                <th className="px-6 py-4">PPG</th>
                                <th className="px-6 py-4">RPG (Total)</th>
                                <th className="px-6 py-4">APG (Total)</th>
                                <th className="px-6 py-4">Total Pts</th>
                                <th className="px-6 py-4">FG%</th>
                                <th className="px-6 py-4">3P (M/A)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {playerSummary?.players?.map((player) => (
                                <tr key={player.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                                {player.image_url ? (
                                                    <img src={player.image_url} alt={player.first_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase">
                                                        {player.first_name[0]}{player.last_name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{player.first_name} {player.last_name}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Player ID: #{player.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{player.games_played}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-indigo-600">{player.ppg}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{player.rpg} ({player.total_rebounds})</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{player.apg} ({player.total_assists})</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{player.total_points}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            {player.fg_pct}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {player.total_3p_made} / {player.total_3p_attempts}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function LeaderCard({ title, player, metric, value, icon: Icon, color }) {
    if (!player) return null;
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-indigo-200 transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.06] transition-opacity`}></div>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon size={20} className={color.replace('bg-', 'text-')} />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{metric}</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-1">{title}</p>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden ring-1 ring-slate-200">
                        {player.image_url ? (
                            <img src={player.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">?</div>
                        )}
                    </div>
                    <p className="text-sm font-bold text-slate-700 truncate">{player.first_name} {player.last_name}</p>
                </div>
            </div>
        </div>
    );
}
