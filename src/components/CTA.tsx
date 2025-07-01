'use client';

import { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Mail } from 'lucide-react';

const CTA = () => {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-cta-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div 
          ref={ctaRef}
          className="opacity-0 translate-y-10 transition-all duration-1000 ease-out max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Join the Style Revolution</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to Transform
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              {" "}Your Wardrobe?
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of fashion enthusiasts who've already revolutionized their style with AI. 
            Start your journey to effortless, personalized fashion today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-full text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-3">
              <span>Download Free App</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <button className="group border-2 border-purple-500 text-purple-400 px-10 py-5 rounded-full text-xl font-bold hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center space-x-3">
              <Mail className="w-6 h-6" />
              <span>Get Early Access</span>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="group">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors duration-300">
                  Free
                </div>
                <p className="text-gray-300">Forever Plan Available</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-pink-400 mb-2 group-hover:text-pink-300 transition-colors duration-300">
                  30s
                </div>
                <p className="text-gray-300">Setup Time</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                  24/7
                </div>
                <p className="text-gray-300">AI Style Assistant</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ctaIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        
        .animate-cta-in {
          animation: ctaIn 1s ease-out forwards;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default CTA;