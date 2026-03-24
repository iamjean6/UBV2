import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import '../admin-theme.css';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // Can be toggled

    return (
        <div className={`admin-theme ${isDarkMode ? 'dark' : ''} flex h-screen overflow-hidden bg-[var(--background)] font-[family-name:var(--font-sans)] text-[var(--foreground)]`}>
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                <TopNavbar setSidebarOpen={setSidebarOpen} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
