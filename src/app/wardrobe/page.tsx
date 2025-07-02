"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContent';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Calendar, Camera, Sparkles, User, Zap, Plus,
    LogOut, Bell, Search
} from 'lucide-react';

// --- INITIAL MOCK DATA (Fallback) ---
const initialOutfits = [
    { id: 1, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-07-01" },
    { id: 2, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-07-04" },
    { id: 3, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-07-04" },
];

export default function WardrobePage() {
    // --- HOOKS ---
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [outfits, setOutfits] = useState(() => {
        if (typeof window === 'undefined') return initialOutfits;
        try {
            const savedOutfits = window.localStorage.getItem('userOutfits');
            return savedOutfits ? JSON.parse(savedOutfits) : initialOutfits;
        } catch (error) {
            console.error("Failed to parse outfits from localStorage", error);
            return initialOutfits;
        }
    });
    const outfitRefs = useRef(new Map());
    const fileInputRef = useRef < HTMLInputElement > (null);

    // --- EFFECTS ---
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem('userOutfits', JSON.stringify(outfits));
            } catch (error) {
                console.error("Failed to save outfits to localStorage", error);
            }
        }
    }, [outfits]);

    // --- DATA & LOGIC ---
    const outfitsByDate = useMemo(() => {
        const map = new Map();
        outfits.forEach(outfit => {
            map.set(outfit.uploadDate, (map.get(outfit.uploadDate) || 0) + 1);
        });
        return map;
    }, [outfits]);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const calendarDays = useMemo(() => {
        const days = [];
        // Add empty divs for days before the start of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-gray-700"></div>);
        }
        // Add divs for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const today = new Date();
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const outfitCount = outfitsByDate.get(dateStr);
            const isClickable = outfitCount > 0;

            days.push(
                <div
                    key={day}
                    onClick={isClickable ? () => handleDateClick(dateStr) : undefined}
                    className={`h-24 border border-gray-700 flex flex-col p-1 transition-colors duration-200 ${isToday ? 'bg-purple-600 text-white font-bold' : 'bg-gray-800/50 hover:bg-gray-700/80'} ${isClickable ? 'cursor-pointer' : ''}`}
                >
                    <span className="self-start text-gray-300">{day}</span>
                    {isClickable && (
                        <div className="mt-auto text-center text-xs bg-pink-500/30 border border-pink-500/50 text-pink-300 rounded-full px-2 py-1">
                            {outfitCount} {outfitCount > 1 ? 'outfits' : 'outfit'}
                        </div>
                    )}
                </div>
            );
        }
        return days;
    }, [currentDate, outfitsByDate, daysInMonth, firstDayOfMonth]);

    // --- HANDLERS ---
    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    const goToPreviousMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

    const handleDateClick = (dateStr) => {
        const targetOutfit = outfits.find(o => o.uploadDate === dateStr);
        if (targetOutfit) {
            const outfitElement = outfitRefs.current.get(targetOutfit.id);
            if (outfitElement) {
                outfitElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                outfitElement.style.transition = 'all 300ms ease';
                outfitElement.style.transform = 'scale(1.03)';
                outfitElement.style.boxShadow = '0 0 20px rgba(192, 132, 252, 0.7)';
                setTimeout(() => {
                    outfitElement.style.transform = '';
                    outfitElement.style.boxShadow = '';
                }, 1500);
            }
        }
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const today = new Date();
            const uploadDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            setOutfits(prevOutfits => [{ id: Date.now(), imageUrl, uploadDate }, ...prevOutfits]);
        }
    };
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // --- CONDITIONAL RETURNS ---
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-gray-800">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="flex items-center space-x-2">
                                <Sparkles className="w-8 h-8 text-purple-400" />
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    FitCheck
                                </span>
                            </Link>
                            <div className="hidden md:block">
                                <h1 className="text-2xl font-bold">
                                    Welcome back, {user.displayName?.split(' ')[0] || 'User'}! 👋
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                                <Bell className="w-5 h-5 text-gray-400" />
                            </button>
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
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl z-50">
                                        <div className="p-2">
                                            <Link href="/profile" className="w-full flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors duration-200">
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </Link>
                                            <button onClick={handleLogout} className="w-full flex items-center space-x-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors duration-200">
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
                                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap ${isActive
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

            {/* Main Content Area */}
            <main className="container mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row h-[calc(100vh-250px)] gap-6 animate-fade-in">
                    {/* Left Sidebar: Outfit List */}
                    <aside className="w-full lg:w-96 bg-gray-900/50 border border-gray-800 rounded-3xl shadow-2xl flex flex-col">
                        <div className="p-6 flex-grow flex flex-col min-h-0">
                            <h2 className="text-xl font-bold text-white mb-6 text-center shrink-0">My Items</h2>
                            <div className="flex-grow overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-600">
                                <div className="grid grid-cols-2 gap-6">
                                    {outfits.map((outfit) => (
                                        <div
                                            key={outfit.id}
                                            ref={(el) => { if (el) outfitRefs.current.set(outfit.id, el); else outfitRefs.current.delete(outfit.id); }}
                                            className="rounded-2xl overflow-hidden shadow-lg bg-gray-800/50 border border-gray-700 shrink-0"
                                        >
                                            <img src={outfit.imageUrl} alt={`Outfit ${outfit.id}`} className="w-full h-48 object-cover" />
                                            <div className="p-2"><p className="text-xs text-center text-gray-400">Uploaded: {outfit.uploadDate}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 shrink-0">
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                <button onClick={handleUploadClick} className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                                    Upload New Item
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Right Panel: Calendar */}
                    <section className="flex-1 overflow-y-auto bg-gray-900/50 border border-gray-800 rounded-3xl shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={goToPreviousMonth} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">&lt;</button>
                            <span className="text-lg font-semibold text-white">{monthNames[currentMonth]} {currentYear}</span>
                            <button onClick={goToNextMonth} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">&gt;</button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="h-10 flex items-center justify-center font-semibold text-gray-500 text-sm">{day}</div>)}
                            {calendarDays}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};