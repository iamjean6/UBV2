import { useState, useEffect } from 'react';
import { Trophy, Users, BarChart2, Calendar, MapPin } from 'lucide-react';
import { fetchPlayerStatsByGame } from '../../../services/api';
import { cn } from '../../layout/Sidebar';
import { PacmanLoader, RotateLoader } from 'react-spinners';

export default function GameSummary({ game }) {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                const res = await fetchPlayerStatsByGame(game.id);
                if (res.status === 'success') {
                    // Filter stats for "Our Team"
                    // If game.our_team is 'HOME', match player stats where p.team_id === game.home_team_id
                    // The backend returns first_name, last_name, etc. in the stats list.
                    // We need to know which players belong to "our team".
                    // For now, assume the stats returned are for all players who have recorded stats.
                    // Usually we only care about our team as per user request #5.
                    setStats(res.data);
                }
            } catch (err) {
                console.error('Error loading game summary stats:', err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [game.id]);

    const isHome = game.our_team === 'HOME';
    const ourTeamName = isHome ? game.home_team_name : game.away_team_name;
    const opponentName = isHome ? game.away_team_name : game.home_team_name;
    const ourScore = isHome ? game.home_score : game.away_score;
    const opponentScore = isHome ? game.away_score : game.home_score;
    const result = ourScore > opponentScore ? 'WIN' : ourScore < opponentScore ? 'LOSS' : 'TIE';

    return (
        <div className="bg-[var(--card)] rounded-xl shadow-md border border-[var(--border)] overflow-hidden transition-all hover:shadow-lg">
            {/* Header / Scoreboard */}
            <div className="bg-[var(--muted)]/30 p-4 border-b border-[var(--border)]">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                            {game.league_name}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                            <Calendar className="h-3 w-3" />
                            {new Date(game.game_date).toLocaleDateString()}
                        </div>
                    </div>
                    <div className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-black tracking-tighter shadow-sm ring-1 ring-inset",
                        result === 'WIN' ? "bg-green-500/10 text-green-600 ring-green-500/20" :
                            result === 'LOSS' ? "bg-red-500/10 text-red-600 ring-red-500/20" :
                                "bg-gray-500/10 text-gray-600 ring-gray-500/20"
                    )}>
                        {result}
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 text-center">
                        <div className="text-sm font-bold text-[var(--foreground)] line-clamp-1">{ourTeamName}</div>
                        <div className="text-2xl font-black text-[var(--foreground)]">{ourScore}</div>
                        <div className="text-[10px] font-bold text-[var(--muted-foreground)]">OUR TEAM</div>
                    </div>
                    <div className="text-sm font-black text-[var(--muted-foreground)]">VS</div>
                    <div className="flex-1 text-center">
                        <div className="text-sm font-bold text-[var(--foreground)] line-clamp-1">{opponentName}</div>
                        <div className="text-2xl font-black text-[var(--foreground)]">{opponentScore}</div>
                        <div className="text-[10px] font-bold text-[var(--muted-foreground)]">OPPONENT</div>
                    </div>
                </div>
            </div>

            {/* Box Score Summary */}
            <div className="p-4">
                <div className="flex items-center gap-2 mb-3 border-b border-[var(--border)] pb-2">
                    <BarChart2 className="h-4 w-4 text-[var(--primary)]" />
                    <h3 className="text-xs font-bold text-[var(--foreground)] uppercase">Our Team Box Score</h3>
                </div>

                {loading ? (

                    <div className=" flex items-center justify-center">
                        <RotateLoader />
                    </div>


                ) : stats.length === 0 ? (
                    <div className="py-4 text-center text-[var(--muted-foreground)] text-xs italic">No stats recorded for this game.</div>
                ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto overflow-x-auto  pr-1 custom-scrollbar">
                        <table className="w-full text-left text-[10px]">
                            <thead>
                                <tr className="text-[var(--muted-foreground)] border-b border-[var(--border)]">
                                    <th className="pb-1 font-bold">PLAYER</th>
                                    <th className="pb-1 text-center font-bold">Min</th>
                                    <th className="pb-1 text-center font-bold">PTS</th>
                                    <th className="pb-1 text-center font-bold">FG</th>
                                    <th className="pb-1 text-center font-bold">3PT</th>
                                    <th className="pb-1 text-center font-bold">FT</th>
                                    <th className="pb-1 text-center font-bold">OR</th>
                                    <th className="pb-1 text-center font-bold">DR</th>
                                    <th className="pb-1 text-center font-bold">REB</th>
                                    <th className="pb-1 text-center font-bold">AST</th>
                                    <th className="pb-1 text-center font-bold">STL</th>
                                    <th className="pb-1 text-center font-bold">BLK</th>
                                    <th className="pb-1 text-center font-bold">TO</th>
                                    <th className="pb-1 text-center font-bold">EFF</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]/50">
                                {stats.map(s => (
                                    <tr key={s.id} className="hover:bg-[var(--muted)]/20">
                                        <td className="py-1.5 flex items-center gap-2">
                                            <img src={s.image_url || '/img/picture.avif'} alt="" className="w-10 h-10 object-cover rounded-full" />
                                            <div>
                                                <div className="font-semibold text-sm text-[var(--foreground)]">{s.first_name} {s.last_name}</div>
                                                <span className="text-[10px] font-industry font-black text-[var(--muted-foreground)]">#{s.jersey_number}</span>
                                            </div>
                                        </td>
                                        <td className='py-1.5 text-sm text-center font-semibold text-[var(--foreground)]'>{s.minutes_played}</td>
                                        <td className="py-1.5 text-sm text-center font-semibold text-[var(--foreground)]">{s.points}</td>
                                        <td className="py-1.5 text-[10px] text-center font-medium text-[var(--muted-foreground)]">
                                            {s.fg_made}/{s.fg_attempts}
                                            <div className="text-[9px] text-blue-500 font-bold">
                                                {s.fg_attempts > 0 ? ((s.fg_made / s.fg_attempts) * 100).toFixed(0) + '%' : '0%'}
                                            </div>
                                        </td>
                                        <td className="py-1.5 text-[10px] text-center font-medium text-[var(--muted-foreground)]">
                                            {s.three_pt_made}/{s.three_pt_attempts}
                                            <div className="text-[9px] text-blue-500 font-bold">
                                                {s.three_pt_attempts > 0 ? ((s.three_pt_made / s.three_pt_attempts) * 100).toFixed(0) + '%' : '0%'}
                                            </div>
                                        </td>
                                        <td className="py-1.5 text-[10px] text-center font-medium text-[var(--muted-foreground)]">
                                            {s.ft_made}/{s.ft_attempts}
                                            <div className="text-[9px] text-blue-500 font-bold">
                                                {s.ft_attempts > 0 ? ((s.ft_made / s.ft_attempts) * 100).toFixed(0) + '%' : '0%'}
                                            </div>
                                        </td>
                                        <td className="py-1.5 text-sm text-center font-semibold text-[var(--muted-foreground)]">{s.offensive_rebounds}</td>
                                        <td className="py-1.5 text-sm text-center font-semibold text-[var(--muted-foreground)]">{s.defensive_rebounds}</td>
                                        <td className="py-1.5 text-sm text-center font-bold text-[var(--foreground)]">{s.rebounds}</td>
                                        <td className="py-1.5 text-sm text-center font-semibold text-[var(--muted-foreground)]">{s.assists}</td>
                                        <td className="py-1.5 text-sm text-center font-semibold text-[var(--muted-foreground)]">{s.steals}</td>
                                        <td className="py-1.5 text-sm text-center font-semibold text-[var(--muted-foreground)]">{s.blocks}</td>
                                        <td className="py-1.5 text-sm text-center font-semibold text-[var(--muted-foreground)]">{s.turnovers}</td>
                                        <td className="py-1.5 text-sm text-center font-bold text-blue-600">
                                            {(
                                                (Number(s.points) + Number(s.rebounds) + Number(s.assists) + Number(s.steals) + Number(s.blocks)) -
                                                ((Number(s.fg_attempts) - Number(s.fg_made)) + (Number(s.ft_attempts) - Number(s.ft_made)) + Number(s.turnovers))
                                            ).toFixed(0)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-[var(--muted)]/10 px-4 py-2 flex items-center gap-2 text-[9px] text-[var(--muted-foreground)] border-t border-[var(--border)]">
                <MapPin className="h-2.5 w-2.5" />
                {game.venue}, {game.city}
            </div>
        </div>
    );
}
