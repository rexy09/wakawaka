import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { IAuthUser } from '../types';

interface AuthContextType {
  // Firebase user
  firebaseUser: User | null;
  // Your app user data
  user: IAuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  // Auth actions
  signIn: (userData: IAuthUser, firebaseUser: User) => void;
  signOutUser: () => Promise<void>;

  // Token management
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  refreshToken: () => Promise<string | null>;

  // User data management
  updateUser: (userData: Partial<IAuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      // If Firebase user is null, clear app user data
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem('user_data');
      } else {
        // Try to restore user data from localStorage
        const savedUserData = localStorage.getItem('user_data');
        if (savedUserData) {
          try {
            const userData = JSON.parse(savedUserData);
            setUser(userData);
          } catch (error) {
            console.error('Error parsing saved user data:', error);
            localStorage.removeItem('user_data');
          }
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = (userData: IAuthUser, firebaseUserObj: User) => {
    setUser(userData);
    setFirebaseUser(firebaseUserObj);

    // Persist user data to localStorage
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem('user_data');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const getIdToken = async (forceRefresh: boolean = false): Promise<string | null> => {
    if (firebaseUser) {
      try {
        return await firebaseUser.getIdToken(forceRefresh);
      } catch (error) {
        console.error('Error getting ID token:', error);
        throw error;
      }
    }
    return null;
  };

  const refreshToken = async (): Promise<string | null> => {
    return getIdToken(true);
  };

  const updateUser = (userData: Partial<IAuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = useMemo(() => ({
    firebaseUser,
    user,
    loading,
    isAuthenticated: !!firebaseUser && !!user,
    signIn,
    signOutUser,
    getIdToken,
    refreshToken,
    updateUser,
  }), [firebaseUser, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};