'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContent';
import { useRouter } from 'next/navigation';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Sun, 
  Cloud, 
  CloudRain,
  Snowflake,
  Edit,
  Trash2,
  Copy,
  Share2,
  Sparkles,
  ArrowLeft,
  Filter,
  Search,
  Grid3X3,
  List,
  Eye,
  Clock,
  MapPin,
  Thermometer
} from 'lucide-react';

const StyleCalendar = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showOutfitModal, setShowOutfitModal] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Mock data for scheduled outfits
  const scheduledOutfits = {
    '2024-07-01': {
      outfit: 'Business Meeting',
      weather: { temp: 72, condition: 'sunny', icon: Sun },
      event: 'Team Presentation',
      time: '09:00 AM',
      image: 'bg-gradient-to-br from-slate-600 to-slate-800'
    },
    '2024-07-03': {
      outfit: 'Casual Friday',
      weather: { temp: 68, condition: 'cloudy', icon: Cloud },
      event: 'Lunch with Sarah',
      time: '12:30 PM',
      image: 'bg-gradient-to-br from-blue-600 to-purple-800'
    },
    '2024-07-05': {
      outfit: 'Date Night',
      weather: { temp: 75, condition: 'clear', icon: Sun },
      event: 'Dinner Date',
      time: '07:00 PM',
      image: 'bg-gradient-to-br from-pink-600 to-red-800'
    },
    '2024-07-08': {
      outfit: 'Weekend Brunch',
      weather: { temp: 71, condition: 'partly cloudy', icon: Cloud },
      event: 'Brunch with Friends',
      time: '11:00 AM',
      image: 'bg-gradient-to-br from-green-600 to-teal-800'
    }
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const OutfitModal = () => {
    if (!showOutfitModal) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-3xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Plan Your Outfit</h3>
            <button 
              onClick={() => setShowOutfitModal(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={formatDateKey(selectedDate)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Occasion</label>
              <input
                type="text"
                placeholder="e.g., Work meeting, Date night, Casual hangout"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
              <input
                type="time"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Choose Outfit</label>
              <div className="grid grid-cols-2 gap-3">
                {['Business Casual', 'Smart Casual', 'Formal', 'Casual'].map((style) => (
                  <button
                    key={style}
                    className="p-3 bg-gray-700 hover:bg-purple-500 border border-gray-600 rounded-lg text-sm transition-colors duration-200"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button 
                onClick={() => setShowOutfitModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                Schedule Outfit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Style Calendar
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'month' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'week' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  Week
                </button>
              </div>
              
              <button 
                onClick={() => setShowOutfitModal(true)}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Plan Outfit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="xl:col-span-3">
            <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => navigateMonth(-1)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-2xl font-bold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button 
                    onClick={() => navigateMonth(1)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
                >
                  Today
                </button>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center py-3 text-gray-400 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {getCalendarDays().map((date, index) => {
                  const dateKey = formatDateKey(date);
                  const hasOutfit = scheduledOutfits[dateKey];
                  const isCurrentMonth = isSameMonth(date);
                  const isTodayDate = isToday(date);

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`relative p-3 h-32 border border-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${
                        isTodayDate ? 'bg-purple-500/20 border-purple-500' : 
                        isCurrentMonth ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-800/20'
                      } ${selectedDate.toDateString() === date.toDateString() ? 'ring-2 ring-purple-400' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        isCurrentMonth ? 'text-white' : 'text-gray-500'
                      } ${isTodayDate ? 'text-purple-300' : ''}`}>
                        {date.getDate()}
                      </div>

                      {hasOutfit && (
                        <div className="space-y-1">
                          <div className={`${hasOutfit.image} h-12 rounded-md relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute bottom-1 left-1 right-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <hasOutfit.weather.icon className="w-3 h-3 text-white" />
                                  <span className="text-xs text-white">{hasOutfit.weather.temp}°</span>
                                </div>
                                <div className="text-xs text-white bg-black/30 px-1 rounded">
                                  {hasOutfit.time}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 truncate">{hasOutfit.event}</div>
                        </div>
                      )}

                      {!hasOutfit && isCurrentMonth && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(date);
                            setShowOutfitModal(true);
                          }}
                          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-purple-500/10 transition-opacity duration-200"
                        >
                          <Plus className="w-6 h-6 text-purple-400" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Weather */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">Today's Weather</h3>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                  <Sun className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">72°F</div>
                  <div className="text-gray-400">Sunny</div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Feels like</span>
                  <span>75°F</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Humidity</span>
                  <span>45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Wind</span>
                  <span>8 mph</span>
                </div>
              </div>
            </div>

            {/* Upcoming Outfits */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">Upcoming Outfits</h3>
              <div className="space-y-3">
                {Object.entries(scheduledOutfits).slice(0, 3).map(([date, outfit]) => (
                  <div key={date} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-xl">
                    <div className={`w-12 h-12 ${outfit.image} rounded-lg`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{outfit.outfit}</div>
                      <div className="text-gray-400 text-xs">{outfit.event}</div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{outfit.time}</span>
                        <outfit.weather.icon className="w-3 h-3" />
                        <span>{outfit.weather.temp}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Style Stats */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Outfits Planned</span>
                  <span className="text-purple-400 font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Days Styled</span>
                  <span className="text-pink-400 font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Favorites Used</span>
                  <span className="text-cyan-400 font-semibold">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">New Combinations</span>
                  <span className="text-green-400 font-semibold">3</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors duration-200">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Generate Weekly Outfits</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors duration-200">
                  <Copy className="w-5 h-5 text-blue-400" />
                  <span>Copy Last Week</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors duration-200">
                  <Share2 className="w-5 h-5 text-green-400" />
                  <span>Share Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OutfitModal />
    </div>
  );
};

export default StyleCalendar;