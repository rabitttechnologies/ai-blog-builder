import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth";

const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
      <Helmet>
        <title>404 Not Found - BlogCraft</title>
      </Helmet>
      
      <div className="w-full max-w-md mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 mb-6 text-center">
          BlogCraft
        </h1>
        <h2 className="text-2xl font-bold mb-2 text-center">Page Not Found</h2>
        <p className="text-foreground/70 mb-8 text-center">
          The page you are looking for does not exist or has been moved.
        </p>
        
        <div className="flex flex-col items-stretch space-y-4">
          <Button asChild>
            <Link to="/">Go to Homepage</Link>
          </Button>
          {isAuthenticated && (
            <Button asChild variant="secondary">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
