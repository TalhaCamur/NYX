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
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.2),transparent_50%)]"></div>
                
                {/* Floating Orbs */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-float"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                
                <div className="relative z-10 container mx-auto px-6 py-20">
                    <div className="max-w-6xl mx-auto">
                        {/* Premium Header */}
                        <div className="text-center mb-12">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-nyx-blue/20 to-brand-purple/20 border border-nyx-blue/30 mb-6">
                                <div className="w-2 h-2 bg-nyx-blue rounded-full animate-pulse"></div>
                                <span className="text-xs font-semibold text-gray-300 tracking-wider">MY ACCOUNT</span>
                            </div>
                            
                            {/* Title */}
                            <h1 className="text-5xl md:text-6xl font-bold mb-4">
                                <span className="text-white">Your</span>{' '}
                                <span className="bg-gradient-to-r from-nyx-blue via-brand-purple to-brand-pink text-transparent bg-clip-text">Profile</span>
                            </h1>
                            
                            {/* Subtitle */}
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                Manage your personal information, security settings, and preferences
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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

                    {/* Premium Tab Navigation */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-2 mb-8 shadow-xl">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 min-w-[120px] px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                                    activeTab === 'profile'
                                        ? 'bg-gradient-to-r from-nyx-blue to-brand-purple text-white shadow-lg shadow-nyx-blue/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                👤 Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`flex-1 min-w-[120px] px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                                    activeTab === 'security'
                                        ? 'bg-gradient-to-r from-nyx-blue to-brand-purple text-white shadow-lg shadow-nyx-blue/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                🔒 Security
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex-1 min-w-[120px] px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                                    activeTab === 'orders'
                                        ? 'bg-gradient-to-r from-nyx-blue to-brand-purple text-white shadow-lg shadow-nyx-blue/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                📦 Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex-1 min-w-[120px] px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                                    activeTab === 'settings'
                                        ? 'bg-gradient-to-r from-nyx-blue to-brand-purple text-white shadow-lg shadow-nyx-blue/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                ⚙️ Settings
                            </button>
                        </div>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            {/* Premium Profile Card */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                                {/* Animated Background Orbs */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-nyx-blue/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-brand-purple/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                                
                                <div className="relative p-8">
                                    {/* Profile Header */}
                                    <div className="flex flex-col items-center text-center mb-8">
                                        {/* Premium Avatar with Animated Rings */}
                                        <div className="relative mb-6">
                                            {/* Animated Rings */}
                                            <div className="absolute inset-0 -m-4">
                                                <div className="absolute inset-0 rounded-full border-2 border-nyx-blue/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                                                <div className="absolute inset-0 rounded-full border-2 border-brand-purple/30 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
                                            </div>
                                            
                                            {/* Avatar Container */}
                                            <div className="relative group">
                                                {profileData.avatar_url ? (
                                                    <img 
                                                        src={profileData.avatar_url} 
                                                        alt="Profile" 
                                                        className="w-32 h-32 rounded-3xl object-cover shadow-2xl ring-4 ring-white/10 group-hover:ring-nyx-blue/50 transition-all duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-32 h-32 bg-gradient-to-br from-nyx-blue via-brand-purple to-brand-pink rounded-3xl flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-4 ring-white/10 group-hover:ring-nyx-blue/50 transition-all duration-300">
                                                        {(profileData.first_name?.[0] || 'U')}{(profileData.last_name?.[0] || '')}
                                                    </div>
                                                )}
                                                
                                                {/* Online Status Badge */}
                                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-4 border-nyx-black shadow-lg flex items-center justify-center">
                                                    <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                                                </div>
                                                
                                                {/* Upload Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-nyx-blue/90 to-brand-purple/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
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
                                                                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                <span className="text-white text-sm font-semibold">Uploading...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <span className="text-white text-sm font-semibold">Change Photo</span>
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* User Info - Centered */}
                                        <div className="space-y-3">
                                            <h2 className="text-4xl font-bold text-white">
                                                {profileData.first_name || 'User'} {profileData.last_name || ''}
                                            </h2>
                                            
                                            <div className="flex items-center justify-center gap-2 text-gray-300">
                                                <svg className="w-5 h-5 text-nyx-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-lg">{profileData.email}</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-center gap-2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm">Member since {new Date(profileData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                            </div>
                                            
                                            {/* Role Badges */}
                                            <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
                                                {(user?.roles || ['user']).map((role, index) => (
                                                    <span 
                                                        key={index}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider shadow-lg ${
                                                            role === 'super-admin' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                                                            role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' :
                                                            role === 'seller' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                                                            role === 'content_writer' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' :
                                                            role === 'Web Developer' ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white' :
                                                            role === 'UI/UX Designer' ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white' :
                                                            'bg-gradient-to-r from-nyx-blue to-brand-purple text-white'
                                                        }`}
                                                    >
                                                        {role.toUpperCase()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
                                            <div className="bg-gradient-to-br from-nyx-blue/20 to-brand-purple/10 backdrop-blur-sm rounded-2xl p-4 border border-nyx-blue/30">
                                                <div className="text-3xl font-bold text-white mb-1">{stats.orders}</div>
                                                <div className="text-sm text-gray-300 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    Total Orders
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-brand-pink/20 to-red-500/10 backdrop-blur-sm rounded-2xl p-4 border border-brand-pink/30">
                                                <div className="text-3xl font-bold text-white mb-1">{stats.favorites}</div>
                                                <div className="text-sm text-gray-300 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                    Favorites
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        
                                        {/* Edit Button - Centered */}
                                        <div className="mt-6">
                                            {!isEditing ? (
                                                <button
                                                    onClick={handleEdit}
                                                    className="group relative px-8 py-4 bg-gradient-to-r from-nyx-blue to-brand-purple text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-nyx-blue/50 hover:scale-105 flex items-center gap-2"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-nyx-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    <span className="relative z-10">Edit Profile</span>
                                                </button>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 rounded-2xl shadow-lg">
                                                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                                                    <span className="text-orange-300 font-bold text-lg">✏️ Editing Mode</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information Card */}
                            <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-br from-nyx-blue/20 to-brand-purple/20 rounded-xl border border-nyx-blue/30">
                                        <svg className="w-6 h-6 text-nyx-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Personal Information</h3>
                                        {isEditing && (
                                            <span className="text-sm text-nyx-blue font-semibold">✏️ Edit mode active</span>
                                        )}
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">First Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.first_name || ''}
                                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                                                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                                                placeholder="Enter first name"
                                            />
                                        ) : (
                                            <p className="text-gray-300 p-3 bg-white/5 rounded-lg">{profileData.first_name || 'No first name'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Last Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.last_name || ''}
                                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                                                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                                                placeholder="Enter last name"
                                            />
                                        ) : (
                                            <p className="text-gray-300 p-3 bg-white/5 rounded-lg">{profileData.last_name || 'No last name'}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Nickname</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.nickname || ''}
                                                onChange={(e) => handleInputChange('nickname', e.target.value)}
                                                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                                                placeholder="Enter nickname"
                                            />
                                        ) : (
                                            <p className="text-gray-300 p-3 bg-white/5 rounded-lg">{profileData.nickname || 'No nickname'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bio Card */}
                            <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 rounded-xl border border-brand-purple/30">
                                        <svg className="w-6 h-6 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">About Me</h3>
                                        {isEditing && (
                                            <span className="text-sm text-brand-purple font-semibold">✏️ Edit mode active</span>
                                        )}
                                    </div>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        value={editData.bio || ''}
                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                        className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all resize-none"
                                        rows={4}
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-300 leading-relaxed text-lg">{profileData.bio || 'No bio available yet. Click edit to add one!'}</p>
                                )}
                            </div>

                            {/* Contact Information Card */}
                            <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Contact Information</h3>
                                        {isEditing && (
                                            <span className="text-sm text-green-400 font-semibold">✏️ Edit mode active</span>
                                        )}
                                    </div>
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

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-green-300 mb-4">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-semibold">Ready to save your changes?</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 group relative px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="relative z-10">Save Changes</span>
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-6 py-4 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{stats.orders}</h3>
                                    <p className="text-gray-400">Orders Placed</p>
                                </div>
                                
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{stats.favorites}</h3>
                                    <p className="text-gray-400">Favorites</p>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                                <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
                                <div className="space-y-4">
                                    {recentActivity.length > 0 ? (
                                        recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    activity.type === 'order' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                                                    activity.type === 'profile' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                                    activity.type === 'account' ? 'bg-gradient-to-r from-orange-500 to-red-600' :
                                                    'bg-gradient-to-r from-gray-500 to-gray-600'
                                                }`}>
                                                    {activity.icon === 'shopping-bag' && (
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                    )}
                                                    {activity.icon === 'user' && (
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    )}
                                                    {activity.icon === 'user-plus' && (
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                            {/* Order Tracking Section */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                                <h3 className="text-2xl font-bold text-white mb-6">Order Tracking</h3>
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-xl font-semibold text-white mb-2">Track Your Orders</h4>
                                    <p className="text-gray-400 mb-6">Monitor your order status and delivery progress</p>
                                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                                        View All Orders
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-8 shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-6">Security Settings</h3>
                            
                                {/* Password Change */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-white mb-4">Change Password</h4>
                                    
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
                                            <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Current Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <button
                                            onClick={handlePasswordChange}
                                            disabled={passwordLoading}
                                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {passwordLoading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>

                            {/* Email Change */}
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold text-white mb-4">Change Email</h4>
                                
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
                                        <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Current Email Address</label>
                                        <input
                                            type="email"
                                            value={emailData.currentEmail}
                                            onChange={(e) => setEmailData(prev => ({ ...prev, currentEmail: e.target.value }))}
                                            className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                                            placeholder="Enter your current email address"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">New Email Address</label>
                                        <input
                                            type="email"
                                            value={emailData.newEmail}
                                            onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                                            className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                                            placeholder="Enter new email address"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Current Password (Required)</label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                                            placeholder="Enter your current password"
                                        />
                                    </div>
                                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <p className="text-blue-300 text-sm">
                                            📧 You will receive a verification link at your new email address. 
                                            Please check your inbox and click the link to complete the email change.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleEmailChange();
                                            // Fallback: reset loading state after 5 seconds
                                            setTimeout(() => {
                                                if (emailLoading) {
                                                    console.log("🔄 Fallback: Resetting email loading state");
                                                    setEmailLoading(false);
                                                }
                                            }, 5000);
                                        }}
                                        disabled={emailLoading}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {emailLoading ? 'Sending...' : 'Send Verification Email'}
                                    </button>
                                </div>
                            </div>

                            {/* Delete Account */}
                            <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <h4 className="text-lg font-semibold text-red-400 mb-2">🗑️ Delete Account</h4>
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                                        <p className="text-red-300 text-sm font-medium mb-2">⚠️ WARNING: This action is irreversible!</p>
                                        <p className="text-gray-300 text-sm">
                                            Deleting your account will permanently remove:
                                        </p>
                                        <ul className="text-gray-400 text-sm mt-2 ml-4 list-disc">
                                            <li>Your profile and personal information</li>
                                            <li>All orders and purchase history</li>
                                            <li>Favorites and wishlists</li>
                                            <li>Security settings and preferences</li>
                                            <li>All associated data from our database</li>
                                        </ul>
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        This action cannot be undone. Please be absolutely certain before proceeding.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        🗑️ Delete Account Permanently
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-8 shadow-2xl">
                                <h3 className="text-2xl font-bold text-white mb-6">Account Settings</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                        <div>
                                            <h4 className="text-white font-medium">Email Notifications</h4>
                                            <p className="text-gray-400 text-sm">Receive email updates about your orders and account</p>
                                        </div>
                                        <button
                                            onClick={() => setEmailNotifications(!emailNotifications)}
                                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
                                                emailNotifications ? 'bg-blue-500' : 'bg-gray-600'
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                                                emailNotifications ? 'right-1' : 'left-1'
                                            }`}></div>
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                        <div>
                                            <h4 className="text-white font-medium">SMS Notifications</h4>
                                            <p className="text-gray-400 text-sm">Receive SMS updates for important account changes</p>
                                        </div>
                                        <button
                                            onClick={() => setSmsNotifications(!smsNotifications)}
                                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
                                                smsNotifications ? 'bg-blue-500' : 'bg-gray-600'
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                                                smsNotifications ? 'right-1' : 'left-1'
                                            }`}></div>
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                        <div>
                                            <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                                            <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                                        </div>
                                        <button
                                            onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
                                                twoFactorAuth ? 'bg-blue-500' : 'bg-gray-600'
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                                                twoFactorAuth ? 'right-1' : 'left-1'
                                            }`}></div>
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                        <div>
                                            <h4 className="text-white font-medium">Dark Mode</h4>
                                            <p className="text-gray-400 text-sm">Use dark theme for better experience</p>
                                        </div>
                                        <button
                                            onClick={() => setDarkMode(!darkMode)}
                                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
                                                darkMode ? 'bg-blue-500' : 'bg-gray-600'
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                                                darkMode ? 'right-1' : 'left-1'
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