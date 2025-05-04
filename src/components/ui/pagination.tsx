
import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  pageCount: number
  currentPage: number
  onPageChange: (page: number) => void
}

export const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
  className,
  ...props
}: PaginationProps) => {
  const canPreviousPage = currentPage > 1
  const canNextPage = currentPage < pageCount

  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <div className="flex-1 text-sm text-muted-foreground">
        {currentPage} of {pageCount}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPreviousPage}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNextPage}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline" 
          size="md"
          onClick={() => onPageChange(pageCount)}
          disabled={currentPage === pageCount}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
