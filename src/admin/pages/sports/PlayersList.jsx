import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchPlayers, deletePlayer, fetchTeams, restorePlayer } from '../../../services/api';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

export default function PlayersList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [posFilter, setPosFilter] = useState('All');
    const [teamFilter, setTeamFilter] = useState(3);
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState(null);
    const [showDeleted, setShowDeleted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadPlayers();
    }, [showDeleted]);

    const loadPlayers = async () => {
        try {
            setLoading(true);
            const [playersRes, teamsRes] = await Promise.all([
                fetchPlayers(showDeleted),
                fetchTeams()
            ]);
            if (playersRes.status === 'success') {
                setPlayers(playersRes.data);
            }
            if (teamsRes.status === 'success') {
                const allowedTeams = teamsRes.data.filter(t =>
                    ['UBV', 'Tritons'].includes(t.name)
                );
                setTeams(allowedTeams);
            }
        } catch (err) {
            console.error('Error fetching players:', err);
            setError('Failed to load players.');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setPlayerToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!playerToDelete) return;
        try {
            await deletePlayer(playerToDelete);
            setPlayers(players.filter(p => p.id !== playerToDelete));
        } catch (err) {
            console.error('Error deleting player:', err);
            alert('Failed to delete player.');
        } finally {
            setPlayerToDelete(null);
        }
    };

    const handleRestore = async (id) => {
        if (!window.confirm('Are you sure you want to restore this player?')) return;
        try {
            await restorePlayer(id);
            loadPlayers();
        } catch (err) {
            console.error('Error restoring player:', err);
            alert('Failed to restore player.');
        }
    };

    const filteredPlayers = players.filter(p => {
        const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase());
        const matchesPos = posFilter === 'All' || (p.position && p.position.includes(posFilter.toUpperCase()));
        const matchesTeam = teamFilter === 'All' || p.team_id === teamFilter;
        return matchesSearch && matchesPos && matchesTeam;
    });

    const positions = ['All', 'Guard', 'Forward', 'Center'];

    if (loading && players.length === 0) return <div className="p-8 text-center text-[var(--muted-foreground)]">Loading players...</div>;

    return (<div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Players</h1>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Manage your team roster, view player details, and update profiles.
                </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                    onClick={() => navigate('/admin/sports/players/new')}
                    className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Player
                </button>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--card)] p-4 rounded-lg shadow-sm border border-[var(--border)]">
            <div className="relative w-full sm:max-w-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Team Tabs */}
                <div className="flex bg-[var(--muted)] p-1 rounded-lg ">
                    {teams.map((team) => (
                        <button
                            key={team.id}
                            onClick={() => setTeamFilter(team.id)}
                            className={`px-4 hover:cursor-pointer py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${teamFilter === team.id
                                ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm'
                                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            {team.name}
                        </button>
                    ))}
                </div>

                <select
                    value={posFilter}
                    onChange={(e) => setPosFilter(e.target.value)}
                    className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                >
                    {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </select>

                <div className="flex items-center gap-2 ml-auto">
                    <label className="text-sm text-[var(--muted-foreground)] flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={showDeleted} 
                            onChange={(e) => setShowDeleted(e.target.checked)}
                            className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] bg-[var(--background)]"
                        />
                        Show Deleted
                    </label>
                </div>
            </div>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

        <div className="bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--border)]">
                    <thead className="bg-[var(--muted)]/50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[var(--foreground)] sm:pl-6">Player</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">#</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Position</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Age</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Height</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Nickname</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                        {filteredPlayers.map((player) => (
                            <tr key={player.id} className="hover:bg-[var(--muted)]/50 transition-colors">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover border border-[var(--border)]" src={player.image_url || '/img/picture.webp'} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-[var(--card-foreground)] flex items-center gap-2">
                                                {player.first_name} {player.last_name}
                                                {player.is_active === false && (
                                                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Deleted</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-[var(--muted-foreground)]">{player.nickname}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                    {player.jersey_number}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                    {player.position}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                    {player.age}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                    {player.height}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                    {player.nickname}
                                </td>

                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        {player.is_active === false ? (
                                            <button
                                                onClick={() => handleRestore(player.id)}
                                                className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors px-3 py-1 rounded-md bg-green-50 border border-green-200"
                                            >
                                                Restore
                                            </button>
                                        ) : (
                                            <>
                                                <button className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors p-1" title="View Stats">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/sports/players/edit/${player.id}`)}
                                                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors p-1"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(player.id)}
                                                    className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors p-1"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <ConfirmDeleteModal 
            isOpen={isDeleteModalOpen} 
            onClose={() => setIsDeleteModalOpen(false)} 
            onConfirm={handleDelete} 
            title="Delete Player" 
            message="Are you sure you want to delete this player? This action cannot be undone." 
        />
    </div>
    );
}
