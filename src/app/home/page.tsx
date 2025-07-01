"use client"; // <--- THE FIX IS HERE

import Link from "next/link";
import ToggleNav from "../ToggleNav";
import { useState, useMemo } from "react";

export default function Home() {
  // --- MOCK DATA ---
  const outfits = [
    { id: 1, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-07-01" },
    { id: 2, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-07-04" },
    { id: 3, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-07-04" },
    { id: 4, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-06-20" },
    { id: 5, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-06-18" },
    { id: 6, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-06-15" },
    { id: 7, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-06-15" },
    { id: 8, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-06-15" },
    { id: 9, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-08-08" },
    { id: 10, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2025-08-05" },
    { id: 11, imageUrl: "https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png", uploadDate: "2024-01-01" },
  ];

  // --- STATE MANAGEMENT ---
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- DATA PROCESSING ---
  const outfitsByDate = useMemo(() => {
    const map = new Map();
    outfits.forEach(outfit => {
      const date = outfit.uploadDate;
      map.set(date, (map.get(date) || 0) + 1);
    });
    return map;
  }, [outfits]);

  // --- CALENDAR LOGIC ---
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // --- NAVIGATION HANDLERS ---
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const handleMonthChange = (e) => {
    setCurrentDate(new Date(currentYear, parseInt(e.target.value), 1));
  };

  // --- DYNAMICALLY GENERATE CALENDAR DAYS ---
  const generateCalendarDays = () => {
    const calendarDays = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 dark:border-gray-700"></div>);
    }
  
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      const isToday = day === today.getDate() && currentMonth === today.getMonth();
      
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const outfitCount = outfitsByDate.get(dateStr);

      calendarDays.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 dark:border-gray-700 flex flex-col p-1 ${
            isToday 
              ? 'bg-blue-500 text-white font-bold' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <span className="self-start">{day}</span>
          {outfitCount > 0 && (
            <div className="mt-auto text-center text-xs rounded-full px-2 py-1">
              {outfitCount} {outfitCount > 1 ? 'outfits' : 'outfit'}
            </div>
          )}
        </div>
      );
    }
    return calendarDays;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const yearRange = Array.from({length: 11}, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 p-4 gap-4">
      {/* --- SIDEBAR (No changes here) --- */}
      <aside className="w-72 bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex flex-col">
        <div className="p-6 flex-grow flex flex-col min-h-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center shrink-0">
            My Outfits
          </h2>
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="flex flex-col gap-6">
              {outfits.map((outfit, index) => (
                <div key={`${outfit.id}-${index}`} className="rounded-2xl overflow-hidden shadow-lg bg-gray-50 dark:bg-gray-700/50 shrink-0">
                  <img src={outfit.imageUrl} alt={`Outfit ${outfit.id}`} className="w-full h-auto" />
                  <div className="p-2">
                    <p className="text-xs text-center text-gray-600 dark:text-gray-300">Uploaded: {outfit.uploadDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 shrink-0">
            <button className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
              Upload New Outfit
            </button>
          </div>
        </div>
      </aside>
      
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Fashion Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your style journey and upcoming events
            </p>
          </div>

          {/* --- MODIFIED CALENDAR SECTION --- */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <button onClick={goToPreviousMonth} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">&lt;</button>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{monthNames[currentMonth]} {currentYear}</span>
              <button onClick={goToNextMonth} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">&gt;</button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="h-10 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300 text-sm">
                  {day}
                </div>
              ))}
              {calendarDays}
            </div>
          </div>

          {/* --- QUICK STATS (No changes here) --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Outfits This Month
              </h3>
              <p className="text-3xl font-bold text-blue-600">24</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Events Coming Up
              </h3>
              <p className="text-3xl font-bold text-green-600">3</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Style Score
              </h3>
              <p className="text-3xl font-bold text-purple-600">8.5</p>
            </div>
          </div>
          <ToggleNav leftHref="/home" rightHref="/profile" leftLabel="Home" rightLabel="Profile" />
        </div>
      </main>
    </div>
  );
}
