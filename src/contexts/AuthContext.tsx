import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
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

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const generateUUID = () => {
    // This is a mock UUID generator for development
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate API call
      const mockUser: User = { 
        id: generateUUID(), // Using UUID format instead of "1"
        email, 
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user'
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: "Please check your credentials and try again.",
      });
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Simulate API call
      const mockUser: User = { 
        id: generateUUID(), // Using UUID format instead of "1"
        email, 
        name,
        role: 'user'
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: "Please try again later.",
      });
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate('/');
  };

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