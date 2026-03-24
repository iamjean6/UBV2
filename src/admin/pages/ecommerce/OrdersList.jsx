import { useState, useEffect } from 'react';
import { Search, Loader2, RefreshCw, ShoppingCart, User, Package, Calendar, DollarSign } from 'lucide-react';
import { cn } from '../../layout/Sidebar';
import { fetchSuccessfulOrders } from '../../../services/api';

export default function OrdersList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetchSuccessfulOrders();
            setOrders(response?.data || []);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const groupedOrders = orders.reduce((acc, curr) => {
        if (!acc[curr.order_id]) {
            acc[curr.order_id] = {
                order_id: curr.order_id,
                username: curr.username,
                created_at: curr.created_at,
                items: [],
                total: 0
            };
        }
        acc[curr.order_id].items.push(curr);
        acc[curr.order_id].total += parseFloat(curr.price_at_purchase) * curr.quantity;
        return acc;
    }, {});

    const sortedGroupedOrders = Object.values(groupedOrders).sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
    );

    const filteredOrders = sortedGroupedOrders.filter(order => 
        order.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_id?.toString().includes(searchTerm) ||
        order.items.some(item => item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Successful Orders</h1>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        A detailed list of all successful transactions, grouped by Order ID.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-md bg-[var(--background)] px-3 py-2 text-center text-sm font-semibold text-[var(--foreground)] shadow-sm border border-[var(--border)] hover:bg-[var(--accent)] transition-colors"
                    >
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--card)] p-4 rounded-lg shadow-sm border border-[var(--border)]">
                <div className="relative w-full sm:max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-[var(--foreground)] bg-[var(--background)] ring-1 ring-inset ring-[var(--border)] placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-inset focus:ring-[var(--ring)] sm:text-sm sm:leading-6"
                        placeholder="Search by customer, product, or order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-[var(--muted-foreground)] bg-[var(--muted)]/30 px-3 py-1.5 rounded-full border border-[var(--border)]">
                    Distinct Orders: <span className="font-bold text-[var(--foreground)]">{Object.keys(groupedOrders).length}</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead className="bg-[var(--muted)]/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[var(--foreground)] sm:pl-6">
                                    <div className="flex items-center gap-2"><ShoppingCart className="h-4 w-4"/> Order</div>
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">
                                    <div className="flex items-center gap-2"><User className="h-4 w-4"/> Customer</div>
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">
                                    <div className="flex items-center gap-2"><Package className="h-4 w-4"/> Items</div>
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)] text-right">
                                    <div className="flex items-center gap-2 justify-end"><DollarSign className="h-4 w-4"/> Total (KES)</div>
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">
                                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Date</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                            {loading && orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-[var(--primary)]" />
                                        <p className="mt-2 text-sm font-medium">Loading orders...</p>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-[var(--muted-foreground)] text-sm">
                                        No successful orders found.
                                    </td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.order_id} className="hover:bg-[var(--muted)]/50 transition-colors duration-150 align-top">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-[var(--primary)] sm:pl-6">
                                        #{order.order_id}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--card-foreground)] font-medium">
                                        {order.username}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                        <div className="space-y-1">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between gap-4">
                                                    <span>{item.product_name} x {item.quantity}</span>
                                                    <span className="text-xs">KES {parseFloat(item.price_at_purchase).toLocaleString()} ea</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-[var(--foreground)] text-right">
                                        KES {order.total.toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">
                                        {formatDate(order.created_at)}
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
