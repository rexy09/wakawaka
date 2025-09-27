import { Text } from "@mantine/core";
import { useUserProfile, useUserProfileFields } from "../auth/hooks/useUserProfile";



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
