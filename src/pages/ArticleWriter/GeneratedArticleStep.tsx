
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import '@/styles/article.css';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import ArticleLoadingOverlay from '@/components/articleWriter/ArticleLoadingOverlay';
import WordCounter from '@/components/articleWriter/WordCounter';
import ArticleActions from '@/components/articleWriter/ArticleActions';
import EditableArticleContent from '@/components/articleWriter/EditableArticleContent';
import ArticleMetaEditor from '@/components/articleWriter/ArticleMetaEditor';
import KeywordInfoDisplay from '@/components/articleWriter/KeywordInfoDisplay';
import { 
  getTitleFromResponse, 
  getDescriptionFromResponse,
  getTitlesAndDescriptions,
  safeJsonParse,
  extractMetaDescription
} from '@/utils/articleUtils';
import { 
  exportAsHtml, 
  exportAsDocx, 
  exportAsPdf 
} from '@/utils/documentUtils';
import { toast } from 'sonner';

const GeneratedArticleStep = () => {
  const navigate = useNavigate();
  const { toast: toastNotification } = useToast();
  const articleContentRef = useRef<HTMLDivElement>(null);
  
  const {
    currentStep,
    setCurrentStep,
    keywordForm,
    keywordSelectResponse,
    isLoading,
    setIsLoading
  } = useArticleWriter();
  
  const [article, setArticle] = useState<string | null>(null);
  const [humanizedArticle, setHumanizedArticle] = useState<string | null>(null);
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('generated');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Set step number
    setCurrentStep(5);
    
    // If we don't have keyword response data, redirect
    if (!keywordSelectResponse) {
      navigate('/article-writer/keyword');
      return;
    }
    
    // Check for generated article content
    if (keywordSelectResponse.GeneratedArticle) {
      setArticle(keywordSelectResponse.GeneratedArticle);
    } else if (keywordSelectResponse.generatedArticle) {
      setArticle(keywordSelectResponse.generatedArticle);
    } else {
      setError('No article content available. Please try again.');
    }
    
    // Check for humanized article content if available
    if (keywordSelectResponse.HumanizedGeneratedArticle) {
      setHumanizedArticle(keywordSelectResponse.HumanizedGeneratedArticle);
      // If humanized content is available, use it as the default tab
      setActiveTab('humanized');
    }
    
    // Check for meta description
    if (keywordSelectResponse.metaTags) {
      setMetaDescription(keywordSelectResponse.metaTags);
    }
  }, [keywordSelectResponse, navigate, setCurrentStep]);
  
  // Navigate back to outline step
  const handleBack = () => {
    navigate('/article-writer/outline');
  };
  
  // Handle article edit
  const handleEdit = () => {
    // Navigate to a hypothetical edit page or just show an edit UI here
    toast("Edit feature coming soon", {
      description: "Advanced article editing will be available in a future update."
    });
  };
  
  // Functions for document export
  const handleDownloadHtml = () => {
    try {
      const content = activeTab === 'humanized' && humanizedArticle 
        ? humanizedArticle 
        : article || '';
        
      const title = getTitleFromResponse(keywordSelectResponse, 'article');
      const filename = title.replace(/\s+/g, '-').toLowerCase();
      
      exportAsHtml(content, filename);
      toast.success("Article downloaded as HTML");
    } catch (error) {
      console.error("Error downloading HTML:", error);
      toast.error("Failed to download as HTML");
    }
  };
  
  const handleDownloadDoc = async () => {
    try {
      const content = activeTab === 'humanized' && humanizedArticle 
        ? humanizedArticle 
        : article || '';
        
      const title = getTitleFromResponse(keywordSelectResponse, 'article');
      const filename = title.replace(/\s+/g, '-').toLowerCase();
      
      await exportAsDocx(content, filename);
      toast.success("Article downloaded as DOCX");
    } catch (error) {
      console.error("Error downloading DOCX:", error);
      toast.error("Failed to download as DOCX");
    }
  };
  
  const handleDownloadPdf = async () => {
    try {
      setIsLoading(true);
      
      const title = getTitleFromResponse(keywordSelectResponse, 'article');
      const filename = title.replace(/\s+/g, '-').toLowerCase();
      
      if (!articleContentRef.current) {
        throw new Error("Article content element not found");
      }
      
      await exportAsPdf('article-content-export', filename);
      toast.success("Article downloaded as PDF");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download as PDF");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle sharing
  const handleShare = () => {
    try {
      const title = getTitleFromResponse(keywordSelectResponse, 'Generated Article');
      // Use Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: title,
          text: `Check out this article: ${title}`,
        }).catch(error => {
          console.error('Error sharing:', error);
          // Fallback to copy to clipboard
          copyToClipboard();
        });
      } else {
        // Fallback to copy to clipboard
        copyToClipboard();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Failed to share article");
    }
  };
  
  // Copy URL to clipboard as a fallback sharing mechanism
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("URL copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy URL");
    });
  };
  
  // Get additional data from the response
  const contentType = keywordSelectResponse?.typeOfContent || '';
  const originalKeyword = keywordSelectResponse?.originalKeyword || '';
  const mainKeyword = keywordSelectResponse?.mainKeyword || '';
  
  // Handle additional keywords, which might be an array or string
  let additionalKeywords: string[] = [];
  if (keywordSelectResponse?.additionalKeyword) {
    if (Array.isArray(keywordSelectResponse.additionalKeyword)) {
      additionalKeywords = keywordSelectResponse.additionalKeyword;
    } else if (typeof keywordSelectResponse.additionalKeyword === 'string') {
      try {
        additionalKeywords = JSON.parse(keywordSelectResponse.additionalKeyword);
      } catch (e) {
        // If it's a single string that can't be parsed, use it directly
        additionalKeywords = [keywordSelectResponse.additionalKeyword];
      }
    }
  }
  
  // Get titles and descriptions
  const titlesAndDescriptions = getTitlesAndDescriptions(keywordSelectResponse);
  const title = titlesAndDescriptions.length > 0 ? titlesAndDescriptions[0].title : '';
  const description = titlesAndDescriptions.length > 0 ? titlesAndDescriptions[0].description : '';

  return (
    <DashboardLayout>
      <Helmet>
        <title>Generated Article - Article Writer</title>
        {metaDescription && <meta name="description" content={extractMetaDescription(metaDescription)} />}
      </Helmet>
      
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{title || 'Generated Article'}</h1>
          <p className="text-gray-600">
            {description || `Your article on ${mainKeyword || originalKeyword} has been generated`}
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="md:col-span-2">
            {/* Tabs for different article versions */}
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <TabsList>
                  <TabsTrigger value="generated">Generated Article</TabsTrigger>
                  {humanizedArticle && (
                    <TabsTrigger value="humanized">Like Human Written</TabsTrigger>
                  )}
                </TabsList>
                
                {/* Article actions (download, share) */}
                <ArticleActions
                  onDownloadHtml={handleDownloadHtml}
                  onDownloadDoc={handleDownloadDoc}
                  onDownloadPdf={handleDownloadPdf}
                  onShare={handleShare}
                />
              </div>
              
              {/* Generated article content */}
              <TabsContent value="generated">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center">
                      {article && <WordCounter content={article} />}
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <EditableArticleContent
                      content={article || ''}
                      onChange={setArticle}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Humanized article content (only shown if available) */}
              {humanizedArticle && (
                <TabsContent value="humanized">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center">
                        {humanizedArticle && <WordCounter content={humanizedArticle} />}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <EditableArticleContent
                        content={humanizedArticle}
                        onChange={setHumanizedArticle}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
            
            {/* Meta description editor */}
            {metaDescription && (
              <div className="mb-6">
                <ArticleMetaEditor
                  metaText={metaDescription}
                  onChange={setMetaDescription}
                />
              </div>
            )}
          </div>
          
          {/* Sidebar with keyword information */}
          <div>
            <KeywordInfoDisplay
              contentType={contentType}
              originalKeyword={originalKeyword}
              mainKeyword={mainKeyword}
              additionalKeywords={additionalKeywords}
            />
          </div>
        </div>
        
        {/* Hidden div for PDF export */}
        <div id="article-content-export" className="hidden">
          <div className="prose prose-slate max-w-none article-content" ref={articleContentRef}>
            {activeTab === 'humanized' && humanizedArticle ? (
              <div dangerouslySetInnerHTML={{ __html: humanizedArticle }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: article || '' }} />
            )}
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleEdit}
            className="flex items-center"
          >
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
      
      {isLoading && <ArticleLoadingOverlay />}
    </DashboardLayout>
  );
};

export default GeneratedArticleStep;
