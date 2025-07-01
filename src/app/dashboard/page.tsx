'use client';

import { useAuth } from '../../contexts/AuthContent';
import { useRouter } from 'next/navigation';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
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

  const mockOutfits = [
    { id: 1, name: "Business Meeting", date: "Today", image: "bg-gradient-to-br from-slate-600 to-slate-800", likes: 12 },
    { id: 2, name: "Casual Friday", date: "Yesterday", image: "bg-gradient-to-br from-blue-600 to-purple-800", likes: 8 },
    { id: 3, name: "Date Night", date: "2 days ago", image: "bg-gradient-to-br from-pink-600 to-red-800", likes: 24 },
    { id: 4, name: "Weekend Brunch", date: "3 days ago", image: "bg-gradient-to-br from-green-600 to-teal-800", likes: 15 },
  ];

  const TabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 cursor-pointer group">
                <Camera className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-2">Upload Items</h3>
                <p className="text-gray-400 text-sm">Add new clothes to your wardrobe</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-2xl p-6 hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer group">
                <Zap className="w-12 h-12 text-pink-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-2">Generate Outfit</h3>
                <p className="text-gray-400 text-sm">AI-powered outfit suggestions</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 cursor-pointer group">
                <Calendar className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-2">Style Calendar</h3>
                <p className="text-gray-400 text-sm">Plan your weekly outfits</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 rounded-2xl p-6 hover:from-cyan-500/30 hover:to-teal-500/30 transition-all duration-300 cursor-pointer group">
                <TrendingUp className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-2">Trends</h3>
                <p className="text-gray-400 text-sm">Discover latest fashion trends</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Outfit */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Today's Outfit</h2>
                    <button className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium">
                      Regenerate
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-64 rounded-2xl mb-6 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-white/70 mx-auto mb-4" />
                      <p className="text-white/70 text-lg">No outfit generated yet</p>
                      <button className="mt-4 bg-white/20 text-white px-6 py-2 rounded-full hover:bg-white/30 transition-colors duration-200">
                        Generate Outfit
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300">Weather: 72°F, Sunny</p>
                      <p className="text-gray-400 text-sm">Perfect for business casual</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                        <Heart className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                        <Share2 className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Stats */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-4">Your Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Wardrobe Items</span>
                      <span className="text-purple-400 font-semibold">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Outfits Created</span>
                      <span className="text-pink-400 font-semibold">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Days Styled</span>
                      <span className="text-cyan-400 font-semibold">15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Likes Received</span>
                      <span className="text-green-400 font-semibold">156</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <p className="text-gray-300 text-sm">Created "Business Meeting" outfit</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <p className="text-gray-300 text-sm">Added 3 new items to wardrobe</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <p className="text-gray-300 text-sm">Received 12 likes on outfit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'wardrobe':
        return (
          <div className="space-y-6">
            {/* Wardrobe Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">My Wardrobe</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                <button className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  <Plus className="w-5 h-5" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {['All', 'Tops', 'Bottoms', 'Shoes', 'Accessories'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Wardrobe Items */}
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Your wardrobe is empty</h3>
              <p className="text-gray-500 mb-6">Start by uploading your first clothing item to get personalized outfit suggestions.</p>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                Upload Your First Item
              </button>
            </div>
          </div>
        );

      case 'outfits':
        return (
          <div className="space-y-6">
            {/* Outfits Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">My Outfits</h2>
              <button className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                <Plus className="w-5 h-5" />
                <span>Create Outfit</span>
              </button>
            </div>

            {/* Outfits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockOutfits.map((outfit) => (
                <div key={outfit.id} className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group">
                  <div className={`${outfit.image} h-48 relative`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors duration-200">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                        {outfit.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-400">{outfit.likes}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{outfit.date}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200">
                        Wear Again
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-purple-500 hover:bg-purple-600 rounded-full text-white transition-colors duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{user.displayName || 'User'}</h2>
                  <p className="text-gray-400 mb-4">{user.email}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">47</div>
                      <div className="text-sm text-gray-400">Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-pink-400">23</div>
                      <div className="text-sm text-gray-400">Outfits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-cyan-400">156</div>
                      <div className="text-sm text-gray-400">Likes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.displayName || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors duration-200 opacity-60"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors duration-200 h-24 resize-none"
                      placeholder="Tell us about your style..."
                    />
                  </div>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Style Preferences */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6">Style Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Style</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors duration-200">
                      <option value="">Select your style</option>
                      <option value="casual">Casual</option>
                      <option value="business">Business</option>
                      <option value="formal">Formal</option>
                      <option value="streetwear">Streetwear</option>
                      <option value="bohemian">Bohemian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Favorite Colors</label>
                    <div className="flex flex-wrap gap-2">
                      {['Black', 'White', 'Navy', 'Gray', 'Purple', 'Pink'].map((color) => (
                        <button
                          key={color}
                          className="px-3 py-2 bg-gray-700 hover:bg-purple-500 border border-gray-600 rounded-lg text-sm transition-colors duration-200"
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Size Information</label>
                    <div className="grid grid-cols-2 gap-4">
                      <select className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors duration-200">
                        <option value="">Top Size</option>
                        <option value="xs">XS</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                      </select>
                      <select className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors duration-200">
                        <option value="">Bottom Size</option>
                        <option value="xs">XS</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                      </select>
                    </div>
                  </div>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-6">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Privacy Settings</h4>
                    <p className="text-gray-400 text-sm">Manage who can see your profile and outfits</p>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
                    Manage
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Notifications</h4>
                    <p className="text-gray-400 text-sm">Control your notification preferences</p>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
                    Configure
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-red-400">Delete Account</h4>
                    <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                  </div>
                  <button className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
                    <div className="p-4 border-b border-gray-700">
                      <p className="font-semibold text-white">{user.displayName || 'User'}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setActiveTab('profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors duration-200"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button className="w-full flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors duration-200">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <hr className="my-2 border-gray-700" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors duration-200"
                      >
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
              { id: 'overview', label: 'Overview', icon: Sparkles },
              { id: 'wardrobe', label: 'Wardrobe', icon: Camera },
              { id: 'outfits', label: 'Outfits', icon: Zap },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-400 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <TabContent />
      </div>
    </div>
  );
};

export default DashboardPage;