
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle, Home, ArrowLeft, Star } from "lucide-react";
import { Helmet } from "react-helmet";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if the path indicates they were looking for a feature
  const isPotentialFeaturePath = 
    location.pathname.includes("advanced") || 
    location.pathname.includes("analytics") || 
    location.pathname.includes("export") ||
    location.pathname.includes("templates");
  
  const hasFreeTrialExpired = user && 
    (user.trialBlogsRemaining <= 0 || new Date(user.trialEndsAt) < new Date());

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background">
      <Helmet>
        <title>Page Not Found | BlogCraft</title>
      </Helmet>

      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">Oops! Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We couldn't find the page you were looking for.
        </p>
        
        {isPotentialFeaturePath && !isAuthenticated && (
          <div className="glass p-6 rounded-xl mb-8 border border-primary/20">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold">Looking for premium features?</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              The feature you're looking for might be available in one of our premium plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="primary" 
                fullWidth
                onClick={() => navigate("/signup")}
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => navigate("/pricing")}
              >
                View Plans
              </Button>
            </div>
          </div>
        )}
        
        {isPotentialFeaturePath && isAuthenticated && hasFreeTrialExpired && (
          <div className="glass p-6 rounded-xl mb-8 border border-primary/20">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold">Upgrade to access more features</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Your free trial has ended. Upgrade to a premium plan to access all features.
            </p>
            <Button 
              variant="primary" 
              fullWidth
              onClick={() => navigate("/pricing")}
            >
              View Premium Plans
            </Button>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Go Back
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

export default NotFound;
