'use client';

import { Sparkles, Twitter, Instagram, Github, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <div className="absolute inset-0 w-8 h-8 bg-purple-400/20 rounded-full blur-md"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FitCheck
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Your AI-powered style companion that transforms your wardrobe into a smart, personalized fashion assistant. 
              Never have a "nothing to wear" moment again.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-500 transition-all duration-300 transform group-hover:scale-110">
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
              </a>
              <a href="#" className="group">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-all duration-300 transform group-hover:scale-110">
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
              </a>
              <a href="#" className="group">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-600 transition-all duration-300 transform group-hover:scale-110">
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
              </a>
              <a href="#" className="group">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 transform group-hover:scale-110">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  AI Technology
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Mobile App
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  API Access
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Press Kit
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-xl font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get the latest fashion AI insights and style tips delivered to your inbox.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border border-gray-700 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-200 lg:w-80"
              />
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>&copy; 2025 FitCheck. All rights reserved.</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                Cookie Policy
              </a>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400" />
                <span>by the FitCheck team</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;