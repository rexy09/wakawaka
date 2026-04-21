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

function isValidAuthUser(data: unknown): data is IAuthUser {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.uid === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.fullName === 'string'
  );
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (!firebaseUser) {
        setUser(null);
        sessionStorage.removeItem('user_data');
      } else {
        const savedUserData = sessionStorage.getItem('user_data');
        if (savedUserData) {
          try {
            const userData = JSON.parse(savedUserData);
            if (isValidAuthUser(userData)) {
              setUser(userData);
            } else {
              sessionStorage.removeItem('user_data');
            }
          } catch {
            sessionStorage.removeItem('user_data');
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

    sessionStorage.setItem('user_data', JSON.stringify(userData));
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    sessionStorage.removeItem('user_data');
  };

  const getIdToken = async (forceRefresh: boolean = false): Promise<string | null> => {
    if (firebaseUser) {
      return await firebaseUser.getIdToken(forceRefresh);
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
      sessionStorage.setItem('user_data', JSON.stringify(updatedUser));
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