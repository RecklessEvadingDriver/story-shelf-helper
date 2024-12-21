import { useState, useEffect, Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Sign In" : "Create Account"} | BookStore</title>
        <meta 
          name="description" 
          content={isLogin 
            ? "Sign in to your BookStore account to access your personalized reading experience" 
            : "Join BookStore to discover and purchase your favorite books"
          } 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content={theme === 'dark' ? '#1a1a1a' : '#ffffff'} />
      </Helmet>

      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key="header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8 space-y-4"
            >
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {isLogin ? "Welcome Back" : "Join Our Community"}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {isLogin
                  ? "Sign in to access your personalized bookshelf"
                  : "Create an account to start your reading journey"}
              </p>
            </motion.div>

            <motion.div 
              key="form-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card dark:bg-card/95 p-6 md:p-8 rounded-xl shadow-lg border border-border/50 backdrop-blur-sm"
            >
              <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }>
                {isLogin ? <LoginForm /> : <RegisterForm />}
              </Suspense>

              <div className="mt-8 text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {isLogin ? "New to BookStore?" : "Already have an account?"}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full md:w-auto hover:bg-secondary dark:hover:bg-accent/20 transition-all duration-200 font-medium"
                  aria-label={isLogin ? "Switch to create account form" : "Switch to sign in form"}
                >
                  {isLogin ? "Create Account" : "Sign In"}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

export default Auth;