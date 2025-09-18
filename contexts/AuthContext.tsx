import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { createClient, Session, User as SupabaseUser } from '@supabase/supabase-js';

// --- Supabase Client Initialization ---
// In a real production app, these would be in environment variables.
const supabaseUrl = 'https://dpbyrvnvxjlhvtooyuru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYnlydm52eGpsaHZ0b295dXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTExODAsImV4cCI6MjA3MzY4NzE4MH0.txkD2Awid_RJhWhFJb0I13QBseIHdrDqHfeGgXrG0EE';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Helper Functions ---
const mapProfileToUser = (profile: any, authUser: SupabaseUser | null): User => ({
    id: profile.id,
    firstName: profile.first_name,
    lastName: profile.last_name,
    nickname: profile.nickname,
    email: authUser?.email || profile.email,
    roles: profile.roles,
    profilePicture: profile.profile_picture,
});

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => Promise<void>;
    signup: (firstName: string, lastName: string, nickname: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userId: string, updates: Partial<Pick<User, 'firstName' | 'lastName' | 'nickname' | 'profilePicture'>>) => Promise<User>;
    changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
    signInWithProvider: (provider: 'google' | 'facebook') => Promise<void>;
    fetchAllUsers: () => Promise<User[]>;
    updateUserRoles: (userId: string, roles: UserRole[]) => Promise<void>;
    deleteUserAsAdmin: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setUser(mapProfileToUser(profile, session.user));
                }
            }
            setLoading(false);
        };
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setUser(mapProfileToUser(profile, session.user));
                }
            } else {
                setUser(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);
    

    const login = async (identifier: string, password: string): Promise<void> => {
        const trimmedIdentifier = identifier.trim();
        
        // First, try to sign in with the identifier as an email.
        let { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
            email: trimmedIdentifier,
            password: password,
        });
    
        // If the first attempt fails with "Invalid credentials", it might be a nickname.
        if (signInError && signInError.message.includes('Invalid login credentials')) {
            const normalizedNickname = trimmedIdentifier.toLowerCase();
            
            // Use the secure RPC function to get email from nickname
            const { data: emailFromNickname, error: rpcError } = await supabase.rpc('get_email_from_nickname', {
                nickname_to_find: normalizedNickname
            });
            
            // If we found an email and there was no RPC error, try signing in again with it.
            if (emailFromNickname && !rpcError) {
                const realEmail = emailFromNickname as string;
                // Overwrite the previous failed results with a new attempt
                const retryResult = await supabase.auth.signInWithPassword({
                    email: realEmail,
                    password: password,
                });
                sessionData = retryResult.data;
                signInError = retryResult.error;
            }
        }
    
        // After all attempts, if there's still an error, throw it.
        if (signInError) {
            // Provide a single, consistent error message for failed logins.
            if (signInError.message.includes('Invalid login credentials')) {
                throw new Error("Invalid email/nickname or password.");
            }
            // For other errors (e.g., email not confirmed), throw the original message.
            throw signInError;
        }
    
        // If login was successful but we don't have user data, something is wrong.
        if (!sessionData?.user) {
            throw new Error("Login failed unexpectedly. Please try again.");
        }
        
        // A successful login will trigger the onAuthStateChange listener,
        // which will then fetch the user profile and update the state.
        // No need to manually set the user here.
    };

    const signup = async (firstName: string, lastName: string, nickname: string, email: string, password: string): Promise<void> => {
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedNickname = nickname.trim();
        const trimmedEmail = email.trim();
        const normalizedNickname = trimmedNickname.toLowerCase(); // Normalize nickname

        if (!trimmedNickname || !trimmedEmail || !trimmedFirstName || !trimmedLastName) {
            throw new Error("All fields must be filled out.");
        }

        // 1. Pre-check if normalized nickname is already taken.
        const { data: existingProfiles, error: checkError } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('nickname', normalizedNickname); // Use eq with normalized nickname

        if (checkError) {
            throw new Error(`An error occurred during signup: ${checkError.message}`);
        }

        if (existingProfiles && existingProfiles.length > 0) {
            throw new Error('This nickname is already taken. Please choose another one.');
        }

        // 2. Proceed with auth user creation
        const { data: authData, error: authError } = await supabase.auth.signUp({ email: trimmedEmail, password });
        if (authError) {
            if (authError.message.includes('User already registered')) {
                throw new Error('This email address is already in use.');
            }
            throw authError;
        }
        if (!authData.user) throw new Error("Signup failed: user object not returned.");

        // 3. Create the user profile
        const userRoles: UserRole[] = trimmedEmail.toLowerCase() === 'bedrettinsahin2002@gmail.com' ? ['super-admin'] : ['user'];
        const { error: profileError } = await supabase.from('profiles').insert([{
            id: authData.user.id,
            first_name: trimmedFirstName,
            last_name: trimmedLastName,
            nickname: normalizedNickname, // Store the normalized nickname
            email: trimmedEmail,
            roles: userRoles,
            profile_picture: `https://ui-avatars.com/api/?name=${trimmedFirstName}+${trimmedLastName}&background=random`,
        }]);

        if (profileError) {
            console.error("CRITICAL: User created in auth but profile creation failed.", profileError);
            if (profileError.message.includes('duplicate key value violates unique constraint')) {
                 throw new Error('This nickname or email is already taken. Please choose another one.');
            }
            throw new Error(`Account created but profile setup failed. Please contact support. Error: ${profileError.message}`);
        }
    };
    
    const signInWithProvider = async (provider: 'google' | 'facebook'): Promise<void> => {
        const { error } = await supabase.auth.signInWithOAuth({ provider });
        if (error) throw new Error(`Could not sign in with ${provider}: ${error.message}`);
    };

    const logout = async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    const updateUser = async (userId: string, updates: Partial<Pick<User, 'firstName' | 'lastName' | 'nickname' | 'profilePicture'>>): Promise<User> => {
        const updatesForDb: { [key: string]: any } = {};
        if (updates.firstName) updatesForDb.first_name = updates.firstName.trim();
        if (updates.lastName) updatesForDb.last_name = updates.lastName.trim();
        if (updates.profilePicture) updatesForDb.profile_picture = updates.profilePicture;

        if (updates.nickname) {
            const normalizedNickname = updates.nickname.trim().toLowerCase();
            if (normalizedNickname === "") throw new Error("Nickname cannot be empty.");

            // Check if the normalized nickname is already taken by another user
            const { data: existingProfile, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('nickname', normalizedNickname)
                .neq('id', userId)
                .limit(1);

            if (checkError) {
                throw new Error(`Error checking nickname: ${checkError.message}`);
            }

            if (existingProfile && existingProfile.length > 0) {
                throw new Error('This nickname is already taken. Please choose another one.');
            }

            updatesForDb.nickname = normalizedNickname;
        }

        if (Object.keys(updatesForDb).length === 0) {
            if (!user) throw new Error("User not found");
            return user;
        }

        const { data, error } = await supabase
            .from('profiles')
            .update(updatesForDb)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        const authUserResult = await supabase.auth.getUser();
        const authUser = authUserResult.data.user;
        const updatedUser = mapProfileToUser(data, authUser);
        setUser(updatedUser);
        return updatedUser;
    };
    
    const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
        if (!user?.email) throw new Error("User email not found. Cannot verify password.");
        
        // Step 1: Verify current password by attempting to sign in.
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
        });
        if (signInError) throw new Error("Incorrect current password.");

        // Step 2: If sign-in is successful, update the password for the currently authenticated user.
        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
        if (updateError) throw updateError;
    };

    const fetchAllUsers = async (): Promise<User[]> => {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        // Supabase returns snake_case, we need to map to camelCase for our app's User type
        return data.map(profile => ({
            id: profile.id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            nickname: profile.nickname,
            email: profile.email,
            roles: profile.roles,
            profilePicture: profile.profile_picture,
        }));
    };

    const updateUserRoles = async (userId: string, roles: UserRole[]): Promise<void> => {
        const { error } = await supabase.from('profiles').update({ roles }).eq('id', userId);
        if (error) throw error;
    };
    
    const deleteUserAsAdmin = async (userId: string): Promise<void> => {
        // NOTE: With client-side anon key, we can only delete from our public 'profiles' table.
        // Deleting from 'auth.users' requires admin privileges (service_role key) on the backend.
        // This will remove the user from the app's user management UI.
        const { error } = await supabase.from('profiles').delete().eq('id', userId);
        if (error) throw error;
    };

    const value = { user, login, signup, logout, updateUser, changePassword, signInWithProvider, fetchAllUsers, updateUserRoles, deleteUserAsAdmin };

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