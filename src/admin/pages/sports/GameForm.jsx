import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Calendar, MapPin, Trophy, Building2, Activity } from 'lucide-react';
import { fetchTeams, fetchLeagues, createLeague, fetchOneGame, createGame, updateGame } from '../../../services/api';
import { cn } from '../../layout/Sidebar';

export default function GameForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        home_team_id: '',
        away_team_id: '',
        league_id: '',
        league_name: '', // Added for text input
        season: '',      // Added for text input
        game_date: '',
        venue: '',
        city: '',
        status: 'UPCOMING',
        home_score: 0,
        away_score: 0,
        our_team: 'HOME' // Default to Home
    });

    const [teams, setTeams] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isHome, setIsHome] = useState(true);

    const STORAGE_KEY = id ? `game_form_${id}` : 'game_form_new';

    useEffect(() => {
        loadInitialData();
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && !isEdit) {
            try {
                setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
            } catch (e) {
                console.error('Error parsing saved game form:', e);
            }
        }
    }, [id]);

    useEffect(() => {
        if (formData.home_team_id || formData.away_team_id || formData.venue || formData.league_name) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, STORAGE_KEY]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [teamsRes, leaguesRes] = await Promise.all([fetchTeams(), fetchLeagues()]);

            const allLeagues = leaguesRes.status === 'success' ? leaguesRes.data : [];
            if (teamsRes.status === 'success') setTeams(teamsRes.data);
            setLeagues(allLeagues);

            if (isEdit) {
                const gameRes = await fetchOneGame(id);
                if (gameRes.status === 'success') {
                    const g = gameRes.data;
                    const league = allLeagues.find(l => l.id === g.league_id);
                    setFormData({
                        ...g,
                        league_id: g.league_id || '',
                        league_name: league ? league.name : '',
                        season: league ? league.season : '',
                        game_date: g.game_date ? new Date(g.game_date).toISOString().slice(0, 16) : ''
                    });
                }
            }
        } catch (err) {
            console.error('Error loading game data:', err);
            setError('Failed to load teams or leagues.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value.slice(0, 30) }));
    };

    const getOrCreateLeague = async () => {
        const { league_name, season } = formData;
        if (!league_name || !season) return null;

        // Try to find existing
        const existing = leagues.find(
            l => l.name.toLowerCase() === league_name.toLowerCase() &&
                l.season.toLowerCase() === season.toLowerCase()
        );

        if (existing) return existing.id;

        // Create new
        try {
            const newRes = await createLeague({ name: league_name, season });
            if (newRes.status === 'success') {
                return newRes.data.id;
            }
        } catch (e) {
            console.error('Error auto-creating league:', e);
            throw new Error('Failed to create league automatically.');
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (formData.home_team_id === formData.away_team_id) {
                throw new Error("A team cannot play against itself. Please select different teams.");
            }

            // Get or create league ID first
            let finalLeagueId = formData.league_id;
            if (formData.league_name && formData.season) {
                finalLeagueId = await getOrCreateLeague();
            }

            const submissionData = {
                ...formData,
                league_id: finalLeagueId
            };

            let savedGame = null;
            if (isEdit) {
                const res = await updateGame(id, submissionData);
                if (res.status === 'success') savedGame = res.data;
            } else {
                const res = await createGame(submissionData);
                if (res.status === 'success') savedGame = res.data;
            }

            localStorage.removeItem(STORAGE_KEY);

            if (savedGame && submissionData.status === 'FINAL') {
                navigate(`/admin/sports/games/${savedGame.id}/stats`);
            } else {
                navigate('/admin/sports/games');
            }
        } catch (err) {
            console.error('Error saving game:', err);
            setError(err.message || 'Failed to save game. Please check your data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit && !formData.game_date) {
        return <div className="p-8 text-center text-[var(--muted-foreground)]">Loading game details...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                        {isEdit ? 'Edit Game' : 'Schedule New Game'}
                    </h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Manage game details, locations, and league associations.
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
                        disabled={loading}
                        className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Game</>}
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)] space-y-6">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                                <Trophy className="h-5 w-5 text-orange-500" />
                                Matchup Info
                            </h2>
                            <div className="flex items-center gap-2 bg-[var(--background)] p-1 rounded-md border border-[var(--border)]">
                                <span className="text-[10px] font-bold text-[var(--muted-foreground)] px-2 uppercase tracking-wider">Our Team:</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, our_team: 'HOME' }))}
                                    className={cn(
                                        "px-3 py-1 text-xs font-bold rounded transition-all",
                                        formData.our_team === 'HOME' ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "hover:bg-[var(--accent)] text-[var(--muted-foreground)]"
                                    )}
                                >
                                    HOME
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, our_team: 'AWAY' }))}
                                    className={cn(
                                        "px-3 py-1 text-xs font-bold rounded transition-all",
                                        formData.our_team === 'AWAY' ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "hover:bg-[var(--accent)] text-[var(--muted-foreground)]"
                                    )}
                                >
                                    AWAY
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Home Team</label>
                                <select
                                    name="home_team_id"
                                    required
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.home_team_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Home Team</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Away Team</label>
                                <select
                                    name="away_team_id"
                                    required
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.away_team_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Away Team</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">League Name</label>
                                <input
                                    type="text"
                                    name="league_name"
                                    required
                                    placeholder="e.g. Summer League"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.league_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Season</label>
                                <input
                                    type="text"
                                    name="season"
                                    required
                                    placeholder="e.g. 2024"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.season}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="game_date"
                                    required
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.game_date}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Game Status</label>
                                <select
                                    name="status"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="UPCOMING">UPCOMING</option>
                                    <option value="LIVE">LIVE</option>
                                    <option value="FINAL">FINAL</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Venue</label>
                                <input
                                    type="text"
                                    name="venue"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.venue}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {formData.status === 'FINAL' && (
                        <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)] space-y-6">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                                <div className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                                    <Building2 className="h-5 w-5 text-blue-500" />
                                    <h2>Final Score</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (id) {
                                            navigate(`/admin/sports/games/${id}/stats`);
                                        } else {
                                            setError("Please save the game first before entering stats.");
                                        }
                                    }}
                                    className="text-sm font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
                                >
                                    <Activity className="h-4 w-4" />
                                    Enter Player Stats
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 items-center max-w-md mx-auto">
                                <div className="text-center space-y-2">
                                    <label className="block text-xs font-bold text-[var(--muted-foreground)]">HOME</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className="block w-full text-center text-3xl font-black rounded-lg border-2 border-[var(--border)] py-4 text-[var(--foreground)] bg-[var(--background)] focus:border-[var(--primary)] focus:ring-0"
                                        value={formData.home_score}
                                        onChange={(e) => {
                                            const onlyNumbers = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                                            setFormData(prev => ({ ...prev, home_score: onlyNumbers }));
                                        }}
                                    />
                                </div>
                                <div className="text-center text-2xl font-bold text-[var(--muted-foreground)]">VS</div>
                                <div className="text-center space-y-2">
                                    <label className="block text-xs font-bold text-[var(--muted-foreground)]">AWAY</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className="block w-full text-center text-3xl font-black rounded-lg border-2 border-[var(--border)] py-4 text-[var(--foreground)] bg-[var(--background)] focus:border-[var(--primary)] focus:ring-0"
                                        value={formData.away_score}
                                        onChange={(e) => {
                                            const onlyNumbers = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                                            setFormData(prev => ({ ...prev, away_score: onlyNumbers }));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)]">
                        <h2 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2 mb-4 flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Schedule Note
                        </h2>
                        <p className="text-xs text-[var(--muted-foreground)]">
                            Ensure both teams are registered before scheduling. Linking a game to a league allows for automated season statistics calculation.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
}
