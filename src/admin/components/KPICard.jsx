import { cn } from '../layout/Sidebar';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KPICard({ title, value, change, changeType, icon: Icon }) {
    const isPositive = changeType === 'positive';

    return (
        <div className="bg-[var(--card)] overflow-hidden shadow-[var(--shadow-sm)] rounded-xl border border-[var(--border)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--muted-foreground)] truncate">{title}</p>
                        <div className="mt-1 flex items-baseline">
                            <p className="text-2xl font-semibold text-[var(--card-foreground)]">{value}</p>
                            <p
                                className={cn(
                                    "ml-2 flex items-baseline text-sm font-semibold",
                                    isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                )}
                            >
                                {isPositive ? (
                                    <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4 text-green-500 dark:text-green-400" aria-hidden="true" />
                                ) : (
                                    <ArrowDownRight className="self-center flex-shrink-0 h-4 w-4 text-red-500 dark:text-red-400" aria-hidden="true" />
                                )}
                                <span className="sr-only"> {isPositive ? 'Increased' : 'Decreased'} by </span>
                                {change}
                            </p>
                        </div>
                    </div>
                    {Icon && (
                        <div className="flex-shrink-0 bg-[var(--primary)]/10 p-3 rounded-lg">
                            <Icon className="h-6 w-6 text-[var(--primary)]" aria-hidden="true" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
