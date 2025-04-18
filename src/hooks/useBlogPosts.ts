
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost, BlogPostInsert, BlogPostUpdate } from '@/types/blog';
import { useLanguage } from '@/context/language/LanguageContext';
import { blogPosts } from '@/data/blogPosts';

export const useBlogPosts = () => {
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();

  const getBlogPosts = async (language: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          translations:blog_posts!original_id(*)
        `)
        .eq('language_code', language)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Cast data to BlogPost type with necessary transformations for backward compatibility
        return data.map(post => ({
          ...post,
          // Add backward compatibility fields
          date: post.published_at || post.created_at,
          readTime: '5 min', // Default read time
          category: post.categories?.[0] || 'Uncategorized',
          image: post.featured_image,
          // Transform translations to expected format if needed
          translations: post.translations ? 
            Object.fromEntries(
              (post.translations as any[]).map(t => [
                t.language_code, 
                { 
                  title: t.title, 
                  excerpt: t.excerpt || '', 
                  category: t.categories?.[0] || 'Uncategorized' 
                }
              ])
            ) : undefined
        })) as BlogPost[];
      }
      
      return blogPosts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return blogPosts;
    }
  };

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['blog_posts', currentLanguage],
    queryFn: () => getBlogPosts(currentLanguage),
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
    createPost,
    updatePost,
  };
};
