import React from 'react';
import { Button, Card, Text, Stack, Group, Badge, Loader } from '@mantine/core';
import { useFirebaseSession } from '../hooks/useFirebaseSession';

export const SessionInfoCard: React.FC = () => {
  const { loading, isAuthenticated, getSessionInfo } = useFirebaseSession();

  if (loading) {
    return <Loader size="sm" />;
  }

  if (!isAuthenticated) {
    return <Text>Not authenticated</Text>;
  }

  const sessionInfo = getSessionInfo();

  return (
    <Card withBorder>
      <Stack gap="sm">
        <Text size="lg" fw={600}>Session Information</Text>

        <Group>
          <Text size="sm">Status:</Text>
          <Badge color="green">Authenticated</Badge>
        </Group>

        {sessionInfo && (
          <>
            <Group>
              <Text size="sm">Email:</Text>
              <Text size="sm">{sessionInfo.email}</Text>
            </Group>

            <Group>
              <Text size="sm">Display Name:</Text>
              <Text size="sm">{sessionInfo.displayName || 'Not set'}</Text>
            </Group>

            <Group>
              <Text size="sm">Email Verified:</Text>
              <Badge color={sessionInfo.emailVerified ? 'green' : 'red'}>
                {sessionInfo.emailVerified ? 'Verified' : 'Not Verified'}
              </Badge>
            </Group>

            <Group>
              <Text size="sm">Last Sign In:</Text>
              <Text size="sm">{sessionInfo.metadata.lastSignInTime || 'Unknown'}</Text>
            </Group>
          </>
        )}
      </Stack>
    </Card>
  );
};

export const SessionControls: React.FC = () => {
  const {
    setPersistenceType,
    signOutUser,
    getIdToken,
    refreshTokenIfNeeded,
    isAuthenticated
  } = useFirebaseSession();

  const handleSetPersistence = async (type: 'local' | 'session' | 'none') => {
    try {
      await setPersistenceType(type);
      console.log(`Persistence set to: ${type}`);
    } catch (error) {
      console.error('Failed to set persistence:', error);
    }
  };

  const handleGetToken = async () => {
    try {
      const token = await getIdToken();
      console.log('Current token:', token);
    } catch (error) {
      console.error('Failed to get token:', error);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const token = await refreshTokenIfNeeded();
      console.log('Refreshed token:', token);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (!isAuthenticated) {
    return <Text>Please sign in to use session controls</Text>;
  }

  return (
    <Card withBorder>
      <Stack gap="md">
        <Text size="lg" fw={600}>Session Controls</Text>

        <Group>
          <Text size="sm">Persistence Settings:</Text>
        </Group>

        <Group>
          <Button
            size="xs"
            onClick={() => handleSetPersistence('local')}
          >
            Local (Until Sign Out)
          </Button>

          <Button
            size="xs"
            onClick={() => handleSetPersistence('session')}
          >
            Session Only
          </Button>

          <Button
            size="xs"
            onClick={() => handleSetPersistence('none')}
          >
            No Persistence
          </Button>
        </Group>

        <Group>
          <Button size="xs" onClick={handleGetToken}>
            Get ID Token
          </Button>

          <Button size="xs" onClick={handleRefreshToken}>
            Refresh Token
          </Button>

          <Button size="xs" color="red" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export const FirebaseSessionDemo: React.FC = () => {
  return (
    <Stack gap="lg">
      <Text size="xl" fw={700}>Firebase Session Management Demo</Text>
      <SessionInfoCard />
      <SessionControls />
    </Stack>
  );
};