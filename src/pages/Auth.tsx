import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">
              {isLogin ? "Welcome Back" : "Join Our Community"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to access your bookshelf and continue reading"
                : "Create an account to start your reading journey"}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-8 rounded-lg shadow-lg"
          >
            {isLogin ? <LoginForm /> : <RegisterForm />}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "New to our bookstore?" : "Already have an account?"}
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="mt-2 hover:bg-secondary"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;