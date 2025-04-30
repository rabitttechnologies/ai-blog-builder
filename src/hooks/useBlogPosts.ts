
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost, BlogPostInsert, BlogPostUpdate, BlogTranslation } from '@/types/blog';
import { useLanguage } from '@/context/language/LanguageContext';
import { blogPosts } from '@/data/blogPosts';
import { useAuth } from '@/context/auth';

export const useBlogPosts = () => {
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();

  const getBlogPosts = async (language: string): Promise<BlogPost[]> => {
    try {
      if (!user) {
        return blogPosts;
      }
      
      console.log(`Fetching blogs for user ID: ${user.id}, language: ${language}`);
      
      // Fetch all blogs - both drafts and published - that belong to the current user
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          translations:blog_posts!original_id(*)
        `)
        .eq('language_code', language)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }
      
      console.log(`Received ${data?.length || 0} blogs from Supabase:`, data);
      
      if (data && data.length > 0) {
        return data.map(post => {
          // Handle translations properly - ensure it's an array
          const translationsArray = Array.isArray(post.translations) ? post.translations : [];
          
          // Transform the data into our BlogPost type
          const transformedPost: BlogPost = {
            ...post,
            date: post.published_at || post.created_at,
            readTime: '5 min',
            category: post.categories?.[0] || 'Uncategorized',
            image: post.featured_image,
            translations: translationsArray.reduce((acc, t: any) => ({
              ...acc,
              [t.language_code]: {
                title: t.title,
                excerpt: t.excerpt || '',
                category: t.categories?.[0] || 'Uncategorized'
              }
            }), {})
          };

          return transformedPost;
        });
      }
      
      console.log("No blogs found in Supabase, returning default blog posts");
      return blogPosts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return blogPosts;
    }
  };

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['blog_posts', currentLanguage, user?.id],
    queryFn: () => getBlogPosts(currentLanguage),
    enabled: !!user // Only run the query when we have a user
  });

  const createPost = useMutation({
    mutationFn: async (newPost: BlogPostInsert) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(newPost)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
    },
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, post }: { id: string; post: BlogPostUpdate }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
    },
  });

  return {
    posts,
    isLoading,
    error,
    refetch,
    createPost,
    updatePost,
  };
};
