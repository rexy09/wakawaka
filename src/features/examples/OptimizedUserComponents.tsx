import { Text, Avatar, Group } from "@mantine/core";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IAuthUser } from "../auth/types";
import { useUserProfile, useUserProfileFields } from "../auth/hooks/useUserProfile";

// Example 1: Using minimal auth user data (no additional fetch needed)
export const UserHeader = () => {
  const authUser = useAuthUser<IAuthUser>();
  
  return (
    <Group>
      <Avatar src={authUser?.avatarURL} alt={authUser?.fullName} />
      <div>
        <Text fw={500}>{authUser?.fullName}</Text>
        <Text size="sm" c="dimmed">{authUser?.email}</Text>
      </div>
    </Group>
  );
};

// Example 2: Using specific profile fields when needed
export const UserContactInfo = () => {
  const { phoneNumber, country, loading } = useUserProfileFields(['phoneNumber', 'country']);
  
  if (loading) return <Text>Loading contact info...</Text>;
  
  return (
    <div>
      <Text>Phone: {phoneNumber || 'Not provided'}</Text>
      <Text>Country: {country?.name || 'Not provided'}</Text>
    </div>
  );
};

// Example 3: Using full profile when needed
export const UserProfileComplete = () => {
  const { profile, loading, error } = useUserProfile();
  
  if (loading) return <Text>Loading profile...</Text>;
  if (error) return <Text c="red">Error: {error}</Text>;
  if (!profile) return <Text>No profile found</Text>;
  
  return (
    <div>
      <Text>Gender: {profile.gender || 'Not specified'}</Text>
      <Text>Phone: {profile.phoneNumber || 'Not provided'}</Text>
      <Text>Status: {profile.status}</Text>
      <Text>Last Updated: {profile.updatedAt?.toString()}</Text>
    </div>
  );
};
