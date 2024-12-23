import { createContext, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, AuthProviderProps } from "./types";
import { useAuthOperations } from "./useAuthOperations";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
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
  } = useAuthOperations();

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await checkAdminStatus(session.user.id);
          await createProfile(session.user.id, session.user.user_metadata.full_name || '');
          navigate('/');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to initialize authentication. Please try again.",
        });
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (session?.user) {
        setUser(session.user);
        await checkAdminStatus(session.user.id);
        
        if (event === 'SIGNED_IN') {
          await createProfile(session.user.id, session.user.user_metadata.full_name || '');
          navigate('/');
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        } else if (event === 'USER_UPDATED') {
          await createProfile(session.user.id, session.user.user_metadata.full_name || '');
          navigate('/');
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
        }
      } else {
        setUser(null);
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};