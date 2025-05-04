
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ButtonProps } from '@/components/ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  siblingCount = 1,
}: PaginationProps) {
  // Generate page numbers logic
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Current page and siblings
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push(-1); // -1 represents ellipsis
    }
    
    // Add sibling pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  // Render pagination UI
  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>
      
      {pageNumbers.map((pageNumber, index) => {
        // Render ellipsis
        if (pageNumber < 0) {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center h-9 w-9"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }
        
        // Render page number
        return (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            className={`h-9 w-9 p-0`}
          >
            {pageNumber}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </nav>
  );
}
