import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { User, UserRole } from '../types';
import { createClient, Session, User as SupabaseUser } from '@supabase/supabase-js';

// --- Supabase Client Initialization ---
const supabaseUrl = 'https://dpbyrvnvxjlhvtooyuru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYnlydm52eGpsaHZ0b295dXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTExODAsImV4cCI6MjA3MzY4NzE4MH0.txkD2Awid_RJxWhFJb0I13QBseIHdrDqFfeGgXrOEE';
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// Test Supabase connection
export const testSupabaseConnection = async () => {
    try {
        const startTime = Date.now();
        
        // Add timeout to prevent infinite waiting
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection test timeout')), 10000)
        );
        
        // Try a simpler test first - just check if we can reach Supabase
        const connectionPromise = supabase
            .from('profiles')
            .select('id')
            .limit(1);
            
        const { data, error } = await Promise.race([connectionPromise, timeoutPromise]) as any;
        const duration = Date.now() - startTime;
        
        if (error) {
            console.error("❌ Supabase connection test failed:", error);
            return { success: false, error, duration };
        }
        
        return { success: true, duration };
    } catch (error) {
        console.error("💥 Supabase connection test error:", error);
        return { success: false, error, duration: 0 };
    }
};

// --- Helper Functions ---
const mapProfileToUser = (profile: any, authUser: SupabaseUser | null): User => ({
    id: profile.id,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    nickname: profile.nickname || authUser?.user_metadata?.nickname || 'user',
    email: authUser?.email || profile.email || '',
    roles: Array.isArray(profile.roles)
        ? (profile.roles.length > 0 ? profile.roles : ['user'])
        : (typeof profile.roles === 'string'
            ? (profile.roles.replace(/[{}]/g, '').split(',').filter(role => role.trim() !== '')) as UserRole[]
            : ['user']),
    profilePicture: profile.profile_picture,
    newsletterSubscribed: profile.newsletter_subscribed ?? false,
});

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isPasswordRecoveryFlow: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    signup: (firstName: string, lastName: string, nickname: string, email: string, password: string, newsletterSubscribed: boolean) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userId: string, updates: Partial<Pick<User, 'firstName' | 'lastName' | 'nickname' | 'profilePicture'>>) => Promise<User>;
    changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
    signInWithProvider: (provider: 'google') => Promise<void>;
    sendPasswordResetEmail: (email: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    fetchAllUsers: () => Promise<User[]>;
    updateUserRoles: (userId: string, roles: UserRole[]) => Promise<void>;
    deleteUserAsAdmin: (userId: string) => Promise<void>;
    deleteUserAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false); // INSTANT LOADING
    const [isPasswordRecoveryFlow, setIsPasswordRecoveryFlow] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error("❌ Session error:", error);
                    setUser(null);
                    setLoading(false);
                    return;
                }
                
                if (session?.user) {
                    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                    
                    if (profileError) {
                        console.warn("⚠️ User exists in auth but not in profiles. Creating profile...");
                        
                        // Create profile for existing user
                        const emailPrefix = session.user.email?.split('@')[0] || 'user';
                        const fullName = session.user.user_metadata?.full_name || '';
                        const nameParts = fullName.split(' ');
                        
                        const { error: createProfileError } = await supabase
                            .from('profiles')
                            .insert({
                                id: session.user.id,
                                first_name: session.user.user_metadata?.first_name || nameParts[0] || emailPrefix,
                                last_name: session.user.user_metadata?.last_name || nameParts.slice(1).join(' ') || '',
                                nickname: session.user.user_metadata?.nickname || emailPrefix,
                                email: session.user.email || '',
                                newsletter_subscribed: session.user.user_metadata?.newsletter_subscribed || false,
                                roles: ['user'],
                                created_at: session.user.created_at,
                                updated_at: new Date().toISOString(),
                                is_active: true
                            });

                        if (createProfileError) {
                            console.error("❌ Failed to create profile:", createProfileError);
                            await supabase.auth.signOut();
                            setUser(null);
                        } else {
                            // Load the newly created profile
                            const { data: newProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                            if (newProfile) {
                                setUser(mapProfileToUser(newProfile, session.user));
                            }
                        }
                    } else if (profile) {
                        // Check if account is deleted/deactivated
                        if (!profile.is_active || profile.email?.includes('deleted_')) {
                            await supabase.auth.signOut();
                            setUser(null);
                            return;
                        }
                        
                        
                        // Check if profile needs updating (if first_name is email prefix)
                        const emailPrefix = session.user.email?.split('@')[0] || '';
                        if (profile.first_name === emailPrefix && emailPrefix) {
                            
                            const fullName = session.user.user_metadata?.full_name || '';
                            const nameParts = fullName.split(' ');
                            
                            const { error: updateError } = await supabase
                                .from('profiles')
                                .update({
                                    first_name: session.user.user_metadata?.first_name || nameParts[0] || emailPrefix,
                                    last_name: session.user.user_metadata?.last_name || nameParts.slice(1).join(' ') || '',
                                    nickname: session.user.user_metadata?.nickname || emailPrefix,
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', session.user.id);
                            
                            if (updateError) {
                                console.error("❌ Failed to update profile:", updateError);
                            } else {
                                // Reload profile
                                const { data: updatedProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                                if (updatedProfile) {
                                    setUser(mapProfileToUser(updatedProfile, session.user));
                                    return;
                                }
                            }
                        }
                        
                        setUser(mapProfileToUser(profile, session.user));
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("💥 Error fetching initial session:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        
        // Add a fallback timeout
        const fallbackTimeout = setTimeout(() => {
            setLoading(false);
        }, 3000);
        
        getSession().finally(() => {
            clearTimeout(fallbackTimeout);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("🔄 Auth state change:", event, session?.user?.id);
            
            if (event === 'PASSWORD_RECOVERY') {
                setIsPasswordRecoveryFlow(true);
            } else if (event === 'USER_UPDATED') {
                // For USER_UPDATED events, update user and profile
                console.log("👤 User updated:", session?.user?.email);
                if (session?.user) {
                    // Update profiles table with new email
                    const { error: profileUpdateError } = await supabase
                        .from('profiles')
                        .update({ 
                            email: session.user.email,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', session.user.id);
                    
                    if (profileUpdateError) {
                        console.error("❌ Profile email update error:", profileUpdateError);
                    } else {
                        console.log("✅ Profile email updated successfully");
                    }
                    
                    // Update user state with new auth data
                    setUser(prevUser => prevUser ? {
                        ...prevUser,
                        email: session.user.email || prevUser.email,
                        profilePicture: session.user.user_metadata?.avatar_url || prevUser.profilePicture
                    } : null);
                }
            } else if (session?.user) {
                console.log("👤 User session found:", session.user.email);
                const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                
                if (profileError) {
                    console.error("❌ Profile loading error:", profileError);
                }
                
                if (profile) {
                    setUser(mapProfileToUser(profile, session.user));
                } else {
                    // Create a basic user from auth data if no profile exists
                    setUser({
                        id: session.user.id,
                        firstName: session.user.user_metadata?.first_name || '',
                        lastName: session.user.user_metadata?.last_name || '',
                        nickname: session.user.user_metadata?.nickname || session.user.email?.split('@')[0] || 'user',
                        email: session.user.email || '',
                        roles: ['user'],
                        profilePicture: session.user.user_metadata?.avatar_url || null,
                        newsletterSubscribed: false,
                    });
                }
                setIsPasswordRecoveryFlow(false);
            } else {
                setUser(null);
                setIsPasswordRecoveryFlow(false);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);
    

    const login = useCallback(async (identifier: string, password: string): Promise<any> => {
        const trimmedIdentifier = identifier.trim();
    
        try {
            console.log("🚀 Starting login process...");
            
            // First check if email exists in profiles table
            console.log("🔍 Checking if email exists...");
            const { data: profileCheck, error: profileError } = await supabase
                .from('profiles')
                .select('id, email')
                .eq('email', trimmedIdentifier)
                .single();
            
            // Attempt login
            console.log("📧 Attempting email login...");
            const { data, error } = await supabase.auth.signInWithPassword({
                email: trimmedIdentifier,
                password: password,
            });
            
            if (error) {
                console.error("❌ Login error:", error);
                
                // Check if it's an invalid credentials error
                if (error.message.includes('Invalid login credentials')) {
                    // If profile exists but login failed, it's a password issue
                    if (profileCheck && !profileError) {
                        throw new Error("Password does not match. Please check your password and try again.");
                    } else {
                        // If no profile found, account doesn't exist
                        throw new Error("Account not found. Please check your email address or sign up for a new account.");
                    }
                }
                
                if (error.message.includes('email_not_confirmed')) {
                    throw new Error("Please check your email and click the confirmation link to complete your registration.");
                }
                
                throw new Error(error.message || 'Login failed. Please try again.');
            }
            
            if (!data.user) {
                throw new Error("Login failed. Could not authenticate user.");
            }
            
            console.log("✅ Login successful:", data.user.email);
            return data; // Return data to resolve Promise
            
        } catch (error) {
            console.error("💥 Login error:", error);
            throw error;
        }
    }, []);

    const signup = useCallback(async (firstName: string, lastName: string, nickname: string, email: string, password: string, newsletterSubscribed: boolean): Promise<any> => {
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedNickname = nickname.trim();
        const trimmedEmail = email.trim();
        const normalizedNickname = trimmedNickname.toLowerCase();

        if (!trimmedNickname || !trimmedEmail || !trimmedFirstName || !trimmedLastName) {
            throw new Error("All fields must be filled out.");
        }

        try {
            // Add timeout to prevent infinite processing
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Signup timeout - please check your internet connection')), 15000)
            );

            const signupPromise = (async () => {
                console.log("🚀 Starting signup process...");
                
                // Skip nickname check for now to avoid timeout issues
                console.log("⚠️ Skipping nickname check to avoid timeout...");

                // Simple signup without complex options
                console.log("📝 Creating user account...");
                const authSignupPromise = supabase.auth.signUp({ 
                    email: trimmedEmail, 
                    password,
                    options: {
                        data: {
                            first_name: trimmedFirstName,
                            last_name: trimmedLastName,
                            nickname: trimmedNickname,
                            newsletter_subscribed: newsletterSubscribed,
                        }
                    }
                });
                
                const authTimeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Auth signup timeout')), 10000)
                );
                
                const { data, error: authError } = await Promise.race([
                    authSignupPromise,
                    authTimeoutPromise
                ]) as any;
                
                if (authError) {
                    console.error("❌ Auth signup error:", authError);
                    if (authError.message.includes('User already registered')) {
                        throw new Error('This email is already registered. Please try logging in or resetting your password.');
                    }
                    if (authError.message.includes('Database error')) {
                        throw new Error('Database error. Please try again in a few moments.');
                    }
                    throw new Error(authError.message || 'Signup failed. Please try again.');
                }

                if (!data.user) {
                    throw new Error("Signup failed. Could not create user.");
                }

                console.log("✅ User created successfully:", data.user.id);
                console.log("🎉 Signup completed successfully!");
                
                // Check if email confirmation is required
                if (data.user && !data.user.email_confirmed_at) {
                    console.log("📧 Email confirmation required");
                    // Don't throw error, just show success message
                    console.log("✅ Signup successful! Please check your email and click the confirmation link.");
                    return data; // Return data to resolve Promise
                }
                
                return data; // Return data for confirmed users
            })();

            await Promise.race([signupPromise, timeoutPromise]);
            
        } catch (error) {
            console.error("💥 Signup error:", error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("❌ Logout error:", error);
                throw error;
            }
            setUser(null);
        } catch (error) {
            console.error("💥 Logout failed:", error);
            throw error;
        }
    }, []);

    const updateUser = useCallback(async (userId: string, updates: Partial<Pick<User, 'firstName' | 'lastName' | 'nickname' | 'profilePicture'>>): Promise<User> => {
        const profileUpdates: { [key: string]: any } = {};
        if (updates.firstName) profileUpdates.first_name = updates.firstName.trim();
        if (updates.lastName) profileUpdates.last_name = updates.lastName.trim();
        if (updates.profilePicture) profileUpdates.profile_picture = updates.profilePicture;

        if (updates.nickname) {
            const trimmedNickname = updates.nickname.trim();
            if (!trimmedNickname) {
                throw new Error("Nickname cannot be empty.");
            }
            
            // Uniqueness check
            const { data: existingProfile, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('nickname', trimmedNickname.toLowerCase())
                .single();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = 0 rows, i.e. not found
                throw checkError;
            }

            if (existingProfile && existingProfile.id !== userId) {
                throw new Error('This nickname is already taken. Please choose another one.');
            }
            
            // Update auth user metadata for display casing
            const { error: authUpdateError } = await supabase.auth.updateUser({
                data: { nickname: trimmedNickname }
            });

            if (authUpdateError) throw authUpdateError;

            profileUpdates.nickname = trimmedNickname; // This will be lowercased by a DB trigger for lookups
        }
    
        const { data, error } = await supabase
            .from('profiles')
            .update(profileUpdates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            if (error.message.includes('duplicate key value violates unique constraint')) {
                throw new Error('This nickname is already taken.');
            }
            throw error;
        }
        if (!data) throw new Error("Could not update profile.");
        
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const updatedUser = mapProfileToUser(data, authUser);
        setUser(updatedUser);
        return updatedUser;
    }, []);
    
    const changePassword = useCallback(async (userId: string, currentPassword: string, newPassword: string) => {
        if (!user) throw new Error("User not authenticated.");
        
        const { error: reauthError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
        });

        if (reauthError) {
            throw new Error("Incorrect current password.");
        }

        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

        if (updateError) {
            throw updateError;
        }
    }, [user]);
    
    const signInWithProvider = useCallback(async (provider: 'google') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) throw error;
    }, []);
    
    const sendPasswordResetEmail = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (error) throw error;
    }, []);

    const updatePassword = useCallback(async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
    }, []);

    const fetchAllUsers = useCallback(async (): Promise<User[]> => {
        // Check if user is admin or super-admin
        if (!user || (!user.roles.includes('admin') && !user.roles.includes('super-admin'))) {
            throw new Error('Insufficient permissions');
        }
        
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data.map((profile: any) => mapProfileToUser(profile, null));
    }, [user]);

    const updateUserRoles = useCallback(async (userId: string, roles: UserRole[]) => {
        // Check if user is admin or super-admin
        if (!user || (!user.roles.includes('admin') && !user.roles.includes('super-admin'))) {
            throw new Error('Insufficient permissions');
        }
        
        const { error } = await supabase
            .from('profiles')
            .update({ roles: roles, updated_at: new Date().toISOString() })
            .eq('id', userId);
            
        if (error) throw error;
    }, [user]);

    const deleteUserAsAdmin = useCallback(async (userId: string) => {
        // Check if user is admin or super-admin
        if (!user || (!user.roles.includes('admin') && !user.roles.includes('super-admin'))) {
            throw new Error('Insufficient permissions');
        }
        
        // Delete from profiles table (this will cascade to auth.users due to foreign key)
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);
            
        if (error) throw error;
    }, [user]);
    
    const deleteUserAccount = useCallback(async () => {
        if(!user) throw new Error("Not logged in.");
        
        
        try {
            // First delete all related data
            const { error: ordersError } = await supabase
                .from('orders')
                .delete()
                .eq('user_id', user.id);
            if (ordersError) console.warn("⚠️ Orders deletion warning:", ordersError);

            const { error: favoritesError } = await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', user.id);
            if (favoritesError) console.warn("⚠️ Favorites deletion warning:", favoritesError);

            const { error: cartError } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id);
            if (cartError) console.warn("⚠️ Cart deletion warning:", cartError);

            // Mark profile as deleted and deactivate
            const deletedTimestamp = Date.now();
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    is_active: false,
                    email: `deleted_${deletedTimestamp}@deleted.com`,
                    first_name: 'Deleted',
                    last_name: 'User',
                    nickname: `deleted_${deletedTimestamp}`,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);
                
            if (profileError) {
                console.error("❌ Profile update error:", profileError);
                throw profileError;
            }
            
            
            // Finally sign out the user
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) {
                console.error("❌ Sign out error:", signOutError);
                // Don't throw here as profile is already marked as deleted
            }
            
            setUser(null);
        } catch (error) {
            console.error("💥 Account deletion failed:", error);
            throw error;
        }
    }, [user]);

    const value = useMemo(() => ({
        user,
        loading,
        isPasswordRecoveryFlow,
        login,
        signup,
        logout,
        updateUser,
        changePassword,
        signInWithProvider,
        sendPasswordResetEmail,
        updatePassword,
        fetchAllUsers,
        updateUserRoles,
        deleteUserAsAdmin,
        deleteUserAccount,
    }), [
        user, loading, isPasswordRecoveryFlow, login, signup, logout, 
        updateUser, changePassword, signInWithProvider, 
        sendPasswordResetEmail, updatePassword, fetchAllUsers, 
        updateUserRoles, deleteUserAsAdmin, deleteUserAccount
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};