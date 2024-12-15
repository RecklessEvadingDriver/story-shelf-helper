import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

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

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate API call
      const mockUser = { id: '1', email, name: email.split('@')[0] };
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
      const mockUser = { id: '1', email, name };
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