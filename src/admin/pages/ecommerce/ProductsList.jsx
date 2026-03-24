import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../layout/Sidebar';
import { fetchProducts, deleteProduct, fetchCategories } from '../../../services/api';

export default function ProductsList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                fetchProducts(),
                fetchCategories()
            ]);
            setProducts(productsData?.data || []);
            setCategories(categoriesData?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            setDeleteLoading(id);
            await deleteProduct(id);
            await loadData();
        } catch (err) {
            console.error("Failed to delete product", err);
            alert("Failed to delete product");
        } finally {
            setDeleteLoading(null);
        }
    };

    const displayImage = (product) => {
        if (product && product.images && product.images.length > 0 && product.images[0]) {
            return product.images[0].image_url;
        }
        return 'https://via.placeholder.com/150?text=No+Image';
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || p.category_name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Products</h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        A list of all products in your store including their name, price, category, and status.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-2">
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 block rounded-md bg-[var(--background)] px-3 py-2 text-center text-sm font-semibold text-[var(--foreground)] shadow-sm border border-[var(--border)] hover:bg-[var(--accent)] transition-colors"
                    >
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </button>
                    <button
                        onClick={() => navigate('/admin/ecommerce/products/new')}
                        className="flex items-center gap-2 block rounded-md bg-[var(--primary)] px-3 py-2 text-center text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--card)] p-4 rounded-lg shadow-sm border border-[var(--border)]">
                <div className="relative w-full sm:max-w-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-inset focus:ring-[var(--ring)] sm:text-sm sm:leading-6"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] sm:text-sm sm:leading-6"
                    >
                        <option value="All Categories">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead className="bg-[var(--muted)]/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[var(--foreground)] sm:pl-6">Product</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Category</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Price</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Total Stock</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                            {loading && products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-[var(--primary)]" />
                                        <p className="mt-2 text-sm font-medium">Loading products...</p>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-[var(--muted-foreground)] text-sm">
                                        No products found.
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-[var(--muted)]/50 transition-colors duration-150">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-md object-cover border border-[var(--border)] bg-gray-100" src={displayImage(product)} alt={product.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-[var(--card-foreground)]">{product.name}</div>
                                                <div className="text-xs text-[var(--muted-foreground)]">{product.variants ? product.variants.length : 0} Variants</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                        {product.category_name || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-[var(--foreground)]">
                                        {product.variants ? product.variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) : 0}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={cn(
                                            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                            product.is_active
                                                ? "bg-green-500/10 text-green-600 ring-green-500/20"
                                                : "bg-[var(--muted)] text-[var(--muted-foreground)] ring-[var(--border)]"
                                        )}>
                                            {product.is_active ? 'Active' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/ecommerce/products/${product.slug}/details`)}
                                                className="text-[var(--primary)] hover:text-indigo-500 transition-colors p-1"
                                                title="View Finished List Details"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                                <span className="sr-only">Details for {product.name}</span>
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/ecommerce/products/edit/${product.id}`)}
                                                className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors p-1"
                                                title="Edit Product"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                <span className="sr-only">Edit {product.name}</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deleteLoading === product.id}
                                                className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors p-1"
                                            >
                                                {deleteLoading === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                <span className="sr-only">Delete {product.name}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
