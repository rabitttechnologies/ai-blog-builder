
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Helmet } from "react-helmet";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

const ServerError = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background">
      <Helmet>
        <title>Server Error | BlogCraft</title>
      </Helmet>

      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">Server Error</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We're experiencing some issues with our servers. Please try again later.
        </p>
        
        <div className="glass p-6 rounded-xl mb-8 border border-primary/20">
          <h2 className="text-lg font-semibold mb-4">Why might this happen?</h2>
          <ul className="text-left text-muted-foreground space-y-2 mb-6">
            <li>• Our server might be undergoing maintenance</li>
            <li>• There might be a temporary network issue</li>
            <li>• High traffic volume might be affecting our services</li>
          </ul>
          <p className="text-sm mb-4">
            Rest assured, your data is safe and this is just a temporary issue.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh Page
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            leftIcon={<Home className="h-4 w-4" />}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
