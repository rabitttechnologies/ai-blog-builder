
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/auth";
import { Skeleton } from "@/components/ui/skeleton";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Try to get the return URL from location state, default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";
  
  console.log("Login page render - Auth state:", { isAuthenticated, isLoading });

  // Redirect authenticated users to where they were trying to go
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log(`Login page - Authenticated, redirecting to: ${from}`);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  // Show loading indicator if the auth state is still loading
  if (isLoading) {
    console.log("Login page - Loading auth state");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-8" />
          <Skeleton className="h-[300px] w-full rounded-xl mb-8" />
        </div>
      </div>
    );
  }

  // Skip rendering the login form if already authenticated
  if (isAuthenticated) {
    console.log("Login page - Already authenticated, redirecting");
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
      <Helmet>
        <title>Log In - Insight Writer AI</title>
      </Helmet>
      
      <div className="w-full max-w-md mb-8">
        <Link to="/" className="inline-block mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            Insight Writer AI
          </h1>
        </Link>
        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
        <p className="text-foreground/70 mb-8">Log in to continue creating SEO-optimized blogs.</p>
        
        <LoginForm />
        
        <p className="text-center mt-8 text-foreground/70">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Start your free trial
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
