import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";

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
            ? "Sign in to your BookStore account to access your bookshelf and continue reading" 
            : "Create a BookStore account to start your reading journey"
          } 
        />
      </Helmet>

      <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground transition-colors duration-300 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 space-y-3"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isLogin ? "Welcome Back" : "Join Our Community"}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-sm mx-auto">
              {isLogin
                ? "Sign in to access your bookshelf and continue reading"
                : "Create an account to start your reading journey"}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card dark:bg-card/95 p-6 md:p-8 rounded-xl shadow-lg border border-border/50 backdrop-blur-sm"
          >
            {isLogin ? <LoginForm /> : <RegisterForm />}

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "New to our bookstore?" : "Already have an account?"}
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full md:w-auto hover:bg-secondary dark:hover:bg-accent/20 transition-colors duration-200"
                aria-label={isLogin ? "Switch to create account form" : "Switch to sign in form"}
              >
                {isLogin ? "Create Account" : "Sign In"}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Auth;