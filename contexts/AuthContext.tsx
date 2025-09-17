



import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

// In a real app, this would come from a backend. For now, we simulate a user database in localStorage.
const USERS_DB_KEY = 'nyx-users';
const CURRENT_USER_KEY = 'nyx-current-user';

// This function now initializes the user database with a default set of users.
const initializeUsers = () => {
    const defaultUsers: (User & { password: string })[] = [
        {
            id: 'admin-01',
            name: 'Admin',
            email: 'admin@nyx.io',
            // In a real app, you would never store plaintext passwords. This is for simulation only.
            password: 'password123',
            roles: ['admin'],
        },
        {
            id: 'admin-02',
            name: 'Bedrettin Sahin',
            email: 'bedrettinsahin2002@gmail.com',
            password: 'password123', // Simple password for simulation purposes
            roles: ['super-admin', 'admin'],
        }
    ];
    // Set the default users in localStorage, overwriting any previous data.
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultUsers));
    // Also clear the currently logged-in user session to ensure a clean state.
    localStorage.removeItem(CURRENT_USER_KEY);
    return defaultUsers;
};


interface AuthContextType {
    user: User | null;
    allUsers: User[];
    setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>(() => initializeUsers());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Persist allUsers to localStorage whenever it changes
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(allUsers));
    }, [allUsers]);

    useEffect(() => {
        // Check for a logged-in user on initial load
        try {
            const storedUser = localStorage.getItem(CURRENT_USER_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem(CURRENT_USER_KEY);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const foundUser = allUsers.find(u => u.email === email && (u as any).password === password);
                if (foundUser) {
                    const { password: _, ...userToStore } = foundUser as any;
                    setUser(userToStore);
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
                    resolve();
                } else {
                    reject(new Error('Invalid email or password.'));
                }
            }, 500);
        });
    };

    const signup = async (name: string, email: string, password: string): Promise<void> => {
         return new Promise((resolve, reject) => {
            setTimeout(() => {
                const existingUser = allUsers.find(u => u.email === email);
                if (existingUser) {
                    return reject(new Error('An account with this email already exists.'));
                }

                const newUser: User & { password?: string } = {
                    id: `user-${Date.now()}`,
                    name,
                    email,
                    password,
                    roles: ['user'],
                };
                
                setAllUsers(prev => [...prev, newUser]);

                const { password: _, ...userToStore } = newUser;
                setUser(userToStore);
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
                resolve();
            }, 500);
        });
    };

    const logout = async (): Promise<void> => {
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    };

    const value = { user, allUsers, setAllUsers, login, signup, logout };

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