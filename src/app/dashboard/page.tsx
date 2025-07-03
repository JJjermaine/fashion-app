// app/dashboard/page.tsx
'use client';

import { useAuth } from '../../contexts/AuthContent';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import WebAppHeader from '@/components/WebAppHeader';
import { useEffect, useState } from 'react';
// Removed Image import as it's no longer used directly in this file's render
import {
  Calendar,
  Camera,
  Sparkles,
  TrendingUp,
  User,
  Zap,
  Settings,
  LogOut
} from 'lucide-react';

const DashboardPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // defaultProfilePic is only needed if you render it directly here,
  // but WebAppHeader already handles fallback.
  // const defaultProfilePic = '/default-profile-pic.png'; 

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
  
  // Helper component for Quick Action cards
  const QuickActionCard = ({ icon: Icon, color, title, description, href }) => (
    <div 
      onClick={() => href && router.push(href)}
      className={`
        bg-gradient-to-br from-${color}-500/20 to-blue-500/20 border border-${color}-500/30 
        rounded-2xl p-6 hover:from-${color}-500/30 hover:to-blue-500/30 
        transition-all duration-300 cursor-pointer group
      `}
    >
      <Icon className={`w-12 h-12 text-${color}-400 mb-4 group-hover:scale-110 transition-transform duration-300`} />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );

  return (
      <div className="min-h-screen bg-black text-white">
          
          <WebAppHeader
            user={user}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
            handleLogout={handleLogout}
          />

      {/* Main Content - Now only shows Overview */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard icon={Camera} color="purple" title="Upload Items" description="Add new clothes to your wardrobe" href="/wardrobe"/>
            <QuickActionCard icon={Zap} color="pink" title="Generate Outfit" description="AI-powered outfit suggestions" href="/outfits"/>
            {/* This card now navigates to /wardrobe */}
            <QuickActionCard icon={Calendar} color="blue" title="Style Calendar" description="Plan your weekly outfits" href="/wardrobe"/>
            <QuickActionCard icon={TrendingUp} color="cyan" title="Trends" description="Discover latest fashion trends" href="/trends"/>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Outfit */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8">
                <h2 className="text-2xl font-bold">Today's Outfit</h2>
                <div className="mt-4 text-gray-400">
                  {/* Placeholder for today's outfit */}
                  <p>Your AI-generated outfit for today will appear here!</p>
                  <p className="mt-2 text-sm">You haven't generated an outfit yet or set your preferences. Go to "Generate Outfit" to get started.</p>
                </div>
              </div>
            </div>

            {/* Sidebar with Stats and Activity */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
                 <h3 className="text-xl font-bold mb-4">Your Stats</h3>
                 <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center justify-between">
                        <span className="flex items-center space-x-2"><Camera className="w-5 h-5 text-purple-300"/> <span>Wardrobe Items:</span></span>
                        <span className="font-semibold text-lg text-purple-200">0</span> {/* These would dynamically load from Firebase */}
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="flex items-center space-x-2"><Zap className="w-5 h-5 text-pink-300"/> <span>Outfits Generated:</span></span>
                        <span className="font-semibold text-lg text-pink-200">0</span> {/* These would dynamically load from Firebase */}
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="flex items-center space-x-2"><Sparkles className="w-5 h-5 text-cyan-300"/> <span>Style Points:</span></span>
                        <span className="font-semibold text-lg text-cyan-200">0</span> {/* These would dynamically load from Firebase */}
                    </li>
                 </ul>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
                 <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                 <ul className="space-y-3 text-gray-400 text-sm">
                    <li><span className="font-semibold text-gray-300">Today:</span> Signed up for FitCheck!</li>
                    <li><span className="font-semibold text-gray-300">Yesterday:</span> No activity.</li>
                    {/* More dynamic activity feed would go here */}
                 </ul>
                 <div className="mt-4 text-right">
                    <Link href="#" className="text-purple-400 hover:text-purple-300 text-sm">View All Activity</Link>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default DashboardPage;