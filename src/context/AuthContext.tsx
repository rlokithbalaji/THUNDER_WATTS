import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User;
  currentRole: UserRole;
  login: (email: string, pass: string) => boolean;
  loginWithDemo: () => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  canPerformAction: (action: 'admin' | 'assess' | 'remediate' | 'view') => boolean;
}

const DEFAULT_USERS: Record<UserRole, User> = {
  'Security Administrator': {
    id: 'usr-admin-01',
    name: 'Sarah Connor (Admin)',
    email: 'admin@worldmonitor.demo',
    role: 'Security Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'Active',
    lastActive: 'Just now'
  },
  'Security Analyst': {
    id: 'usr-analyst-02',
    name: 'Alex Rivera (Analyst)',
    email: 'analyst@worldmonitor.demo',
    role: 'Security Analyst',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'Active',
    lastActive: 'Just now'
  },
  'Viewer': {
    id: 'usr-viewer-03',
    name: 'Morgan Vance (Viewer)',
    email: 'viewer@worldmonitor.demo',
    role: 'Viewer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    status: 'Active',
    lastActive: '5m ago'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('wm_auth') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('wm_role') as UserRole;
    return savedRole || 'Security Administrator';
  });

  const currentUser = DEFAULT_USERS[currentRole];

  useEffect(() => {
    localStorage.setItem('wm_auth', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('wm_role', currentRole);
  }, [isAuthenticated, currentRole]);

  const login = (email: string, pass: string): boolean => {
    // Demo login validation
    if (email === 'admin@worldmonitor.demo' && pass === 'Demo@123') {
      setCurrentRole('Security Administrator');
      setIsAuthenticated(true);
      return true;
    }
    if (email.toLowerCase().includes('analyst')) {
      setCurrentRole('Security Analyst');
      setIsAuthenticated(true);
      return true;
    }
    if (email.toLowerCase().includes('viewer')) {
      setCurrentRole('Viewer');
      setIsAuthenticated(true);
      return true;
    }
    // Accept standard demo entry
    setCurrentRole('Security Administrator');
    setIsAuthenticated(true);
    return true;
  };

  const loginWithDemo = () => {
    setCurrentRole('Security Administrator');
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const canPerformAction = (action: 'admin' | 'assess' | 'remediate' | 'view'): boolean => {
    if (action === 'view') return true;
    if (currentRole === 'Security Administrator') return true;
    if (currentRole === 'Security Analyst') {
      return action === 'assess' || action === 'remediate';
    }
    return false; // Viewer can only view
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        currentRole,
        login,
        loginWithDemo,
        logout,
        switchRole,
        canPerformAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
