import { useState, useEffect } from 'react';
import DragDropImageUpload from '../../components/DragDropImageUpload';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, fetchOneProduct } from '../../../services/api';

export default function ProductForm() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const isEdit = !!slug;
    const [productId, setProductId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialFetchLoading, setInitialFetchLoading] = useState(isEdit);

    // Core Product Info
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        // category_id: null,
        status: 'active',
        discount_percent: 0
    });

    // Images
    const [images, setImages] = useState([]);

    // Variants (e.g. Size/Color)
    const [variants, setVariants] = useState([
        { color: 'Any', size: 'Any', stock_quantity: 10 }
    ]);

    useEffect(() => {
        if (isEdit) {
            const loadProduct = async () => {
                try {
                    const res = await fetchOneProduct(slug);
                    if (res && res.status === 'success') {
                        const p = res.data;
                        setProductId(p.id);
                        setFormData({
                            name: p.name || '',
                            description: p.description || '',
                            price: p.price || '',
                            category: p.category_name || '',
                            status: p.is_active ? 'active' : 'draft',
                            discount_percent: p.discount_percent || 0
                        });
                        if (p.variants && p.variants.length > 0) {
                            setVariants(p.variants);
                        }
                        // Note: old images aren't pre-populated in DragDrop yet, 
                        // so saving without new images retains the old ones in the backend via PUT.
                    }
                } catch (err) {
                    console.error('Failed to load product:', err);
                } finally {
                    setInitialFetchLoading(false);
                }
            };
            loadProduct();
        }
    }, [isEdit, slug]);

    const handleAddVariant = () => {
        setVariants([...variants, { color: '', size: '', stock_quantity: 0 }]);
    };

    const handleRemoveVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const data = new FormData();

            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('is_active', formData.status === 'active');
            data.append('discount_percent', formData.discount_percent);

            // In a real app we would have standard categories to map to category_id
            // data.append('category_id', ...) 

            // Append variants as a JSON string for backend parsing
            data.append('variants', JSON.stringify(variants));

            // Append all images
            images.forEach((img) => {
                data.append('images', img);
            });

            if (isEdit && productId) {
                await updateProduct(productId, data);
            } else {
                await createProduct(data);
            }
            navigate('/admin/ecommerce/products');
        } catch (err) {
            console.error('Failed to save product:', err);
            alert('Failed to save product. Watch the console.');
        } finally {
            setLoading(false);
        }
    };

    if (initialFetchLoading) {
        return <div className="p-8 text-center text-[var(--muted-foreground)]">Loading product details...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate('/admin/ecommerce/products')}
                    className="p-2 -ml-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="sr-only">Back to products</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        {isEdit ? 'Update the details of your existing product below.' : 'Fill in the information below to create a new product in the store.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[var(--card)] shadow-sm ring-1 ring-[var(--border)] sm:rounded-xl md:col-span-2">
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mb-8">
                        {/* Core Info */}
                        <div className="col-span-full pb-4 border-b border-[var(--border)]">
                            <h2 className="text-base font-semibold leading-7 text-[var(--foreground)]">Core Details</h2>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-[var(--foreground)]">Product Name*</label>
                            <div className="mt-2 text-red">
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-[var(--foreground)] bg-[var(--background)] shadow-sm ring-1 ring-inset ring-[var(--input)] sm:text-sm sm:leading-6 focus:ring-[var(--ring)]"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="price" className="block text-sm font-medium leading-6 text-[var(--foreground)]">Price (KES)*</label>
                            <div className="mt-2 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-[var(--muted-foreground)] sm:text-sm">Ksh</span>
                                </div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    name="price"
                                    required
                                    maxLength={5}
                                    className="block w-full rounded-md border-0 py-1.5 pl-7 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--input)] sm:text-sm sm:leading-6 focus:ring-[var(--ring)]"
                                    placeholder="00"
                                    value={formData.price}
                                    onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                                        setFormData(prev => ({
                                            ...prev,
                                            price: onlyNumbers
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-4">
                            <label htmlFor="category" className="block text-sm font-medium leading-6 text-[var(--foreground)]">Category</label>
                            <div className="mt-2 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">

                                </div>
                                <input
                                    type="text"
                                    inputMode="text"
                                    name="category"
                                    required
                                    maxLength={20}
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--input)] sm:text-sm sm:leading-6 focus:ring-[var(--ring)]"
                                    placeholder="eg Tees, Warmers"
                                    value={formData.category || ''}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            category: e.target.value
                                        }));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="discount_percent" className="block text-sm font-medium leading-6 text-[var(--foreground)]">Discount Percentage (%)</label>
                            <div className="mt-2 relative rounded-md shadow-sm">
                                <input
                                    type="number"
                                    name="discount_percent"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 pr-10 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--input)] sm:text-sm sm:leading-6 focus:ring-[var(--ring)]"
                                    placeholder="0 to 1 (e.g., 0.20 for 20%)"
                                    value={formData.discount_percent}
                                    onChange={(e) => {
                                        let val = parseFloat(e.target.value);
                                        if (isNaN(val)) val = 0;
                                        if (val < 0) val = 0;
                                        if (val > 1) val = 1;

                                        setFormData(prev => ({
                                            ...prev,
                                            discount_percent: val
                                        }));
                                    }}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-[var(--muted-foreground)] sm:text-sm">%</span>
                                </div>
                            </div>
                            {formData.price && formData.discount_percent > 0 && (
                                <p className="mt-2 text-sm text-green-600 font-medium">
                                    Final Price: Ksh {(formData.price * (1 - formData.discount_percent)).toFixed(2)}
                                </p>
                            )}
                        </div>

                        <div className="col-span-full">
                            <label className="block text-sm font-medium leading-6 text-[var(--foreground)]">Description</label>
                            <div className="mt-2">
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="block w-full rounded-md p-3 border-0 py-1.5 text-[var(--foreground)] bg-[var(--background)] shadow-sm ring-1 ring-inset ring-[var(--input)] sm:text-sm sm:leading-6 focus:ring-[var(--ring)]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mb-8">
                        <div className="col-span-full pb-4 border-b border-[var(--border)]">
                            <h2 className="text-base font-semibold leading-7 text-[var(--foreground)]">Product Images</h2>
                            <p className="text-sm text-[var(--muted-foreground)]">Upload one or more images for this product.</p>
                        </div>
                        <div className="col-span-full">
                            <DragDropImageUpload onImageUpload={(files) => setImages(files)} />
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="max-w-3xl mb-8">
                        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
                            <h2 className="text-base font-semibold leading-7 text-[var(--foreground)]">Product Variants</h2>
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline font-medium"
                            >
                                <Plus className="w-4 h-4" /> Add Variant
                            </button>
                        </div>

                        <div className="space-y-3">
                            {variants.map((v, idx) => (
                                <div key={idx} className="flex gap-4 items-end bg-[var(--accent)]/50 p-3 rounded border border-[var(--border)]">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Color</label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={50}
                                            className="block w-full text-sm rounded-md border-0 py-1.5 px-3 text-[var(--foreground)] bg-[var(--background)] shadow-sm ring-1 ring-[var(--input)] focus:ring-[var(--ring)]"
                                            value={v.color}
                                            onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                                            placeholder="e.g. Red, Any"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Size</label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={50}
                                            className="block w-full text-sm rounded-md border-0 py-1.5 px-3 text-[var(--foreground)] bg-[var(--background)] shadow-sm ring-1 ring-[var(--input)] focus:ring-[var(--ring)]"
                                            value={v.size}
                                            onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                                            placeholder="e.g. M, L, Any"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Stock</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="block w-full text-sm rounded-md border-0 py-1.5 px-3 text-[var(--foreground)] bg-[var(--background)] shadow-sm ring-1 ring-[var(--input)] focus:ring-[var(--ring)]"
                                            value={v.stock_quantity}
                                            onChange={(e) => handleVariantChange(idx, 'stock_quantity', parseInt(e.target.value))}
                                        />
                                    </div>
                                    {variants.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVariant(idx)}
                                            className="p-2 text-[var(--muted-foreground)] hover:text-red-500 rounded bg-[var(--background)] border border-[var(--border)] mb-[1px]"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 mt-6 pt-6 border-t border-[var(--border)]">
                        <div className="sm:col-span-3">
                            <fieldset>
                                <legend className="text-sm font-medium leading-6 text-[var(--foreground)]">Visibility Status</legend>
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-x-3">
                                        <input
                                            id="status-active"
                                            name="status"
                                            type="radio"
                                            checked={formData.status === 'active'}
                                            onChange={() => setFormData({ ...formData, status: 'active' })}
                                            className="h-4 w-4 border-[var(--input)] bg-[var(--background)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                        />
                                        <label htmlFor="status-active" className="block text-sm font-medium leading-6 text-[var(--foreground)]">
                                            Active (Visible)
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <input
                                            id="status-draft"
                                            name="status"
                                            type="radio"
                                            checked={formData.status === 'draft'}
                                            onChange={() => setFormData({ ...formData, status: 'draft' })}
                                            className="h-4 w-4 border-[var(--input)] bg-[var(--background)] text-[var(--primary)] focus:ring-[var(--ring)]"
                                        />
                                        <label htmlFor="status-draft" className="block text-sm font-medium leading-6 text-[var(--foreground)]">
                                            Draft (Hidden)
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                </div>

                <div className="flex items-center justify-end gap-x-6 border-t border-[var(--border)] px-4 py-4 sm:px-8 bg-[var(--muted)]/20 rounded-b-xl">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/ecommerce/products')}
                        className="text-sm font-semibold leading-6 text-[var(--foreground)] hover:text-[var(--muted-foreground)] px-3 py-2 rounded-md transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 focus-visible:outline focus-visible:outline-[var(--ring)] transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
