'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContent';
import { useRouter } from 'next/navigation';
import WebAppHeader from '@/components/WebAppHeader';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Send, Sparkles, User, MessageSquarePlus, Menu, X, ArrowUp, Save, ThumbsUp, Compass, Code, ImageOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- DEFINE TYPES ---
interface Message {
    role: 'user' | 'model';
    content: string;
}

interface OutfitCardData {
    title: string;
    description: string;
    image: string; // The URL for the outfit image
    link: string;  // The URL to the webpage for the outfit
}

interface Chat {
    id: string;
    title: string;
    messages: Message[];
}

// --- INITIALIZE GEMINI API & CUSTOM SEARCH ---
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const CUSTOM_SEARCH_API_KEY = process.env.NEXT_PUBLIC_CUSTOM_SEARCH_API_KEY || "";
const SEARCH_ENGINE_ID = process.env.NEXT_PUBLIC_SEARCH_ENGINE_ID || "";

if (!API_KEY) {
    console.warn("Gemini API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.");
}
if (!CUSTOM_SEARCH_API_KEY || !SEARCH_ENGINE_ID) {
    console.warn("Google Custom Search API Key or Search Engine ID is missing. Please set them in your .env.local file for image search to work.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite-preview-06-17",
    systemInstruction: `You are FitCheck AI, a visual fashion stylist. You will be given a prompt from a user looking for fashion advice. Your entire response MUST be a single, valid JSON object and nothing else. Do not include the \`\`\`json markdown wrapper.

When the user asks for a specific brand (e.g., "Nike", "Adidas"), you MUST include that brand in the 'title' and 'searchQuery'.

The JSON object must follow this exact structure:
{
  "comment": "A brief, one-sentence conversational comment to display above the cards.",
  "outfits": [
    {
      "title": "A short, catchy title for the outfit card.",
      "searchQuery": "A highly specific and detailed query for Google Image Search to find a product photo. ALWAYS include brand (if provided by user), gender, color, and item type. For example: 'Nike men's grey Dri-FIT training shorts'."
    }
  ]
}
Generate 2-3 outfit objects in the array.`,
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ],
});

const initialMessage: Message = {
    role: 'model',
    content: "Hello! How can I help you today?",
};

