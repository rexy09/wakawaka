import {
  User,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signOut
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../../config/firebase';

export type FirebasePersistenceType = 'local' | 'session' | 'none';

export const useFirebaseSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
      (user) => {
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Set Firebase persistence
  const setPersistenceType = async (persistenceType: FirebasePersistenceType) => {
    try {
      let persistence;
      switch (persistenceType) {
        case 'local':
          persistence = browserLocalPersistence; // Persists until explicit sign out
          break;
        case 'session':
          persistence = browserSessionPersistence; // Persists for session only
          break;
       
        default:
          persistence = browserLocalPersistence;
      }

      await setPersistence(auth, persistence);
    } catch (error) {
      console.error('Error setting persistence:', error);
      throw error;
    }
  };

  // Sign out user
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Get current user's ID token
  const getIdToken = async (forceRefresh: boolean = false) => {
    if (user) {
      try {
        return await user.getIdToken(forceRefresh);
      } catch (error) {
        console.error('Error getting ID token:', error);
        throw error;
      }
    }
    return null;
  };

  // Check if token is expired and refresh if needed
  const refreshTokenIfNeeded = async () => {
    if (user) {
      try {
        // Force refresh token to ensure it's valid
        const token = await user.getIdToken(true);
        return token;
      } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
      }
    }
    return null;
  };

  // Get user session info
  const getSessionInfo = () => {
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      providerData: user.providerData,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      }
    };
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    setPersistenceType,
    signOutUser,
    getIdToken,
    refreshTokenIfNeeded,
    getSessionInfo,
  };
};