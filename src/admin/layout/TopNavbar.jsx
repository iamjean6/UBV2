import { Bell, Search, Menu, Settings, LogOut, User, Moon, Sun } from 'lucide-react';

export default function TopNavbar({ setSidebarOpen, isDarkMode, setIsDarkMode }) {
    return (
        <header className="flex items-center justify-between h-16 px-4 bg-[var(--background)] border-b border-[var(--border)] sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="flex items-center flex-1">
                <button
                    type="button"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="w-6 h-6" aria-hidden="true" />
                </button>

                {/* Global Search */}
                <div className="hidden sm:flex items-center flex-1 ml-4 lg:ml-0 gap-2 max-w-md relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Global search..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 text-[var(--muted-foreground)] bg-[var(--background)] rounded-full hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 transition-colors"
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <button className="p-2 text-[var(--muted-foreground)] bg-[var(--background)] rounded-full hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 relative transition-colors">
                    <span className="sr-only">View notifications</span>
                    <Bell className="w-5 h-5" aria-hidden="true" />
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[var(--background)]" />
                </button>

                {/* Profile Dropdown (Simplified for MVP) */}
                <div className="relative flex items-center gap-3 ml-2">
                    <div className="flex flex-col text-right hidden sm:block">
                        <span className="text-sm font-medium text-[var(--foreground)] leading-none">Admin User</span>
                        <span className="text-xs text-[var(--muted-foreground)] mt-1">Super Admin</span>
                    </div>
                    <button className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2">
                        <User className="w-5 h-5" />
                    </button>

                    <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-48 rounded-md shadow-[var(--shadow-lg)] bg-[var(--popover)] border border-[var(--border)] ring-opacity-5 divide-y divide-[var(--border)] focus:outline-none z-50">
                        {/* Keeping it simple - could use a proper dropdown library later */}
                        <div className="py-1">
                            <a href="#settings" className="group flex items-center px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)]">
                                <Settings className="mr-3 h-4 w-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]" />
                                Settings
                            </a>
                            <a href="#logout" className="group flex items-center px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)]">
                                <LogOut className="mr-3 h-4 w-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]" />
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
