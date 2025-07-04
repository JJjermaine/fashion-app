'use client';

import React, { useState, useEffect } from 'react';
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
    LayoutDashboard,
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudLightning,
    Wind
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

// --- NEW Weather Display Component ---
const WeatherDisplay = () => {
    const [weather, setWeather] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Map weather conditions to icons
    const weatherIcons: { [key: string]: React.ElementType } = {
        Clear: Sun,
        Clouds: Cloud,
        Rain: CloudRain,
        Drizzle: CloudRain,
        Thunderstorm: CloudLightning,
        Snow: CloudSnow,
        Default: Wind,
    };

    useEffect(() => {
        const fetchWeather = async (lat: number, lon: number) => {
            try {
                const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch weather');
                }
                const data = await response.json();
                setWeather(data);
                // Cache in session storage for 1 hour
                sessionStorage.setItem('weather_data', JSON.stringify({ ...data, timestamp: Date.now() }));
            } catch (err: any) {
                setError(err.message);
            }
        };

        const getLocation = () => {
            // Check for cached data first
            const cachedData = sessionStorage.getItem('weather_data');
            if (cachedData) {
                const { timestamp, ...data } = JSON.parse(cachedData);
                // Use cache if less than 1 hour old
                if (Date.now() - timestamp < 3600000) {
                    setWeather(data);
                    return;
                }
            }

            // Get user's location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchWeather(position.coords.latitude, position.coords.longitude);
                    },
                    () => {
                        setError('Location permission denied. Unable to fetch weather.');
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        };

        getLocation();
    }, []);

    if (error) {
        return <div className="text-xs text-red-400">{error}</div>;
    }

    if (!weather) {
        return <div className="text-sm text-gray-400">Loading weather...</div>;
    }
    
    const WeatherIcon = weatherIcons[weather.weather[0].main] || weatherIcons.Default;
    // Compose city/region string
    let locationString = weather.name || '';
    if (weather.sys && (weather.sys.state || weather.sys.country)) {
        locationString += ', ' + (weather.sys.state || weather.sys.country);
    }

    return (
        <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1.5 rounded-lg">
            <WeatherIcon className="w-5 h-5 text-yellow-400" />
            <span className="font-medium text-sm text-white">
                {Math.round(weather.main.temp)}°F
            </span>
            <span className="text-sm text-gray-300 hidden sm:block">
                {weather.weather[0].description}
            </span>
            {locationString && (
                <span className="text-sm text-gray-400 ml-2">{locationString}</span>
            )}
        </div>
    );
};

// --- Main WebAppHeader Component ---
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
                            {/* --- ADDED WEATHER DISPLAY --- */}
                            <WeatherDisplay />

                            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                                <Bell className="w-5 h-5 text-gray-400" />
                            </button>
                            
                            {/* Profile Menu */}
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
                                        <div className="p-4 border-b border-gray-700">
                                            <p className="font-semibold text-white truncate">{user.displayName || 'Anonymous User'}</p>
                                            <p className="text-sm text-gray-400 truncate">{user.email}</p>
                                        </div>
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