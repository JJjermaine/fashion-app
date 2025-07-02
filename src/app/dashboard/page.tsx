'use client';

import { useAuth } from '../../contexts/AuthContent';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  FitCheck
                </span>
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
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8 overflow-x-auto">
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
          </nav>
        </div>
      </div>

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
