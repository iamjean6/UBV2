import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Loader2, Package, Tag, Layers, ShoppingCart, Percent } from 'lucide-react';
import { fetchOneProduct } from '../../../services/api';

export default function ProductDetails() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const res = await fetchOneProduct(slug);
                if (res.status === 'success') {
                    setProduct(res.data);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="p-8 text-center bg-red-50 text-red-600 rounded-md">
                <p>{error || 'Product not found'}</p>
                <button
                    onClick={() => navigate('/admin/ecommerce/products')}
                    className="mt-4 text-[var(--primary)] hover:underline"
                >
                    Back to products
                </button>
            </div>
        );
    }

    const totalStock = product.variants ? product.variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) : 0;
    const finalPrice = product.price * (1 - (product.discount_percent || 0));

    // Fallback if images array is empty or undefined
    const displayImage = (product.images && product.images.length > 0) ? product.images[0].image_url : 'https://via.placeholder.com/400?text=No+Image';

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/ecommerce/products')}
                        className="p-2 -ml-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{product.name}</h1>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)] flex items-center gap-2">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.is_active ? "bg-green-500/10 text-green-600 ring-green-500/20" : "bg-gray-50 text-gray-500 ring-gray-500/10"
                                }`}>
                                {product.is_active ? 'Active' : 'Draft'}
                            </span>
                            • {product.slug}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/admin/ecommerce/products/edit/${product.id}`)}
                    className="flex items-center gap-2 rounded-md bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm ring-1 ring-inset ring-[var(--border)] hover:bg-[var(--accent)] transition-colors"
                >
                    <Edit2 className="h-4 w-4" /> Edit Product
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Images & Quick Stats */}
                <div className="space-y-6">
                    {/* Primary Image */}
                    <div className="bg-[var(--card)] rounded-xl overflow-hidden border border-[var(--border)] p-2 shadow-sm">
                        <img
                            src={displayImage}
                            alt={product.name}
                            className="w-full h-auto aspect-square object-cover rounded-lg"
                        />
                    </div>
                    {/* Secondary Images Gallery */}
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.slice(1).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img.image_url}
                                    alt={`Product view ${idx + 2}`}
                                    className="w-full h-auto aspect-square object-cover rounded-lg border border-[var(--border)]"
                                />
                            ))}
                        </div>
                    )}

                    {/* At A Glance */}
                    <div className="bg-[var(--card)] p-5 rounded-xl border border-[var(--border)] shadow-sm space-y-4">
                        <h3 className="font-semibold text-lg text-[var(--foreground)] border-b border-[var(--border)] pb-2">At a Glance</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[var(--muted-foreground)] flex items-center gap-2"><Tag className="w-4 h-4" /> Category</span>
                                <span className="font-medium text-[var(--foreground)]">{product.category_name || 'Uncategorized'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[var(--muted-foreground)] flex items-center gap-2"><Package className="w-4 h-4" /> Total Stock</span>
                                <span className="font-medium text-[var(--foreground)]">{totalStock} Units</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[var(--muted-foreground)] flex items-center gap-2"><Layers className="w-4 h-4" /> Variants count</span>
                                <span className="font-medium text-[var(--foreground)]">{product.variants?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Details & Pricing & Variants */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Price Block */}
                    <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--muted-foreground)] flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" /> Selling Price
                            </p>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight  text-[var(--foreground)]">
                                    Ksh {finalPrice.toFixed(2)}
                                </span>
                                {product.discount_percent > 0 && (
                                    <span className="text-lg text-[var(--muted-foreground)] line-through">
                                        Ksh {parseFloat(product.price).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                        {product.discount_percent > 0 && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                                <Percent className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-bold text-sm">On Sale</p>
                                    <p className="text-xs">{product.discount_percent * 100}% Discount Applied</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Information */}
                    <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                        <h3 className="font-semibold text-lg text-[var(--foreground)] mb-4">Description</h3>
                        <p className="text-[var(--foreground)] text-sm whitespace-pre-wrap leading-relaxed">
                            {product.description || <span className="text-[var(--muted-foreground)] italic">No description provided.</span>}
                        </p>
                    </div>

                    {/* Variants Table */}
                    <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                        <h3 className="font-semibold text-lg text-[var(--foreground)] mb-4">Inventory Breakdown (Variants)</h3>
                        {product.variants && product.variants.length > 0 ? (
                            <div className="overflow-hidden border border-[var(--border)] rounded-lg">
                                <table className="min-w-full divide-y divide-[var(--border)] text-sm text-[var(--foreground)]">
                                    <thead className="bg-[var(--muted)]/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Color</th>
                                            <th className="px-4 py-3 text-left font-medium">Size</th>
                                            <th className="px-4 py-3 text-right font-medium">Stock Inside</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {product.variants.map((v, i) => (
                                            <tr key={v.id || i} className="hover:bg-[var(--muted)]/30 transition-colors">
                                                <td className="px-4 py-2">{v.color}</td>
                                                <td className="px-4 py-2">{v.size}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${v.stock_quantity > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'
                                                        }`}>
                                                        {v.stock_quantity || 0}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-[var(--muted-foreground)] text-sm italic">No variants configured for this product.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
