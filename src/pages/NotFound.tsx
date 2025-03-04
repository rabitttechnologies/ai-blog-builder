
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle, Home, ArrowLeft, Star, Package, Search } from "lucide-react";
import { Helmet } from "react-helmet";
import { cn } from "@/lib/utils";

// Define different user paths and messages
type NotFoundScenario = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  primaryAction: {
    label: string;
    path: string;
  };
  secondaryAction?: {
    label: string;
    path: string;
  };
  showForPaths: string[];
  showForUsers: "all" | "authenticated" | "unauthenticated" | "trial-expired";
};

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeScenario, setActiveScenario] = useState<NotFoundScenario | null>(null);
  
  const hasFreeTrialExpired = user && 
    (user.trialBlogsRemaining <= 0 || new Date(user.trialEndsAt) < new Date());
  
  const scenarios: NotFoundScenario[] = [
    {
      id: "content-creation",
      title: "Looking for professional content creation?",
      description: "BlogCraft can help you create SEO-optimized blog posts in minutes with our AI-powered tools.",
      icon: <Package className="h-10 w-10 text-primary" />,
      primaryAction: {
        label: isAuthenticated ? "Create a Blog" : "Start Free Trial",
        path: isAuthenticated ? "/blog/create" : "/signup"
      },
      secondaryAction: !isAuthenticated ? {
        label: "Learn More",
        path: "/pricing"
      } : undefined,
      showForPaths: ["blog", "post", "content", "article", "write"],
      showForUsers: "all"
    },
    {
      id: "analytics",
      title: "Looking for content analytics?",
      description: "Track your blog performance with our advanced analytics dashboard.",
      icon: <Search className="h-10 w-10 text-primary" />,
      primaryAction: {
        label: isAuthenticated ? "View Analytics" : "Start Free Trial",
        path: isAuthenticated ? "/dashboard" : "/signup"
      },
      secondaryAction: !isAuthenticated ? {
        label: "Explore Features",
        path: "/pricing"
      } : undefined,
      showForPaths: ["analytics", "stats", "performance", "metrics", "data"],
      showForUsers: "all"
    },
    {
      id: "templates",
      title: "Looking for blog templates?",
      description: "Access our library of professional blog templates with a premium plan.",
      icon: <Star className="h-10 w-10 text-yellow-500" />,
      primaryAction: {
        label: hasFreeTrialExpired ? "Upgrade Now" : "Access Templates",
        path: hasFreeTrialExpired ? "/pricing" : "/dashboard"
      },
      secondaryAction: hasFreeTrialExpired ? undefined : {
        label: "View Plans",
        path: "/pricing"
      },
      showForPaths: ["template", "framework", "layout", "design"],
      showForUsers: "authenticated"
    },
    {
      id: "expired-trial",
      title: "Your free trial has ended",
      description: "Upgrade to a premium plan to continue creating amazing content with BlogCraft.",
      icon: <Star className="h-10 w-10 text-yellow-500" />,
      primaryAction: {
        label: "View Premium Plans",
        path: "/pricing"
      },
      showForPaths: ["advanced", "export", "unlimited", "premium"],
      showForUsers: "trial-expired"
    },
    {
      id: "default",
      title: "Oops! Page Not Found",
      description: "We couldn't find the page you were looking for.",
      icon: <AlertTriangle className="h-10 w-10 text-red-500" />,
      primaryAction: {
        label: "Back to Home",
        path: "/"
      },
      secondaryAction: {
        label: "Go Back",
        path: ""
      },
      showForPaths: [],
      showForUsers: "all"
    }
  ];

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Find matching scenario based on path and auth status
    const path = location.pathname.toLowerCase();
    
    // Determine user status
    let userStatus: "all" | "authenticated" | "unauthenticated" | "trial-expired" = "all";
    if (isAuthenticated) {
      userStatus = hasFreeTrialExpired ? "trial-expired" : "authenticated";
    } else {
      userStatus = "unauthenticated";
    }
    
    // Find matching scenario
    const matchedScenario = scenarios.find(scenario => {
      // If path matches and user status matches
      const pathMatch = scenario.showForPaths.length === 0 || 
        scenario.showForPaths.some(p => path.includes(p));
      
      const userMatch = scenario.showForUsers === "all" || 
        scenario.showForUsers === userStatus;
      
      return pathMatch && userMatch;
    }) || scenarios.find(s => s.id === "default");
    
    setActiveScenario(matchedScenario || null);
  }, [location.pathname, isAuthenticated, hasFreeTrialExpired]);

  if (!activeScenario) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background">
      <Helmet>
        <title>Page Not Found | BlogCraft</title>
      </Helmet>

      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className={cn(
            "h-20 w-20 rounded-full flex items-center justify-center",
            activeScenario.id === "default" ? "bg-red-100" : 
            activeScenario.id === "templates" || activeScenario.id === "expired-trial" ? "bg-yellow-100" : 
            "bg-primary/10"
          )}>
            {activeScenario.icon}
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">{activeScenario.title}</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {activeScenario.description}
        </p>
        
        <div className={cn(
          "glass p-6 rounded-xl mb-8 border border-primary/20",
          activeScenario.id === "default" ? "hidden" : ""
        )}>
          <div className="flex flex-col gap-3">
            <Button 
              variant="primary" 
              fullWidth
              onClick={() => navigate(activeScenario.primaryAction.path)}
            >
              {activeScenario.primaryAction.label}
            </Button>
            
            {activeScenario.secondaryAction && (
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => navigate(activeScenario.secondaryAction!.path)}
              >
                {activeScenario.secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {activeScenario.id === "default" && (
            <>
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
            </>
          )}
          
          {activeScenario.id !== "default" && (
            <>
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Go Back
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                leftIcon={<Home className="h-4 w-4" />}
              >
                Back to Home
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
