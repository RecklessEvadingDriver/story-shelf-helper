import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{activeTab === "login" ? "Sign In" : "Create Account"} | BookStore</title>
        <meta 
          name="description" 
          content={activeTab === "login" 
            ? "Sign in to your BookStore account to access your personalized reading experience" 
            : "Join BookStore to discover and purchase your favorite books"
          } 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content={theme === 'dark' ? '#1a1a1a' : '#ffffff'} />
      </Helmet>

      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8 space-y-4"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {activeTab === "login" ? "Welcome Back" : "Join Our Community"}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {activeTab === "login"
                ? "Sign in to access your personalized bookshelf"
                : "Create an account to start your reading journey"}
            </p>
          </motion.div>

          <div className="bg-card dark:bg-card/95 p-6 md:p-8 rounded-xl shadow-lg border border-border/50 backdrop-blur-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                By continuing, you agree to our{" "}
                <button className="text-primary hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-primary hover:underline">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Auth;