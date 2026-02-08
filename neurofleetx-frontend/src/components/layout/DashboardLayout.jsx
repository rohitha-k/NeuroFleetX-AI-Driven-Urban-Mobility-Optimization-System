import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Map as MapIcon,
    Car,
    Users,
    Settings,
    Menu,
    Bell,
    Search,
    LogOut,
    ClipboardCheck
} from 'lucide-react';


const DashboardLayout = ({ role = "ADMIN" }) => { // Default to ADMIN
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    // Define navigation items per role
    const roleNavItems = {
        ADMIN: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
            { icon: ClipboardCheck, label: 'Verification', path: '/admin/verification' },
            { icon: MapIcon, label: 'Live Map', path: '/admin/map' },
            { icon: Car, label: 'Vehicles', path: '/admin/vehicles' },
            { icon: Users, label: 'Drivers', path: '/admin/drivers' },
            { icon: Settings, label: 'Settings', path: '/admin/settings' },
        ],
        MANAGER: [
            { icon: LayoutDashboard, label: 'Overview', path: '/manager' },
            { icon: Car, label: 'Fleet Status', path: '/manager/fleet' },
            { icon: Settings, label: 'Maintenance', path: '/manager/maintenance' },
        ],
        DRIVER: [
            { icon: LayoutDashboard, label: 'My Route', path: '/driver' },
            { icon: MapIcon, label: 'History', path: '/driver/history' },
        ],
        CUSTOMER: [
            { icon: LayoutDashboard, label: 'Book Ride', path: '/customer' },
            { icon: MapIcon, label: 'My Trips', path: '/customer/trips' },
        ]
    };

    const navItems = roleNavItems[role] || roleNavItems["ADMIN"];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo */}
                <div className="h-20 flex items-center justify-center border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="font-bold text-lg">N</span>
                        </div>
                        {sidebarOpen && (
                            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                NeuroFleetX
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                            {isActive(item.path) && sidebarOpen && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-slate-700">
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="font-bold text-slate-300">
                                {localStorage.getItem('user_name') ? localStorage.getItem('user_name').substring(0, 2).toUpperCase() : 'US'}
                            </span>
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {localStorage.getItem('user_name') || 'User'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {localStorage.getItem('user_role') || 'Role'}
                                </p>
                            </div>
                        )}
                        {sidebarOpen && (
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = '/';
                                }}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {navItems.find(i => isActive(i.path))?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
                            />
                        </div>
                        <button className="p-2 rounded-full hover:bg-gray-100 relative text-gray-600">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
