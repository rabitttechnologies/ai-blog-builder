
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { PlusCircle, FileText, ArrowUpRight } from "lucide-react";
import CreateBlogDialog from "@/components/blog/CreateBlogDialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const BlogCreation = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { posts, isLoading } = useBlogPosts();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleViewBlog = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Create Blog - AI Agent Writer</title>
        <meta 
          name="description" 
          content="Research keywords and create optimized blog content with AI assistance." 
        />
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
        
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Your Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="flex flex-col h-full">
                  <CardContent className="pt-6 flex-grow">
                    <h3 className="text-lg font-medium line-clamp-2 mb-2">{post.title}</h3>
                    <p className="text-sm text-foreground/70 line-clamp-3 mb-2">
                      {post.excerpt || post.meta_description || "No description available"}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-foreground/50">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <span className="mx-1">•</span>
                      <span className="capitalize">{post.status}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-3 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full flex justify-center items-center gap-1"
                      onClick={() => handleViewBlog(post.id)}
                    >
                      <FileText className="h-4 w-4" />
                      <span>View</span>
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
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
        )}
      
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
