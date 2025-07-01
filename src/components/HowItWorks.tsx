'use client';

import { useEffect, useRef } from 'react';
import { Upload, Zap, Calendar, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const steps = entry.target.querySelectorAll('.step-card');
            steps.forEach((step, index) => {
              setTimeout(() => {
                step.classList.add('animate-step-in');
              }, index * 300);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Wardrobe",
      description: "Take photos of your clothing items and let our AI automatically categorize and tag them by color, style, and season.",
      color: "from-purple-500 to-blue-500"
    },
    {
      number: "02",
      icon: Zap,
      title: "AI Learns Your Style",
      description: "Our machine learning algorithms analyze your preferences, past outfits, and styling patterns to understand your unique taste.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "03",
      icon: Calendar,
      title: "Get Daily Suggestions",
      description: "Receive personalized outfit recommendations based on your calendar, weather, and trending styles that match your aesthetic.",
      color: "from-cyan-500 to-purple-500"
    },
    {
      number: "04",
      icon: Sparkles,
      title: "Elevate Your Style",
      description: "Discover new combinations, track your favorite looks, and continuously improve your style with AI-powered insights.",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}FitCheck{" "}
            </span>
            Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Four simple steps to transform your wardrobe into a smart, AI-powered styling assistant that knows exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-card opacity-0 translate-x-10 transition-all duration-800 ease-out group"
            >
              <div className="relative bg-gray-800/30 border border-gray-700/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Step Number */}
                <div className="flex items-start space-x-6 relative z-10">
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300`}>
                    {step.number}
                  </div>
                  
                  <div className="flex-1">
                    {/* Icon */}
                    <div className="mb-4">
                      <step.icon className={`w-8 h-8 bg-gradient-to-r ${step.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-300 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connection Line for Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-6 top-1/2 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                )}

                {/* Animated Border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
            Start Building Your Smart Wardrobe
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes stepIn {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-step-in {
          animation: stepIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;