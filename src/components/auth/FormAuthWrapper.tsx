
import React, { ReactNode, useEffect, useRef } from "react";
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
  const renderTimeRef = useRef(performance.now());
  
  // Log rendering performance
  useEffect(() => {
    const renderTime = performance.now() - renderTimeRef.current;
    console.log(`FormAuthWrapper render time: ${Math.round(renderTime)}ms - isLoading: ${isLoading}`);
  }, [isLoading]);
  
  // If auth is still loading, show fallback or skeleton
  if (isLoading) {
    if (fallback) return <>{fallback}</>;
    
    // Return optimized skeleton with explicit dimensions to prevent layout shifts
    return (
      <div className="space-y-4" style={{minHeight: '320px'}}>
        <Skeleton className="h-10 w-full" style={{height: '40px', width: '100%'}} />
        <Skeleton className="h-10 w-full" style={{height: '40px', width: '100%'}} />
        <Skeleton className="h-10 w-full" style={{height: '40px', width: '100%'}} />
        <Skeleton className="h-10 w-3/4 mx-auto mt-6" style={{height: '40px', width: '75%', marginTop: '24px', marginLeft: 'auto', marginRight: 'auto'}} />
      </div>
    );
  }
  
  // Auth is ready, safe to render form components
  return <>{children}</>;
};

export default FormAuthWrapper;
