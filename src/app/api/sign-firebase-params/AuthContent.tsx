// contexts/AuthContent.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc as firestoreUpdateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // <-- Add Storage imports
import { auth, db, storage } from '@/lib/firebase'; // <-- Import storage

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  uploadImage: (file: File, path: string) => Promise<string>; // Modified to accept a path
  deleteImage: (url: string) => Promise<void>; // New function to delete images from Storage
  updateUserProfile: (displayName: string | null, photoURL: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName });

      await setDoc(doc(db, 'users', newUser.uid), {
        name: displayName,
        email: email,
        wardrobeItems: 0,
        outfitsCreated: 0,
        stylePoints: 0,
        notificationsEnabled: false,
        preferredStyle: 'casual',
        profilePicture: newUser.photoURL || '',
      });

      setUser(newUser);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const googleUser = userCredential.user;

      const userRef = doc(db, 'users', googleUser.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: googleUser.displayName || '',
          email: googleUser.email || '',
          wardrobeItems: 0,
          outfitsCreated: 0,
          stylePoints: 0,
          notificationsEnabled: false,
          preferredStyle: 'casual',
          profilePicture: googleUser.photoURL || '',
        });
      }

      setUser(googleUser);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Uploads an image to Firebase Storage.
   * @param file The File object to upload.
   * @param path The path in Firebase Storage (e.g., `users/user_id/profile.jpg`, `wardrobe/item_id/image.png`).
   * @returns A promise that resolves with the download URL of the uploaded image.
   */
  const uploadImage = async (file: File, path: string): Promise<string> => {
    if (!user) {
      throw new Error('You must be logged in to upload images.');
    }
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image to Firebase Storage:', error);
      throw new Error(`Firebase Storage upload failed: ${error.message}`);
    }
  };

  /**
   * Deletes an image from Firebase Storage using its download URL.
   * @param url The download URL of the image to delete.
   */
  const deleteImage = async (url: string): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to delete images.');
    }
    if (!url || url.startsWith('/default-profile-pic.png')) { // Prevent deleting default placeholder
        console.warn('Attempted to delete a null/empty URL or default placeholder. Skipping deletion.');
        return;
    }
    try {
      const storageRef = ref(storage, url); // ref from URL works if it's a standard Firebase Storage URL
      await deleteObject(storageRef);
      console.log('Image deleted from Firebase Storage:', url);
    } catch (error: any) {
      console.error('Error deleting image from Firebase Storage:', error);
      // Don't throw a critical error if deletion fails (e.g., file not found, no permission)
      // as the main operation (e.g., updating profile) might still succeed.
      // You might want to handle specific error codes here.
    }
  };

  const updateUserProfile = async (displayName: string | null, photoURL: string | null) => {
    if (!user) {
      throw new Error('No user logged in.');
    }
    try {
      // Update Firebase Authentication profile
      await updateProfile(user, {
        displayName: displayName !== null ? displayName : user.displayName,
        photoURL: photoURL !== null ? photoURL : user.photoURL,
      });

      // Update Firestore user document
      await firestoreUpdateDoc(doc(db, 'users', user.uid), {
        name: displayName !== null ? displayName : user.displayName,
        profilePicture: photoURL !== null ? photoURL : user.photoURL,
      });

      // Force context user update (important for immediate UI reflection)
      setUser({ ...user, displayName, photoURL });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle,
    uploadImage, // Now uses Firebase Storage
    deleteImage, // New delete function
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};