import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Activity, User, ChevronLeft } from 'lucide-react';
import { fetchOneGame, fetchPlayers, fetchPlayerStatsByGame, savePlayerStats } from '../../../services/api';

const StatInput = ({ playerId, field, label, value, onChange }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">{label}</label>
        <input
            type="text"
            inputMode="numeric"
            className="w-12 h-8 text-center rounded border border-[var(--border)] bg-[var(--background)] text-sm focus:ring-1 focus:ring-[var(--primary)] outline-none"
            value={value || 0}
            onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                onChange(playerId, field, onlyNumbers);
            }}
        />
    </div>
);

const PlayerRow = ({ player, stats, onStatChange }) => (
    <tr key={player.id} className="border-b border-[var(--border)] hover:bg-[var(--accent)]/50 transition-colors">
        <td className="py-3 px-4">
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--muted)] flex items-center justify-center overflow-hidden">
                    {player.image_url ? (
                        <img src={player.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-4 w-4 text-[var(--muted-foreground)]" />
                    )}
                </div>
                <div>
                    <div className="text-sm font-medium text-[var(--foreground)]">{player.first_name} {player.last_name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">#{player.jersey_number} • {player.position}</div>
                </div>
            </div>
        </td>
        <td className="py-3 px-4">
            <div className="flex gap-2 flex-wrap">
                <StatInput playerId={player.id} field="minutes_played" label="MIN" value={stats[player.id]?.minutes_played} onChange={onStatChange} />
                <StatInput playerId={player.id} field="points" label="PTS" value={stats[player.id]?.points} onChange={onStatChange} />
                <StatInput playerId={player.id} field="fg_made" label="FGM" value={stats[player.id]?.fg_made} onChange={onStatChange} />
                <StatInput playerId={player.id} field="fg_attempts" label="FGA" value={stats[player.id]?.fg_attempts} onChange={onStatChange} />
                <StatInput playerId={player.id} field="three_pt_made" label="3PM" value={stats[player.id]?.three_pt_made} onChange={onStatChange} />
                <StatInput playerId={player.id} field="three_pt_attempts" label="3PA" value={stats[player.id]?.three_pt_attempts} onChange={onStatChange} />
                <StatInput playerId={player.id} field="ft_made" label="FTM" value={stats[player.id]?.ft_made} onChange={onStatChange} />
                <StatInput playerId={player.id} field="ft_attempts" label="FTA" value={stats[player.id]?.ft_attempts} onChange={onStatChange} />
                <StatInput playerId={player.id} field="offensive_rebounds" label="OREB" value={stats[player.id]?.offensive_rebounds} onChange={onStatChange} />
                <StatInput playerId={player.id} field="defensive_rebounds" label="DREB" value={stats[player.id]?.defensive_rebounds} onChange={onStatChange} />
                <StatInput playerId={player.id} field="assists" label="AST" value={stats[player.id]?.assists} onChange={onStatChange} />
                <StatInput playerId={player.id} field="steals" label="STL" value={stats[player.id]?.steals} onChange={onStatChange} />
                <StatInput playerId={player.id} field="blocks" label="BLK" value={stats[player.id]?.blocks} onChange={onStatChange} />
                <StatInput playerId={player.id} field="turnovers" label="TO" value={stats[player.id]?.turnovers} onChange={onStatChange} />
                <StatInput playerId={player.id} field="fouls" label="PF" value={stats[player.id]?.fouls} onChange={onStatChange} />
            </div>
        </td>
    </tr>
);

export default function StatsForm() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [players, setPlayers] = useState([]);
    const [stats, setStats] = useState({}); // { playerId: { points: 0, ... } }
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const STORAGE_KEY = `stats_form_${gameId}`;

    useEffect(() => {
        loadData();
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setStats(JSON.parse(saved));
            } catch (e) {
                console.error('Error parsing saved stats form:', e);
            }
        }
    }, [gameId]);

    useEffect(() => {
        if (Object.keys(stats).length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
        }
    }, [stats, STORAGE_KEY]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [gameRes, playersRes, statsRes] = await Promise.all([
                fetchOneGame(gameId),
                fetchPlayers(),
                fetchPlayerStatsByGame(gameId)
            ]);

            if (gameRes.status === 'success') setGame(gameRes.data);
            if (playersRes.status === 'success') setPlayers(playersRes.data);

            // Fetching existing stats from DB
            const existingStats = {};
            if (statsRes.status === 'success') {
                statsRes.data.forEach(s => {
                    existingStats[s.player_id] = s;
                });
            }
            // Merge DB stats with localStorage if needed, but usually localStorage should win if it exists
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) {
                setStats(existingStats);
            }
        } catch (err) {
            console.error('Error loading stats data:', err);
            setError('Failed to load data for this game.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatChange = (playerId, field, value) => {
        setStats(prev => ({
            ...prev,
            [playerId]: {
                ...(prev[playerId] || { game_id: gameId, player_id: playerId }),
                [field]: parseInt(value) || 0
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);

            // Save each player's stats that have been modified
            const promises = Object.values(stats).map(playerStats =>
                savePlayerStats({ ...playerStats, game_id: gameId })
            );

            await Promise.all(promises);
            localStorage.removeItem(STORAGE_KEY);
            navigate('/admin/sports/games');
        } catch (err) {
            console.error('Error saving box score:', err);
            setError('Failed to save some statistics. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-[var(--muted-foreground)]">Loading game and roster...</div>;

    const homePlayers = players.filter(p => p.team_id === game?.home_team_id);
    const awayPlayers = players.filter(p => p.team_id === game?.away_team_id);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <div className="flex items-center justify-between sticky top-0 z-10 bg-[var(--background)] py-4 border-b border-[var(--border)]">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Game Box Score</h1>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        {game?.home_team_name} vs {game?.away_team_name} • {new Date(game?.game_date).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/sports/games')}
                        className="flex items-center gap-2 rounded-md bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm ring-1 ring-inset ring-[var(--border)] hover:bg-[var(--accent)] transition-colors"
                    >
                        <X className="h-4 w-4" /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : <><Save className="h-4 w-4" /> Save Box Score</>}
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>}

            <div className="space-y-8">
                {(!game?.our_team || game?.our_team === 'HOME') && (
                    <div className="bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
                        <div className="bg-[var(--muted)]/30 px-6 py-3 border-b border-[var(--border)] flex justify-between items-center">
                            <h2 className="font-bold flex items-center gap-2">
                                <Activity className="h-4 w-4 text-[var(--primary)]" />
                                {game?.home_team_name} (Home)
                            </h2>
                            <span className="text-2xl font-black text-[var(--foreground)]">{game?.home_score}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--muted)]/10 text-[xs] font-bold text-[var(--muted-foreground)] uppercase">
                                        <th className="py-3 px-4">Player</th>
                                        <th className="py-3 px-4">Statistics</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {homePlayers.map(p => <PlayerRow key={p.id} player={p} stats={stats} onStatChange={handleStatChange} />)}
                                    {homePlayers.length === 0 && <tr><td colSpan="2" className="p-8 text-center text-[var(--muted-foreground)]">No players registered for this team.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {(!game?.our_team || game?.our_team === 'AWAY') && (
                    <div className="bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
                        <div className="bg-[var(--muted)]/30 px-6 py-3 border-b border-[var(--border)] flex justify-between items-center">
                            <h2 className="font-bold flex items-center gap-2">
                                <Activity className="h-4 w-4 text-[var(--primary)]" />
                                {game?.away_team_name} (Away)
                            </h2>
                            <span className="text-2xl font-black text-[var(--foreground)]">{game?.away_score}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--muted)]/10 text-[xs] font-bold text-[var(--muted-foreground)] uppercase">
                                        <th className="py-3 px-4">Player</th>
                                        <th className="py-3 px-4">Statistics</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {awayPlayers.map(p => <PlayerRow key={p.id} player={p} stats={stats} onStatChange={handleStatChange} />)}
                                    {awayPlayers.length === 0 && <tr><td colSpan="2" className="p-8 text-center text-[var(--muted-foreground)]">No players registered for this team.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}
