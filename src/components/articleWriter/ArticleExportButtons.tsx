
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Share2, FileText } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

interface ArticleExportButtonsProps {
  title: string;
  contentId: string;
}

const ArticleExportButtons: React.FC<ArticleExportButtonsProps> = ({ title, contentId }) => {
  const sanitizedTitle = title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
  
  const getContentHTML = (): string => {
    const element = document.getElementById(contentId);
    if (!element) {
      toast.error("Content not found");
      return '<p>Content not available</p>';
    }
    
    // If it's a textarea, get the value
    if (element instanceof HTMLTextAreaElement) {
      return element.value;
    }
    
    // Otherwise get the inner HTML
    return element.innerHTML;
  };
  
  const exportAsHTML = () => {
    try {
      const content = getContentHTML();
      const htmlDocument = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 2em; }
            h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; }
            p { margin: 1em 0; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${content}
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
      saveAs(blob, `${sanitizedTitle}.html`);
      toast.success("HTML file exported successfully!");
    } catch (error) {
      toast.error("Failed to export as HTML");
      console.error("HTML export error:", error);
    }
  };
  
  const exportAsDOC = () => {
    try {
      const content = getContentHTML();
      const docDocument = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
        </head>
        <body>
          <h1>${title}</h1>
          ${content}
        </body>
        </html>
      `;
      
      const blob = new Blob([docDocument], { type: 'application/msword;charset=utf-8' });
      saveAs(blob, `${sanitizedTitle}.doc`);
      toast.success("DOC file exported successfully!");
    } catch (error) {
      toast.error("Failed to export as DOC");
      console.error("DOC export error:", error);
    }
  };
  
  const exportAsPDF = () => {
    try {
      // For PDF export, we would typically use jsPDF and html2canvas
      // But since we don't have those installed, we'll show a toast message
      toast.info("PDF export functionality requires jsPDF library. You can install it with 'npm install jspdf html2canvas'");
    } catch (error) {
      toast.error("Failed to export as PDF");
      console.error("PDF export error:", error);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this article: ${title}`,
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch((error) => {
        console.error("Share error:", error);
        toast.error("Failed to share");
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      try {
        navigator.clipboard.writeText(window.location.href);
        toast.success("URL copied to clipboard!");
      } catch (error) {
        console.error("Copy error:", error);
        toast.error("Failed to copy URL");
      }
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={exportAsHTML} title="Export as HTML">
        <FileText className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">HTML</span>
      </Button>
      <Button variant="outline" size="sm" onClick={exportAsDOC} title="Export as DOC">
        <FileText className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">DOC</span>
      </Button>
      <Button variant="outline" size="sm" onClick={exportAsPDF} title="Export as PDF">
        <Download className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">PDF</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare} title="Share article">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ArticleExportButtons;
