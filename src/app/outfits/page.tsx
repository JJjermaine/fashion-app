'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContent';
import { useRouter } from 'next/navigation';
import WebAppHeader from '@/components/WebAppHeader'; // Re-imported the header
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Send, Sparkles, User, MessageSquarePlus, Menu, X, ArrowUp, Compass, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- DEFINE TYPES ---
interface Message {
    role: 'user' | 'model';
    content: string;
}

interface Chat {
    id: string;
    title: string;
    messages: Message[];
}

// --- INITIALIZE GEMINI API ---
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
if (!API_KEY) {
    console.warn("Gemini API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.");
}
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite-preview-06-17",
    systemInstruction: `You are FitCheck AI, a specialist fashion stylist. Your goal is to provide users with visual outfit inspiration.

    RULES:
    - ALWAYS respond with markdown.
    - NEVER write long paragraphs of conversational text or advice.
    - Your entire response should be a list of 1-3 distinct outfit ideas.
    - For EACH outfit, you MUST provide the following for each clothing item (e.g., Top, Bottoms, Shoes, Accessory):
      1. Browse the internet and display the image with its supporting link
      2. The item name and a brief description.
      3. A "Shop" link pointing to an example retail page.
    
    Structure each outfit under a "###" markdown heading. Do not say "hello" or "of course!". Only provide the outfits.`,
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ],
});

const initialMessage: Message = {
    role: 'model',
    content: "Hello! How can I help you today?",
};