// --- WEB SEARCH FUNCTION ---
const searchForOutfitImage = async (query: string): Promise<{ link: string; image: string } | null> => {
    if (!CUSTOM_SEARCH_API_KEY || !SEARCH_ENGINE_ID) {
        console.error("Google Custom Search credentials are not configured.");
        return null;
    }
    const url = `https://www.googleapis.com/customsearch/v1?key=${CUSTOM_SEARCH_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=1&safe=active`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Google Search API error: ${response.statusText}`);
            return null;
        }
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const firstResult = data.items[0];
            return {
                link: firstResult.image.contextLink,
                image: firstResult.link,
            };
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch from Google Custom Search API:", error);
        return null;
    }
};


// --- OUTFIT CARD COMPONENT ---
const OutfitCard = ({ card }: { card: OutfitCardData }) => {
    return (
        <a href={card.link} target="_blank" rel="noopener noreferrer" className="bg-gray-800/60 border border-gray-700 rounded-xl overflow-hidden group flex flex-col hover:border-purple-500 transition-all duration-300">
            <div className="h-48 w-full overflow-hidden bg-gray-700 flex items-center justify-center">
                {card.image ? (
                    <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).parentElement?.classList.add('hidden'); }}
                    />
                ) : (
                    <div className="text-gray-500"><ImageOff size={40} /></div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h4 className="font-semibold text-white">{card.title}</h4>
                <p className="text-sm text-gray-300 mt-1 flex-grow">{card.description}</p>
                <div className="flex items-center justify-end gap-2 mt-3">
                    <button onClick={(e) => { e.preventDefault(); alert('Save feature coming soon!'); }} className="p-2 rounded-full bg-gray-700 hover:bg-purple-500 transition-colors"><Save className="w-4 h-4 text-gray-300 group-hover:text-white"/></button>
                    <button onClick={(e) => { e.preventDefault(); alert('Like feature coming soon!'); }} className="p-2 rounded-full bg-gray-700 hover:bg-purple-500 transition-colors"><ThumbsUp className="w-4 h-4 text-gray-300 group-hover:text-white"/></button>
                </div>
            </div>
        </a>
    );
};

// --- RENDER COMPONENT FOR EACH MODEL MESSAGE ---
const ModelMessage = ({ message }: { message: Message }) => {
    try {
        const parsed = JSON.parse(message.content);
        // Check if the parsed content is a valid outfit object
        if (parsed.outfits && Array.isArray(parsed.outfits)) {
            return (
                <div className="flex-1 pt-1">
                    <p className="mb-4">{parsed.comment}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {parsed.outfits.map((outfit: OutfitCardData, i: number) => (
                            <OutfitCard key={i} card={outfit} />
                        ))}
                    </div>
                </div>
            );
        }
    } catch (e) {
        // Not a JSON object, or not the right structure. Fallback to plain text.
    }

    // Fallback for simple text messages like "Hello!"
    return (
        <div className="flex-1 pt-1 prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
            </ReactMarkdown>
        </div>
    );
};


// --- GREETING COMPONENT ---
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
            <p className="text-xl text-gray-400 mb-12">How can I help you style your look today?</p>
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
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const initLoaded = useRef(false);
    
    // -- UI State --
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    // -- Chat State --
    const [userInput, setUserInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [allChats, setAllChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const activeChat = useMemo(() => allChats.find(c => c.id === activeChatId), [allChats, activeChatId]);
    
    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [activeChat?.messages]);

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
        if (user && !initLoaded.current) {
            initLoaded.current = true;
            
            let loadedChats: Chat[] = [];
            let loadedActiveId: string | null = null;

            try {
                const savedData = localStorage.getItem(`geminiCloneChats_${user.uid}`);
                if (savedData) {
                    const { chats, currentChatId } = JSON.parse(savedData);
                    if (chats?.length > 0) {
                        loadedChats = chats;
                        loadedActiveId = currentChatId;
                    }
                }
            } catch (error) { 
                console.error("Failed to load or parse chats:", error);
                localStorage.removeItem(`geminiCloneChats_${user.uid}`);
            }

            if (loadedChats.length === 0) {
                const newChatId = `chat_${Date.now()}`;
                const newChat: Chat = { id: newChatId, title: 'New Chat', messages: [initialMessage] };
                loadedChats = [newChat];
                loadedActiveId = newChatId;
            }

            setAllChats(loadedChats);
            setActiveChatId(loadedActiveId);
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


    useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);
    const handleLogout = async () => {
        try {
            await logout();
            if (user) localStorage.removeItem(`geminiCloneChats_${user.uid}`);
            router.push('/');
        } catch (error) { console.error('Logout error:', error); }
    };
    
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
            if (activeChatIndex === -1) return updatedChats;
            const activeChatItem = updatedChats.splice(activeChatIndex, 1)[0];
            return [activeChatItem, ...updatedChats];
        });
    
        const historyForAPI = activeChat?.messages.slice(1).map(msg => ({ role: msg.role, parts: [{ text: msg.content }] })) || [];
        const chatSession = model.startChat({ history: historyForAPI });
    
        try {
            const result = await chatSession.sendMessage(messageText);
            const text = result.response.text();
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(text);
            } catch (e) {
                console.error("Invalid JSON from AI:", text);
                throw new Error("Invalid JSON response from AI");
            }
    
            if (parsedResponse.outfits && Array.isArray(parsedResponse.outfits)) {
                const outfitsWithImages = await Promise.all(
                    parsedResponse.outfits.map(async (outfit: Omit<OutfitCardData, 'image' | 'link'> & { searchQuery: string }) => {
                        const searchResult = await searchForOutfitImage(outfit.searchQuery);
                        return {
                            title: outfit.title,
                            description: outfit.description,
                            image: searchResult?.image || "", 
                            link: searchResult?.link || '#',
                        };
                    })
                );
                parsedResponse.outfits = outfitsWithImages;
            }
    
            const aiMessage: Message = { role: 'model', content: JSON.stringify(parsedResponse) };
            setAllChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, aiMessage] } : c));
    
        } catch (error) {
            console.error("Error during message generation or image search:", error);
            const errorMessage: Message = { role: 'model', content: "{\"comment\": \"Sorry, I ran into an error. Please try again.\", \"outfits\": []}" };
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
        sendMessage(prompt);
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div></div>;
    }
    if (!user) return null;

    // --- RENDER JSX ---
    return (
        <div className="h-screen w-screen bg-gray-950 text-gray-200 flex flex-col">
            <WebAppHeader user={user} showProfileMenu={showProfileMenu} setShowProfileMenu={setShowProfileMenu} handleLogout={handleLogout} />
            <div className="flex flex-1 overflow-hidden">
                <aside className={`fixed top-15 left-0 z-40 w-80 h-[calc(100vh-3.5rem)] bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-2 flex justify-between items-center h-14 border-b border-gray-700/50">
                        <button onClick={handleNewChat} className="p-2 ml-2 hover:bg-gray-700 rounded-full"><MessageSquarePlus size={20} /></button>
                        {isMenuOpen && (
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 mr-2 hover:bg-gray-700 rounded-full"><X size={20} /></button>
                        )}
                    </div>
                    <nav className="flex-grow overflow-y-auto p-2">
                        <p className="px-4 pt-4 pb-2 text-xs text-gray-500 font-medium">Recent</p>
                        {allChats.map((chat) => (
                            <a 
                                key={chat.id} 
                                onClick={() => setActiveChatId(chat.id)} 
                                className={`block px-4 py-2 text-sm truncate cursor-pointer rounded-full ${activeChatId === chat.id ? 'bg-gray-700/80 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                            >
                                {chat.title}
                            </a>
                        ))}
                    </nav>
                </aside>
                
                <main className={`flex-1 flex flex-col transition-all duration-300 ${isMenuOpen ? 'ml-80' : 'ml-0'}`}>
                    <div className="flex-shrink-0 flex items-center h-14 px-4 border-b border-gray-800">
                        {!isMenuOpen && <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-gray-700 rounded-full mr-2"><Menu size={20} /></button>}
                    </div>

                    <div className="flex-1 overflow-y-auto pb-4" ref={chatContainerRef}>
                        <div className="max-w-4xl mx-auto px-4 h-full">
                            {activeChat && activeChat.messages.length > 1 ? (
                                activeChat.messages.slice(1).map((message, index) => (
                                    <div key={`${activeChat.id}-msg-${index}`}>
                                        {message.role === 'user' && (
                                            <div className="py-6 flex gap-4 pl-12">
                                                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-600"><User size={16} /></div>
                                                <div className="flex-1 pt-1">{message.content}</div>
                                            </div>
                                        )}
                                        {message.role === 'model' && (
                                            <div className="py-6 flex gap-4 pr-12">
                                                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500"><Sparkles size={16} /></div>
                                                <ModelMessage message={message} />
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <Greeting userName={user.displayName || 'there'} onPromptClick={handlePromptClick} />
                            )}
                            {isGenerating && <div className="text-center py-4 text-sm text-gray-400">AI is thinking...</div>}
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