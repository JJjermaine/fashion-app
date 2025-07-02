// components/WebAppHeader.tsx
import React from 'react';
import Link from 'next/link';
import { User as UserIcon, Settings, LogOut, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'; // Added ChevronDown/Up
import { User } from 'firebase/auth';
import Image from 'next/image';

interface WebAppHeaderProps {
  user: User | null;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  handleLogout: () => void;
}

const WebAppHeader: React.FC<WebAppHeaderProps> = ({ user, showProfileMenu, setShowProfileMenu, handleLogout }) => {
  const defaultProfilePic = '/default-profile-pic.png'; // Make sure this file exists in your /public folder

  return (
    <header className="bg-gray-900 border-b border-gray-700 py-4 px-6 flex items-center justify-between z-50 relative">
      <Link href="/dashboard" className="inline-flex items-center space-x-2">
        <div className="relative">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <div className="absolute inset-0 w-6 h-6 bg-purple-400/20 rounded-full blur-md"></div>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          FitCheck
        </span>
      </Link>

      <nav className="flex items-center space-x-4">
        {/* Main Navigation Links */}
        <Link href="/dashboard" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 hidden sm:block">
          Dashboard
        </Link>
        <Link href="/wardrobe" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 hidden sm:block">
          Wardrobe
        </Link>
        <Link href="/outfits" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 hidden sm:block">
          Outfits
        </Link>

        {user && (
          <div className="relative ml-4"> {/* Adjusted margin for spacing */}
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 text-white bg-gray-700/50 hover:bg-gray-700 rounded-full p-1 pr-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Toggle profile menu"
            >
              <Image
                src={user.photoURL || defaultProfilePic}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border border-purple-500"
                priority // Prioritize loading for header image
              />
              <span className="font-medium text-sm hidden md:block"> {/* Show name on medium/large screens */}
                {user.displayName || user.email?.split('@')[0]}
              </span>
              {showProfileMenu ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg py-2 z-20">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default WebAppHeader;