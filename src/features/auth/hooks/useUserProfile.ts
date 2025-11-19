import { useEffect, useState } from "react";
import { useProfileServices } from "../../dashboard/profile/services";
import { useAuth } from "../context/FirebaseAuthContext";
import { IUser } from "../types";

/**
 * Custom hook to fetch additional user profile data
 * Only fetches when needed, reducing auth state size
 */
export const useUserProfile = () => {
  const { user: authUser } = useAuth();
  const { getUserData } = useProfileServices();
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!authUser?.uid) return;

    setLoading(true);
    setError(null);

    try {
      const userData = await getUserData(authUser.uid);
      if (userData) {
        setProfile(userData as IUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser?.uid && !profile) {
      fetchProfile();
    }
  }, [authUser?.uid]);

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
  };
};

/*
 * Hook to get specific user profile fields
 * Usage: const { phoneNumber, country, currency } = useUserProfileFields(['phoneNumber', 'country', 'currency']);
 */
export const useUserProfileFields = <T extends keyof IUser>(fields: T[]) => {
  const { profile, loading, error } = useUserProfile();
  
  const selectedFields = fields.reduce((acc, field) => {
    if (profile && field in profile) {
      acc[field] = profile[field];
    }
    return acc;
  }, {} as Partial<Pick<IUser, T>>);

  return {
    ...selectedFields,
    loading,
    error,
  };
};
