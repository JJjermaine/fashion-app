'use client';

import { useAuth } from '../../contexts/AuthContent';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import WebAppHeader from '@/components/WebAppHeader';
import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Camera, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Zap, 
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Heart,
  Share2,
  Filter,
  Grid3X3,
  List,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';

const DashboardPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
            {/* NEW: This card now navigates to /wardrobe */}
            <QuickActionCard icon={Calendar} color="blue" title="Style Calendar" description="Plan your weekly outfits" href="/wardrobe"/>
            <QuickActionCard icon={TrendingUp} color="cyan" title="Trends" description="Discover latest fashion trends" href="/trends"/>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Outfit */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8">
                <h2 className="text-2xl font-bold">Today's Outfit</h2>
                {/* ... rest of the Today's Outfit content ... */}
              </div>
            </div>

            {/* Sidebar with Stats and Activity */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
                 <h3 className="text-xl font-bold mb-4">Your Stats</h3>
                 {/* ... rest of the stats content ... */}
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
                 <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                 {/* ... rest of the activity content ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default DashboardPage;
