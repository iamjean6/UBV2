import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Calendar } from 'lucide-react';
import { fetchOneLeague, createLeague, updateLeague } from '../../../services/api';

export default function LeagueForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        season: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const STORAGE_KEY = id ? `league_form_${id}` : 'league_form_new';

    useEffect(() => {
        loadLeague();
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && !isEdit) {
            try {
                setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
            } catch (e) {
                console.error('Error parsing saved league form:', e);
            }
        }
    }, [id]);

    useEffect(() => {
        if (formData.name || formData.season) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, STORAGE_KEY]);

    const loadLeague = async () => {
        try {
            setLoading(true);
            const response = await fetchOneLeague(id);
            if (response.status === 'success') {
                setFormData({
                    name: response.data.name || '',
                    season: response.data.season || ''
                });
            }
        } catch (err) {
            console.error('Error loading league:', err);
            setError('Failed to load league details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (isEdit) {
                await updateLeague(id, formData);
            } else {
                await createLeague(formData);
            }

            localStorage.removeItem(STORAGE_KEY);
            navigate('/admin/sports/leagues');
        } catch (err) {
            console.error('Error saving league:', err);
            setError('Failed to save league.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                        {isEdit ? 'Edit League/Season' : 'Create New League'}
                    </h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Define a league and its active season (e.g. 2024-25).
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/sports/leagues')}
                        className="flex items-center gap-2 rounded-md bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm ring-1 ring-inset ring-[var(--border)] hover:bg-[var(--accent)] transition-colors"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save League</>}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)] max-w-2xl space-y-4">
                <h2 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    League Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)]">League Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Urbanville Summer League"
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)]">Season</label>
                        <input
                            type="text"
                            name="season"
                            required
                            placeholder="e.g. 2024-25"
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                            value={formData.season}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
