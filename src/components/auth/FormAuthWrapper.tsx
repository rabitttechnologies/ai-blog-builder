
import React, { ReactNode } from "react";
import { useAuth } from "@/context/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface FormAuthWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper component that ensures form components are only rendered
 * after authentication state is fully established
 */
const FormAuthWrapper: React.FC<FormAuthWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  const { isLoading } = useAuth();
  
  // If auth is still loading, show fallback or skeleton
  if (isLoading) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4 mx-auto mt-6" />
      </div>
    );
  }
  
  // Auth is ready, safe to render form components
  return <>{children}</>;
};

export default FormAuthWrapper;
