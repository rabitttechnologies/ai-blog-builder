
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TranslationWorkflow } from '@/types/blog';

interface UseTranslationDataProps {
  blogId?: string;
  page: number;
  itemsPerPage: number;
}

export const useTranslationData = ({ blogId, page, itemsPerPage }: UseTranslationDataProps) => {
  return useQuery({
    queryKey: ['translation-history', blogId, page, itemsPerPage],
    queryFn: async () => {
      const startRange = (page - 1) * itemsPerPage;
      const endRange = startRange + itemsPerPage - 1;

      const query = supabase
        .from('translation_workflows')
        .select(`
          *,
          blog_posts:blog_id (
            title,
            language_code
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(startRange, endRange);

      if (blogId) {
        query.eq('blog_id', blogId);
      }

      const { data, count, error } = await query;
      
      if (error) throw error;
      
      return {
        translations: data as TranslationWorkflow[],
        total: count || 0
      };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    placeholderData: (prevData) => prevData, // This replaces keepPreviousData
  });
};
