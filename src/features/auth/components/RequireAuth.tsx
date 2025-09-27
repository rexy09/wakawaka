import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import { useAuth } from '../context/FirebaseAuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  fallbackPath = "/signin"
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  // If not authenticated, redirect to fallback path with current location
  if (!isAuthenticated) {
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace
      />
    );
  }

  // If authenticated, render children
  return <>{children}</>;
};