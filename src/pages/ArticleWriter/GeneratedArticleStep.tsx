
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner'; 
import '@/styles/article.css';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import ArticleLoadingOverlay from '@/components/articleWriter/ArticleLoadingOverlay';
import ArticleContentEditor from '@/components/articleWriter/ArticleContentEditor';
import ArticleExportButtons from '@/components/articleWriter/ArticleExportButtons';
import WordCount from '@/components/articleWriter/WordCount';
import { 
  getTitleFromResponse,
  getGeneratedArticleContent,
  getHumanizedArticleContent,
  getMetaDescription,
  analyzeResponseStructure
} from '@/utils/articleUtils';
import type { ArticleTabOption } from '@/types/articleWriter';

const GeneratedArticleStep = () => {
  const navigate = useNavigate();
  
  const {
    currentStep,
    setCurrentStep,
    keywordForm,
    keywordSelectResponse,
    isLoading,
    setIsLoading
  } = useArticleWriter();
  
  const [articleContent, setArticleContent] = useState<string>('');
  const [humanizedContent, setHumanizedContent] = useState<string | null>(null);
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ArticleTabOption>('generated');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  useEffect(() => {
    // Set step number
    setCurrentStep(5);
    
    // If we don't have keyword response data, redirect
    if (!keywordSelectResponse) {
      console.log("No keywordSelectResponse found, redirecting to keyword entry step");
      navigate('/article-writer/keyword');
      return;
    }
    
    console.log("GeneratedArticleStep - keywordSelectResponse:", keywordSelectResponse);
    console.log("Response structure:", analyzeResponseStructure(keywordSelectResponse));
    
    try {
      // Get article content from the response with extensive debugging
      console.log("Attempting to extract generated article content");
      const generatedArticle = getGeneratedArticleContent(keywordSelectResponse, '');
      console.log("Generated article content extracted:", generatedArticle ? generatedArticle.substring(0, 100) + "..." : "None");
      
      if (generatedArticle && generatedArticle.length > 0) {
        setArticleContent(generatedArticle);
        console.log("Article content set in state");
      } else {
        console.warn("No article content found in response");
        setError('No article content available. Please try again.');
      }
      
      // Get humanized content if available with extensive debugging
      console.log("Attempting to extract humanized article content");
      const humanized = getHumanizedArticleContent(keywordSelectResponse);
      console.log("Humanized article content extracted:", humanized ? humanized.substring(0, 100) + "..." : "None");
      
      if (humanized && humanized.length > 0) {
        setHumanizedContent(humanized);
        console.log("Humanized content set in state");
        
        // If we have humanized content, default to that tab
        setActiveTab('humanized');
        console.log("Active tab set to 'humanized'");
      }
      
      // Get meta description
      console.log("Attempting to extract meta description");
      const meta = getMetaDescription(keywordSelectResponse, '');
      console.log("Meta description extracted:", meta);
      
      if (meta) {
        setMetaDescription(meta);
      }
      
      setIsInitialized(true);
      console.log("Component initialization complete");
    } catch (err) {
      console.error("Error processing article data:", err);
      setError('An error occurred while processing the article content.');
    }
    
  }, [keywordSelectResponse, navigate, setCurrentStep]);
  
  // Navigate back to outline step
  const handleBack = () => {
    navigate('/article-writer/outline');
  };
  
  // Create new article
  const handleCreateNew = () => {
    navigate('/article-writer/keyword');
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as ArticleTabOption);
  };
  
  // Content ID to use for exporting articles
  const contentId = activeTab === 'generated' ? 'generated-article-content' : 'humanized-article-content';
  
  // If both content pieces are empty, show an error
  useEffect(() => {
    if (isInitialized && !articleContent && !humanizedContent) {
      setError('No article content available. The API response may be incomplete.');
    } else if (isInitialized && (articleContent || humanizedContent)) {
      setError(null);
    }
  }, [articleContent, humanizedContent, isInitialized]);
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Generated Article - Article Writer</title>
      </Helmet>
      
      <div className="container py-8">
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Generated Article</h1>
          <p className="text-gray-600">
            Your article on{" "}
            <span className="font-medium">
              {getTitleFromResponse(keywordSelectResponse, keywordForm?.keyword || '')}
            </span>{" "}
            has been generated
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="max-w-6xl mx-auto mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="max-w-6xl mx-auto mb-6">
          {/* Article details card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Type of Content</h3>
                  <p>{keywordSelectResponse?.typeOfContent || '-'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Original Keyword</h3>
                  <p>{keywordSelectResponse?.originalKeyword || '-'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Main Keyword</h3>
                  <p>{keywordSelectResponse?.mainKeyword || '-'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Additional Keywords</h3>
                  <p>{Array.isArray(keywordSelectResponse?.additionalKeyword) ? keywordSelectResponse.additionalKeyword.join(', ') : '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Title & Description</h3>
                  <p className="font-medium">{getTitleFromResponse(keywordSelectResponse, '')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {metaDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs for Generated Article and Humanized Article */}
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
            defaultValue={humanizedContent ? 'humanized' : 'generated'}
          >
            <div className="flex flex-wrap items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="generated">Generated Article</TabsTrigger>
                {humanizedContent && (
                  <TabsTrigger value="humanized">Human-like Article</TabsTrigger>
                )}
              </TabsList>
              
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                {/* Word count */}
                {activeTab === 'generated' ? (
                  <WordCount content={articleContent} />
                ) : (
                  <WordCount content={humanizedContent || ''} />
                )}
                
                {/* Export buttons */}
                <ArticleExportButtons 
                  title={getTitleFromResponse(keywordSelectResponse, 'Generated Article')}
                  contentId={contentId}
                />
              </div>
            </div>
            
            {/* Generated Article Content */}
            <TabsContent value="generated" className="m-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Generated Article</CardTitle>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <ArticleContentEditor
                    id="generated-article-content"
                    content={articleContent}
                    onChange={setArticleContent}
                    isEditable={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Humanized Article Content */}
            {humanizedContent && (
              <TabsContent value="humanized" className="m-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Human-like Article</CardTitle>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ArticleContentEditor
                      id="humanized-article-content"
                      content={humanizedContent}
                      onChange={setHumanizedContent}
                      isEditable={true}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
          
          {/* Meta Description */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Meta Description</CardTitle>
            </CardHeader>
            <CardContent>
              <ArticleContentEditor
                id="meta-description-content"
                content={metaDescription}
                onChange={setMetaDescription}
                isEditable={true}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between max-w-6xl mx-auto mt-8">
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
