
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/language/LanguageContext";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  Eye, 
  FileText 
} from "lucide-react";
import { CreateBlogDialog } from "@/components/blog/CreateBlogDialog";
import { AdminTranslationRequest } from "./AdminTranslationRequest";
import { TranslationManager } from "@/components/blog/translation/TranslationManager";
import { Select } from "@/components/ui/select";
import { BlogPost, BlogPostStatus } from "@/types/blog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" }
];

const languageOptions = [
  { label: "All Languages", value: "all" },
  ...SUPPORTED_LANGUAGES.map(lang => ({
    label: lang.name,
    value: lang.code
  }))
];

export function AdminBlogManagement() {
  const { posts, isLoading } = useBlogPosts();
  const { currentLanguage, setLanguage } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);
  
  // Filter the blog posts based on the search query and filters
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    
    const matchesLanguage = languageFilter === "all" || post.language_code === languageFilter;
    
    return matchesSearch && matchesStatus && matchesLanguage;
  }) || [];
  
  // Sort posts: first originals, then by created date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    // Originals first
    if (a.is_original && !b.is_original) return -1;
    if (!a.is_original && b.is_original) return 1;
    
    // Then by date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  
  // Mutation for updating blog status
  const updateBlogStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BlogPostStatus }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast({
        title: "Blog updated",
        description: "The blog post status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update blog post status",
        variant: "destructive",
      });
      console.error("Error updating blog post:", error);
    }
  });
  
  // Mutation for deleting a blog post
  const deleteBlog = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast({
        title: "Blog deleted",
        description: "The blog post has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
      console.error("Error deleting blog post:", error);
    }
  });
  
  const handlePublish = (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    updateBlogStatus.mutate({ id: post.id, status: newStatus as BlogPostStatus });
  };
  
  const handleDelete = (post: BlogPost) => {
    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      deleteBlog.mutate(post.id);
    }
  };
  
  const handleTranslateClick = (post: BlogPost) => {
    setSelectedBlog(post);
    setIsTranslationDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Blog Management - Admin Dashboard</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Blog
        </Button>
      </div>
      
      <div className="glass p-6 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-1 gap-4">
            <Select
              defaultValue="all"
              onValueChange={setStatusFilter}
              className="w-full md:w-40"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            
            <Select
              defaultValue="all"
              onValueChange={setLanguageFilter}
              className="w-full md:w-40"
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        
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
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Translations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      {post.title}
                      {post.is_original && (
                        <Badge variant="outline" className="ml-2">Original</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {SUPPORTED_LANGUAGES.find(l => l.code === post.language_code)?.name || post.language_code}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                      >
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {post.is_original ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleTranslateClick(post)}
                        >
                          <Globe className="mr-1 h-4 w-4" />
                          <span>Translate</span>
                        </Button>
                      ) : (
                        <Badge variant="outline">
                          Translation of {post.original_id}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/${post.language_code}/${post.slug}`, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={post.status === 'published' ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => handlePublish(post)}
                      >
                        {post.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {selectedBlog && (
        <div className="mt-6">
          <TranslationManager 
            blogId={selectedBlog.id} 
            currentLanguage={selectedBlog.language_code || currentLanguage}
          />
        </div>
      )}
      
      {/* Create Blog Dialog */}
      <CreateBlogDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
      
      {/* Translation Request Dialog */}
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
