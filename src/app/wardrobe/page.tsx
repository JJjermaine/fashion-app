"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from '../api/sign-firebase-params/AuthContent';
import { useRouter } from 'next/navigation';
import WebAppHeader from '@/components/WebAppHeader';

const WardrobePage = () => {
    const { user, loading, logout, uploadImage } = useAuth();
    const router = useRouter();
    const [outfits, setOutfits] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const outfitRefs = useRef(new Map());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [itemName, setItemName] = useState('');

    const fetchOutfits = async () => {
        if (user) {
            const q = query(collection(db, "fits"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const userOutfits = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOutfits(userOutfits.map(o => ({ ...o, imageUrl: o.cloudinaryUrl })));
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else {
            fetchOutfits();
        }
    }, [user, loading, router]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && itemName) {
            try {
                // Get signature from server
                const response = await fetch('/api/sign-cloudinary-params', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });
                const { signature, timestamp } = await response.json();

                const formData = new FormData();
                formData.append('file', file);
                formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
                formData.append('timestamp', timestamp);
                formData.append('signature', signature);

                const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await uploadResponse.json();
                const cloudinaryUrl = data.secure_url;

                if (!cloudinaryUrl) {
                    throw new Error('Image upload failed, no secure_url found in response.');
                }
                
                await uploadImage(cloudinaryUrl, itemName);
                fetchOutfits(); 
                setItemName('');
            } catch (error) {
                console.error("Error uploading image: ", error);
            }
        }
    };

    const outfitsByDate = useMemo(() => {
        const map = new Map();
        outfits.forEach(outfit => {
            if (outfit.uploadDate) {
                map.set(outfit.uploadDate, (map.get(outfit.uploadDate) || 0) + 1);
            }
        });
        return map;
    }, [outfits]);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-gray-700"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const outfitCount = outfitsByDate.get(dateStr);
            const isClickable = outfitCount > 0;
            days.push(
                <div
                    key={day}
                    onClick={isClickable ? () => handleDateClick(dateStr) : undefined}
                    className={`h-24 border border-gray-700 flex flex-col p-1 transition-colors duration-200 ${isClickable ? 'cursor-pointer' : ''}`}
                >
                    <span className="self-start text-gray-300">{day}</span>
                    {isClickable && (
                        <div className="mt-auto text-center text-xs bg-pink-500/30 border border-pink-500/50 text-pink-300 rounded-full px-2 py-1">
                            {outfitCount} {outfitCount > 1 ? 'outfits' : 'outfit'}
                        </div>
                    )}
                </div>
            );
        }
        return days;
    }, [currentDate, outfitsByDate]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleDateClick = (dateStr: any) => {
        const targetOutfit = outfits.find(o => o.uploadDate === dateStr);
        if (targetOutfit) {
            const outfitElement = outfitRefs.current.get(targetOutfit.id);
            if (outfitElement) {
                outfitElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };
    
    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white">
            <WebAppHeader
                user={user}
                showProfileMenu={showProfileMenu}
                setShowProfileMenu={setShowProfileMenu}
                handleLogout={handleLogout}
            />
            <main className="container mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row h-[calc(100vh-250px)] gap-6">
                    <aside className="w-full lg:w-96 bg-gray-900/50 border border-gray-800 rounded-3xl shadow-2xl flex flex-col">
                        <div className="p-6 flex-grow flex flex-col min-h-0">
                            <h2 className="text-xl font-bold text-white mb-6 text-center shrink-0">My Items</h2>
                            <div className="flex-grow overflow-y-auto pr-2">
                                <div className="grid grid-cols-2 gap-6">
                                    {outfits.map((outfit) => (
                                        <div
                                            key={outfit.id}
                                            ref={(el) => { if (el) outfitRefs.current.set(outfit.id, el); }}
                                            className="rounded-2xl overflow-hidden shadow-lg bg-gray-800/50 border border-gray-700 shrink-0"
                                        >
                                            <img src={outfit.imageUrl} alt={`Outfit ${outfit.id}`} className="w-full h-48 object-.cover" />
                                            <div className="p-2"><p className="text-xs text-center text-gray-400">{outfit.itemName}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 shrink-0">
                                <input 
                                    type="text" 
                                    value={itemName} 
                                    onChange={(e) => setItemName(e.target.value)} 
                                    placeholder="Item Name" 
                                    className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg mb-4"
                                />
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                                    Upload New Item
                                </button>
                            </div>
                        </div>
                    </aside>
                    <section className="flex-1 overflow-y-auto bg-gray-900/50 border border-gray-800 rounded-3xl shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">&lt;</button>
                            <span className="text-lg font-semibold text-white">{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</span>
                            <button onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">&gt;</button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="h-10 flex items-center justify-center font-semibold text-gray-500 text-sm">{day}</div>)}
                            {calendarDays}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default WardrobePage;
