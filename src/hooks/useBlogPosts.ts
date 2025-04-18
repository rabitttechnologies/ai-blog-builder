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
        .select('*')
        .eq('language_code', language)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If we have data from the database, return it
      if (data && data.length > 0) {
        return data as BlogPost[];
      }
      
      // Otherwise, return our mock data with the right language
      return blogPosts.map(post => {
        if (language === 'en') return post;
        
        // For non-English languages, try to get the translation
        if (post.translations && post.translations[language]) {
          const translation = post.translations[language];
          return {
            ...post,
            title: translation.title,
            excerpt: translation.excerpt,
            category: translation.category,
            categories: [translation.category],
            language_code: language,
            slug: `${post.slug}-${language}`
          };
        }
        
        // If no translation exists, return the English version
        return post;
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Return mock data as fallback
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
