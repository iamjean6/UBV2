import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { fetchLeagues, deleteLeague } from '../../../services/api';

export default function LeaguesList() {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadLeagues();
    }, []);

    const loadLeagues = async () => {
        try {
            const response = await fetchLeagues();
            if (response.status === 'success') {
                setLeagues(response.data);
            }
        } catch (err) {
            console.error('Error loading leagues:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this league? This will affect stats for games in this league.')) {
            try {
                await deleteLeague(id);
                loadLeagues();
            } catch (err) {
                console.error('Error deleting league:', err);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Leagues & Seasons</h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">Manage your competition categories and active seasons.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/sports/leagues/new')}
                    className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    New League
                </button>
            </div>

            <div className="bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
                <table className="min-w-full divide-y divide-[var(--border)]">
                    <thead className="bg-[var(--muted)]/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">League Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Season</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-[var(--border)]">
                        {loading ? (
                            <tr><td colSpan="3" className="px-6 py-10 text-center text-[var(--muted-foreground)]">Loading leagues...</td></tr>
                        ) : leagues.length === 0 ? (
                            <tr><td colSpan="3" className="px-6 py-10 text-center text-[var(--muted-foreground)]">No leagues found.</td></tr>
                        ) : (
                            leagues.map((league) => (
                                <tr key={league.id} className="hover:bg-[var(--accent)]/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3 font-medium text-[var(--foreground)]">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            {league.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                                        {league.season}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => navigate(`/admin/sports/leagues/edit/${league.id}`)} className="p-1 text-[var(--muted-foreground)] hover:text-[var(--primary)]">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(league.id)} className="p-1 text-[var(--muted-foreground)] hover:text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
