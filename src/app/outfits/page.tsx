'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContent';
import { useRouter, usePathname } from 'next/navigation';
import WebAppHeader from '@/components/WebAppHeader';
import Link from 'next/link';
import { 
    // Icons for this page
    Sparkles,
    Send,
    ThumbsUp,
    Save,
    // Icons for standard nav/header
    Camera,
    Zap,
    User,
    LogOut,
    Bell,
} from 'lucide-react';

export default function OutfitsPage() {
    // --- HOOKS & STATE ---
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userInput, setUserInput] = useState('');

    // --- AUTHENTICATION EFFECT ---
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // --- HANDLERS ---
    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        // In a real app, you would add the user message to a state array
        // and send the input to your AI backend.
        console.log("User message sent:", userInput);
        setUserInput('');
    };

    // --- LOADING & AUTH CHECKS ---
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
        );
    }
    if (!user) return null;

    // --- RENDER ---
  return (
      <div className="min-h-screen bg-black text-white">
          
          <WebAppHeader
            user={user}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
            handleLogout={handleLogout}
          />

            {/* Main Chatbot Content */}
            <main className="container mx-auto px-6 py-8 flex-grow flex flex-col">
                <div className="bg-gray-800/50 border border-gray-700 rounded-3xl flex-grow flex flex-col">
                    {/* Chat Messages Area */}
                    <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                        {/* AI Welcome Message */}
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                                <Sparkles className="w-6 h-6 text-white"/>
                            </div>
                            <div className="bg-gray-700 rounded-2xl rounded-tl-none p-4 max-w-lg">
                                <p className="font-bold text-purple-300 mb-1">FitCheck AI</p>
                                <p className="text-gray-200">Hello! I'm your personal AI stylist. Show me an item from your wardrobe, or tell me about an occasion, and I'll create some outfits for you.</p>
                            </div>
                        </div>

                        {/* User Message Placeholder */}
                        <div className="flex items-start gap-3 justify-end">
                             <div className="bg-purple-600 rounded-2xl rounded-tr-none p-4 max-w-lg">
                                 <p className="text-white">Can you build an outfit around this shirt?</p>
                                <img src="https://i.postimg.cc/GhCSLCt4/UCLA-Bruins-script-svg.png" alt="User's shirt" className="mt-3 rounded-lg border-2 border-purple-400/50 w-32 h-32 object-contain bg-white p-2"/>
                            </div>
                             <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center shrink-0">
                                <User className="w-6 h-6 text-gray-300"/>
                            </div>
                        </div>
                        
                        {/* AI Response with Outfit Links */}
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                                <Sparkles className="w-6 h-6 text-white"/>
                            </div>
                            <div className="bg-gray-700 rounded-2xl rounded-tl-none p-4 max-w-2xl">
                                <p className="font-bold text-purple-300 mb-2">FitCheck AI</p>
                                <p className="text-gray-200 mb-4">Of course! Based on that shirt and today's weather in San Francisco, here are a few outfit ideas I've put together:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Outfit Card 1 */}
                                    <div className="bg-gray-600/50 border border-gray-500 rounded-xl overflow-hidden group">
                                        <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-700"></div>
                                        <div className="p-3">
                                            <h4 className="font-semibold text-white">Casual Campus Look</h4>
                                            <p className="text-sm text-gray-300 mt-1">Perfect for class or grabbing coffee. Pairs the shirt with dark jeans and white sneakers.</p>
                                            <div className="flex items-center justify-end gap-2 mt-3">
                                                <button className="p-2 rounded-full bg-gray-700 hover:bg-purple-500 transition-colors"><Save className="w-4 h-4 text-gray-300 group-hover:text-white"/></button>
                                                <button className="p-2 rounded-full bg-gray-700 hover:bg-purple-500 transition-colors"><ThumbsUp className="w-4 h-4 text-gray-300 group-hover:text-white"/></button>
                                            </div>
                                        </div>
                                    </div>
                                     {/* Outfit Card 2 */}
                                     <div className="bg-gray-600/50 border border-gray-500 rounded-xl overflow-hidden group">
                                        <div className="h-40 bg-gradient-to-br from-slate-500 to-slate-700"></div>
                                        <div className="p-3">
                                            <h4 className="font-semibold text-white">Smart-Casual Vibe</h4>
                                            <p className="text-sm text-gray-300 mt-1">Dress it up with khaki chinos and a light jacket for a versatile, sharp look.</p>
                                            <div className="flex items-center justify-end gap-2 mt-3">
                                                <button className="p-2 rounded-full bg-gray-700 hover:bg-purple-500 transition-colors"><Save className="w-4 h-4 text-gray-300 group-hover:text-white"/></button>
                                                <button className="p-2 rounded-full bg-gray-700 hover:bg-purple-500 transition-colors"><ThumbsUp className="w-4 h-4 text-gray-300 group-hover:text-white"/></button>
                                            </div>
                                        </div>
                                    </div>
                                     {/* Outfit Card 3 */}
                                     <div className="bg-gray-600/50 border border-gray-500 rounded-xl overflow-hidden group">
                                        <div className="h-40 bg-gradient-to-br from-cyan-500 to-teal-700"></div>
                                        <div className="p-3">
                                            <h4 className="font-semibold text-white">Weekend Outing</h4>
                                            <p className="text-sm text-gray-300 mt-1">Combine with light-wash shorts and sunglasses for a relaxed, sunny day.</p>
                                             <div className="flex items-center justify-end gap-2 mt-3">
                                                <button className="p-2 rounded-full bg-gray-700 hover:bg-purple-500 transition-colors"><Save className="w-4 h-4 text-gray-300 group-hover:text-white"/></button>
                                                <button className="p-2 rounded-full bg-gray-700 hover:bg-purple-500 transition-colors"><ThumbsUp className="w-4 h-4 text-gray-300 group-hover:text-white"/></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* Chat Input Area */}
                    <div className="p-4 border-t border-gray-700">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <input 
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask for an outfit for a 'beach party' or 'formal dinner'..."
                                className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors">
                                <Send className="w-5 h-5"/>
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}