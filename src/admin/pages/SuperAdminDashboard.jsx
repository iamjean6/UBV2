import { useState, useEffect } from 'react';
import { Activity, Shield, User, Clock, Search, Filter, Database, Server, Cpu, Globe } from 'lucide-react';

export default function SuperAdminDashboard() {
    const [activities, setActivities] = useState([]);
    const [vitals, setVitals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const headers = { 'Authorization': `Bearer ${token}` };
                
                const [actRes, vitRes] = await Promise.all([
                    fetch('http://localhost:5000/api/admin/activities', { headers }),
                    fetch('http://localhost:5000/api/admin/vitals', { headers })
                ]);

                const actResult = await actRes.json();
                const vitResult = await vitRes.json();

                if (actResult.status === 'success') setActivities(actResult.data);
                if (vitResult.status === 'success') setVitals(vitResult.data);
            } catch (err) {
                console.error('Error fetching oversight data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredActivities = activities.filter(act => 
        act.admin_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.target_module.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    <Shield className="text-indigo-600" size={32} />
                    Superadmin Oversight
                </h1>
                <p className="text-slate-500 mt-1">Monitoring administrative actions and system vitals.</p>
            </div>

            {/* System Vitals Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <VitalCard title="Database Status" value={vitals?.database || "Healthy"} icon={Database} status="online" />
                <VitalCard title="API Latency" value={vitals?.latency || "42ms"} icon={Server} status="online" />
                <VitalCard title="Server Uptime" value={vitals?.uptime || "0 mins"} icon={Clock} status="online" />
                <VitalCard title="Memory Used" value={vitals?.memory || "0MB"} icon={Cpu} status="online" />
            </div>

            {/* Activities Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="text-indigo-500" size={20} />
                        Admin Activity Logs
                    </h3>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter by admin, action, or module..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">Admin</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Module</th>
                                <th className="px-6 py-4">Target ID</th>
                                <th className="px-6 py-4">IP Address</th>
                                <th className="px-6 py-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredActivities.length > 0 ? (
                                filteredActivities.map((act) => (
                                    <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                                                    {act.admin_username[0].toUpperCase()}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700">{act.admin_username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${getActionStyle(act.action)}`}>
                                                {act.action.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{act.target_module}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-slate-400">
                                            {act.target_id || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400">
                                            {act.ip_address}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Clock size={14} />
                                                <span className="text-xs font-medium">
                                                    {new Date(act.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <Search size={40} className="text-slate-200" />
                                            <p className="text-sm font-medium">No activity logs found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {filteredActivities.length > 0 && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400 font-medium tracking-tight">Showing {filteredActivities.length} recent operations</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function VitalCard({ title, value, icon: Icon, status }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
                <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-slate-900 leading-none">{value}</p>
                    <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></span>
                </div>
            </div>
        </div>
    );
}

function getActionStyle(action) {
    if (action.includes('CREATE')) return 'bg-emerald-100 text-emerald-700';
    if (action.includes('UPDATE')) return 'bg-amber-100 text-amber-700';
    if (action.includes('DELETE')) return 'bg-rose-100 text-rose-700';
    return 'bg-slate-100 text-slate-700';
}
