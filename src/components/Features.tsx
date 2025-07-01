'use client';

import { useEffect, useRef } from 'react';
import { Brain, Palette, TrendingUp, Cloud, Users, Zap } from 'lucide-react';

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll('.feature-card');
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('animate-slide-in');
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Our machine learning algorithms analyze your style preferences and suggest outfits that match your unique taste.",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: Palette,
      title: "Smart Color Matching",
      description: "Advanced color detection ensures your outfits are perfectly coordinated based on color theory and your skin tone.",
      gradient: "from-pink-500 to-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "Stay ahead of fashion trends with real-time analysis from social media, runways, and street style.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Cloud,
      title: "Weather Integration",
      description: "Get outfit suggestions tailored to the weather conditions and temperature in your location.",
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Style Community",
      description: "Connect with friends, share your fits, and get inspiration from a community of fashion enthusiasts.",
      gradient: "from-teal-500 to-green-500"
    },
    {
      icon: Zap,
      title: "Instant Outfit Generation",
      description: "Generate complete outfit combinations in seconds based on your wardrobe and the occasion.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="features" ref={featuresRef} className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Smart Styling
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of fashion with our AI-powered wardrobe assistant that learns your style and elevates your everyday looks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card opacity-0 translate-y-10 transition-all duration-700 ease-out group"
            >
              <div className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-500`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.7s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Features;