import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const createProfile = async (userId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: userId,
          dark_mode: false,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Generate a proper UUID for the user
      const userId = crypto.randomUUID();
      const mockUser: User = { 
        id: userId,
        email, 
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user'
      };
      
      // Create or update profile with the UUID
      await createProfile(userId, email);
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/');
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: "Please check your credentials and try again.",
      });
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Generate a proper UUID for the user
      const userId = crypto.randomUUID();
      const mockUser: User = { 
        id: userId,
        email, 
        name,
        role: 'user'
      };

      // Create profile with the UUID
      await createProfile(userId, email);
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      navigate('/');
    } catch (error) {
      console.error('Sign up error:', error);
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