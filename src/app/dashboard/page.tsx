// app/dashboard/page.tsx
'use client';
import { useAuth } from '../../contexts/AuthContent';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WebAppHeader from '@/components/WebAppHeader';
import { useEffect, useState, useRef } from 'react';
import {
  Calendar,
  Camera,
  Sparkles,
  TrendingUp,
  Zap,
  Newspaper, // Added for the news section
} from 'lucide-react';

// Define a type for individual news articles
interface Article {
  title: string;
  url: string;
  urlToImage?: string;
  description?: string;
  publishedAt?: string;
  source: {
    name: string;
  };
}

interface QuickActionCardProps {
  icon: React.ComponentType;
  color: string;
  title: string;
  description: string;
  href: string;
}

// Client-side cache for news data
const newsCache = {
  data: null as Article[] | null,
  timestamp: 0,
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
};

const DashboardPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [fashionNews, setFashionNews] = useState<Article[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch fashion news from the new API route with caching
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Check if we have valid cached data
        const now = Date.now();
        if (newsCache.data && (now - newsCache.timestamp) < newsCache.CACHE_DURATION) {
          console.log('Using cached news data');
          setFashionNews(newsCache.data);
          setNewsLoading(false);
          return;
        }

        setNewsLoading(true);
        console.log('Fetching fresh news data');
        
        const response = await fetch('/api/news', {
          // Add cache headers to prevent unnecessary requests
          headers: {
            'Cache-Control': 'max-age=1800', // 30 minutes
          },
        });
        
        const data = await response.json();
        
        if (data.articles) {
          // Update cache
          newsCache.data = data.articles;
          newsCache.timestamp = now;
          
          setFashionNews(data.articles);
          setLastFetchTime(new Date());
        }
      } catch (error) {
        console.error('Failed to fetch fashion news:', error);
        
        // If we have stale cache data, use it as fallback
        if (newsCache.data) {
          console.log('Using stale cached data due to fetch error');
          setFashionNews(newsCache.data);
        }
      } finally {
        setNewsLoading(false);
      }
    };

    // Only fetch on initial mount or if user changes
    if (isInitialMount.current && user) {
      fetchNews();
      isInitialMount.current = false;
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const QuickActionCard = ({ icon: Icon, color, title, description, href }: QuickActionCardProps) => (
    <div
      onClick={() => href && router.push(href)}
      className={`
        bg-gradient-to-br from-${color}-500/10 to-gray-900/20 border border-white/10
        rounded-2xl p-6 hover:from-${color}-500/20 hover:border-white/20
        transition-all duration-300 cursor-pointer group backdrop-blur-sm
      `}
    >
      <Icon className={`w-10 h-10 text-${color}-400 mb-4 group-hover:scale-110 transition-transform duration-300`} />
      <h3 className="text-lg font-semibold mb-1 text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );

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

  return (
    <div className="min-h-screen bg-black text-white">
      <WebAppHeader
        user={user}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        handleLogout={handleLogout}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard icon={Camera} color="purple" title="Upload Items" description="Add new clothes to your wardrobe" href="/wardrobe" />
            <QuickActionCard icon={Zap} color="pink" title="Generate Outfit" description="AI-powered outfit suggestions" href="/outfits" />
            <QuickActionCard icon={Calendar} color="blue" title="Style Calendar" description="Plan your weekly outfits" href="/wardrobe" />
            <QuickActionCard icon={TrendingUp} color="cyan" title="Trends" description="Discover latest fashion trends" href="/trends" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Outfit & Stats */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white">Today's Outfit</h2>
                <div className="mt-4 text-gray-400">
                  <p>Your AI-generated outfit for today will appear here!</p>
                  <p className="mt-2 text-sm">Go to "Generate Outfit" to get started.</p>
                </div>
              </div>

              {/* Fashion News Section */}
              <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Newspaper className="w-8 h-8 text-teal-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">Latest Fashion News</h2>
                  </div>
                  {lastFetchTime && (
                    <p className="text-xs text-gray-500">
                      Last updated: {lastFetchTime.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                {newsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400 mr-3"></div>
                    <p className="text-gray-400">Fetching the latest trends...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fashionNews.slice(0, 6).map((article, index) => (
                      <article key={index} className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
                        {article.urlToImage && (
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={article.urlToImage} 
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>
                        )}
                        <div className="p-4">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-teal-300 transition-colors duration-300 font-semibold line-clamp-2"
                          >
                            {article.title}
                          </a>
                          {article.description && (
                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                              {article.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-gray-500">{article.source.name}</p>
                            {article.publishedAt && (
                              <p className="text-xs text-gray-500">
                                {new Date(article.publishedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar with Stats */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Your Stats</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center space-x-2"><Camera className="w-5 h-5 text-purple-300" /> <span>Wardrobe Items:</span></span>
                    <span className="font-semibold text-lg text-purple-200">0</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center space-x-2"><Zap className="w-5 h-5 text-pink-300" /> <span>Outfits Generated:</span></span>
                    <span className="font-semibold text-lg text-pink-200">0</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center space-x-2"><Sparkles className="w-5 h-5 text-cyan-300" /> <span>Style Points:</span></span>
                    <span className="font-semibold text-lg text-cyan-200">0</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Recent Activity</h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li><span className="font-semibold text-gray-300">Today:</span> Signed up for FitCheck!</li>
                  <li><span className="font-semibold text-gray-300">Yesterday:</span> No activity.</li>
                </ul>
                <div className="mt-4 text-right">
                  <Link href="#" className="text-purple-400 hover:text-purple-300 text-sm">View All</Link>
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