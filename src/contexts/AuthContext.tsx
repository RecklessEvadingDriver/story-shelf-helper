import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const createProfile = async (userId: string) => {
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          dark_mode: false,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        toast.error("Failed to create user profile");
      }
    } catch (error) {
      console.error("Error in profile creation:", error);
      toast.error("Failed to create user profile");
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
        navigate('/');
        toast.success("Successfully signed in!");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
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
        await createProfile(data.user.id);
        setUser(data.user);
        navigate('/');
        toast.success("Successfully signed up!");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Signed out successfully");
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        createProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (event === 'SIGNED_IN') {
          await createProfile(session.user.id);
          navigate('/');
        }
      } else {
        setUser(null);
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};