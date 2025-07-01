import Link from "next/link";
import Image from "next/image";
import ToggleNav from "../ToggleNav";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
        </div>
        

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image */}
            <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-600 dark:text-gray-300">
                JD
              </span>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                John Doe
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Fashion Enthusiast • Style Creator
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">156</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Outfits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">2.4k</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">89</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Following</p>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                Edit Profile
              </button>
              <Link
            href="/login"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </Link>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Email</label>
                <p className="text-gray-900 dark:text-white">john.doe@example.com</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Location</label>
                <p className="text-gray-900 dark:text-white">New York, NY</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Style Preferences</label>
                <p className="text-gray-900 dark:text-white">Casual, Streetwear, Minimalist</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Member Since</label>
                <p className="text-gray-900 dark:text-white">January 2024</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-gray-900 dark:text-white">Posted new outfit</p>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-gray-900 dark:text-white">Liked 5 outfits</p>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-gray-900 dark:text-white">Followed @styleguru</p>
                <span className="text-sm text-gray-500">3 days ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-gray-900 dark:text-white">Created event</p>
                <span className="text-sm text-gray-500">1 week ago</span>
              </div>
            </div>
          </div>
        </div>
        <ToggleNav leftHref="/home" rightHref="/profile" leftLabel="Home" rightLabel="Profile" />
      </div>
    </div>
  );
} 