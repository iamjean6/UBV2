import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, BarChart2 } from "lucide-react";
import { fetchOneGame, fetchPlayerStatsByGame } from '../services/api';
import { FadeLoader } from 'react-spinners';

export default function GameStats() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [gameRes, statsRes] = await Promise.all([
                    fetchOneGame(id),
                    fetchPlayerStatsByGame(id)
                ]);

                if (gameRes.status === 'success') {
                    setGame(gameRes.data);
                }
                if (statsRes.status === 'success') {
                    setStats(statsRes.data);
                }
            } catch (err) {
                console.error('Error loading game stats data:', err);
                setError('Failed to load game tracking data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#00471B]">
                <FadeLoader color="#ffffff" />
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#00471B] p-4 text-white">
                <p className="text-red-400 font-bold mb-4">{error || 'Game not found'}</p>
                <button
                    onClick={() => navigate('/games')}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to Games
                </button>
            </div>
        );
    }

    // Find Game Leaders
    const topScorer = stats.length > 0 ? [...stats].sort((a, b) => b.points - a.points)[0] : null;
    const topRebounder = stats.length > 0 ? [...stats].sort((a, b) => b.rebounds - a.rebounds)[0] : null;
    const topPasser = stats.length > 0 ? [...stats].sort((a, b) => b.assists - a.assists)[0] : null;

    return (
        <div className="min-h-screen w-full bg-[#00471B] text-white pt-20">

            {/* HEADER */}
            <div className="px-6 md:px-16 py-10 border-b border-white/10">
                <div className="flex justify-between items-center">

                    {/* home Team (TEAM 1) */}
                    <div className="text-center space-y-2 flex-1">
                        <img
                            src={game.home_team_logo || "https://via.placeholder.com/60"}
                            className="mx-auto w-16 h-16 object-contain rounded-full"
                            alt={game.home_team_name}
                        />
                        <p className="text-sm text-gray-300 font-bold uppercase tracking-widest">{game.home_team_name}</p>
                        <p className="text-5xl font-black">{game.home_score}</p>
                    </div>

                    {/* CENTER */}
                    <div className="flex flex-col items-center gap-3 px-8">
                        <span className="bg-white text-black text-xs px-4 py-1.5 rounded-full font-black tracking-widest">
                            {game.status?.toUpperCase() || 'FINAL'}
                        </span>
                        <div className="flex items-center gap-4 text-gray-400">
                            <div className="h-[1px] w-12 bg-white/20"></div>
                            <span className="text-xl font-black">VS</span>
                            <div className="h-[1px] w-12 bg-white/20"></div>
                        </div>
                        <button
                            onClick={() => navigate('/games')}
                            className="flex items-center gap-2 border border-white/40 px-6 py-2 rounded-full hover:bg-white hover:text-black transition text-xs font-bold uppercase tracking-tighter"
                        >
                            <ChevronLeft size={16} />
                            BACK TO SCHEDULE
                        </button>
                    </div>

                    {/* away Team (TEAM 2) */}
                    <div className="text-center space-y-2 flex-1">
                        <img
                            src={game.away_team_logo || "https://via.placeholder.com/60"}
                            className="mx-auto w-16 h-16 object-contain rounded-full"
                            alt={game.away_team_name}
                        />
                        <p className="text-sm text-gray-300 font-bold uppercase tracking-widest">{game.away_team_name}</p>
                        <p className="text-5xl font-black">{game.away_score}</p>
                    </div>
                </div>
            </div>

            {/* GAME LEADERS */}
            {stats.length > 0 && (
                <div className="px-6 md:px-16 py-8 border-b border-white/10">
                    <h2 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-widest text-center">
                        Game Leaders
                    </h2>

                    <div className="flex justify-center gap-8 md:gap-24">
                        {[
                            { name: `${topScorer.first_name[0]}. ${topScorer.last_name}`, stat: `${topScorer.points} PTS`, image: topScorer.image_url },
                            { name: `${topRebounder.first_name[0]}. ${topRebounder.last_name}`, stat: `${topRebounder.rebounds} REB`, image: topRebounder.image_url },
                            { name: `${topPasser.first_name[0]}. ${topPasser.last_name}`, stat: `${topPasser.assists} ASTS`, image: topPasser.image_url },
                        ].map((p, i) => (
                            <div key={i} className="text-center space-y-3 group">
                                <p className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white transition-colors">{p.name}</p>
                                <img
                                    src={p.image || "https://via.placeholder.com/60"}
                                    className="w-16 h-16 rounded-full mx-auto border-2 border-white/10 group-hover:border-white/40 transition-all object-cover"
                                    alt=""
                                />
                                <p className="text-sm font-black text-white">{p.stat}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* GAME STATS */}
            <div className="px-4 md:px-16 py-8 pb-24 bg-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <BarChart2 className="h-5 w-5 text-black" />
                    <h3 className="text-xs font-black uppercase text-black tracking-widest">
                        Player Statistics
                    </h3>
                </div>

                <div className="w-full overflow-x-auto  border border-gray-200/5 ">
                    <table className="min-w-[1400px] w-full text-sm">

                        {/* HEADER */}
                        <thead className="text-[10px] font-black text-black border-b border-white/10 uppercase tracking-widest sticky top-0 bg-orange-600 z-10">
                            <tr>
                                <th className="text-left py-2 px-2">PLAYER</th>
                                <th className="text-center">MIN</th>
                                <th className="text-center">FGM</th>
                                <th className="text-center">FGA</th>
                                <th className="text-center text-blue-600">FG%</th>
                                <th className="text-center">3PM</th>
                                <th className="text-center">3PA</th>
                                <th className="text-center text-blue-600">3P%</th>
                                <th className="text-center">FTM</th>
                                <th className="text-center">FTA</th>
                                <th className="text-center text-blue-600">FT%</th>
                                <th className="text-center">REB</th>
                                <th className="text-center">AST</th>
                                <th className="text-center">STL</th>
                                <th className="text-center">BLK</th>
                                <th className="text-center ">TOV</th>
                                <th className="text-center font-black text-lg text-white">PTS</th>
                                <th className="text-center text-gray-300">+/-</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-white/5">
                            {stats.map((s, i) => (
                                <tr
                                    key={s.id}
                                    className={`hover:bg-white/5 transition-colors ${i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}`}
                                >
                                    {/* PLAYER */}
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={s.image_url || "https://via.placeholder.com/40"}
                                                    alt=""
                                                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                                                />

                                            </div>
                                            <span className="font-bold uppercase text-black tracking-tighter">{s.first_name} {s.last_name}</span>
                                        </div>
                                    </td>

                                    <td className="text-center text-black font-medium">{s.minutes_played || '0'}</td>

                                    <td className="text-center text-black">{s.fg_made || 0}</td>
                                    <td className="text-center text-black">{s.fg_attempts || 0}</td>
                                    <td className="text-center font-bold text-blue-600">{s.fg_attempts > 0 ? ((s.fg_made / s.fg_attempts) * 100).toFixed(1) : '0.0'}</td>

                                    <td className="text-center text-black">{s.three_pt_made || 0}</td>
                                    <td className="text-center text-black">{s.three_pt_attempts || 0}</td>
                                    <td className="text-center font-bold text-blue-600">{s.three_pt_attempts > 0 ? ((s.three_pt_made / s.three_pt_attempts) * 100).toFixed(1) : '0.0'}</td>

                                    <td className="text-center text-black">{s.ft_made || 0}</td>
                                    <td className="text-center text-black">{s.ft_attempts || 0}</td>
                                    <td className="text-center font-bold text-blue-600">{s.ft_attempts > 0 ? ((s.ft_made / s.ft_attempts) * 100).toFixed(1) : '0.0'}</td>

                                    <td className="text-center text-black font-bold">{s.rebounds || 0}</td>

                                    <td className="text-center text-black">{s.assists || 0}</td>
                                    <td className="text-center text-black">{s.steals || 0}</td>
                                    <td className="text-center text-black">{s.blocks || 0}</td>
                                    <td className="text-center text-red-500/80">{s.turnovers || 0}</td>

                                    <td className="text-center font-black text-xl text-green-600">{s.points || 0}</td>
                                    <td className={`text-center font-bold ${Number(s.plus_minus) > 0 ? 'text-green-400' : Number(s.plus_minus) < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                        {s.plus_minus > 0 ? `+${s.plus_minus}` : s.plus_minus || 0}
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
