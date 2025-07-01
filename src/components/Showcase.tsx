'use client';

import { useEffect, useRef } from 'react';
import { Star, Heart, Share2, Calendar } from 'lucide-react';

const Showcase = () => {
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.showcase-item');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('animate-showcase-in');
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (showcaseRef.current) {
      observer.observe(showcaseRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const showcaseItems = [
    {
      id: 1,
      title: "Business Casual Perfection",
      occasion: "Work Meeting",
      likes: 142,
      shares: 23,
      image: "bg-gradient-to-br from-slate-600 to-slate-800",
      user: "Sarah M.",
      rating: 5
    },
    {
      id: 2,
      title: "Weekend Vibes",
      occasion: "Casual Brunch",
      likes: 89,
      shares: 12,
      image: "bg-gradient-to-br from-blue-600 to-purple-800",
      user: "Alex K.",
      rating: 5
    },
    {
      id: 3,
      title: "Date Night Ready",
      occasion: "Dinner Date",
      likes: 203,
      shares: 45,
      image: "bg-gradient-to-br from-pink-600 to-red-800",
      user: "Jamie L.",
      rating: 5
    },
    {
      id: 4,
      title: "Gym Session",
      occasion: "Workout",
      likes: 67,
      shares: 8,
      image: "bg-gradient-to-br from-green-600 to-teal-800",
      user: "Morgan T.",
      rating: 4
    },
    {
      id: 5,
      title: "Summer Festival",
      occasion: "Music Festival",
      likes: 156,
      shares: 34,
      image: "bg-gradient-to-br from-yellow-600 to-orange-800",
      user: "Riley P.",
      rating: 5
    },
    {
      id: 6,
      title: "Professional Edge",
      occasion: "Conference",
      likes: 91,
      shares: 19,
      image: "bg-gradient-to-br from-indigo-600 to-purple-800",
      user: "Casey R.",
      rating: 5
    }
  ];

  return (
    <section id="showcase" ref={showcaseRef} className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Style
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Showcase
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how our community is elevating their style with AI-powered outfit recommendations for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item, index) => (
            <div
              key={item.id}
              className="showcase-item opacity-0 translate-y-10 transition-all duration-700 ease-out group"
            >
              <div className="relative bg-gray-800/50 border border-gray-700 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                {/* Outfit Image */}
                <div className={`${item.image} h-64 relative flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white/80 text-sm font-medium">{item.occasion}</p>
                  </div>
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold group-hover:text-purple-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">Created by {item.user}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{item.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">{item.shares}</span>
                      </div>
                    </div>
                    <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200">
                      Try This Look
                    </button>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="group">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-4xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors duration-300">
                10K+
              </h3>
              <p className="text-gray-300">Outfits Created</p>
            </div>
          </div>
          <div className="group">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-4xl font-bold text-pink-400 mb-2 group-hover:text-pink-300 transition-colors duration-300">
                5K+
              </h3>
              <p className="text-gray-300">Active Users</p>
            </div>
          </div>
          <div className="group">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-4xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                98%
              </h3>
              <p className="text-gray-300">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes showcaseIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-showcase-in {
          animation: showcaseIn 0.7s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Showcase;