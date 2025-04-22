
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { FileText } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import CreateBlogDialog from "@/components/blog/CreateBlogDialog";
import { AdminTranslationRequest } from "./AdminTranslationRequest";
import { BlogManagementHeader } from "./components/BlogManagementHeader";
import { BlogFilters } from "./components/BlogFilters";
import { BlogTable } from "./components/BlogTable";
import type { BlogPost } from '@/types/blog';

export function AdminBlogManagement() {
  const { posts, isLoading } = useBlogPosts();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);

  // Filter the blog posts
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesLanguage = languageFilter === "all" || post.language_code === languageFilter;
    return matchesSearch && matchesStatus && matchesLanguage;
  }) || [];

  // Sort posts: first originals, then by created date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.is_original && !b.is_original) return -1;
    if (!a.is_original && b.is_original) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handlePublish = async (post: BlogPost) => {
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: newStatus })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Blog post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (post: BlogPost) => {
    window.open(`/blog/${post.language_code}/${post.slug}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Blog Management - Admin Dashboard</title>
      </Helmet>

      <BlogManagementHeader onCreateClick={() => setIsCreateDialogOpen(true)} />

      <div className="glass p-6 rounded-xl">
        <BlogFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          languageFilter={languageFilter}
          onLanguageChange={setLanguageFilter}
        />

        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading blog posts...</p>
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
            <h3 className="text-lg font-medium">No blog posts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all" || languageFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create a new blog post to get started"}
            </p>
            {(searchQuery || statusFilter !== "all" || languageFilter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setLanguageFilter("all");
                }}
                size="md"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <BlogTable
            posts={sortedPosts}
            onTranslateClick={(post) => {
              setSelectedBlog(post);
              setIsTranslationDialogOpen(true);
            }}
            onPublish={handlePublish}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        )}
      </div>

      <CreateBlogDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      {selectedBlog && (
        <AdminTranslationRequest
          isOpen={isTranslationDialogOpen}
          onClose={() => setIsTranslationDialogOpen(false)}
          blogPost={selectedBlog}
        />
      )}
    </div>
  );
}