// --- GREETING COMPONENT FOR EMPTY CHATS ---
const Greeting = ({ userName, onPromptClick }: { userName: string, onPromptClick: (prompt: string) => void }) => {
    const examplePrompts = [
        { icon: <Compass size={24} />, text: "Suggest a casual outfit for a sunny day in the park" },
        { icon: <ArrowUp size={24} />, text: "How can I style a black blazer for a formal event?" },
        { icon: <Code size={24} />, text: "What are the key fashion trends for this fall?" },
    ];
    
    return (
        <div className="flex flex-col items-start justify-center h-full p-4 md:p-8">
            <h1 className="text-4xl md:text-5xl font-medium bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-8">
                Hello, {userName}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {examplePrompts.map((prompt, i) => (
                    <button key={i} onClick={() => onPromptClick(prompt.text)} className="bg-gray-800 hover:bg-gray-700/80 p-4 rounded-xl text-left transition-colors duration-200 h-full">
                        <div className="text-purple-400 mb-2">{prompt.icon}</div>
                        <p className="text-gray-300 text-sm">{prompt.text}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function OutfitsPage() {
    // --- HOOKS & STATE ---
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    // -- UI State --
    const [showProfileMenu, setShowProfileMenu] = useState(false); // State for WebAppHeader
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    // -- Chat State --
    const [userInput, setUserInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [allChats, setAllChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    // -- Derived State --
    const activeChat = useMemo(() => allChats.find(c => c.id === activeChatId), [allChats, activeChatId]);

    // --- AUTO-SCROLL EFFECT ---
    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [activeChat?.messages]);


    // --- CHAT PERSISTENCE & MANAGEMENT ---
    const handleNewChat = () => {
        const firstChat = allChats[0];
        if (firstChat && firstChat.messages.length === 1) {
            setActiveChatId(firstChat.id);
            return;
        }

        const newChatId = `chat_${Date.now()}`;
        const newChat: Chat = { id: newChatId, title: 'New Chat', messages: [initialMessage] };
        setAllChats(prev => [newChat, ...prev]);
        setActiveChatId(newChatId);
    };

    useEffect(() => {
        if (user) {
            try {
                const savedData = localStorage.getItem(`geminiCloneChats_${user.uid}`);
                if (savedData) {
                    const { chats, currentChatId } = JSON.parse(savedData);
                    if (chats?.length > 0) {
                        setAllChats(chats);
                        setActiveChatId(currentChatId);
                        return;
                    }
                }
            } catch (error) { console.error("Failed to load chats:", error); }
            handleNewChat();
        }
    }, [user]);

    useEffect(() => {
        if (user && allChats.length > 0 && activeChatId) {
            try {
                const dataToSave = JSON.stringify({ chats: allChats, currentChatId: activeChatId });
                localStorage.setItem(`geminiCloneChats_${user.uid}`, dataToSave);
            } catch (error) { console.error("Failed to save chats:", error); }
        }
    }, [allChats, activeChatId, user]);


    // --- AUTHENTICATION & LOGOUT ---
    useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);
    const handleLogout = async () => {
        try {
            await logout();
            if (user) localStorage.removeItem(`geminiCloneChats_${user.uid}`);
            router.push('/');
        } catch (error) { console.error('Logout error:', error); }
    };
    
    // --- SEND MESSAGE HANDLER ---
    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isGenerating || !activeChatId) return;

        const userMessage: Message = { role: 'user', content: messageText };
        setIsGenerating(true);
        setUserInput('');

        setAllChats(prevChats => {
            const isNewChat = prevChats.find(c => c.id === activeChatId)?.messages.length === 1;
            const updatedChats = prevChats.map(chat =>
                chat.id === activeChatId
                    ? { ...chat, title: isNewChat ? messageText.substring(0, 40) : chat.title, messages: [...chat.messages, userMessage] }
                    : chat
            );
            const activeChatIndex = updatedChats.findIndex(c => c.id === activeChatId);
            const activeChatItem = updatedChats.splice(activeChatIndex, 1)[0];
            return [activeChatItem, ...updatedChats];
        });

        const historyForAPI = activeChat?.messages.slice(1).map(msg => ({ role: msg.role, parts: [{ text: msg.content }] })) || [];
        const chatSession = model.startChat({ history: historyForAPI });

        try {
            const result = await chatSession.sendMessage(messageText);
            const text = result.response.text();
            const aiMessage: Message = { role: 'model', content: text };
            setAllChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, aiMessage] } : c));
        } catch (error) {
            const errorMessage: Message = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
            setAllChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, errorMessage] } : c));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage(userInput);
    };
    
    const handlePromptClick = (prompt: string) => {
        setUserInput(prompt);
    };

    // --- RENDER ---
    if (loading) {
        return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div></div>;
    }
    if (!user) return null;

    return (
        <div className="h-screen w-screen bg-gray-950 text-gray-200 flex flex-col">
            {/* ## Re-integrated WebAppHeader ## */}
            <WebAppHeader
                user={user}
                showProfileMenu={showProfileMenu}
                setShowProfileMenu={setShowProfileMenu}
                handleLogout={handleLogout}
            />

            {/* Container for the sidebar and main content */}
            <div className="flex flex-1 overflow-hidden">
                {/* --- SIDEBAR --- */}
                <aside className={`bg-gray-900 flex-shrink-0 flex flex-col transition-all duration-300 ${isMenuOpen ? 'w-64' : 'w-0'}`}>
                    <div className="p-2 flex justify-between items-center h-14 border-b border-gray-700/50">
                        <button onClick={handleNewChat} className="p-2 ml-2 hover:bg-gray-700 rounded-full"><MessageSquarePlus size={20} /></button>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 mr-2 hover:bg-gray-700 rounded-full"><X size={20} /></button>
                    </div>
                    <nav className="flex-grow overflow-y-auto p-2">
                        <p className="px-4 pt-4 pb-2 text-xs text-gray-500 font-medium">Recent</p>
                        {allChats.map(chat => (
                            <a key={chat.id} onClick={() => setActiveChatId(chat.id)} className={`block px-4 py-2 text-sm truncate cursor-pointer rounded-full ${activeChatId === chat.id ? 'bg-gray-700/80 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                                {chat.title}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 flex flex-col h-full">
                     <div className="flex-shrink-0 flex items-center h-14 px-4 border-b border-gray-800">
                        {!isMenuOpen && <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-gray-700 rounded-full mr-2"><Menu size={20} /></button>}
                        <h2 className="text-lg">{activeChat?.title}</h2>
                     </div>

                    <div className="flex-1 overflow-y-auto pb-4" ref={chatContainerRef}>
                        <div className="max-w-4xl mx-auto px-4">
                            {activeChat && activeChat.messages.length > 1 ? (
                                activeChat.messages.slice(1).map((message, index) => (
                                   <div key={index} className={`py-6 flex gap-4 ${message.role === 'model' ? 'pr-12' : 'pl-12'}`}>
                                       <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.role === 'model' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-600'}`}>
                                           {message.role === 'model' ? <Sparkles size={16} /> : <User size={16} />}
                                       </div>
                                       <div className="flex-1 pt-1">
                                           <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                                               h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
                                               h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3" {...props} />,
                                               code: ({node, inline, className, children, ...props}) => {
                                                   const match = /language-(\w+)/.exec(className || '')
                                                   return !inline ? (
                                                     <pre className="bg-gray-900 rounded-md p-4 my-4 overflow-x-auto"><code className={`language-${match?.[1]}`} {...props}>{children}</code></pre>
                                                   ) : (
                                                     <code className="bg-gray-700 text-purple-300 rounded px-1.5 py-1" {...props}>{children}</code>
                                                   )
                                                 }
                                           }}>
                                               {message.content}
                                           </ReactMarkdown>
                                       </div>
                                   </div>
                               ))
                            ) : (
                                <Greeting userName={user.displayName || 'there'} onPromptClick={handlePromptClick} />
                            )}
                        </div>
                    </div>

                     <div className="flex-shrink-0 px-4 pb-4">
                        <div className="max-w-4xl mx-auto">
                            <form onSubmit={handleFormSubmit} className="bg-gray-800 rounded-2xl flex items-center p-2 shadow-lg">
                                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Message FitCheck AI..." className="flex-grow bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none" disabled={isGenerating} />
                                <button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white font-semibold p-3 rounded-full transition-colors disabled:bg-gray-600/50 disabled:cursor-not-allowed" disabled={isGenerating || !userInput.trim()}><ArrowUp className="w-5 h-5"/></button>
                            </form>
                        </div>
                     </div>
                </main>
            </div>
        </div>
    );
}