// app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../api/sign-firebase-params/AuthContent';
import { useRouter } from 'next/navigation';
import WebAppHeader from '@/components/WebAppHeader';
import {
  Bell,
  Sparkles,
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  User as UserIcon,
  Camera,
  Mail,
  Key,
  Trash2,
  List,
  LayoutDashboard,
  Palette,
} from 'lucide-react';
import { doc, getDoc, updateDoc as firestoreUpdateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // Ensure auth is imported for sendPasswordResetEmail
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import Image from 'next/image';

interface UserSettings {
  notificationsEnabled: boolean;
  preferredStyle: string;
}

const DashboardSettingsPage = () => {
  const { user, loading, logout, uploadImage, deleteImage, updateUserProfile } = useAuth(); // Destructure deleteImage
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'appearance' | 'notifications' | 'account'>('profile');

  const [settings, setSettings] = useState<UserSettings>({
    notificationsEnabled: false,
    preferredStyle: 'casual',
  });
  const [originalSettings, setOriginalSettings] = useState<UserSettings>({ ...settings });

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [originalDisplayName, setOriginalDisplayName] = useState(user?.displayName || '');
  const [profilePicture, setProfilePicture] = useState(user?.photoURL || '/default-profile-pic.png');
  const [newProfilePictureFile, setNewProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setDisplayName(user.displayName || user.email?.split('@')[0] || '');
      setOriginalDisplayName(user.displayName || user.email?.split('@')[0] || '');
      setProfilePicture(user.photoURL || '/default-profile-pic.png');

      const fetchUserSettings = async () => {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const fetchedSettings: UserSettings = {
            notificationsEnabled: userData.notificationsEnabled ?? false,
            preferredStyle: userData.preferredStyle ?? 'casual',
          };
          setSettings(fetchedSettings);
          setOriginalSettings({ ...fetchedSettings });
          
          setDisplayName(userData.name || user.displayName || '');
          setOriginalDisplayName(userData.name || user.displayName || '');
          setProfilePicture(userData.profilePicture || user.photoURL || '/default-profile-pic.png');

        } else {
            setSettings({
                notificationsEnabled: false,
                preferredStyle: 'casual',
            });
            setOriginalSettings({
                notificationsEnabled: false,
                preferredStyle: 'casual',
            });
        }
      };
      fetchUserSettings();
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, checked, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaveStatus(null);
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
    setSaveStatus(null);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
      setSaveStatus(null);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    let finalPhotoURL: string | null = user?.photoURL || null; // Start with current Firebase Auth photoURL

    try {
      if (!user) {
        throw new Error("No user logged in to save settings.");
      }

      // 1. Upload new profile picture if selected
      if (newProfilePictureFile) {
        setUploadingImage(true);
        try {
          // Define the storage path: users/UID/profile.jpg
          const profilePicPath = `users/${user.uid}/profile-picture/${newProfilePictureFile.name}`;
          finalPhotoURL = await uploadImage(newProfilePictureFile, profilePicPath);

          // If there was an old profile picture, attempt to delete it
          // Ensure it's not the default placeholder before attempting to delete from Storage
          if (profilePicture && profilePicture !== '/default-profile-pic.png' && profilePicture !== user.photoURL) {
            await deleteImage(profilePicture);
          }

          setProfilePicture(finalPhotoURL);
          setNewProfilePictureFile(null);
          if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview);
          setProfilePicturePreview(null);
        } catch (uploadError: any) {
          console.error('Error uploading profile picture:', uploadError);
          setSaveStatus('error');
          setIsSaving(false);
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      } else {
          // If no new file, and user is manually removing a picture (e.g., setting to empty string)
          // this logic needs adjustment. For now, it keeps current or sets to null if undefined.
          // This assumes `photoURL` can be null for deletion.
          if(profilePicturePreview === null && profilePicture !== '/default-profile-pic.png' && !user.photoURL && originalDisplayName === displayName) {
             // User explicitly cleared the image, but didn't upload a new one.
             // This needs a dedicated UI clear button for robust handling.
             // For now, if no new file is selected, finalPhotoURL remains the existing one (or null).
          }
      }

      // 2. Update Firebase Auth profile (displayName and photoURL) and Firestore document
      await updateUserProfile(
        displayName,
        finalPhotoURL // Pass the new Storage URL, or current one if no new picture was uploaded
      );

      // 3. Update general settings in Firestore (notifications, preferredStyle, name, profilePicture)
      const userRef = doc(db, 'users', user.uid);
      await firestoreUpdateDoc(userRef, {
        notificationsEnabled: settings.notificationsEnabled,
        preferredStyle: settings.preferredStyle,
        name: displayName,
        profilePicture: finalPhotoURL || '', // Store the Storage URL in Firestore
      });

      setOriginalDisplayName(displayName);
      setOriginalSettings({ ...settings });
      setSaveStatus('success');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handlePasswordReset = async () => {
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        alert('Password reset email sent! Please check your inbox.');
      } catch (error: any) {
        console.error('Error sending password reset email:', error);
        alert(`Failed to send password reset email: ${error.message}`);
      }
    } else {
      alert('Please log in to reset your password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      alert('No user is logged in.');
      return;
    }

    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion is a sensitive operation. For security, Firebase typically requires re-authentication shortly before deletion to confirm it\'s the legitimate user. You would also need to delete the user\'s data from Firestore and Firebase Storage. This feature needs careful backend implementation.');
      // Example of actual Firebase user deletion (requires re-authentication first)
      // You'd need to implement re-authentication logic here (e.g., asking for password again)
      // Then, you would delete the Firebase Auth user: await user.delete();
      // Then delete their Firestore document: await deleteDoc(doc(db, 'users', user.uid));
      // And finally, delete their folder in Firebase Storage (which requires listing all files first):
      // const listRef = ref(storage, `users/${user.uid}`);
      // const res = await listAll(listRef);
      // const deletePromises = res.items.map(itemRef => deleteObject(itemRef));
      // await Promise.all(deletePromises);
      // alert('Your account has been deleted.');
      // router.push('/');
    }
  };

  const hasChanges =
    displayName !== originalDisplayName ||
    newProfilePictureFile !== null ||
    JSON.stringify(settings) !== JSON.stringify(originalSettings);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <WebAppHeader
        user={user}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        handleLogout={handleLogout}
      />

      <div className="container mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar / Navigation */}
          <div className="lg:col-span-1 bg-gray-800/50 border border-gray-700 rounded-3xl p-6 h-fit sticky top-24">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200
                  ${activeSection === 'profile' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveSection('appearance')}
                className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200
                  ${activeSection === 'appearance' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <Sparkles className="w-5 h-5" /> {/* Using Sparkles for Outfit Preferences */}
                <span>Outfit Preferences</span>
              </button>
              <button
                onClick={() => setActiveSection('notifications')}
                className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200
                  ${activeSection === 'notifications' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveSection('account')}
                className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200
                  ${activeSection === 'account' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <Key className="w-5 h-5" />
                <span>Account</span>
              </button>
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 bg-gray-800/50 border border-gray-700 rounded-3xl p-8 space-y-8">
            {/* Conditional Rendering based on activeSection */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Profile</h2>
                <div className="space-y-4">
                  {/* Profile Picture */}
                  <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={profilePicturePreview || profilePicture}
                        alt="Profile Preview"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200 flex items-center space-x-2">
                        <Camera className="w-5 h-5" />
                        <span>Change Photo</span>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePictureChange}
                          disabled={uploadingImage}
                        />
                      </label>
                      {uploadingImage && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>}
                    </div>
                  </div>

                  {/* Display Name */}
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={displayName}
                      onChange={handleDisplayNameChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-200"
                      placeholder="Your display name"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Outfit Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="preferredStyle" className="block text-sm font-medium text-gray-300 mb-2">
                      Preferred Style
                    </label>
                    <select
                      id="preferredStyle"
                      name="preferredStyle"
                      value={settings.preferredStyle}
                      onChange={handleSettingsChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors duration-200"
                    >
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                      <option value="sporty">Sporty</option>
                      <option value="bohemian">Bohemian</option>
                      <option value="streetwear">Streetwear</option>
                      <option value="vintage">Vintage</option>
                      <option value="chic">Chic</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                    <label htmlFor="notificationsEnabled" className="text-lg text-gray-300 cursor-pointer">
                      Enable Email Notifications
                    </label>
                    <input
                      type="checkbox"
                      id="notificationsEnabled"
                      name="notificationsEnabled"
                      checked={settings.notificationsEnabled}
                      onChange={handleSettingsChange}
                      className="toggle-switch"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Account Management</h2>
                <div className="space-y-4">
                  <p className="text-gray-400">Manage your account details and security settings.</p>
                  <button
                    onClick={handlePasswordReset}
                    className="w-full text-left flex items-center space-x-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors duration-200"
                  >
                    <Mail className="w-5 h-5 text-blue-300" />
                    <span>Change Password (Send Email Link)</span>
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full text-left flex items-center space-x-3 px-4 py-3 bg-red-700 hover:bg-red-600 rounded-xl text-white font-medium transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            )}

            {/* Save Button for all sections */}
            <div className="pt-8 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              {saveStatus === 'success' && (
                <p className="text-green-500 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Settings saved!</span>
                </p>
              )}
              {saveStatus === 'error' && (
                <p className="text-red-500 flex items-center space-x-2">
                  <XCircle className="w-5 h-5" />
                  <span>Failed to save settings.</span>
                </p>
              )}
              <button
                onClick={handleSaveSettings}
                disabled={isSaving || !hasChanges || uploadingImage}
                className={`
                  w-full sm:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2
                  transition-all duration-200 transform hover:scale-105
                  ${isSaving || !hasChanges || uploadingImage
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  }
                `}
              >
                {isSaving || uploadingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{uploadingImage ? 'Uploading Image...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettingsPage;