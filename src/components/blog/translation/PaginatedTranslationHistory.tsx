
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TranslationHistoryView } from './TranslationHistoryView';
import { Pagination } from '@/components/ui/pagination';

interface PaginatedTranslationHistoryProps {
  blogId?: string;
  itemsPerPage?: number;
}

export function PaginatedTranslationHistory({ 
  blogId, 
  itemsPerPage = 10 
}: PaginatedTranslationHistoryProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const { data, isLoading } = useQuery({
    queryKey: ['translation-history', blogId, currentPage, itemsPerPage],
    queryFn: async () => {
      const startRange = (currentPage - 1) * itemsPerPage;
      const endRange = startRange + itemsPerPage - 1;
      
      const query = supabase
        .from('translation_workflows')
        .select(`
          *,
          blog_posts!blog_id (
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
        translations: data,
        total: count || 0
      };
    },
  });

  const pageCount = Math.ceil((data?.total || 0) / itemsPerPage);

  return (
    <div className="space-y-4">
      <TranslationHistoryView 
        translations={data?.translations || []}
        isLoading={isLoading}
      />
      
      {pageCount > 1 && (
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
