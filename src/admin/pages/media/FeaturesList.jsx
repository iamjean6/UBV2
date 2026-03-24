import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchFeatures, deleteFeature } from '../../../services/api';

export default function FeaturesList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadFeatures = async () => {
        try {
            setLoading(true);
            const result = await fetchFeatures(1, 100); // Fetch a larger batch for the list view
            setFeatures(result.data);
        } catch (error) {
            console.error("Error loading features:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeatures();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this featured story?')) {
            try {
                await deleteFeature(id);
                loadFeatures();
            } catch (error) {
                console.error("Error deleting feature:", error);
                alert("Failed to delete feature");
            }
        }
    };

    const filteredFeatures = features.filter(f =>
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-[var(--foreground)]">Loading features...</div>;

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Featured Stories</h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Manage your blog posts and featured team activities.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        onClick={() => navigate('/admin/media/features/new')}
                        className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Story
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
                        placeholder="Search stories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead className="bg-[var(--muted)]/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[var(--foreground)] sm:pl-6">Story</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Author</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Date</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                            {filteredFeatures.length > 0 ? filteredFeatures.map((feature, idx) => (
                                <tr key={feature._id || idx} className="hover:bg-[var(--muted)]/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                        <div className="flex items-center">
                                            <div className="h-10 w-14 flex-shrink-0">
                                                <img className="h-10 w-14 rounded object-cover border border-[var(--border)]" src={feature.image} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-[var(--card-foreground)] truncate max-w-[200px]">{feature.title}</div>
                                                <div className="text-xs text-[var(--muted-foreground)]">ID: {feature._id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                        {feature.author}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                        {new Date(feature.date).toLocaleDateString()}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => window.open(`/blog/${feature._id}`, '_blank')}
                                                className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors p-1"
                                                title="View Live"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/media/features/edit/${feature._id}`)}
                                                className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors p-1"
                                                title="Edit"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(feature._id)}
                                                className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors p-1"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-10 text-center text-[var(--muted-foreground)]">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="h-8 w-8 opacity-20" />
                                            <span>No stories found. Create your first one!</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
