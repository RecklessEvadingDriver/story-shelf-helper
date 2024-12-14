import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock authentication functions (replace with Supabase after integration)
  const signIn = async (email: string, password: string) => {
    // Simulate API call
    setUser({ id: '1', email, name: 'John Doe' });
    navigate('/');
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Simulate API call
    setUser({ id: '1', email, name });
    navigate('/');
  };

  const signOut = async () => {
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    // Check for existing session
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};