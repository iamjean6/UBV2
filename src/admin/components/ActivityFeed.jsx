import { cn } from '../layout/Sidebar';
import { UserPlus, ShoppingCart, Tag, Image as ImageIcon } from 'lucide-react';

const activities = [
    { id: 1, type: 'user', content: 'Admin John created new team', time: '1h ago', icon: UserPlus, iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 2, type: 'order', content: 'New order #2034', time: '3h ago', icon: ShoppingCart, iconColor: 'text-green-500', bgColor: 'bg-green-50' },
    { id: 3, type: 'product', content: 'Product price updated', time: '5h ago', icon: Tag, iconColor: 'text-purple-500', bgColor: 'bg-purple-50' },
    { id: 4, type: 'media', content: 'Banner image uploaded', time: '1d ago', icon: ImageIcon, iconColor: 'text-orange-500', bgColor: 'bg-orange-50' },
    { id: 5, type: 'user', content: 'New customer registration', time: '1d ago', icon: UserPlus, iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
];

export function ActivityFeed() {
    return (
        <div className="bg-[var(--card)] rounded-xl shadow-[var(--shadow-sm)] border border-[var(--border)] p-6 h-full">
            <h3 className="text-lg font-semibold text-[var(--card-foreground)] mb-6">Recent Activity</h3>
            <div className="flow-root">
                <ul role="list" className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                        <li key={activity.id}>
                            <div className="relative pb-8">
                                {activityIdx !== activities.length - 1 ? (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[var(--border)]" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span className={cn(activity.bgColor, "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-[var(--card)]")}>
                                            <activity.icon className={cn(activity.iconColor, "h-4 w-4")} aria-hidden="true" />
                                        </span>
                                    </div>
                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                        <div>
                                            <p className="text-sm text-[var(--muted-foreground)]">{activity.content}</p>
                                        </div>
                                        <div className="whitespace-nowrap text-right text-sm text-[var(--muted-foreground)] opacity-70">
                                            <time dateTime={activity.time}>{activity.time}</time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-6 flex flex-col justify-stretch">
                <button
                    type="button"
                    className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                >
                    View all activity →
                </button>
            </div>
        </div>
    );
}
