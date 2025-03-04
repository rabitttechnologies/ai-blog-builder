
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
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // If redirectTo is provided, redirect to that path
      if (this.props.redirectTo) {
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
            <p className="text-xl text-muted-foreground mb-8">
              We've encountered an unexpected error
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              <Button
                variant="primary"
                onClick={() => this.setState({ hasError: false, error: null })}
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
