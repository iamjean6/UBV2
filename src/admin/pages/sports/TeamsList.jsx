import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Building2, Activity } from 'lucide-react';
import { fetchTeams, deleteTeam } from '../../../services/api';

export default function TeamsList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const response = await fetchTeams();
            if (response.status === 'success') {
                setTeams(response.data);
            }
        } catch (err) {
            console.error('Error loading teams:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            try {
                await deleteTeam(id);
                loadTeams();
            } catch (err) {
                console.error('Error deleting team:', err);
            }
        }
    };

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.city && t.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Teams</h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Manage your teams, cities, and logos for game scheduling.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        onClick={() => navigate('/admin/sports/teams/new')}
                        className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Team
                    </button>
                </div>
            </div>

            <div className="bg-[var(--card)] p-4 rounded-lg shadow-sm border border-[var(--border)]">
                <div className="relative max-w-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-inset focus:ring-[var(--ring)] sm:text-sm"
                        placeholder="Search teams..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-[var(--muted-foreground)]">Loading teams...</div>
                ) : filteredTeams.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-[var(--muted-foreground)] border-2 border-dashed border-[var(--border)] rounded-xl">
                        No teams found. Click "Add Team" to get started.
                    </div>
                ) : (
                    filteredTeams.map((team) => (
                        <div key={team.id} className="relative flex items-center space-x-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-6 py-5 shadow-sm hover:border-[var(--ring)] transition-colors group">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full border border-[var(--border)] flex items-center justify-center overflow-hidden bg-white">
                                {team.logo_url ? (
                                    <img className="h-full w-full object-contain p-1" src={team.logo_url} alt="" />
                                ) : (
                                    <Building2 className="h-5 w-5 text-[var(--muted-foreground)]/40" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-[var(--foreground)]">{team.name}</p>
                                <p className="truncate text-sm text-[var(--muted-foreground)]">{team.city || 'No city set'}</p>
                            </div>
                            <div className="flex gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => navigate(`/admin/sports/teams/edit/${team.id}`)}
                                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] p-1"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(team.id)}
                                    className="text-[var(--muted-foreground)] hover:text-red-500 p-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
