"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from '../../contexts/AuthContent';
import { useRouter } from 'next/navigation';
import WebAppHeader from '@/components/WebAppHeader';
import DatePicker from "react-datepicker"; // Import DatePicker

import "react-datepicker/dist/react-datepicker.css"; // Import styles

// Define the Outfit type
interface Outfit {
    id: string;
    uid: string;
    email: string;
    itemName: string;
    cloudinaryUrl: string;
    imageUrl: string;
    uploadDate?: string;
    location?: string;
    createdAt?: any;
}

// ~---~ Modal for Viewing an Item ~---~
const ViewItemModal = ({ outfit, onClose, onDelete }: { outfit: Outfit | null, onClose: () => void, onDelete: (id: string) => void }) => {
    if (!outfit) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-gray-900 rounded-lg max-w-3xl w-full shadow-2xl border border-gray-700 overflow-hidden max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-center items-center overflow-auto max-h-[70vh]">
                    <img src={outfit.imageUrl} alt={outfit.itemName} className="max-w-full max-h-[70vh] w-auto h-auto mx-auto block" />
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">{outfit.itemName}</h2>
                    <div className="text-gray-300 space-y-2">
                        <p><strong>Date:</strong> {outfit.uploadDate}</p>
                        <p><strong>Location:</strong> {outfit.location || 'N/A'}</p>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <button onClick={onClose} className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                            Close
                        </button>
                        <button onClick={() => outfit.id && onDelete(outfit.id)} className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ~---~ Modal for Adding a New Item ~---~
const AddItemModal = ({ isOpen, onClose, initialDate, user, fetchOutfits }: { isOpen: boolean, onClose: () => void, initialDate: Date | null, user: any, fetchOutfits: () => void }) => {
    const [title, setTitle] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
    const [location, setLocation] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Update internal state when the initialDate prop changes
        setSelectedDate(initialDate);
        // Reset other fields
        setTitle('');
        setLocation('');
        setFile(null);
        setPreviewUrl(null);
    }, [initialDate]);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [file]);

    if (!isOpen || !initialDate) return null;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (file && title && user && selectedDate) {
            try {
                // Get signature from server for Cloudinary
                const signResponse = await fetch('/api/sign-cloudinary-params', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({}),
                });                
                const { signature, timestamp } = await signResponse.json();
                const formData = new FormData();
                formData.append('file', file);
                formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
                formData.append('timestamp', timestamp);
                formData.append('signature', signature);
                const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST', body: formData,
                });
                const data = await uploadResponse.json();
                console.log("Cloudinary upload response:", data);
                if (!data.secure_url) throw new Error('Image upload failed.');

                await addDoc(collection(db, "fits"), {
                    uid: user.uid,
                    email: user.email,
                    itemName: title,
                    location,
                    cloudinaryUrl: data.secure_url,
                    uploadDate: selectedDate.toISOString().slice(0, 10),
                    createdAt: new Date(),
                });

                fetchOutfits();
                onClose();
            } catch (error) {
                console.error("Error uploading new item: ", error);
            }
        } else {
            alert("Please provide a title and select a file.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md shadow-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Add Item</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Input Event Title..." className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}
                            className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg"
                            dateFormat="MMM d, yyyy"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Location (Optional)</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Input Event Location..." className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg" />
                    </div>
                     <div className="mb-6">
                     {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="mx-auto mb-4 max-h-40 rounded-lg border border-gray-700 object-contain" />
                        )}
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-700 transition-all duration-300">
                            Upload Image
                        </button>
                        <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" accept="image/*" />
                        {file && <p className="text-center text-gray-400 mt-2 text-sm">Selected: {file.name}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

// ~---~ Main Wardrobe Page Component ~---~
const WardrobePage = () => {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // State for modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);
    const [viewingOutfit, setViewingOutfit] = useState<Outfit | null>(null);

    const fetchOutfits = async () => {
        if (user) {
            const q = query(collection(db, "fits"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const userOutfits = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Outfit, 'id' | 'imageUrl'>),
            }));
            // Sort by date (newest first)
            const sortedOutfits = userOutfits
                .map(o => ({ ...o, imageUrl: o.cloudinaryUrl }))
                .sort((a, b) => {
                    if (!a.uploadDate || !b.uploadDate) return 0;
                    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
                });
            setOutfits(sortedOutfits);
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else {
            fetchOutfits();
        }
    }, [user, loading, router]);
    
    const outfitsByDate = useMemo(() => {
        const map = new Map<string, number>();
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

    const handleAddClick = (day: number) => {
        const date = new Date(currentYear, currentMonth, day);
        setSelectedDateForModal(date);
        setIsAddModalOpen(true);
    };
    
    const handleOutfitClick = (outfit: Outfit) => {
        setViewingOutfit(outfit);
    };

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-gray-700"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const outfitCount = outfitsByDate.get(dateStr);
            
            days.push(
                <div
                    key={day}
                    onClick={() => handleAddClick(day)}
                    className="h-24 border border-gray-700 flex flex-col p-1 transition-colors duration-200 relative group cursor-pointer"
                >
                    <span className="self-start text-gray-300">{day}</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">+</span>
                    </div>

                    {outfitCount && (
                         <div
                            onClick={(e) => {
                                e.stopPropagation(); // Prevents opening the 'add' modal
                                // Potentially scroll to the first item of the day, if desired
                            }}
                            className="absolute bottom-1 left-1 right-1 text-center text-xs bg-pink-500/30 border border-pink-500/50 text-pink-300 rounded-full px-2 py-1 z-10"
                         >
                            {outfitCount} {outfitCount > 1 ? 'outfits' : 'outfit'}
                        </div>
                    )}
                </div>
            );
        }
        return days;
    }, [currentDate, outfitsByDate]);

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "fits", id));
            setViewingOutfit(null);
            fetchOutfits();
        } catch (error) {
            alert("Failed to delete item.");
        }
    };

    // ... (rest of the component logic: handleLogout, loading/user checks) 
    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white">
            <WebAppHeader user={user} showProfileMenu={showProfileMenu} setShowProfileMenu={setShowProfileMenu} handleLogout={() => { /* ... */ }} />
            <main className="container mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row h-[calc(100vh-250px)] gap-6">
                    <aside className="w-full lg:w-96 bg-gray-900/50 border border-gray-800 rounded-3xl shadow-2xl flex flex-col">
                        <div className="p-6 flex-grow flex flex-col min-h-0">
                            <h2 className="text-xl font-bold text-white mb-6 text-center shrink-0">My Outfits</h2>
                            <div className="flex-grow overflow-y-auto pr-2">
                                <div className="grid grid-cols-2 gap-6">
                                    {outfits.map((outfit) => (
                                        <div
                                            key={outfit.id}
                                            onClick={() => handleOutfitClick(outfit)}
                                            className="rounded-2xl overflow-hidden shadow-lg bg-gray-800/50 border border-gray-700 shrink-0 cursor-pointer group"
                                        >
                                            <img src={outfit.imageUrl} alt={outfit.itemName} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                                            <div className="p-2"><p className="text-xs text-center text-gray-400">{outfit.itemName}</p></div>
                                        </div>
                                    ))}
                                </div>
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
            {/* Modal Components */}
            <AddItemModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                initialDate={selectedDateForModal}
                user={user}
                fetchOutfits={fetchOutfits}
            />
            <ViewItemModal
                outfit={viewingOutfit}
                onClose={() => setViewingOutfit(null)}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default WardrobePage;