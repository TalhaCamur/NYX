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
            firstName: 'Admin',
            lastName: 'User',
            nickname: 'admin',
            email: 'admin@nyx.io',
            // In a real app, you would never store plaintext passwords. This is for simulation only.
            password: 'password123',
            roles: ['admin'],
            profilePicture: `https://ui-avatars.com/api/?name=Admin+User&background=9333ea&color=fff`,
        },
        {
            id: 'admin-02',
            firstName: 'Bedrettin Talha',
            lastName: 'Camur',
            nickname: 'NYX',
            email: 'bedrettinsahin2002@gmail.com',
            password: 'password123', // Simple password for simulation purposes
            roles: ['super-admin', 'admin'],
            profilePicture: `https://ui-avatars.com/api/?name=Bedrettin+Talha+Camur&background=db2777&color=fff`,
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
    login: (identifier: string, password: string) => Promise<void>;
    signup: (firstName: string, lastName: string, nickname: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userId: string, updates: Partial<Pick<User, 'firstName' | 'lastName' | 'nickname' | 'profilePicture'>>) => Promise<User>;
    changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
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

    const login = async (identifier: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const foundUser = allUsers.find(u => (u.email === identifier || u.nickname === identifier) && (u as any).password === password);
                if (foundUser) {
                    const { password: _, ...userToStore } = foundUser as any;
                    setUser(userToStore);
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
                    resolve();
                } else {
                    reject(new Error('Invalid credentials. Please try again.'));
                }
            }, 500);
        });
    };

    const signup = async (firstName: string, lastName: string, nickname: string, email: string, password: string): Promise<void> => {
         return new Promise((resolve, reject) => {
            setTimeout(() => {
                const existingUserByEmail = allUsers.find(u => u.email === email);
                if (existingUserByEmail) {
                    return reject(new Error('An account with this email already exists.'));
                }
                const existingUserByNickname = allUsers.find(u => u.nickname === nickname);
                if (existingUserByNickname) {
                    return reject(new Error('This nickname is already taken.'));
                }

                const newUser: User & { password?: string } = {
                    id: `user-${Date.now()}`,
                    firstName,
                    lastName,
                    nickname,
                    email,
                    password,
                    roles: ['user'],
                    profilePicture: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
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

    const updateUser = async (userId: string, updates: Partial<Pick<User, 'firstName' | 'lastName' | 'nickname' | 'profilePicture'>>): Promise<User> => {
        return new Promise((resolve, reject) => {
            let updatedUser: User | null = null;
            let error: Error | null = null;
            
            const updatedAllUsers = allUsers.map(u => {
                if (u.id === userId) {
                    if (updates.nickname && updates.nickname !== u.nickname) {
                        if (allUsers.some(existingUser => existingUser.nickname === updates.nickname && existingUser.id !== userId)) {
                            error = new Error('This nickname is already taken.');
                            return u;
                        }
                    }
                    updatedUser = { ...u, ...updates };
                    return updatedUser;
                }
                return u;
            });

            if (error) {
                return reject(error);
            }

            if (updatedUser) {
                setAllUsers(updatedAllUsers as User[]);
                if (user?.id === userId) {
                     const { password: _, ...userToStore } = updatedUser as any;
                     setUser(userToStore);
                     localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
                }
                resolve(updatedUser);
            } else {
                reject(new Error("User not found."));
            }
        });
    };
    
    const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
         return new Promise((resolve, reject) => {
            setTimeout(() => {
                const userIndex = allUsers.findIndex(u => u.id === userId);
                if (userIndex === -1) {
                    return reject(new Error("User not found."));
                }

                const userToUpdate = allUsers[userIndex] as User & { password?: string };

                if (userToUpdate.password !== currentPassword) {
                    return reject(new Error("Incorrect current password."));
                }

                const updatedUser = { ...userToUpdate, password: newPassword };
                const newAllUsers = [...allUsers];
                newAllUsers[userIndex] = updatedUser;
                
                setAllUsers(newAllUsers);
                resolve();
            }, 500);
        });
    }

    const value = { user, allUsers, setAllUsers, login, signup, logout, updateUser, changePassword };

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
