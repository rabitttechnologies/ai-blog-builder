
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Clock, AlertTriangle, PlusCircle, FileText } from "lucide-react";
import CreateBlogDialog from "@/components/blog/CreateBlogDialog";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { posts, isLoading } = useBlogPosts();
  
  // Show only 3 most recent blogs on dashboard
  const recentBlogs = posts?.slice(0, 3) || [];

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const daysRemaining = user ? Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Dashboard - AI Agent Writer</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-foreground/70">Manage your account</p>
          </div>
          
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="mt-4 md:mt-0"
            leftIcon={<PlusCircle className="h-4 w-4" />}
            size="md"
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
              size="md"
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Blogs</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/blogs")}
              className="text-sm"
            >
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : recentBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentBlogs.map((blog) => (
                <Card key={blog.id} className="flex flex-col h-full">
                  <CardContent className="pt-6 flex-grow">
                    <h3 className="text-lg font-medium line-clamp-2 mb-2">{blog.title}</h3>
                    <p className="text-sm text-foreground/70 line-clamp-2">
                      {blog.excerpt || blog.meta_description || "No description available"}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 pb-3 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/blog/${blog.id}`)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Blog
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="glass p-8 rounded-xl text-center">
              <img 
                src="/placeholder.svg" 
                alt="No activity" 
                className="w-32 h-32 mx-auto mb-4 opacity-50" 
              />
              <h3 className="text-lg font-medium mb-2">No blogs created yet</h3>
              <p className="text-foreground/70 mb-6 max-w-md mx-auto">
                Create your first blog to see it here.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Create Blog
              </Button>
            </div>
          )}
        </div>
        
        {/* Dialog for creating a new blog */}
        <CreateBlogDialog 
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
