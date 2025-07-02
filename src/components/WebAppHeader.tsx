'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Sparkles, 
    Search, 
    Bell, 
    User, 
    LogOut,
    Camera,
    Zap,
    Home,
    LayoutDashboard
} from 'lucide-react';

// Define the type for the user object for clarity
interface User {
    displayName?: string | null;
    email?: string | null;
}

// Define the props the component will accept
interface WebAppHeaderProps {
    user: User | null;
    showProfileMenu: boolean;
    setShowProfileMenu: (show: boolean) => void;
    handleLogout: () => void;
}

const WebAppHeader: React.FC<WebAppHeaderProps> = ({ user, showProfileMenu, setShowProfileMenu, handleLogout }) => {
    const pathname = usePathname();

    if (!user) {
        return null;
    }

    const closeMenu = () => {
        setShowProfileMenu(false);
    }

    return (
        <>
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-gray-800">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        {/* --- Restored Simple Logo Link --- */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-8 h-8 text-purple-400" />
                                <Link href="/dashboard">
                                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        FitCheck
                                    </span>
                                </Link>
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-2xl font-bold">
                                    Welcome back, {user.displayName?.split(' ')[0] || 'User'}! 👋
                                </h1>
                            </div>
                        </div>
                        
                        {/* Header Actions */}
                        <div className="flex items-center space-x-4">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-200 w-64"
                                />
                            </div>
                            
                            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                                <Bell className="w-5 h-5 text-gray-400" />
                            </button>
                            
                            {/* --- Updated Profile Menu --- */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center space-x-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-semibold">
                                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                                    </div>
                                </button>
                                
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-60 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                                        {/* User Info Header */}
                                        <div className="p-4 border-b border-gray-700">
                                            <p className="font-semibold text-white truncate">{user.displayName || 'Anonymous User'}</p>
                                            <p className="text-sm text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        {/* Navigation Links */}
                                        <div className="p-2 space-y-1">
                                            <Link href="/" onClick={closeMenu} className="w-full flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors duration-200">
                                                <Home className="w-4 h-4" />
                                                <span>Home</span>
                                            </Link>
                                            <Link href="/dashboard" onClick={closeMenu} className="w-full flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors duration-200">
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span>Dashboard</span>
                                            </Link>
                                            <Link href="/profile" onClick={closeMenu} className="w-full flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors duration-200">
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </div>
                                        {/* Logout Button */}
                                        <div className="p-2 border-t border-gray-700">
                                            <button onClick={handleLogout} className="w-full flex items-center space-x-3 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors duration-200">
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="border-b border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="flex space-x-8 overflow-x-auto">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: Sparkles, href: '/dashboard' },
                            { id: 'wardrobe', label: 'Wardrobe', icon: Camera, href: '/wardrobe' },
                            { id: 'outfits', label: 'Outfits', icon: Zap, href: '/outfits' },
                            { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = pathname.startsWith(tab.href);
                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                                        isActive
                                            ? 'border-purple-400 text-purple-400'
                                            : 'border-transparent text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default WebAppHeader;