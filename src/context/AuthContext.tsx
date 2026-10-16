import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email?: string, name?: string) => void;
  logout: () => void;
  switchRole: (role: UserProfile['role']) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-001',
  fullName: 'Shivansh',
  email: 'shivansh@example.com',
  role: 'responder',
  institution: 'BPIT',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('resqra_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('resqra_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('resqra_user');
    }
  }, [user]);

  const login = (email: string = 'shivansh@example.com', name: string = 'Shivansh') => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      email,
      fullName: name
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserProfile['role']) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
