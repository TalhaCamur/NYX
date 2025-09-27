import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { User, UserRole } from '../types';
import { createClient, Session, User as SupabaseUser } from '@supabase/supabase-js';

// --- Supabase Client Initialization ---
const supabaseUrl = 'https://dpbyrvnvxjlhvtooyuru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYnlydm52eGpsaHZ0b295dXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTExODAsImV4cCI6MjA3MzY4NzE4MH0.txkD2Awid_RJhWhFJb0I13QBseIHdrDqHfeGgXrG0EE';
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Helper Functions ---
const mapProfileToUser = (profile: any, authUser: SupabaseUser | null): User => ({
    id: profile.id,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    nickname: authUser?.user_metadata?.nickname || profile.nickname || 'user',
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
    const [loading, setLoading] = useState(true);
    const [isPasswordRecoveryFlow, setIsPasswordRecoveryFlow] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (session?.user) {
                    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                    if (profileError) {
                        console.warn("User exists in auth but not in profiles. Logging out.");
                        await supabase.auth.signOut();
                        return;
                    }
                    if (profile) {
                        setUser(mapProfileToUser(profile, session.user));
                    }
                }
            } catch (error) {
                console.error("Error fetching initial session:", error);
            } finally {
                setLoading(false);
            }
        };
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsPasswordRecoveryFlow(true);
            } else if (session?.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setUser(mapProfileToUser(profile, session.user));
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
    

    const login = useCallback(async (identifier: string, password: string): Promise<void> => {
        const trimmedIdentifier = identifier.trim();
    
        // Attempt to sign in with the identifier as an email first.
        const { error: emailLoginError } = await supabase.auth.signInWithPassword({
            email: trimmedIdentifier,
            password: password,
        });
    
        // If login is successful, we are done.
        if (!emailLoginError) {
            return;
        }
    
        // If the error is not "Invalid login credentials", it could be a network issue or something else.
        // In that case, we don't proceed to the nickname check and throw the original error.
        if (!emailLoginError.message.includes('Invalid login credentials')) {
            throw emailLoginError;
        }
    
        // Since email login failed with invalid credentials, now we try to treat the identifier as a nickname.
        // We normalize the nickname to lowercase for a case-insensitive lookup.
        const normalizedNickname = trimmedIdentifier.toLowerCase();
        const { data: emailFromNickname, error: rpcError } = await supabase.rpc('get_email_from_nickname', {
            nickname_to_find: normalizedNickname
        });
    
        // If the RPC call fails or doesn't return an email, it means the nickname doesn't exist.
        if (rpcError || !emailFromNickname) {
            // We throw the generic error because the user doesn't need to know if it was the email or nickname that failed.
            throw new Error("Invalid email/nickname or password.");
        }
    
        // If we found an email associated with the nickname, we try to sign in again with that email.
        const { error: nicknameLoginError } = await supabase.auth.signInWithPassword({
            email: emailFromNickname as string,
            password: password,
        });
    
        // If this second attempt fails, it implies the password was incorrect for the user with that nickname.
        if (nicknameLoginError) {
             if (nicknameLoginError.message.includes('Invalid login credentials')) {
                 throw new Error("Invalid email/nickname or password.");
            }
            throw nicknameLoginError;
        }
    
        // If we reach here, the login via nickname was successful.
    }, []);

    const signup = useCallback(async (firstName: string, lastName: string, nickname: string, email: string, password: string, newsletterSubscribed: boolean): Promise<void> => {
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedNickname = nickname.trim();
        const trimmedEmail = email.trim();
        const normalizedNickname = trimmedNickname.toLowerCase();

        if (!trimmedNickname || !trimmedEmail || !trimmedFirstName || !trimmedLastName) {
            throw new Error("All fields must be filled out.");
        }

        const { data: existingProfiles, error: checkError } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('nickname', normalizedNickname);

        if (checkError) throw checkError;
        if (existingProfiles && existingProfiles.length > 0) {
            throw new Error('This nickname is already taken. Please choose another one.');
        }

        const { data, error: authError } = await supabase.auth.signUp({ 
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
        
        if (authError) {
            if (authError.message.includes('User already registered')) {
                throw new Error('This email is already registered. Please try logging in or resetting your password.');
            }
            throw authError;
        }

        if (!data.user) {
            throw new Error("Signup failed. Could not create user.");
        }
    }, []);

    const logout = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
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
        const { data, error } = await supabase.rpc('get_all_users_with_profiles');
        if (error) throw error;
        return data.map((profile: any) => mapProfileToUser(profile, null));
    }, []);

    const updateUserRoles = useCallback(async (userId: string, roles: UserRole[]) => {
        const { error } = await supabase.rpc('update_user_roles', {
            user_id_to_update: userId,
            new_roles: roles,
        });
        if (error) throw error;
    }, []);

    const deleteUserAsAdmin = useCallback(async (userId: string) => {
        const { error } = await supabase.rpc('delete_user_by_admin', { user_id_to_delete: userId });
        if (error) throw error;
    }, []);
    
    const deleteUserAccount = useCallback(async () => {
        if(!user) throw new Error("Not logged in.");
        const { error } = await supabase.rpc('delete_own_user_account');
        if (error) throw error;
        setUser(null);
    }, [user]);

    const value = useMemo(() => ({
        user,
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
        user, isPasswordRecoveryFlow, login, signup, logout, 
        updateUser, changePassword, signInWithProvider, 
        sendPasswordResetEmail, updatePassword, fetchAllUsers, 
        updateUserRoles, deleteUserAsAdmin, deleteUserAccount
    ]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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