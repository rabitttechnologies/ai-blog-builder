
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Log authentication status for debugging
    console.log("AuthGuard - Auth status:", { 
      isAuthenticated, 
      isLoading, 
      isAdmin: user?.isAdmin,
      path: location.pathname 
    });
  }, [isAuthenticated, isLoading, user, location.pathname]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    console.log("AuthGuard - Loading auth state");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          <Skeleton className="h-16 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("AuthGuard - Not authenticated, redirecting to login");
    // Save the location they were trying to access for redirection after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If admin access is required but user is not admin
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated (and is admin if admin is required)
  return <>{children}</>;
};

export default AuthGuard;
