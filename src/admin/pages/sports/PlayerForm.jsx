import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, Music, Users } from 'lucide-react';
import DragDropImageUpload from '../../components/DragDropImageUpload';
import { fetchTeams, fetchOnePlayer, createPlayer, updatePlayer, fetchPlayerProfile, savePlayerProfile } from '../../../services/api';

export default function PlayerForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        team_id: '',
        jersey_number: '',
        position: [],
        height: '',
        weight_kg: '',
        age: '',
        nickname: '',
        bio: '',
        pro_career: '',
        personal_life: '',
        image: null,
        audio: null
    });

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const positions = [
        { id: 'PG', name: 'Point Guard' },
        { id: 'SG', name: 'Shooting Guard' },
        { id: 'SF', name: 'Small Forward' },
        { id: 'PF', name: 'Power Forward' },
        { id: 'C', name: 'Center' },
    ];

    const STORAGE_KEY = id ? `player_form_${id}` : 'player_form_new';

    useEffect(() => {
        loadInitialData();
        // Load persisted data
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && !isEdit) { // Only auto-load for new players or if you want to resume edit
            try {
                const parsed = JSON.parse(saved);
                setFormData(prev => ({ ...prev, ...parsed, image: null, audio: null }));
            } catch (e) {
                console.error('Error parsing saved form:', e);
            }
        }
    }, [id]);

    useEffect(() => {
        // Persist data on change
        if (formData.first_name || formData.last_name || formData.bio) {
            const { image, audio, ...persistable } = formData;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
        }
    }, [formData, STORAGE_KEY]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const teamsRes = await fetchTeams();
            if (teamsRes.status === 'success') setTeams(teamsRes.data);

            if (isEdit) {
                const [playerRes, profileRes] = await Promise.all([
                    fetchOnePlayer(id),
                    fetchPlayerProfile(id).catch(() => ({ status: 'error' }))
                ]);

                if (playerRes.status === 'success') {
                    const p = playerRes.data;
                    const profile = profileRes.status === 'success' ? profileRes.data : {};
                    setFormData({
                        ...p,
                        age: p.age || '',
                        bio: profile.bio || '',
                        pro_career: profile.pro_career || '',
                        personal_life: profile.personal_life || '',
                        position: Array.isArray(p.position) ? p.position : (p.position ? [p.position] : []),
                        image: null,
                        audio: null
                    });
                }
            }
        } catch (err) {
            console.error('Error loading initial data:', err);
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePositionChange = (posId) => {
        setFormData(prev => {
            const current = Array.isArray(prev.position) ? prev.position : [];
            if (current.includes(posId)) {
                return { ...prev, position: current.filter(id => id !== posId) };
            } else {
                return { ...prev, position: [...current, posId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    if (key === 'position' && Array.isArray(formData[key])) {
                        formData[key].forEach(pos => data.append('position', pos));
                    } else {
                        data.append(key, formData[key]);
                    }
                }
            });

            let playerId = id;
            if (isEdit) {
                await updatePlayer(id, data);
            } else {
                const res = await createPlayer(data);
                if (res.status === 'success') {
                    playerId = res.data.id;
                }
            }

            // Save profile data
            await savePlayerProfile({
                player_id: playerId,
                bio: formData.bio,
                pro_career: formData.pro_career,
                personal_life: formData.personal_life
            });

            localStorage.removeItem(STORAGE_KEY);
            navigate('/admin/sports/players');
        } catch (err) {
            console.error('Error saving player:', err);
            setError('Failed to save player. Check your file sizes and network.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit && !formData.first_name) {
        return <div className="p-8 text-center text-[var(--muted-foreground)]">Loading player details...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                        {isEdit ? 'Edit Player' : 'Add New Player'}
                    </h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Fill in the details below to {isEdit ? 'update the' : 'create a new'} player profile.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/sports/players')}
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
                        {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Player</>}
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)] space-y-4">
                        <h2 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-500" />
                            Player Info
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    required
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    required
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Nickname (Optional)</label>
                                <input
                                    type="text"
                                    name="nickname"
                                    placeholder="e.g. The Beard"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Team</label>
                                <select
                                    name="team_id"
                                    required
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.team_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Team</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Jersey Number</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.jersey_number}
                                    onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                                        setFormData(prev => ({ ...prev, jersey_number: onlyNumbers }));
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Positions</label>
                                <div className="flex flex-wrap gap-4 p-3 rounded-md bg-[var(--background)] ring-1 ring-inset ring-[var(--border)]">
                                    {positions.map(pos => (
                                        <label key={pos.id} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)] cursor-pointer"
                                                checked={formData.position && formData.position.includes(pos.id)}
                                                onChange={() => handlePositionChange(pos.id)}
                                            />
                                            <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                                                {pos.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Height (e.g. 5'10")</label>
                                <input
                                    type="text"
                                    inputMode='numeric'
                                    name="height"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.height}
                                    onChange={(e) => {
                                        const value = e.target.value
                                            .replace(/[^0-9'"]/g, '')   // allow numbers, ' and "
                                            .slice(0, 5);               // limit length if needed

                                        setFormData(prev => ({ ...prev, height: value }));
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Weight (kg)</label>
                                <input
                                    type="text"
                                    inputMode='mumeric'
                                    name="weight_kg"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.weight_kg}
                                    onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                                        setFormData(prev => ({ ...prev, weight_kg: onlyNumbers }));
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Age</label>
                                <input
                                    type="text"
                                    inputMode='numeric'
                                    name="age"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.age}
                                    onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                                        setFormData(prev => ({ ...prev, age: onlyNumbers }));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Biography</label>
                                <textarea
                                    name="bio"
                                    rows={3}
                                    placeholder="Enter general biography..."
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.bio}
                                    onChange={(e) => {
                                        const handleChange = e.target.value.slice(0, 800);
                                        setFormData(prev => ({ ...prev, bio: handleChange }));
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Pro Career</label>
                                <textarea
                                    name="pro_career"
                                    rows={3}
                                    placeholder="Enter professional career highlights..."
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.pro_career}
                                    onChange={(e) => {
                                        const handleChange = e.target.value.slice(0, 800);
                                        setFormData(prev => ({ ...prev, pro_career: handleChange }));
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Personal Life</label>
                                <textarea
                                    name="personal_life"
                                    rows={3}
                                    placeholder="Enter personal background and life details..."
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.personal_life}
                                    onChange={(e) => {
                                        const handleChange = e.target.value.slice(0, 800);
                                        setFormData(prev => ({ ...prev, personal_life: handleChange }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)]">
                        <h2 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2 mb-4 flex items-center gap-2">
                            <Upload className="h-4 w-4" /> Profile Image
                        </h2>
                        {formData.image_url && !formData.image && (
                            <div className="mb-4 relative group">
                                <img
                                    src={formData.image_url}
                                    alt="Current Profile"
                                    className="h-32 w-full object-cover rounded-md border border-[var(--border)]"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                    <span className="text-white text-xs font-bold">Current Image</span>
                                </div>
                            </div>
                        )}
                        <DragDropImageUpload
                            onImageUpload={(file) => setFormData(prev => ({ ...prev, image: file }))}
                            multiple={false}
                        />
                    </div>

                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)]">
                        <h2 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2 mb-4 flex items-center gap-2">
                            <Music className="h-4 w-4" /> Introduction Audio
                        </h2>
                        <input
                            type="file"
                            accept="audio/*,video/mp4,video/quicktime,audio/mp4,audio/x-m4a"
                            className="block w-full text-sm text-[var(--muted-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-[var(--primary-foreground)] hover:file:bg-[var(--primary)]/90"
                            onChange={(e) => setFormData(prev => ({ ...prev, audio: e.target.files[0] }))}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
