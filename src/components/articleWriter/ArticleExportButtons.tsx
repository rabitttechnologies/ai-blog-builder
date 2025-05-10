
import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ArticleExportButtonsProps {
  title: string;
  contentId: string;
  onDownload?: () => void;
  onShare?: () => void;
}

const ArticleExportButtons: React.FC<ArticleExportButtonsProps> = ({ 
  title,
  contentId,
  onDownload,
  onShare
}) => {
  const { toast } = useToast();
  
  // Prepare filename based on title
  const getFileName = () => {
    return `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}`;
  };
  
  // Download as HTML
  const downloadAsHTML = () => {
    const element = document.getElementById(contentId);
    if (!element) {
      toast({
        title: "Export failed",
        description: "Content element not found",
        variant: "destructive"
      });
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1, h2, h3, h4, h5, h6 { margin-top: 28px; margin-bottom: 14px; }
          p { margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${element.innerHTML}
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getFileName()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "HTML Export Successful",
      description: "Your article has been downloaded as HTML."
    });
    
    if (onDownload) onDownload();
  };
  
  // Download as Plain Text (DOCX-like)
  const downloadAsDoc = () => {
    const element = document.getElementById(contentId);
    if (!element) {
      toast({
        title: "Export failed",
        description: "Content element not found",
        variant: "destructive"
      });
      return;
    }
    
    // Get text content and clean it
    const content = element.innerText || element.textContent || '';
    const textContent = `${title}\n\n${content}`;
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getFileName()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "DOC Export Successful",
      description: "Your article has been downloaded as DOC."
    });
    
    if (onDownload) onDownload();
  };
  
  // Download as PDF
  const downloadAsPDF = async () => {
    const element = document.getElementById(contentId);
    if (!element) {
      toast({
        title: "Export failed",
        description: "Content element not found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Preparing PDF",
        description: "Please wait while we generate your PDF..."
      });
      
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Add title
      pdf.setFontSize(20);
      pdf.text(title, 20, 20);
      
      // Calculate dimensions to fit the PDF page
      const imgWidth = 170; // mm width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add content
      pdf.addImage(imgData, 'PNG', 20, 30, imgWidth, imgHeight);
      
      pdf.save(`${getFileName()}.pdf`);
      
      toast({
        title: "PDF Export Successful",
        description: "Your article has been downloaded as PDF."
      });
      
      if (onDownload) onDownload();
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "PDF Export Failed",
        description: "There was a problem generating your PDF. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Check out this article!',
          url: window.location.href,
        });
        
        toast({
          title: "Shared Successfully",
          description: "The article was shared successfully."
        });
        
        if (onShare) onShare();
      } catch (error) {
        console.error('Share failed:', error);
        toast({
          title: "Share Failed",
          description: "There was a problem sharing the article.",
          variant: "destructive"
        });
      }
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "URL Copied",
          description: "The article URL has been copied to your clipboard."
        });
      }).catch(() => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy URL to clipboard.",
          variant: "destructive"
        });
      });
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={downloadAsHTML}>
            Download as HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadAsDoc}>
            Download as DOC
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadAsPDF}>
            Download as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center">
        <Share2 className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Share</span>
      </Button>
    </div>
  );
};

export default ArticleExportButtons;
