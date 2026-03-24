import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Trophy,
  ShoppingBag,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  Activity,
  LogOut
} from 'lucide-react';
import { useAuth, ROLES } from '../hooks/useAdminAuth';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  {
    name: 'Sports',
    icon: Trophy,
    children: [
      { name: 'Teams', path: '/admin/sports/teams' },
      { name: 'Players', path: '/admin/sports/players' },
      { name: 'Games', path: '/admin/sports/games' },
    ],
  },
  {
    name: 'Ecommerce',
    icon: ShoppingBag,
    children: [
      { name: 'Products', path: '/admin/ecommerce/products' },
      { name: 'Orders', path: '/admin/ecommerce/orders' },
    ],
  },
  {
    name: 'Media',
    icon: ImageIcon,
    children: [
      { name: 'Banners', path: '/admin/media/banners' },
      { name: 'Programs', path: '/admin/media/programs' },
      { name: 'Featured Stories', path: '/admin/media/features' },
    ],
  },
  {
    name: 'System',
    icon: Activity,
    role: ROLES.SUPER_ADMIN,
    children: [
      { name: 'Admin Activities', path: '/admin/superadmin/activities' },
    ],
  },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState({
    Sports: false,
    Ecommerce: false,
    Media: false,
    System: false,
  });

  const toggleExpand = (name) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Filter nav items based on role
  const filteredNavItems = navItems.filter(item => {
    if (item.role && user?.role !== item.role) return false;
    return true;
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#1e293b] text-slate-300 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 bg-[#0f172a] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">U</div>
            <span className="text-xl font-bold tracking-tight">UrbanAdmin</span>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredNavItems.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5 opacity-70 group-hover:text-indigo-400" />
                      {item.name}
                    </div>
                    {expanded[item.name] ? (
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    )}
                  </button>
                  {expanded[item.name] && (
                    <div className="mt-1 space-y-1 pl-11 pr-3">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.path}
                          className={({ isActive }) =>
                            cn(
                              "block px-3 py-2 text-sm font-medium rounded-lg transition-all",
                              isActive
                                ? "bg-indigo-600/10 text-indigo-400"
                                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                            )
                          }
                        >
                          {child.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all group",
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )
                  }
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 opacity-70",
                      "group-hover:text-indigo-400"
                    )}
                  />
                  {item.name}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a]/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 ring-2 ring-slate-800">
                        {user?.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{user?.role}</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>
      </aside>
    </>
  );
}
