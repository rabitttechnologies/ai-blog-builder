
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isAuthError: boolean;
  isFormContextError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isAuthError: false,
    isFormContextError: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    console.error("ErrorBoundary - Caught error:", error.message);
    
    // Check if this is an authentication-related error
    const isAuthError = error.message.includes("getFieldState") || 
                         error.message.includes("useFormContext") ||
                         error.message.includes("Context");
    
    // Check specifically for form context errors
    const isFormContextError = error.message.includes('getFieldState of') || 
                              error.message.includes('Cannot destructure property');
    
    return { 
      hasError: true, 
      error, 
      isAuthError,
      isFormContextError
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  public reset = (): void => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null, 
      isAuthError: false,
      isFormContextError: false
    });
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // For form context errors, only retry
      if (this.state.isFormContextError) {
        console.log("ErrorBoundary - Form context error detected, retrying page render");
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background p-4">
            <div className="text-center max-w-md">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-yellow-500" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Loading Components</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Please wait while we initialize the application
              </p>
              
              <Button
                variant="primary"
                onClick={this.reset}
              >
                Try Again
              </Button>
            </div>
          </div>
        );
      }
      
      // For authentication-related errors, redirect to login
      if (this.state.isAuthError) {
        console.log("ErrorBoundary - Auth-related error detected, redirecting to login");
        return <Navigate to="/login" />;
      }
      
      // If redirectTo is provided, redirect to that path
      if (this.props.redirectTo) {
        console.log(`ErrorBoundary - Redirecting to ${this.props.redirectTo}`);
        return <Navigate to={this.props.redirectTo} />;
      }

      // If a fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background p-4">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-2">Something went wrong</h1>
            <p className="text-xl text-muted-foreground mb-4">
              We've encountered an unexpected error
            </p>
            
            {this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                <p className="font-medium text-red-800 mb-2">Error details:</p>
                <p className="text-sm text-red-700 break-words">{this.state.error.message}</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              <Button
                variant="primary"
                onClick={this.reset}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
