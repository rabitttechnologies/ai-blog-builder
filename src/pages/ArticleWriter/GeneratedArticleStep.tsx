
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Copy, Undo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';

const GeneratedArticleStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    currentStep, 
    setCurrentStep,
    keywordSelectResponse,
    resetWorkflow
  } = useArticleWriter();

  // Set the current step when the component mounts
  useEffect(() => {
    setCurrentStep(5);
    
    // Redirect if we don't have the required data
    if (!keywordSelectResponse) {
      toast({
        title: "Missing Data",
        description: "Required data is missing. Please start over.",
        variant: "destructive"
      });
      navigate('/article-writer');
    }
  }, [setCurrentStep, keywordSelectResponse, toast, navigate]);

  // Handle copy to clipboard
  const handleCopyContent = () => {
    // Implement copy functionality here
    toast({
      title: "Copied to Clipboard",
      description: "Article content has been copied to clipboard.",
    });
  };

  // Handle download as markdown
  const handleDownload = () => {
    // Implement download functionality here
    toast({
      title: "Download Started",
      description: "Your article is being downloaded as markdown.",
    });
  };

  // Handle back button
  const handleBack = () => {
    navigate('/article-writer/outline');
  };

  // Handle start over button
  const handleStartOver = () => {
    resetWorkflow();
    navigate('/article-writer');
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Generated Article - Article Writer AI</title>
      </Helmet>
      
      <div className="container max-w-5xl py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Generated Article</h1>
            <p className="text-gray-600">
              Your article about <span className="font-medium">{keywordSelectResponse?.mainKeyword}</span> has been generated.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleCopyContent}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        
        <Card className="mb-8 p-6">
          <div className="prose max-w-none">
            <h2>{keywordSelectResponse?.titlesandShortDescription?.title || "Your Generated Article"}</h2>
            
            <p className="lead">{keywordSelectResponse?.titlesandShortDescription?.description || "Article description will appear here."}</p>
            
            <div className="py-4">
              <p>Your generated article content will appear here. The content is currently being processed and will be displayed once it's ready.</p>
              
              <p>The article will include all the customizations you selected in the previous step, such as:</p>
              
              <ul>
                <li>Images and visual elements</li>
                <li>Internal and external links</li>
                <li>Expert quotes and references</li>
                <li>Comparison tables if requested</li>
                <li>Frequently asked questions section</li>
                <li>Call to action elements</li>
              </ul>
              
              <p>You'll be able to copy, download, or further edit this content once it's fully loaded.</p>
            </div>
          </div>
        </Card>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Outline
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleStartOver}
            className="flex items-center"
          >
            <Undo className="h-4 w-4 mr-2" />
            Start New Article
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GeneratedArticleStep;
