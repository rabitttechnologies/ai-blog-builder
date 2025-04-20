
import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/auth";
import { Skeleton } from "@/components/ui/skeleton";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const renderTimeRef = useRef(performance.now());
  
  // Log rendering performance
  useEffect(() => {
    const renderTime = performance.now() - renderTimeRef.current;
    console.log(`Login page render time: ${Math.round(renderTime)}ms - Auth state:`, { isAuthenticated, isLoading });
    
    // Mark the LCP element for performance monitoring
    if (document.querySelector('.logo-text')) {
      (window as any).lcpElementMarked = true;
      console.log('LCP element marked: Logo text');
    }
  }, [isAuthenticated, isLoading]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("Login page - Already authenticated, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading indicator if the auth state is still loading
  if (isLoading) {
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

  // If user is authenticated, the useEffect will handle redirection
  // This prevents the component from rendering anything while waiting for navigation
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
      <Helmet>
        <title>Log In - Insight Writer AI</title>
        <meta name="description" content="Log in to your Insight Writer AI account to create SEO-optimized blogs using AI technology." />
        <link rel="preload" as="image" href="/og-image.png" />
      </Helmet>
      
      <div className="w-full max-w-md mb-8">
        <Link to="/" className="inline-block mb-6">
          <h1 className="logo-text text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400" style={{width: 'auto', height: 'auto'}}>
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
