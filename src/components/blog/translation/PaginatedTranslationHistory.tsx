
import React from 'react';
import { useTranslationData } from '@/hooks/useTranslationData';
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
  
  const { data, isLoading } = useTranslationData({
    blogId,
    page: currentPage,
    itemsPerPage
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
