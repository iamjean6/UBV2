import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Trash2, Video, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import DragDropImageUpload from '../../components/DragDropImageUpload';
import { fetchOneFeature, createFeature, updateFeature } from '../../../services/api';

export default function FeatureForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = id !== undefined;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [videoType, setVideoType] = useState('url'); // 'url' or 'file'

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        videoUrl: '',
        videoFile: null,
        imageFile: null,
        imagePreview: null,
    });

    useEffect(() => {
        if (isEdit) {
            const loadFeature = async () => {
                try {
                    const result = await fetchOneFeature(id);
                    const feature = result.data;
                    
                    // Determine video type from existing data
                    const isFile = feature.video && !feature.video.startsWith('http');
                    
                    setFormData({
                        title: feature.title,
                        excerpt: feature.excerpt,
                        content: feature.content,
                        author: feature.author || '',
                        date: feature.date ? new Date(feature.date).toISOString().split('T')[0] : '',
                        videoUrl: !isFile ? (feature.video || '') : '',
                        videoFile: null,
                        imagePreview: feature.image,
                        imageFile: null,
                    });
                    
                    if (isFile) setVideoType('file');
                } catch (error) {
                    console.error("Error loading feature:", error);
                    alert("Failed to load featured story");
                } finally {
                    setLoading(false);
                }
            };
            loadFeature();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMainImageUpload = (file) => {
        if (file instanceof File) {
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleVideoFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, videoFile: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('excerpt', formData.excerpt);
            data.append('content', formData.content);
            data.append('author', formData.author);
            data.append('date', formData.date);

            if (formData.imageFile) {
                data.append('file', formData.imageFile);
            }

            if (videoType === 'url') {
                data.append('videoUrl', formData.videoUrl);
            } else if (formData.videoFile) {
                data.append('videoFile', formData.videoFile);
            }

            if (isEdit) {
                await updateFeature(id, data);
            } else {
                if (!formData.imageFile && !isEdit) {
                    alert("Please upload a cover image");
                    setSaving(false);
                    return;
                }
                await createFeature(data);
            }
            navigate('/admin/media/features');
        } catch (error) {
            console.error("Error saving feature:", error);
            alert("Failed to save featured story");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-[var(--foreground)]">Loading story data...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                        {isEdit ? 'Edit Featured Story' : 'Add New Story'}
                    </h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Markdown is supported in the content area.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/media/features')}
                        className="flex items-center gap-2 rounded-md bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm ring-1 ring-inset ring-[var(--border)] hover:bg-[var(--accent)] transition-colors"
                        disabled={saving}
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={saving}
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Story'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)] space-y-4">
                        <h2 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">Article Content</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter headline..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)]">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    required
                                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                    value={formData.author}
                                    onChange={handleChange}
                                    placeholder="e.g. Admin Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground)]">Summary / Excerpt</label>
                            <textarea
                                name="excerpt"
                                rows={2}
                                required
                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                value={formData.excerpt}
                                onChange={handleChange}
                                placeholder="Short description for the card..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground)]">Content (Markdown)</label>
                            <textarea
                                name="content"
                                rows={15}
                                required
                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] font-mono focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="# Your content here..."
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)]">
                        <h2 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2 mb-4">Media</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Publish Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Cover Image</label>
                                {formData.imagePreview && (
                                    <div className="aspect-video mb-2 rounded-md overflow-hidden border border-[var(--border)]">
                                        <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <DragDropImageUpload onImageUpload={handleMainImageUpload} multiple={false} />
                            </div>

                            <div className="pt-4 border-t border-[var(--border)]">
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Video Inclusion</label>
                                <div className="flex gap-2 p-1 bg-[var(--muted)] rounded-md mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setVideoType('url')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded ${videoType === 'url' ? 'bg-white shadow-sm text-blue-600' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                                    >
                                        <LinkIcon size={14} /> URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setVideoType('file')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded ${videoType === 'file' ? 'bg-white shadow-sm text-blue-600' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                                    >
                                        <Video size={14} /> File
                                    </button>
                                </div>

                                {videoType === 'url' ? (
                                    <input
                                        type="text"
                                        name="videoUrl"
                                        className="block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                        placeholder="YouTube/Vimeo URL..."
                                        value={formData.videoUrl}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoFileUpload}
                                            className="block w-full text-sm text-[var(--muted-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {formData.videoFile && <p className="text-xs text-green-600">Selected: {formData.videoFile.name}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
