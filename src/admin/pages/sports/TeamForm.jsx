import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Trophy, Upload, ImageIcon } from 'lucide-react';
import { fetchOneTeam, createTeam, updateTeam } from '../../../services/api';

export default function TeamForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        logo_url: ''
    });

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const STORAGE_KEY = id ? `team_form_${id}` : 'team_form_new';

    useEffect(() => {
        loadTeam();
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && !isEdit) {
            try {
                setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
            } catch (e) {
                console.error('Error parsing saved team form:', e);
            }
        }
    }, [id]);

    useEffect(() => {
        if (formData.name || formData.city) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, STORAGE_KEY]);

    const loadTeam = async () => {
        try {
            setLoading(true);
            const response = await fetchOneTeam(id);
            if (response.status === 'success') {
                setFormData({
                    name: response.data.name || '',
                    city: response.data.city || '',
                    logo_url: response.data.logo_url || ''
                });
                if (response.data.logo_url) {
                    setLogoPreview(response.data.logo_url);
                }
            }
        } catch (err) {
            console.error('Error loading team:', err);
            setError('Failed to load team details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Respect 15-char limit
        setFormData(prev => ({ ...prev, [name]: value.slice(0, 15) }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const data = new FormData();
            data.append('name', formData.name);
            data.append('city', formData.city);
            if (logoFile) {
                data.append('logo', logoFile);
            } else if (formData.logo_url) {
                data.append('logo_url', formData.logo_url);
            }

            if (isEdit) {
                await updateTeam(id, data);
            } else {
                await createTeam(data);
            }

            localStorage.removeItem(STORAGE_KEY);
            navigate('/admin/sports/teams');
        } catch (err) {
            console.error('Error saving team:', err);
            setError('Failed to save team. Please check your data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit && !formData.name) {
        return <div className="p-8 text-center text-[var(--muted-foreground)]">Loading team details...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                        {isEdit ? 'Edit Team' : 'Add New Team'}
                    </h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        {isEdit ? 'Update your team details and logo.' : 'Build a new team for your basketball league.'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/sports/teams')}
                        className="flex items-center gap-2 rounded-md bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm ring-1 ring-inset ring-[var(--border)] hover:bg-[var(--accent)] transition-colors"
                    >
                        <X className="h-4 w-4" /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Team</>}
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)] space-y-6">
                        <div className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <h2>Team Identity</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Team Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="e.g. Urbanville"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">City / Region</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    placeholder="e.g. Kisumu"
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Team Logo</label>
                            <label className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer bg-[var(--muted)]/20 hover:bg-[var(--muted)]/40 hover:border-[var(--primary)]/50 transition-all overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-4" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                                        <p className="text-sm text-[var(--muted-foreground)]"><span className="font-semibold text-[var(--primary)]">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-[var(--muted-foreground)]/60 mt-1">PNG, JPG or WEBP (Max. 2MB)</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                {logoPreview && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm font-bold flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4" /> Change Image
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)]">
                        <h2 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2 mb-4">Quick Tip</h2>
                        <ul className="text-xs text-[var(--muted-foreground)] space-y-2 list-disc pl-4">
                            <li>Use a transparent PNG for the best appearance on the website.</li>
                            <li>Square logos (1:1 aspect ratio) look best in most list views.</li>
                            <li>High-quality images will be automatically resized for performance.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </form>
    );
}
