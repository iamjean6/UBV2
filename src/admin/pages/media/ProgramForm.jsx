import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Trash2, Plus } from 'lucide-react';
import DragDropImageUpload from '../../components/DragDropImageUpload';
import { fetchOneProgram, createProgram, updateProgram } from '../../../services/api';

export default function ProgramForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = id !== undefined;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        synopsis: '',
        imageFile: null,
        imagePreview: null,
        galleryImages: [], // Array of { file: File, preview: string, isExisting: boolean }
    });

    useEffect(() => {
        if (isEdit) {
            const loadProgram = async () => {
                try {
                    const result = await fetchOneProgram(id);
                    const program = result.data;
                    setFormData({
                        title: program.title,
                        synopsis: program.synopsis,
                        imagePreview: program.image,
                        imageFile: null,
                        galleryImages: (program.images || []).map(url => ({
                            file: null,
                            preview: url,
                            isExisting: true
                        }))
                    });
                } catch (error) {
                    console.error("Error loading program:", error);
                    alert("Failed to load program");
                } finally {
                    setLoading(false);
                }
            };
            loadProgram();
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

const handleGalleryImageUpload = (files) => {
    if (!files || files.length === 0) return;

    const newImages = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        isExisting: false
    }));

    setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...newImages]
    }));
};

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('synopsis', formData.synopsis);

            if (formData.imageFile) {
                data.append('file', formData.imageFile);
            }

            
            formData.galleryImages.forEach((img) => {
                if (!img.isExisting && img.file) {
                    data.append('galleryFiles', img.file);
                }
            });

            if (isEdit) {
                await updateProgram(id, data);
            } else {
                if (!formData.imageFile) {
                    alert("Please upload a cover image");
                    setSaving(false);
                    return;
                }
                await createProgram(data);
            }
            navigate('/admin/media/programs');
        } catch (error) {
            console.error("Error saving program:", error);
            alert("Failed to save program");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading program data...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                        {isEdit ? 'Edit Program' : 'Add New Program'}
                    </h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Fill in the details below to {isEdit ? 'update the' : 'create a new'} program.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/media/programs')}
                        className="flex items-center gap-2 rounded-md bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm ring-1 ring-inset ring-[var(--border)] hover:bg-[var(--accent)] transition-colors"
                        disabled={saving}
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
                        disabled={saving}
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Program'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)] space-y-4">
                        <h2 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">Program Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground)]">Program Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. KISUMU BASKETBALL LEAGUE"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground)]">Synopsis</label>
                            <textarea
                                name="synopsis"
                                rows={4}
                                required
                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm"
                                value={formData.synopsis}
                                onChange={handleChange}
                                placeholder="Describe the program..."
                            />
                        </div>
                    </div>

                    {/* Gallery Images Card */}
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)] space-y-4">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                            <h2 className="text-lg font-semibold text-[var(--foreground)]">Gallery Images</h2>
                            <p className="text-xs text-[var(--muted-foreground)]">{formData.galleryImages.length} images total</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {formData.galleryImages.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-md overflow-hidden border border-[var(--border)]">
                                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(idx)}
                                            className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="aspect-square">
                                <DragDropImageUpload onImageUpload={handleGalleryImageUpload} 
                                multiple={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-[var(--card)] p-6 rounded-lg shadow-sm border border-[var(--border)]">
                        <h2 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2 mb-4">Main Cover Image</h2>
                        <div className="space-y-4">
                            {formData.imagePreview && (
                                <div className="aspect-[3/4] rounded-md overflow-hidden border border-[var(--border)]">
                                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <DragDropImageUpload onImageUpload={handleMainImageUpload}
                            multiple={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}


