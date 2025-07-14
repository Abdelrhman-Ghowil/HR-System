
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../components/auth/LoginPage';
import Dashboard from '../components/dashboard/Dashboard';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return <Dashboard />;
};

export default Index;
