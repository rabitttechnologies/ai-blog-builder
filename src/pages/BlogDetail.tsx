
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Edit, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/blog";

const BlogDetail = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          console.error("Error fetching blog:", fetchError);
          setError("Failed to load blog. It may have been deleted or you don't have permission to view it.");
        } else if (data) {
          setBlog(data as BlogPost);
          console.log("Fetched blog data:", data);
        }
      } catch (err) {
        console.error("Exception fetching blog:", err);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Parse content from string or JSON if needed
  const parseContent = (content: any): string => {
    if (!content) return '';
    
    try {
      // If content is already a string, return it directly
      if (typeof content === 'string') {
        return content;
      }
      
      // If content is stored as JSON
      if (typeof content === 'object') {
        if (content.content) {
          return typeof content.content === 'string' ? content.content : JSON.stringify(content.content);
        }
        return JSON.stringify(content);
      }
      
      return String(content);
    } catch (e) {
      console.error("Error parsing content:", e);
      return "Content could not be displayed";
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>{blog ? `${blog.title} - AI Agent Writer` : "Blog - AI Agent Writer"}</title>
        <meta 
          name="description" 
          content={blog?.meta_description || "View your AI-generated blog content"} 
        />
      </Helmet>
      
      <div className="container max-w-4xl py-8">
        <Button 
          variant="outline" 
          size="sm"
          className="mb-6" 
          onClick={() => navigate("/blogs")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blogs
        </Button>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <div className="text-destructive mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/blogs")}
            >
              Return to Blogs
            </Button>
          </Card>
        ) : blog ? (
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs capitalize">{blog.status}</Badge>
                {blog.tags && blog.tags.length > 0 && blog.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>
              
              <div className="flex items-center text-sm text-foreground/70">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {blog.published_at 
                    ? `Published on ${formatDate(blog.published_at)}` 
                    : `Created on ${formatDate(blog.created_at)}`
                  }
                </span>
              </div>
              
              {blog.meta_description && (
                <p className="mt-4 text-lg italic text-foreground/80 border-l-4 pl-4 border-primary/20">
                  {blog.meta_description}
                </p>
              )}
            </div>
            
            <div className="prose prose-lg max-w-none">
              {blog.content && (
                <div dangerouslySetInnerHTML={{ 
                  __html: parseContent(blog.content)
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/#{3}(.*?)\n/g, '<h3>$1</h3>')
                    .replace(/#{2}(.*?)\n/g, '<h2>$1</h2>')
                    .replace(/#{1}(.*?)\n/g, '<h1>$1</h1>')
                }} />
              )}
            </div>
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p>Blog not found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/blogs")}
            >
              Return to Blogs
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BlogDetail;
