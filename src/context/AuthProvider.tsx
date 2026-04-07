import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginRequest, fetchUsers, findUserByEmail, type User } from '../api/auth';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async (email: string) => {
    const users = await fetchUsers();
    const found = findUserByEmail(users, email);
    if (found) {
      setUser(found);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('auth_token').then((storedToken) => {
      if (storedToken) setToken(storedToken);
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const newToken = await loginRequest(email, password);
    await AsyncStorage.setItem('auth_token', newToken);
    setToken(newToken);
    await loadUser(email);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
