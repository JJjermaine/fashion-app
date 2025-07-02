'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContent';
import { useRouter, usePathname } from 'next/navigation';
import WebAppHeader from '@/components/WebAppHeader';
import Link from 'next/link';
import { 
    // Icons for standard nav/header
    Sparkles,
    Camera,
    Zap,
    LogOut,
    Bell,
    // Icons for Profile Page content
    User, 
    Edit2,
    ShieldCheck,
    Palette,
    Shirt,
    Heart,
    Users,
    Trash2,
    ChevronRight,
    AtSign,
    Lock
} from 'lucide-react';

export default function ProfilePage() {
    // --- HOOKS & STATE ---
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // --- AUTHENTICATION EFFECT ---
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // --- HANDLERS ---
    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    const handleDeleteAccount = () => {
        alert("Delete account functionality is not yet implemented.");
    };

    // --- LOADING & AUTH CHECKS ---
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
        );
    }
    if (!user) return null;

    // --- RENDER ---
  return (
      <div className="min-h-screen bg-black text-white">
          
          <WebAppHeader
            user={user}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
            handleLogout={handleLogout}
          />

            {/* Main Profile Content */}
            <main className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Profile Header Card */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-5xl font-bold">
                                {user.displayName?.charAt(0) || 'U'}
                            </div>
                            <button className="absolute bottom-1 right-1 bg-gray-700 hover:bg-purple-600 p-2 rounded-full border-2 border-gray-800">
                                <Camera className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold">{user.displayName || 'Anonymous User'}</h1>
                            <p className="text-lg text-gray-400 mt-2">{user.email}</p>
                            <button className="mt-4 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4"/>
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                            <Shirt className="w-8 h-8 text-purple-400 mb-2"/>
                            <p className="text-2xl font-bold">78</p>
                            <p className="text-sm text-gray-400">Items</p>
                        </div>
                         <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                            <Sparkles className="w-8 h-8 text-pink-400 mb-2"/>
                            <p className="text-2xl font-bold">42</p>
                            <p className="text-sm text-gray-400">Outfits</p>
                        </div>
                         <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                            <Heart className="w-8 h-8 text-red-400 mb-2"/>
                            <p className="text-2xl font-bold">15</p>
                            <p className="text-sm text-gray-400">Favorites</p>
                        </div>
                         <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                            <Users className="w-8 h-8 text-cyan-400 mb-2"/>
                            <p className="text-2xl font-bold">120</p>
                            <p className="text-sm text-gray-400">Followers</p>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                        <div className="space-y-4">
                             <a href="#" className="flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <AtSign className="w-6 h-6 text-purple-400"/>
                                    <div>
                                        <p className="font-semibold">Email Address</p>
                                        <p className="text-sm text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-500"/>
                            </a>
                             <a href="#" className="flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <Lock className="w-6 h-6 text-purple-400"/>
                                    <div>
                                        <p className="font-semibold">Password</p>
                                        <p className="text-sm text-gray-400">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-500"/>
                            </a>
                              <a href="#" className="flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <Palette className="w-6 h-6 text-purple-400"/>
                                    <div>
                                        <p className="font-semibold">Style Preferences</p>
                                        <p className="text-sm text-gray-400">Edit your favorite styles and colors</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-500"/>
                            </a>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-700">
                             <h3 className="text-xl font-bold text-red-500 mb-4">Danger Zone</h3>
                             <div className="flex flex-col md:flex-row gap-4">
                                <button onClick={handleLogout} className="w-full md:w-auto flex-1 text-center bg-gray-700 hover:bg-gray-600 font-semibold py-3 px-4 rounded-lg transition-colors">
                                    Log Out
                                </button>
                                <button onClick={handleDeleteAccount} className="w-full md:w-auto flex-1 text-center bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 font-semibold py-3 px-4 rounded-lg transition-colors">
                                    Delete Account
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}