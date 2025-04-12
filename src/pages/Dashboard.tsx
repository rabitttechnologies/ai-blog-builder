import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import KeywordResearchModal from "@/components/blog/KeywordResearchModal";
import { useKeywordNavigation } from "@/hooks/useKeywordNavigation";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isKeywordResearchOpen, setIsKeywordResearchOpen] = useState(false);
  
  // Use our custom hook for handling keyword navigation
  const { setPendingKeyword } = useKeywordNavigation(isKeywordResearchOpen);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const daysRemaining = user ? Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  
  const handleCreateBlog = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default navigation
    
    if (user?.trialBlogsRemaining && user.trialBlogsRemaining > 0) {
      // Open the keyword research modal directly instead of navigating
      setIsKeywordResearchOpen(true);
    } else {
      toast({
        title: "Trial limit reached",
        description: "Please upgrade to continue creating blogs.",
        variant: "destructive",
      });
    }
  };
  
  const handleCloseKeywordResearch = () => {
    setIsKeywordResearchOpen(false);
    // No need to clear pending navigation - the hook handles this internally
  };
  
  const handleKeywordResearchComplete = (selectedKeyword: string) => {
    console.log("Keyword research complete, selected keyword:", selectedKeyword);
    
    // First close the modal
    setIsKeywordResearchOpen(false);
    
    // Set pending keyword in our custom hook if we have one
    if (selectedKeyword) {
      console.log("Setting pending keyword:", selectedKeyword);
      setPendingKeyword(selectedKeyword);
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Dashboard - BlogCraft</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-foreground/70">Create and manage your AI-generated blogs</p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={handleCreateBlog}
            rightIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create New Blog
          </Button>
        </div>
        
        {user && user.trialBlogsRemaining >= 0 && (
          <div className="glass p-4 rounded-xl mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="text-primary mr-3 h-5 w-5" />
              <div>
                <h3 className="font-medium">Free Trial Status</h3>
                <p className="text-sm text-foreground/70">
                  {user.trialBlogsRemaining} blog{user.trialBlogsRemaining !== 1 ? 's' : ''} remaining • {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate("/pricing")}
            >
              Upgrade
            </Button>
          </div>
        )}
        
        {user?.trialBlogsRemaining === 0 && (
          <div className="p-4 rounded-xl mb-8 border border-yellow-400 bg-yellow-50 text-yellow-800">
            <div className="flex items-start">
              <AlertTriangle className="mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Trial limit reached</h3>
                <p className="text-sm">
                  You've used all your free trial blogs. Upgrade now to continue creating SEO-optimized content.
                </p>
                <Button 
                  className="mt-3"
                  size="sm"
                  onClick={() => navigate("/pricing")}
                >
                  See Pricing Plans
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Blogs</h2>
          
          {/* Empty state for new users */}
          <div className="glass p-8 rounded-xl text-center">
            <img 
              src="/placeholder.svg" 
              alt="No blogs" 
              className="w-32 h-32 mx-auto mb-4 opacity-50" 
            />
            <h3 className="text-lg font-medium mb-2">No blogs created yet</h3>
            <p className="text-foreground/70 mb-6 max-w-md mx-auto">
              Start by creating your first SEO-optimized blog post with our AI-powered assistant.
            </p>
            <Button onClick={handleCreateBlog}>
              Create Your First Blog
            </Button>
          </div>
        </div>
      </div>
      
      {/* Keyword research modal */}
      <KeywordResearchModal 
        isOpen={isKeywordResearchOpen}
        onClose={handleCloseKeywordResearch}
        onKeywordSelected={handleKeywordResearchComplete}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
