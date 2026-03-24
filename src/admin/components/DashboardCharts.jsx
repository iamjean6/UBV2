import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const data = [
    { name: 'Mon', revenue: 4000, active: 2400 },
    { name: 'Tue', revenue: 3000, active: 1398 },
    { name: 'Wed', revenue: 2000, active: 9800 },
    { name: 'Thu', revenue: 2780, active: 3908 },
    { name: 'Fri', revenue: 1890, active: 4800 },
    { name: 'Sat', revenue: 2390, active: 3800 },
    { name: 'Sun', revenue: 3490, active: 4300 },
];

const pieData = [
    { name: 'Apparel', value: 400 },
    { name: 'Equipment', value: 300 },
    { name: 'Tickets', value: 300 },
    { name: 'Memberships', value: 200 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export function RevenueChart() {
    return (
        <div className="bg-[var(--card)] rounded-xl shadow-[var(--shadow-sm)] border border-[var(--border)] p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[var(--card-foreground)]">Revenue & Activity</h3>
                <select className="text-sm bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] rounded-md focus:ring-[var(--ring)] focus:border-[var(--ring)]">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                </select>
            </div>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dy={10} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dx={-10} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dx={10} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                            itemStyle={{ color: 'var(--popover-foreground)' }}
                        />
                        <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line yAxisId="right" type="monotone" dataKey="active" stroke="var(--chart-2)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function DistributionChart() {
    return (
        <div className="bg-[var(--card)] rounded-xl shadow-[var(--shadow-sm)] border border-[var(--border)] p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-[var(--card-foreground)] w-full mb-2">Orders by Category</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                            itemStyle={{ color: 'var(--popover-foreground)' }}
                            formatter={(value) => [`$${value}`, 'Revenue']}
                        />
                        <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--muted-foreground)' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
