import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useAuthOperations = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check admin status.",
      });
    }
  };

  const createProfile = async (userId: string, name: string) => {
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: name,
          role: 'user',
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;
    } catch (error) {
      console.error("Error in profile creation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user profile. Please try again.",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        setUser(data.user);
        await checkAdminStatus(data.user.id);
        navigate('/');
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      throw new Error(error.message || "Failed to sign in");
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;
      
      if (data.user) {
        await createProfile(data.user.id, name);
        setUser(data.user);
        setIsAdmin(false);
        navigate('/');
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your registration.",
        });
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      throw new Error(error.message || "Failed to create account");
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAdmin(false);
      navigate('/auth');
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error signing out",
      });
    }
  };

  return {
    user,
    setUser,
    isAdmin,
    loading,
    setLoading,
    signIn,
    signUp,
    signOut,
    checkAdminStatus,
    createProfile,
  };
};