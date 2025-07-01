'use client';

import { useEffect, useRef } from 'react';
import { Sparkles, Calendar, Camera, Zap } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="opacity-0 translate-y-10 transition-all duration-1000 ease-out text-center lg:text-left" style={{ animation: 'fadeInUp 1s ease-out forwards' }}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">AI-Powered Mobile App</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                {" "}Perfect Fit{" "}
              </span>
              in Your Pocket
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl lg:max-w-none leading-relaxed">
              Upload your wardrobe, get AI-powered outfit suggestions, and never have a "nothing to wear" moment again. Your personal stylist, powered by AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                Download Free App
                <Zap className="inline-block w-5 h-5 ml-2 group-hover:animate-bounce" />
              </button>
              <button className="border-2 border-purple-500 text-purple-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* App Store Badges */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 transition-colors duration-200 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📱</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Download on the</p>
                    <p className="text-sm font-semibold text-white">App Store</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 transition-colors duration-200 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">▶</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Get it on</p>
                    <p className="text-sm font-semibold text-white">Google Play</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - iPhone Mockup */}
          <div className="flex justify-center lg:justify-end opacity-0 translate-x-10" style={{ animation: 'fadeInRight 1s ease-out 0.3s forwards' }}>
            <div className="relative">
              {/* iPhone Frame */}
              <div className="relative w-72 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                {/* Screen */}
                <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
                  
                  {/* App Content */}
                  <div className="h-full bg-gradient-to-b from-gray-900 to-black p-6 pt-12">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-white text-sm mb-8">
                      <span>9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 border border-white rounded-sm">
                          <div className="w-3 h-1 bg-white rounded-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          FitCheck
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">Your AI Style Assistant</p>
                    </div>

                    {/* Mock App Interface */}
                    <div className="space-y-4">
                      {/* Today's Outfit Card */}
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-semibold">Today's Outfit</span>
                          <Calendar className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-32 rounded-xl mb-3 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-white/70" />
                        </div>
                        <p className="text-gray-300 text-sm">Business Casual • 72°F</p>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                          <Camera className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                          <span className="text-white text-xs">Upload</span>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                          <Zap className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                          <span className="text-white text-xs">Generate</span>
                        </div>
                      </div>

                      {/* Recent Outfits */}
                      <div>
                        <h3 className="text-white font-semibold mb-3 text-sm">Recent Outfits</h3>
                        <div className="flex space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-16 h-16 bg-gradient-to-br ${
                              i === 1 ? 'from-blue-500 to-purple-500' :
                              i === 2 ? 'from-pink-500 to-red-500' :
                              'from-green-500 to-teal-500'
                            } rounded-xl`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Icons Below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
          <div className="group text-center">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105">
              <Camera className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">Smart Upload</h3>
              <p className="text-gray-400">AI recognizes and categorizes your clothing automatically</p>
            </div>
          </div>
          
          <div className="group text-center">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105">
              <Calendar className="w-12 h-12 text-pink-400 mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">Style Calendar</h3>
              <p className="text-gray-400">Track outfits and get personalized recommendations</p>
            </div>
          </div>
          
          <div className="group text-center">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">AI Styling</h3>
              <p className="text-gray-400">Get outfit suggestions based on weather and occasion</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;