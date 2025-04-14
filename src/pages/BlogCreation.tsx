
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import CreateBlogDialog from "@/components/blog/CreateBlogDialog";

const BlogCreation = () => {
  const { user, isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Create Blog - BlogCraft</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blog Creation</h1>
            <p className="text-foreground/70">Research keywords and create content</p>
          </div>
          
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="mt-4 md:mt-0"
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Create New Blog
          </Button>
        </div>
        
        {/* Empty state for new users */}
        <div className="glass p-8 rounded-xl text-center">
          <img 
            src="/placeholder.svg" 
            alt="No blogs" 
            className="w-32 h-32 mx-auto mb-4 opacity-50" 
          />
          <h3 className="text-lg font-medium mb-2">No blogs created yet</h3>
          <p className="text-foreground/70 mb-6 max-w-md mx-auto">
            Click the "Create New Blog" button above to start researching keywords and creating content.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            Get Started
          </Button>
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

export default BlogCreation;
