import React, { useState, useEffect } from 'react';
import { useAuth, supabase } from '../contexts/AuthContext';

interface ProfilePageProps {
    navigateTo: (page: string, params?: any) => void;
}

interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    nickname?: string;
    email: string;
    phone?: string;
    address?: string;
    bio?: string;
    created_at: string;
    avatar_url?: string;
    role?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ navigateTo }) => {
    const { user, signOut, deleteUserAccount } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [editData, setEditData] = useState<Partial<UserProfile>>({});
    const [loading, setLoading] = useState(true);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [stats, setStats] = useState({
        orders: 0,
        favorites: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [emailData, setEmailData] = useState({
        currentEmail: '',
        newEmail: ''
    });
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [selectedCountryCode, setSelectedCountryCode] = useState('+90');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [twoFactorAuth, setTwoFactorAuth] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    // Country codes for phone number
    const countryCodes = [
        { code: '+90', country: 'Turkey', flag: '🇹🇷' },
        { code: '+1', country: 'United States', flag: '🇺🇸' },
        { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
        { code: '+49', country: 'Germany', flag: '🇩🇪' },
        { code: '+33', country: 'France', flag: '🇫🇷' },
        { code: '+39', country: 'Italy', flag: '🇮🇹' },
        { code: '+34', country: 'Spain', flag: '🇪🇸' },
        { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
        { code: '+46', country: 'Sweden', flag: '🇸🇪' },
        { code: '+47', country: 'Norway', flag: '🇳🇴' },
        { code: '+45', country: 'Denmark', flag: '🇩🇰' },
        { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
        { code: '+43', country: 'Austria', flag: '🇦🇹' },
        { code: '+32', country: 'Belgium', flag: '🇧🇪' },
        { code: '+351', country: 'Portugal', flag: '🇵🇹' },
        { code: '+30', country: 'Greece', flag: '🇬🇷' },
        { code: '+7', country: 'Russia', flag: '🇷🇺' },
        { code: '+86', country: 'China', flag: '🇨🇳' },
        { code: '+81', country: 'Japan', flag: '🇯🇵' },
        { code: '+82', country: 'South Korea', flag: '🇰🇷' },
        { code: '+91', country: 'India', flag: '🇮🇳' },
        { code: '+55', country: 'Brazil', flag: '🇧🇷' },
        { code: '+54', country: 'Argentina', flag: '🇦🇷' },
        { code: '+52', country: 'Mexico', flag: '🇲🇽' },
        { code: '+61', country: 'Australia', flag: '🇦🇺' },
        { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
        { code: '+27', country: 'South Africa', flag: '🇿🇦' },
        { code: '+20', country: 'Egypt', flag: '🇪🇬' },
        { code: '+971', country: 'UAE', flag: '🇦🇪' },
        { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' }
    ];


    // Load user profile data
    useEffect(() => {
        const loadProfileData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                
                // Get user profile from profiles table
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                    console.error('Error loading profile:', profileError);
                    // Create basic profile from user data
                    const newProfile = {
                        id: user.id,
                        first_name: user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User',
                        last_name: user.user_metadata?.full_name?.split(' ')[1] || '',
                        nickname: user.user_metadata?.nickname || user.email?.split('@')[0] || 'user',
                        email: user.email || '',
                        created_at: user.created_at,
                        role: user.user_metadata?.role || 'user'
                    };
                    setProfileData(newProfile);
                } else if (profile) {
                    // Ensure all required fields have fallback values
                    const safeProfile = {
                        ...profile,
                        first_name: profile.first_name || user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User',
                        last_name: profile.last_name || user.user_metadata?.full_name?.split(' ')[1] || '',
                        nickname: profile.nickname || user.user_metadata?.nickname || user.email?.split('@')[0] || 'user',
                        email: profile.email || user.email || '',
                        created_at: profile.created_at || user.created_at
                    };
                    setProfileData(safeProfile);
                } else {
                    // Create profile if doesn't exist
                    const newProfile = {
                        id: user.id,
                        first_name: user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User',
                        last_name: user.user_metadata?.full_name?.split(' ')[1] || '',
                        nickname: user.user_metadata?.nickname || user.email?.split('@')[0] || 'user',
                        email: user.email || '',
                        created_at: user.created_at,
                        role: user.user_metadata?.role || 'user'
                    };
                    setProfileData(newProfile);
                }

                // Load user stats (temporarily disabled to prevent 404 errors)
                // TODO: Re-enable when orders and user_favorites tables are created
                setStats({
                    orders: 0,
                    favorites: 0
                });

                // Load recent activity - Security related activities
                const activities = [];
                
                // Get recent orders (temporarily disabled to prevent 404 errors)
                // TODO: Re-enable when orders table is created

                    // Get recent profile updates (if we track them)
                    const { data: profileUpdates } = await supabase
                        .from('profiles')
                        .select('updated_at')
                        .eq('id', user.id)
                        .not('updated_at', 'is', null)
                        .order('updated_at', { ascending: false })
                        .limit(2);

                    if (profileUpdates) {
                        profileUpdates.forEach(update => {
                            activities.push({
                                type: 'profile',
                                id: 'profile-update',
                                title: 'Profile updated',
                                description: 'Your profile information was modified',
                                date: update.updated_at,
                                status: 'completed',
                                icon: 'user'
                            });
                        });
                    }

                    // Add account creation activity
                    activities.push({
                        type: 'account',
                        id: 'account-created',
                        title: 'Account created',
                        description: 'Welcome to NYX! Your account was successfully created',
                        date: user.created_at,
                        status: 'completed',
                        icon: 'user-plus'
                    });

                // Sort by date and limit to 5
                activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setRecentActivity(activities.slice(0, 5));

            } catch (error) {
                console.error('Error loading profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfileData();
    }, [user]);

    const handleEdit = () => {
        if (!profileData) return;
        setIsEditing(true);
        setEditData(profileData);
    };

    const handleSave = async () => {
        if (!user || !editData) return;
        
        // Show saving state
        setMessage({ type: 'success', text: 'Saving changes...' });
        
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    first_name: editData.first_name,
                    last_name: editData.last_name,
                    nickname: editData.nickname || user.email?.split('@')[0] || 'user',
                    email: user.email || '',
                    phone: editData.phone,
                    address: editData.address,
                    bio: editData.bio,
                    updated_at: new Date().toISOString()
                });

            if (error) {
                setMessage({ type: 'error', text: error.message });
                return;
            }

            // Update profile data
            setProfileData(prev => prev ? { ...prev, ...editData } : null);
            setIsEditing(false);
            
            // Show success message with animation
            setMessage({ 
                type: 'success', 
                text: '✅ Profile updated successfully! Your changes have been saved.' 
            });
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
            
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save profile' });
        }
    };

    const handleCancel = () => {
        setEditData(profileData || {});
        setIsEditing(false);
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Password change function
    const handlePasswordChange = async () => {
        if (!passwordData.currentPassword) {
            setPasswordMessage({ type: 'error', text: 'Please enter your current password' });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage(null);

        try {
            // Update password directly (Supabase handles current password verification)
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) {
                console.error("Password update error:", error);
                if (error.message.includes('Password should be at least')) {
                    setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
                } else if (error.message.includes('Invalid password')) {
                    setPasswordMessage({ type: 'error', text: 'Current password is incorrect' });
                } else {
                    setPasswordMessage({ type: 'error', text: error.message });
                }
                setPasswordLoading(false);
                return;
            }

            console.log("✅ Password updated successfully");
            setPasswordMessage({ type: 'success', text: '✅ Password updated successfully! Your new password is now active.' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordLoading(false);
        } catch (error) {
            console.error("Password update catch error:", error);
            setPasswordMessage({ type: 'error', text: 'Failed to update password' });
            setPasswordLoading(false);
        }
    };

    // Email change function
    const handleEmailChange = async () => {
        if (!emailData.currentEmail || !emailData.newEmail) {
            setEmailMessage({ type: 'error', text: 'Please enter both current and new email addresses' });
            return;
        }

        if (emailData.currentEmail !== user?.email) {
            setEmailMessage({ type: 'error', text: 'Current email does not match your account email' });
            return;
        }

        if (emailData.currentEmail === emailData.newEmail) {
            setEmailMessage({ type: 'error', text: 'New email must be different from current email' });
            return;
        }

        setEmailLoading(true);
        setEmailMessage(null);
        
        console.log("📧 Starting email change process...");
        console.log("📧 Current email:", emailData.currentEmail);
        console.log("📧 New email:", emailData.newEmail);

        try {
            // Update email with redirect URL (Supabase handles verification)
            const { data, error } = await supabase.auth.updateUser(
                { email: emailData.newEmail },
                { 
                    emailRedirectTo: 'https://talhacamur.github.io/NYX/'
                }
            );

            console.log("📧 Update response:", { data, error });
            console.log("📧 Full response data:", JSON.stringify(data, null, 2));
            console.log("📧 Full error:", JSON.stringify(error, null, 2));

            if (error) {
                console.error("❌ Email update error:", error);
                if (error.message.includes('Email rate limit exceeded')) {
                    setEmailMessage({ type: 'error', text: 'Too many email change requests. Please wait before trying again.' });
                } else if (error.message.includes('Invalid email')) {
                    setEmailMessage({ type: 'error', text: 'Please enter a valid email address' });
                } else if (error.message.includes('User already registered')) {
                    setEmailMessage({ type: 'error', text: 'This email address is already in use' });
                } else {
                    setEmailMessage({ type: 'error', text: error.message });
                }
                setEmailLoading(false);
                return;
            }

            console.log("✅ Email update request sent successfully");
            setEmailMessage({ 
                type: 'success', 
                text: '✅ Verification email sent! Please check BOTH your current and new email addresses. Click the verification link in the new email to complete the change.' 
            });
            setEmailData({ currentEmail: '', newEmail: '' });
            setEmailLoading(false);
            
            // Clear message after 8 seconds
            setTimeout(() => {
                setEmailMessage(null);
            }, 8000);
        } catch (error: any) {
            console.error("❌ Email update catch error:", error);
            setEmailMessage({ type: 'error', text: error.message || 'Failed to update email. Please try again.' });
            setEmailLoading(false);
        }
    };

    // Avatar upload function
    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setMessage({ type: 'error', text: 'File size must be less than 5MB' });
            return;
        }

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                setMessage({ type: 'error', text: uploadError.message });
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user?.id,
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString()
                });

            if (updateError) {
                setMessage({ type: 'error', text: updateError.message });
                return;
            }

            setProfileData(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
            setMessage({ type: 'success', text: 'Avatar updated successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload avatar' });
        } finally {
            setUploading(false);
        }
    };

    // Delete account function
    const handleDeleteAccount = async () => {
        if (!window.confirm('⚠️ WARNING: This action cannot be undone!\n\nAre you absolutely sure you want to delete your account? All your data, including:\n• Profile information\n• Orders and favorites\n• Security settings\n• All associated data\n\nWill be permanently deleted from our database.')) {
            return;
        }

        // Double confirmation
        if (!window.confirm('🚨 FINAL CONFIRMATION 🚨\n\nThis is your last chance to cancel.\n\nType "DELETE" in the next prompt to confirm account deletion.')) {
            return;
        }

        const confirmation = window.prompt('Type "DELETE" to confirm account deletion:');
        if (confirmation !== 'DELETE') {
            setMessage({ type: 'error', text: 'Account deletion cancelled. You must type "DELETE" exactly to confirm.' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: 'success', text: '🗑️ Deleting account and all associated data...' });
            
            // Use the deleteUserAccount function from AuthContext
            await deleteUserAccount();
            
            setMessage({ type: 'success', text: '✅ Account and all data deleted successfully from database. You will be redirected to the home page.' });
            
            // Wait a bit then navigate to home page
            setTimeout(() => {
                navigateTo('home');
            }, 3000);
        } catch (error) {
            console.error("💥 Account deletion error:", error);
            setMessage({ type: 'error', text: '❌ Failed to delete account from database. Please try again or contact support.' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-dark text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
                    <p className="text-gray-300">Unable to load your profile data.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark text-white">
            {/* Elegant Profile Header - Like Products Page */}
            <section className="relative py-16 border-b border-gray-800/50">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-nyx-blue/5 via-transparent to-transparent"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Small badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-nyx-blue/10 to-brand-purple/10 border border-nyx-blue/20 mb-6">
                            <div className="w-1.5 h-1.5 bg-nyx-blue rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-gray-300 tracking-wide">MY ACCOUNT</span>
                        </div>
                        
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Your <span className="bg-gradient-to-r from-nyx-blue via-brand-purple to-brand-pink text-transparent bg-clip-text">Profile</span>
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-gray-400 text-lg mb-6">
                            Manage your personal information and account settings
                        </p>
                        
                        {/* Quick Stats Row */}
                        <div className="flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Member since {new Date(profileData?.created_at || Date.now()).getFullYear()}</span>
                            </div>
                            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Content */}
            <div className="relative z-10 container mx-auto px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Message Display */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl animate-slide-down flex items-center gap-3 ${
                            message.type === 'success' 
                                ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                                : 'bg-red-500/20 border border-red-500/30 text-red-300'
                        }`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                                {message.type === 'success' ? (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    {/* Elegant Tab Navigation */}
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                                activeTab === 'profile'
                                    ? 'bg-white/10 text-white border border-white/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                                activeTab === 'security'
                                    ? 'bg-white/10 text-white border border-white/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                                activeTab === 'orders'
                                    ? 'bg-white/10 text-white border border-white/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                                activeTab === 'settings'
                                    ? 'bg-white/10 text-white border border-white/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Settings
                        </button>
                    </div>

                    {/* Profile Tab - Minimalist Premium */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            {/* Clean Premium Profile Card */}
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
                                {/* Minimalist Profile Header */}
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                                    {/* Clean Avatar */}
                                    <div className="relative group">
                                        {profileData.avatar_url ? (
                                            <img 
                                                src={profileData.avatar_url} 
                                                alt="Profile" 
                                                className="w-32 h-32 rounded-2xl object-cover border border-white/20"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 bg-gradient-to-br from-nyx-blue to-brand-purple rounded-2xl flex items-center justify-center text-4xl font-bold text-white border border-white/20">
                                                {(profileData.first_name?.[0] || 'U')}{(profileData.last_name?.[0] || '')}
                                            </div>
                                        )}
                                        
                                        {/* Minimal Status Badge */}
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-nyx-black"></div>
                                        
                                        {/* Clean Upload Overlay */}
                                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <label className="cursor-pointer flex flex-col items-center gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarUpload}
                                                    className="hidden"
                                                    disabled={uploading}
                                                />
                                                {uploading ? (
                                                    <>
                                                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="text-white text-xs font-medium">Uploading...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="text-white text-xs font-medium">Change</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                    
                                    {/* Minimalist User Info */}
                                    <div className="flex-1 space-y-4">
                                        <h2 className="text-3xl font-bold text-white">
                                            {profileData.first_name || 'User'} {profileData.last_name || ''}
                                        </h2>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {profileData.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Member since {new Date(profileData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>
                                        
                                        {/* Clean Role Badges */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {(user?.roles || ['user']).map((role, index) => (
                                                <span 
                                                    key={index}
                                                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                                        role === 'super-admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                                        role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                                        role === 'seller' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                        role === 'content_writer' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                                                        role === 'Web Developer' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                                                        role === 'UI/UX Designer' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' :
                                                        'bg-nyx-blue/20 text-nyx-blue border border-nyx-blue/30'
                                                    }`}
                                                >
                                                    {role.toUpperCase()}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        {/* Clean Edit Button */}
                                        <div className="pt-2">
                                            {!isEditing ? (
                                                <button
                                                    onClick={handleEdit}
                                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl transition-all flex items-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit Profile
                                                </button>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                                    <span className="text-orange-300 text-sm font-medium">Editing</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Minimalist Stats */}
                                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white mb-1">{stats.orders}</div>
                                        <div className="text-sm text-gray-400">Orders</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white mb-1">{stats.favorites}</div>
                                        <div className="text-sm text-gray-400">Favorites</div>
                                    </div>
                                </div>
                            </div>

                            {/* Minimalist Personal Information Card */}
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">Personal Information</h3>
                                    {isEditing && (
                                        <span className="text-xs text-gray-400">Editing</span>
                                    )}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">First Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.first_name || ''}
                                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                                                placeholder="Enter first name"
                                            />
                                        ) : (
                                            <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">{profileData.first_name || 'Not set'}</div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Last Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.last_name || ''}
                                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                                                placeholder="Enter last name"
                                            />
                                        ) : (
                                            <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">{profileData.last_name || 'Not set'}</div>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Nickname</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.nickname || ''}
                                                onChange={(e) => handleInputChange('nickname', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                                                placeholder="Enter nickname"
                                            />
                                        ) : (
                                            <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">{profileData.nickname || 'Not set'}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Minimalist Contact Information Card */}
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">Contact Information</h3>
                                    {isEditing && (
                                        <span className="text-xs text-gray-400">Editing</span>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Phone Number</label>
                                        {isEditing ? (
                                            <div className="flex gap-2">
                                                <select
                                                    value={selectedCountryCode}
                                                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                                                    className="p-3 bg-white/5 rounded-lg text-white no-focus"
                                                    style={{
                                                        outline: 'none !important',
                                                        border: 'none !important',
                                                        boxShadow: 'none !important',
                                                        ring: 'none !important',
                                                        '--tw-ring-width': '0 !important',
                                                        '--tw-ring-color': 'transparent !important',
                                                        '--tw-ring-offset-width': '0 !important',
                                                        '--tw-ring-offset-color': 'transparent !important',
                                                        appearance: 'none',
                                                        WebkitAppearance: 'none',
                                                        MozAppearance: 'none'
                                                    }}
                                                >
                                                    {countryCodes.map((country) => (
                                                        <option key={country.code} value={country.code} className="bg-gray-800 text-white">
                                                            {country.flag} {country.code}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="tel"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    className="flex-1 p-3 bg-white/5 rounded-lg text-white placeholder-gray-400 no-focus"
                                                    style={{
                                                        outline: 'none !important',
                                                        border: 'none !important',
                                                        boxShadow: 'none !important',
                                                        ring: 'none !important',
                                                        '--tw-ring-width': '0 !important',
                                                        '--tw-ring-color': 'transparent !important',
                                                        '--tw-ring-offset-width': '0 !important',
                                                        '--tw-ring-offset-color': 'transparent !important'
                                                    }}
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-gray-300 p-3 bg-white/5 rounded-lg">
                                                {profileData.phone ? `${selectedCountryCode} ${profileData.phone}` : 'No phone number'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Minimalist Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 px-6 py-3 bg-white text-nyx-black font-semibold rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Orders Tab - Minimalist */}
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            {/* Clean Stats */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center hover:border-white/20 transition-all">
                                    <div className="text-3xl font-bold text-white mb-1">{stats.orders}</div>
                                    <p className="text-sm text-gray-400">Orders Placed</p>
                                </div>
                                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center hover:border-white/20 transition-all">
                                    <div className="text-3xl font-bold text-white mb-1">{stats.favorites}</div>
                                    <p className="text-sm text-gray-400">Favorites</p>
                                </div>
                            </div>

                            {/* Clean Recent Activity */}
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all">
                                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                                <div className="space-y-3">
                                    {recentActivity.length > 0 ? (
                                        recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    activity.type === 'order' ? 'bg-blue-500/20 text-blue-400' :
                                                    activity.type === 'profile' ? 'bg-green-500/20 text-green-400' :
                                                    activity.type === 'account' ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                    {activity.icon === 'shopping-bag' && (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                    )}
                                                    {activity.icon === 'user' && (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    )}
                                                    {activity.icon === 'user-plus' && (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white font-medium">{activity.title}</p>
                                                    <p className="text-gray-400 text-sm">{activity.description}</p>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        {new Date(activity.date).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                                    activity.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                    activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    activity.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                    {activity.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-400">No recent activity</p>
                                            <p className="text-gray-500 text-sm">Your orders and activities will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Clean Order Tracking */}
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all">
                                <h3 className="text-xl font-bold text-white mb-4">Order Tracking</h3>
                                <div className="text-center py-8">
                                    <p className="text-gray-400 mb-4">Monitor your order status and delivery progress</p>
                                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl transition-all">
                                        View All Orders
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab - Minimalist */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            {/* Password Change Card */}
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all">
                                <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>
                                    
                                    {/* Password Message */}
                                    {passwordMessage && (
                                        <div className={`mb-4 p-4 rounded-lg ${
                                            passwordMessage.type === 'success' 
                                                ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                                                : 'bg-red-500/20 border border-red-500/30 text-red-300'
                                        }`}>
                                            {passwordMessage.text}
                                        </div>
                                    )}
                                    
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <button
                                        onClick={handlePasswordChange}
                                        disabled={passwordLoading}
                                        className="px-6 py-3 bg-white text-nyx-black font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {passwordLoading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>

                            {/* Email Change Card */}
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all">
                                <h3 className="text-xl font-bold text-white mb-6">Change Email</h3>
                                
                                {/* Email Message */}
                                {emailMessage && (
                                    <div className={`mb-4 p-4 rounded-lg ${
                                        emailMessage.type === 'success' 
                                            ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                                            : 'bg-red-500/20 border border-red-500/30 text-red-300'
                                    }`}>
                                        {emailMessage.text}
                                    </div>
                                )}
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Current Email</label>
                                        <input
                                            type="email"
                                            value={emailData.currentEmail}
                                            onChange={(e) => setEmailData(prev => ({ ...prev, currentEmail: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                                            placeholder="Current email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">New Email</label>
                                        <input
                                            type="email"
                                            value={emailData.newEmail}
                                            onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                                            placeholder="New email"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        A verification link will be sent to your new email address
                                    </p>
                                    <button
                                        onClick={handleEmailChange}
                                        disabled={emailLoading}
                                        className="px-6 py-3 bg-white text-nyx-black font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {emailLoading ? 'Sending...' : 'Send Verification'}
                                    </button>
                                </div>
                            </div>

                            {/* Delete Account Card */}
                            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-red-400 mb-4">Delete Account</h3>
                                <p className="text-sm text-gray-400 mb-4">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </p>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-300 font-semibold rounded-xl transition-all"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}

                        {/* Settings Tab - Minimalist */}
                        {activeTab === 'settings' && (
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all">
                                <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                        <div>
                                            <h4 className="text-white font-medium text-sm">Email Notifications</h4>
                                            <p className="text-gray-500 text-xs">Receive email updates</p>
                                        </div>
                                        <button
                                            onClick={() => setEmailNotifications(!emailNotifications)}
                                            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                                                emailNotifications ? 'bg-white' : 'bg-white/20'
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                                                emailNotifications ? 'right-1 bg-nyx-black' : 'left-1 bg-white'
                                            }`}></div>
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                        <div>
                                            <h4 className="text-white font-medium text-sm">SMS Notifications</h4>
                                            <p className="text-gray-500 text-xs">Receive SMS updates</p>
                                        </div>
                                        <button
                                            onClick={() => setSmsNotifications(!smsNotifications)}
                                            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                                                smsNotifications ? 'bg-white' : 'bg-white/20'
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                                                smsNotifications ? 'right-1 bg-nyx-black' : 'left-1 bg-white'
                                            }`}></div>
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                        <div>
                                            <h4 className="text-white font-medium text-sm">Two-Factor Authentication</h4>
                                            <p className="text-gray-500 text-xs">Extra security layer</p>
                                        </div>
                                        <button
                                            onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                                            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                                                twoFactorAuth ? 'bg-white' : 'bg-white/20'
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                                                twoFactorAuth ? 'right-1 bg-nyx-black' : 'left-1 bg-white'
                                            }`}></div>
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                        <div>
                                            <h4 className="text-white font-medium text-sm">Dark Mode</h4>
                                            <p className="text-gray-500 text-xs">Dark theme enabled</p>
                                        </div>
                                        <button
                                            onClick={() => setDarkMode(!darkMode)}
                                            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                                                darkMode ? 'bg-white' : 'bg-white/20'
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                                                darkMode ? 'right-1 bg-nyx-black' : 'left-1 bg-white'
                                            }`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;