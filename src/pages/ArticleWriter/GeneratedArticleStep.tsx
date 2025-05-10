
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Copy, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import '@/styles/article.css';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import ArticleLoadingOverlay from '@/components/articleWriter/ArticleLoadingOverlay';
import { getTitleFromResponse } from '@/utils/articleUtils';

const GeneratedArticleStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    currentStep,
    setCurrentStep,
    keywordForm,
    keywordSelectResponse,
    isLoading,
    setIsLoading
  } = useArticleWriter();
  
  const [article, setArticle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Set step number
    setCurrentStep(5);
    
    // If we don't have keyword response data, redirect
    if (!keywordSelectResponse) {
      navigate('/article-writer/keyword');
    }
    
    // Check if we have a generated article in the response
    if (keywordSelectResponse?.generatedArticle) {
      setArticle(keywordSelectResponse.generatedArticle);
    } else {
      setError('No article content available. Please try again.');
    }
  }, [keywordSelectResponse, navigate, setCurrentStep]);
  
  // Navigate back to outline step
  const handleBack = () => {
    navigate('/article-writer/outline');
  };
  
  // Copy article to clipboard
  const handleCopyArticle = () => {
    if (!article) return;
    
    navigator.clipboard.writeText(article).then(() => {
      toast({
        title: "Article copied to clipboard",
        description: "You can now paste the article into your preferred editor."
      });
    }).catch(() => {
      toast({
        title: "Failed to copy article",
        description: "Please try again or select and copy the text manually.",
        variant: "destructive"
      });
    });
  };
  
  // Download article as file
  const handleDownloadArticle = () => {
    if (!article) return;
    
    const title = getTitleFromResponse(keywordSelectResponse, 'article-' + new Date().toISOString().slice(0, 10));
                 
    const blob = new Blob([article], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Article downloaded",
      description: "Your article has been downloaded as a Markdown file."
    });
  };
  
  // Create new article
  const handleCreateNew = () => {
    navigate('/article-writer/keyword');
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Generated Article - Article Writer</title>
      </Helmet>
      
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Generated Article</h1>
          <p className="text-gray-600">
            Your article on{" "}
            <span className="font-medium">
              {getTitleFromResponse(keywordSelectResponse, keywordForm.keyword)}
            </span>{" "}
            has been generated
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Article Content</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline" 
                size="sm"
                onClick={handleCopyArticle}
                disabled={!article}
                className="flex items-center"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={handleDownloadArticle}
                disabled={!article}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {article ? (
              <div 
                className="prose prose-slate max-w-none article-content"
                dangerouslySetInnerHTML={{ __html: article }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No article content available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
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
            onClick={handleCreateNew}
          >
            Create New Article
          </Button>
        </div>
      </div>
      
      {isLoading && <ArticleLoadingOverlay />}
    </DashboardLayout>
  );
};

export default GeneratedArticleStep;
