
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useArticleWriter, TitleDescriptionOption, WritingStyle } from '@/context/articleWriter/ArticleWriterContext';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeadingCountSelector from '@/components/articleWriter/title-description/HeadingCountSelector';
import PointOfViewSelector from '@/components/articleWriter/title-description/PointOfViewSelector';
import WritingStyleForm from '@/components/articleWriter/title-description/WritingStyleForm';
import ExpertGuidanceInput from '@/components/articleWriter/title-description/ExpertGuidanceInput';
import TitleSelectionCard from '@/components/articleWriter/title-description/TitleSelectionCard';

const TitleDescriptionStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    keywordForm,
    keywordSelectResponse,
    setCurrentStep,
    titleDescriptionFormData,
    updateTitleDescriptionFormData,
    savedWritingStyles,
    addSavedWritingStyle,
    isLoading,
    setIsLoading,
    submitTitleDescriptionForm
  } = useArticleWriter();
  
  const [activeTab, setActiveTab] = useState('select-title');
  const [selectedStyleId, setSelectedStyleId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Update current step
    setCurrentStep(3);
    
    // Redirect if no keyword response
    if (!keywordSelectResponse) {
      toast({
        title: "No keyword data",
        description: "Please complete the keyword selection step first.",
        variant: "destructive"
      });
      navigate('/article-writer/select-keywords');
    }
  }, [setCurrentStep, keywordSelectResponse, toast, navigate]);
  
  // Handle title selection
  const handleSelectTitle = (title: TitleDescriptionOption) => {
    updateTitleDescriptionFormData({ selectedTitle: title });
  };
  
  // Handle writing style selection
  const handleSelectWritingStyle = (styleId: string) => {
    setSelectedStyleId(styleId);
    
    // Find the selected style
    const style = savedWritingStyles.find(s => s.id === styleId);
    if (style) {
      updateTitleDescriptionFormData({ writingStyle: style.description });
    }
  };
  
  // Handle custom writing style change
  const handleCustomStyleChange = (value: string) => {
    setSelectedStyleId(undefined);
    updateTitleDescriptionFormData({ writingStyle: value });
  };
  
  // Handle writing style creation
  const handleCreateStyle = (style: Omit<WritingStyle, 'id'>) => {
    // Fix: Ensure addSavedWritingStyle returns the new style
    const newStyle = addSavedWritingStyle(style);
    if (newStyle) {  // Add null/undefined check
      setSelectedStyleId(newStyle.id);
      updateTitleDescriptionFormData({ writingStyle: newStyle.description });
    }
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/article-writer/select-keywords');
  };
  
  // Handle continue button
  const handleContinue = async () => {
    // Validate form data
    if (!titleDescriptionFormData.selectedTitle) {
      toast({
        title: "Please select a title",
        description: "You need to select a title and description for your article.",
        variant: "destructive"
      });
      setActiveTab('select-title');
      return;
    }
    
    if (!titleDescriptionFormData.writingStyle) {
      toast({
        title: "Please define a writing style",
        description: "You need to select or create a writing style for your article.",
        variant: "destructive"
      });
      setActiveTab('configure-article');
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await submitTitleDescriptionForm();
      
      // If successful, navigate to the next step
      if (result) {
        navigate('/article-writer/outline');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while submitting the form.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!keywordSelectResponse) {
    return null; // Will redirect in useEffect
  }
  
  const titlesAndDescriptions = keywordSelectResponse.titlesandShortDescription || [];
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Select Title and Configure Article - Article Writer AI</title>
      </Helmet>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Title and Configure Article</h1>
          <p className="text-gray-600">
            Choose a title and configure the settings for your article about <span className="font-medium">{keywordForm.keyword}</span>.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select-title">1. Select Title</TabsTrigger>
            <TabsTrigger value="configure-article">2. Configure Article</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select-title" className="pt-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-4">
                Select one of the AI-generated title and description suggestions below.
              </p>
              
              <div className="space-y-4">
                {titlesAndDescriptions.map((title, index) => (
                  <TitleSelectionCard
                    key={index}
                    title={title}
                    isSelected={titleDescriptionFormData.selectedTitle?.title === title.title}
                    onSelect={() => handleSelectTitle(title)}
                    disabled={isLoading}
                  />
                ))}
                
                {titlesAndDescriptions.length === 0 && (
                  <Card className="p-6 text-center">
                    <p className="text-gray-500">No title options available.</p>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center"
                disabled={isLoading}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => setActiveTab('configure-article')}
                className="flex items-center"
                disabled={!titleDescriptionFormData.selectedTitle || isLoading}
              >
                Next Step
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="configure-article" className="pt-6">
            <div className="space-y-8">
              {/* Selected title display */}
              {titleDescriptionFormData.selectedTitle && (
                <Card className="p-4 border-primary/20 bg-primary/5">
                  <h3 className="font-bold text-lg mb-2">{titleDescriptionFormData.selectedTitle.title}</h3>
                  <p className="text-gray-600 text-sm">{titleDescriptionFormData.selectedTitle.description}</p>
                </Card>
              )}
              
              {/* Number of Headings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Number of Headings</h3>
                <p className="text-sm text-gray-500">
                  Select how many headings you want in your article. This will determine the length and depth of the content.
                </p>
                <HeadingCountSelector
                  value={titleDescriptionFormData.headingCount}
                  onChange={(value) => updateTitleDescriptionFormData({ headingCount: value })}
                  disabled={isLoading}
                />
              </div>
              
              {/* Writing Style */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Writing Style</h3>
                <p className="text-sm text-gray-500">
                  Define the tone and style for your article or select from your saved styles.
                </p>
                <WritingStyleForm
                  styles={savedWritingStyles}
                  selectedStyleId={selectedStyleId}
                  customStyle={titleDescriptionFormData.writingStyle}
                  onSelectStyle={handleSelectWritingStyle}
                  onCustomStyleChange={handleCustomStyleChange}
                  onCreateStyle={handleCreateStyle}
                  disabled={isLoading}
                />
              </div>
              
              {/* Article Point of View */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Article Point of View</h3>
                <p className="text-sm text-gray-500">
                  Choose the perspective from which the article will be written.
                </p>
                <PointOfViewSelector
                  value={titleDescriptionFormData.pointOfView}
                  onChange={(value) => updateTitleDescriptionFormData({ pointOfView: value })}
                  disabled={isLoading}
                />
              </div>
              
              {/* Expert Guidance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Expert Guidance (Optional)</h3>
                <p className="text-sm text-gray-500">
                  Provide any specific instructions or guidance for the AI when writing your article.
                </p>
                <ExpertGuidanceInput
                  value={titleDescriptionFormData.expertGuidance}
                  onChange={(value) => updateTitleDescriptionFormData({ expertGuidance: value })}
                  saveForFuture={titleDescriptionFormData.saveWritingStyle}
                  onSaveForFutureChange={(value) => updateTitleDescriptionFormData({ saveWritingStyle: value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setActiveTab('select-title')}
                className="flex items-center"
                disabled={isLoading}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleContinue}
                className="flex items-center"
                disabled={isLoading || !titleDescriptionFormData.writingStyle}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TitleDescriptionStep;
