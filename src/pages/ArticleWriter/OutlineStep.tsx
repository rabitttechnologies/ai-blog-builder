
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { useOutlineCustomization } from '@/hooks/useOutlineCustomization';
import OutlineOptionsList from '@/components/articleWriter/OutlineOptionsList';
import OutlineCustomizationOptions from '@/components/articleWriter/OutlineCustomizationOptions';
import ArticleLoadingOverlay from '@/components/articleWriter/ArticleLoadingOverlay';
import { getTitleFromResponse } from '@/utils/articleUtils';

const OutlineStep = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    keywordForm,
    keywordSelectResponse,
    setKeywordSelectResponse,
    isLoading,
    setIsLoading,
    workflowId,
    sessionId
  } = useArticleWriter();
  
  const {
    loading,
    error,
    outlineOptions,
    selectedOutlineIndex,
    setSelectedOutlineIndex,
    customizationOptions,
    updateCustomizationOption,
    submitOutlineAndCustomization
  } = useOutlineCustomization({
    keywordSelectResponse,
    userId: keywordSelectResponse?.userId || 'defaultUserId',
    workflowId: workflowId,
    sessionId: sessionId
  });
  
  const [apiError, setApiError] = useState<string | null>(null);
  
  useEffect(() => {
    setCurrentStep(4);
    
    if (!keywordSelectResponse) {
      navigate('/article-writer/select-keywords');
    }
    
    if (keywordSelectResponse) {
      // Check for the articleOutline field using the correct casing
      if (keywordSelectResponse.articleOutline) {
        // Use the data from the keywordSelectResponse
        if (Array.isArray(keywordSelectResponse.articleOutline)) {
          console.log("Article outline data is an array:", keywordSelectResponse.articleOutline);
          // If you need to do anything with the outline data here, you can do it
        }
      }
      // For backward compatibility, check lowercase variant too
      else if (keywordSelectResponse.articleOutline) {
        // If the articleOutline (lowercase) exists, copy it to articleOutline (camelCase)
        setKeywordSelectResponse({
          ...keywordSelectResponse,
          articleOutline: keywordSelectResponse.articleOutline
        });
      }
    }
    
  }, [keywordSelectResponse, navigate, setCurrentStep, setKeywordSelectResponse]);
  
  const handleBack = () => {
    navigate('/article-writer/title-description');
  };
  
  const handleSubmit = async () => {
    try {
      setApiError(null);
      setIsLoading(true);
      
      // Call the submitOutlineAndCustomization function from the hook
      await submitOutlineAndCustomization();
      
      // If successful, navigate to the next step
      navigate('/article-writer/generated-article');
    } catch (err: any) {
      // Handle errors from the submitOutlineAndCustomization function
      console.error("Error during outline submission:", err);
      setApiError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegenerate = () => {
    // Reload the current page
    window.location.reload();
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Article Outline - Article Writer</title>
      </Helmet>
      
      <div className="container max-w-5xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Customize Article Outline</h1>
          <p className="text-gray-600">
            Customize the outline and settings for your article about{" "}
            <span className="font-medium">
              {getTitleFromResponse(keywordSelectResponse, keywordForm.keyword)}
            </span>
          </p>
        </div>
        
        {apiError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            {/* Article Outline Options */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Article Outline Options</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleRegenerate}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
                <CardDescription>
                  Select an outline option to customize your article structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OutlineOptionsList
                  outlines={outlineOptions}
                  selectedOutlineIndex={selectedOutlineIndex || 0}
                  onSelect={setSelectedOutlineIndex}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Article Customization Options */}
          <div>
            <OutlineCustomizationOptions
              customizationOptions={customizationOptions}
              updateCustomizationOption={updateCustomizationOption}
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack} className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center"
          >
            {loading ? "Generating..." : "Continue"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading && <ArticleLoadingOverlay />}
    </DashboardLayout>
  );
};

export default OutlineStep;
