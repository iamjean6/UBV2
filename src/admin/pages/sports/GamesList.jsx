import { Plus, Search, Filter, Edit2, Trash2, BarChart2, LayoutGrid, List, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchGames, deleteGame, fetchLeagues } from '../../../services/api';
import { cn } from '../../layout/Sidebar';
import { useEffect, useState } from 'react';
import GameSummary from './GameSummary';
import { PacmanLoader } from 'react-spinners';

export default function GamesList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLeague, setSelectedLeague] = useState('');
    const [viewMode, setViewMode] = useState('ALL'); // 'ALL' or 'FINISHED'
    const [games, setGames] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "#141414ff",
    };
    const [color, setColor] = useState("#141414ff");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [gamesRes, leaguesRes] = await Promise.all([fetchGames(), fetchLeagues()]);

            if (gamesRes.status === 'success') {
                setGames(gamesRes.data);
            }
            if (leaguesRes.status === 'success') {
                setLeagues(leaguesRes.data);
            }
        } catch (err) {
            console.error('Error loading games data:', err);
            setError('Failed to load games list.');
        } finally {
            setLoading(false);
        }
    };

    const loadGames = async () => {
        // Alias for refresh
        loadData();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this game? This will also remove all associated player stats.')) return;
        try {
            await deleteGame(id);
            setGames(prev => prev.filter(g => g.id !== id));
        } catch (err) {
            console.error('Error deleting game:', err);
            alert('Failed to delete game.');
        }
    };

    const filteredGames = games.filter(g => {
        const matchesSearch =
            g.away_team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.home_team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.league_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLeague = selectedLeague === '' || g.league_id === parseInt(selectedLeague);
        const matchesView = viewMode === 'ALL' || g.status === 'FINAL';

        return matchesSearch && matchesLeague && matchesView;
    });

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Games</h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Schedule and manage games, and record player statistics.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        onClick={() => navigate('/admin/sports/games/new')}
                        className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Game
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--card)] p-4 rounded-lg shadow-sm border border-[var(--border)]">
                <div className="flex flex-1 items-center gap-4 w-full">
                    <div className="relative w-full sm:max-w-xs">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-inset focus:ring-[var(--ring)] sm:text-sm"
                            placeholder="Search games..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <select
                            value={selectedLeague}
                            onChange={(e) => setSelectedLeague(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-inset focus:ring-[var(--ring)] sm:text-sm"
                        >
                            <option value="">All Leagues</option>
                            {leagues.map(l => (
                                <option key={l.id} value={l.id}>{l.name} - {l.season}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center bg-[var(--muted)]/50 p-1 rounded-lg border border-[var(--border)]">
                    <button
                        onClick={() => setViewMode('ALL')}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                            viewMode === 'ALL'
                                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        )}
                    >
                        <List className="h-3.5 w-3.5" />
                        List View
                    </button>
                    <button
                        onClick={() => setViewMode('FINISHED')}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                            viewMode === 'FINISHED'
                                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        )}
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Finished Summary
                    </button>
                </div>
            </div>

            {viewMode === 'ALL' ? (
                <div className="bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[var(--border)]">
                            <thead className="bg-[var(--muted)]/50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[var(--foreground)] sm:pl-6">Date</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Opponent</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">H/A</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Score</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Status</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                                {loading ? (

                                    <div className="sweet-loading flex items-center justify-center">


                                        <PacmanLoader
                                            color={color}
                                            loading={loading}
                                            cssOverride={override}
                                            size={30}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>

                                ) : filteredGames.length === 0 ? (
                                    <tr><td colSpan="6" className="py-10 text-center text-[var(--muted-foreground)] text-sm">No games found.</td></tr>
                                ) : filteredGames.map((game) => {
                                    const formattedDate = new Date(game.game_date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });

                                    const isHome = game.our_team === 'HOME';
                                    const opponent = isHome ? game.away_team_name : game.home_team_name;
                                    const opponentLogo = isHome ? game.away_team_logo : game.home_team_logo;

                                    return (
                                        <tr key={game.id} className="hover:bg-[var(--muted)]/50 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6 text-sm text-[var(--foreground)]">
                                                {formattedDate}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <div className="flex items-center">
                                                    <div className="h-6 w-6 rounded-full bg-[var(--muted)] mr-2 flex items-center justify-center overflow-hidden">
                                                        {opponentLogo ? <img className="h-full w-full object-contain" src={opponentLogo} alt="" /> : <Trophy className="h-3 w-3 text-[var(--muted-foreground)]" />}
                                                    </div>
                                                    <span className="text-[var(--card-foreground)] font-medium">{opponent}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                                {isHome ? 'Home' : 'Away'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-mono text-[var(--foreground)]">
                                                {game.home_score} – {game.away_score}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                                    game.status === 'FINAL'
                                                        ? "bg-gray-500/10 text-gray-600 ring-gray-500/20"
                                                        : game.status === 'LIVE'
                                                            ? "bg-red-500/10 text-red-600 ring-red-500/20"
                                                            : "bg-blue-500/10 text-blue-600 ring-blue-500/20"
                                                )}>
                                                    {game.status}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/sports/games/edit/${game.id}`)}
                                                        className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors p-1"
                                                        title="Edit Game"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/admin/sports/games/${game.id}/stats`)}
                                                        className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors p-1"
                                                        title="Stats"
                                                    >
                                                        <BarChart2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(game.id)}
                                                        className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors p-1"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-[var(--muted-foreground)]">Loading finished games...</div>
                    ) : filteredGames.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-[var(--muted-foreground)]">No finished games found for this selection.</div>
                    ) : filteredGames.map(game => (
                        <div key={game.id} className="relative group">
                            <GameSummary game={game} />
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => navigate(`/admin/sports/games/edit/${game.id}`)}
                                    className="p-1.5 bg-[var(--card)] rounded-full shadow-md border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
