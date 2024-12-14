import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to access your account"
                : "Sign up to start exploring books"}
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-lg animate-fadeIn">
            {isLogin ? <LoginForm /> : <RegisterForm />}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="mt-2"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;