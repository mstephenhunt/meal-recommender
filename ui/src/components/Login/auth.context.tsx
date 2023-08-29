import React, { createContext, useContext } from 'react';
import { AuthService } from './auth.service';

const AuthContext = createContext<AuthService | null>(null);

export const AuthProvider: React.FC<{ authService: AuthService; children: React.ReactNode }> = ({
  authService,
  children,
}) => {
  return <AuthContext.Provider value={authService}>{children}</AuthContext.Provider>;
};

export const useAuthService = () => {
  const authService = useContext(AuthContext);
  if (!authService) {
    throw new Error('useAuthService must be used within an AuthProvider');
  }
  return authService;
};
