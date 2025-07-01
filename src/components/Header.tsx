'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContent';
import Link from 'next/link';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md border-b border-purple-500/20' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <div className="absolute inset-0 w-8 h-8 bg-purple-400/20 rounded-full blur-md"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FitCheck
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
              How It Works
            </a>
            <a href="#showcase" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
              Showcase
            </a>
            
            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-white text-sm">{user.displayName || 'User'}</span>
                </button>
                
                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                      <p className="text-white font-semibold">{user.displayName || 'User'}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors duration-200">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
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
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-purple-500/20">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                How It Works
              </a>
              <a href="#showcase" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                Showcase
              </a>
              
              {/* Mobile Auth Section */}
              {user ? (
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{user.displayName || 'User'}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
                  <Link 
                    href="/login" 
                    className="text-center text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-center font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;