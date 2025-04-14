
import React from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Clock, AlertTriangle, PlusCircle } from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const daysRemaining = user ? Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Dashboard - BlogCraft</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-foreground/70">Manage your account</p>
          </div>
          
          <Button 
            onClick={() => navigate("/blogs")}
            className="mt-4 md:mt-0"
            leftIcon={<PlusCircle className="h-4 w-4" />}
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
                  {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
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
                  You've used all your free trial benefits. Upgrade now to continue using premium features.
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
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          
          {/* Empty state for new users */}
          <div className="glass p-8 rounded-xl text-center">
            <img 
              src="/placeholder.svg" 
              alt="No activity" 
              className="w-32 h-32 mx-auto mb-4 opacity-50" 
            />
            <h3 className="text-lg font-medium mb-2">No recent activity</h3>
            <p className="text-foreground/70 mb-6 max-w-md mx-auto">
              Your recent account activity will appear here.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
