import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Auth = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth page mounted, user:", user, "isLoading:", isLoading);
    if (user && !isLoading) {
      console.log("Redirecting authenticated user to home");
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-secondary/30 to-background dark:from-background dark:via-secondary/5 dark:to-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-foreground dark:text-foreground/90">
            Welcome to BookStore
          </h2>
          <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
            Sign in to your account or create a new one
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;