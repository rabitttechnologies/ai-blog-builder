
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import OutlineDisplay from '@/components/articleWriter/OutlineDisplay';
import OutlineCustomizeForm from '@/components/articleWriter/OutlineCustomizeForm';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { useOutlineCustomization } from '@/hooks/useOutlineCustomization';
import ArticleLoadingOverlay from '@/components/articleWriter/ArticleLoadingOverlay';
import { getTitleFromResponse } from '@/utils/articleUtils';

const OutlineStep = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    keywordForm,
    keywordSelectResponse,
    keywordResponse,
    sessionId,
    workflowId,
    isLoading,
    setIsLoading
  } = useArticleWriter();

  const [editingOutlineIndex, setEditingOutlineIndex] = useState<number | null>(null);
  const [editedOutlineContent, setEditedOutlineContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // For debugging - output the articleoutline data to console
  useEffect(() => {
    if (keywordSelectResponse) {
      console.log("OutlineStep - Article Outline Data:", keywordSelectResponse.articleoutline || keywordSelectResponse.articleOutline);
    }
  }, [keywordSelectResponse]);
  
  // Use outline customization hook
  const {
    outlineOptions,
    selectedOutlineIndex,
    customizationOptions,
    setSelectedOutlineIndex,
    updateCustomizationOption,
    submitOutlineAndCustomizations,
    parseOutline
  } = useOutlineCustomization({
    keywordSelectResponse,
    userId: keywordResponse?.userId || keywordSelectResponse?.userId || '',
    workflowId,
    sessionId
  });

  useEffect(() => {
    // Set step number
    setCurrentStep(4);
    
    // Check if we have the necessary data
    if (!keywordSelectResponse) {
      navigate('/article-writer/select-keywords');
    }
  }, [keywordSelectResponse, navigate, setCurrentStep]);
  
  // Check if we have outlines to display
  useEffect(() => {
    if (!keywordSelectResponse?.articleoutline && 
        !keywordSelectResponse?.articleOutline && 
        keywordSelectResponse) {
      console.error("Missing article outline data in keywordSelectResponse:", keywordSelectResponse);
      setError("No outline data found. Please go back to the previous step and try again.");
    }
  }, [keywordSelectResponse]);

  // Handle back button
  const handleBack = () => {
    navigate('/article-writer/title-description');
  };

  // Handle editing outline
  const handleEditOutline = (index: number) => {
    if (index === editingOutlineIndex) {
      // Close editing if already open
      setEditingOutlineIndex(null);
      setEditedOutlineContent('');
    } else {
      // Open editing for this outline
      setEditingOutlineIndex(index);
      setEditedOutlineContent(outlineOptions[index]?.content || '');
    }
  };

  // Handle outline content changes while editing
  const handleOutlineContentChange = (content: string) => {
    setEditedOutlineContent(content);
  };

  // Handle saving edited outline
  const handleSaveOutline = () => {
    if (editingOutlineIndex !== null && editedOutlineContent) {
      const parsedOutline = parseOutline(editedOutlineContent);
      outlineOptions[editingOutlineIndex] = {
        ...outlineOptions[editingOutlineIndex],
        content: editedOutlineContent,
        parsed: parsedOutline
      };
      
      // Close editing mode
      setEditingOutlineIndex(null);
      setEditedOutlineContent('');
      
      // Select this outline
      setSelectedOutlineIndex(editingOutlineIndex);
    }
  };

  // Handle outline selection
  const handleSelectOutline = (index: number) => {
    // If we're in editing mode, save the edits first
    if (editingOutlineIndex === index && editedOutlineContent) {
      handleSaveOutline();
    } else {
      // Otherwise just select the outline
      setSelectedOutlineIndex(index);
    }
  };

  // Handle continue button click
  const handleContinue = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Check if an outline is selected
      if (selectedOutlineIndex === null || !outlineOptions[selectedOutlineIndex]) {
        throw new Error('Please select an outline before continuing.');
      }
      
      // Submit outline and customizations
      await submitOutlineAndCustomizations();
      
      // Navigate to the next step
      navigate('/article-writer/generated-article');
      
    } catch (err: any) {
      if (err.message.includes('CORS policy') || err.message.includes('Failed to fetch')) {
        setError("Network error: Unable to connect to the article customization service. Please try again later.");
      } else {
        setError(err.message || "An error occurred during outline submission.");
      }
      console.error('Error during outline submission:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we're waiting for outlines to load
  const isLoadingOutlines = keywordSelectResponse && outlineOptions.length === 0;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Article Outline - Article Writer</title>
      </Helmet>
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Article Outline</h1>
          <p className="text-gray-600">
            Select and customize your article outline for{" "}
            <span className="font-medium">
              {getTitleFromResponse(keywordSelectResponse)}
            </span>
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Outlines Grid - 2 columns on larger screens */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Outline</CardTitle>
                <CardDescription>
                  Select one of the outlines below or edit them to customize the structure of your article
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6">
                {isLoadingOutlines ? (
                  <div className="text-center p-8 border border-dashed rounded-lg">
                    <p className="text-gray-500">Loading outlines...</p>
                  </div>
                ) : outlineOptions && outlineOptions.length > 0 ? (
                  outlineOptions.map((outline, index) => (
                    <OutlineDisplay
                      key={outline.id || index}
                      outline={outline}
                      isEditing={editingOutlineIndex === index}
                      editedContent={editingOutlineIndex === index ? editedOutlineContent : outline.content}
                      onEdit={() => handleEditOutline(index)}
                      onEditChange={handleOutlineContentChange}
                      onSelect={() => handleSelectOutline(index)}
                      isSelected={selectedOutlineIndex === index}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="text-center p-8 border border-dashed rounded-lg">
                    <p className="text-gray-500">
                      {keywordSelectResponse ? 
                        "No outlines available. Please go back and try again." :
                        "Loading outlines..."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Customization Options Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Content Customization</CardTitle>
                <CardDescription>
                  Customize your article's content and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OutlineCustomizeForm
                  customizationOptions={customizationOptions}
                  onChange={updateCustomizationOption}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Navigation Buttons */}
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
            onClick={handleContinue}
            disabled={selectedOutlineIndex === null || isLoadingOutlines}
            className="flex items-center"
          >
            Generate Article
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        {/* Loading Overlay */}
        {isLoading && (
          <ArticleLoadingOverlay 
            message="We're Creating Your Content" 
            subMessage="This may take a minute or two"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default OutlineStep;
