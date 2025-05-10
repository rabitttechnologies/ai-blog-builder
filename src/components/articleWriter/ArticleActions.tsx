
import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Download,
  Share2,
  FileText,
  FileDown
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ArticleActionsProps {
  onDownloadHtml: () => void;
  onDownloadDoc: () => void;
  onDownloadPdf: () => void;
  onShare: () => void;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({
  onDownloadHtml,
  onDownloadDoc,
  onDownloadPdf,
  onShare
}) => {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDownloadHtml}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Download as HTML</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDownloadDoc}>
            <FileDown className="mr-2 h-4 w-4" />
            <span>Download as DOC</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDownloadPdf}>
            <FileDown className="mr-2 h-4 w-4" />
            <span>Download as PDF</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button variant="outline" size="sm" onClick={onShare} className="flex items-center gap-1.5">
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>
    </div>
  );
};

export default ArticleActions;
