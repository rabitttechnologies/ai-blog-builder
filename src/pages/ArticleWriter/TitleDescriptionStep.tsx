import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { headingsOptions } from '@/types/articleWriter';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import HeadingsCountSelector from '@/components/articleWriter/HeadingsCountSelector';
import WritingStyleSelector from '@/components/articleWriter/WritingStyleSelector';
import PointOfViewSelector from '@/components/articleWriter/PointOfViewSelector';
import ExpertGuidanceInput from '@/components/articleWriter/ExpertGuidanceInput';
import titleDescriptionService from '@/services/titleDescriptionService';

const TitleDescriptionStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentStep,
    keywordForm,
    keywordSelectResponse,
    sessionId,
    workflowId,
    setCurrentStep,
    selectedTitleDescription,
    setSelectedTitleDescription,
    titleDescriptionOptions,
    setTitleDescriptionOptions,
    titleDescriptionForm,
    updateTitleDescriptionForm,
    savedWritingStyles,
    addWritingStyle,
    savedExpertGuidance,
    addExpertGuidance,
    isLoading,
    setIsLoading
  } = useArticleWriter();
  
  const [activeTab, setActiveTab] = useState('titles');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // Process keyword response data and prepare title descriptions
  useEffect(() => {
    // Update current step
    setCurrentStep(3);
    
    console.log("TitleDescriptionStep - keywordSelectResponse:", keywordSelectResponse);
    
    // Check if we have the required data
    if (!keywordSelectResponse) {
      toast({
        title: "Missing Data",
        description: "No keyword data found. Please go back and select keywords first.",
        variant: "destructive"
      });
      navigate('/article-writer/select-keywords');
      return;
    }
    
    // Format and set title description options if they aren't already set
    if (keywordSelectResponse && (!titleDescriptionOptions || titleDescriptionOptions.length === 0)) {
      // Handle both direct object and array-wrapped response
      const normalizedResponse = Array.isArray(keywordSelectResponse) ? keywordSelectResponse[0] : keywordSelectResponse;
      
      if (normalizedResponse.titlesandShortDescription && 
          Array.isArray(normalizedResponse.titlesandShortDescription) && 
          normalizedResponse.titlesandShortDescription.length > 0) {
        
        console.log("Setting title description options from keywordSelectResponse");
        
        const formattedOptions = titleDescriptionService.formatTitleDescriptions(normalizedResponse);
        setTitleDescriptionOptions(formattedOptions);
      } else {
        console.error("No title options found in keywordSelectResponse:", keywordSelectResponse);
        toast({
          title: "Missing Data",
          description: "No title options found. Please go back and select keywords first.",
          variant: "destructive"
        });
        navigate('/article-writer/select-keywords');
      }
    }
  }, [setCurrentStep, keywordSelectResponse, titleDescriptionOptions, setTitleDescriptionOptions, toast, navigate]);
  
  // Handle title selection
  const handleSelectTitle = (title: string, description: string) => {
    setSelectedTitleDescription({
      id: 'selected',
      title,
      description
    });
  };
  
  // Handle headings count selection
  const handleHeadingsCountChange = (value: string) => {
    const selected = headingsOptions.find(option => option.id === value) || null;
    updateTitleDescriptionForm({ headingsCount: selected });
  };
  
  // Handle writing style selection
  const handleWritingStyleSelect = (style: any) => {
    updateTitleDescriptionForm({ writingStyle: style });
  };
  
  // Handle point of view selection
  const handlePointOfViewChange = (value: any) => {
    updateTitleDescriptionForm({ pointOfView: value });
  };
  
  // Handle expert guidance change
  const handleExpertGuidanceChange = (value: string) => {
    updateTitleDescriptionForm({ expertGuidance: value });
  };
  
  // Handle toggle save expert guidance
  const handleToggleSaveGuidance = (value: boolean) => {
    updateTitleDescriptionForm({ saveExpertGuidance: value });
  };
  
  // Handle selecting saved guidance
  const handleSelectSavedGuidance = (guidance: string) => {
    updateTitleDescriptionForm({ expertGuidance: guidance });
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/article-writer/select-keywords');
  };
  
  // Handle continue button
  const handleContinue = async () => {
    if (!keywordSelectResponse) {
      toast({
        title: "Missing Data",
        description: "Required data is missing. Please go back and try again.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedTitleDescription) {
      toast({
        title: "No Title Selected",
        description: "Please select a title and description for your article.",
        variant: "destructive"
      });
      return;
    }
    
    if (!titleDescriptionForm.headingsCount) {
      toast({
        title: "Missing Selection",
        description: "Please select the number of headings for your article.",
        variant: "destructive"
      });
      return;
    }
    
    if (!titleDescriptionForm.writingStyle && activeTab === 'settings') {
      toast({
        title: "Missing Writing Style",
        description: "Please create or select a writing style for your article.",
        variant: "destructive"
      });
      return;
    }
    
    // Save expert guidance if needed
    if (titleDescriptionForm.expertGuidance && titleDescriptionForm.saveExpertGuidance) {
      addExpertGuidance(titleDescriptionForm.expertGuidance);
    }
    
    try {
      setSubmissionError(null);
      setIsLoading(true);
      
      const payload = {
        workflowId,
        userId: keywordSelectResponse.userId,
        sessionId,
        originalKeyword: keywordSelectResponse.originalKeyword,
        country: keywordSelectResponse.country || keywordForm.country,
        language: keywordSelectResponse.language || keywordForm.language,
        typeOfContent: keywordSelectResponse.typeOfContent || keywordForm.contentType,
        mainKeyword: keywordSelectResponse.mainKeyword,
        additionalKeyword: keywordSelectResponse.additionalKeyword || [],
        references: keywordSelectResponse.references || [],
        researchType: keywordSelectResponse.researchType || 'AI Agent Search',
        titlesAndShortDescription: {
          title: selectedTitleDescription.title,
          description: selectedTitleDescription.description
        },
        headingsCount: titleDescriptionForm.headingsCount?.count || '4-5',
        writingStyle: titleDescriptionForm.writingStyle?.description || 'Professional and informative',
        articlePointOfView: titleDescriptionForm.pointOfView,
        ...(titleDescriptionForm.expertGuidance && { expertGuidance: titleDescriptionForm.expertGuidance }),
        additionalData: keywordSelectResponse.additionalData || {}
      };
      
      console.log('Submitting title description payload:', payload);
      
      // Call the webhook service
      const response = await titleDescriptionService.submitTitleDescriptionSelection(payload);
      
      console.log('Title description webhook response:', response);
      
      // Navigate to outline page
      navigate('/article-writer/outline');
      
    } catch (error) {
      console.error('Error submitting title selection:', error);
      setSubmissionError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : 'Failed to submit your selection. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // If data is loading, show loading state
  if (isLoading) {
    return <LoadingOverlay message="Generating your article outline..." subMessage="This may take up to a minute" />;
  }
  
  // Early return if no title options are available
  if (!titleDescriptionOptions || titleDescriptionOptions.length === 0) {
    return (
      <DashboardLayout>
        <div className="container max-w-4xl py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading Title Options</h2>
            <p className="mb-4">We're preparing title options for your article. Please wait...</p>
            <LoadingOverlay message="Loading title options..." />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Select Title and Description - Article Writer AI</title>
      </Helmet>
      <div className="container max-w-5xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Title and Description</h1>
          <p className="text-gray-600">
            Choose a compelling title and description for your article about <span className="font-medium">
              {keywordSelectResponse?.mainKeyword || 'your topic'}
            </span>.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="titles">Select Title & Description</TabsTrigger>
            <TabsTrigger value="settings">Article Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="titles" className="pt-6 space-y-6">
            <div className="space-y-4">
              {titleDescriptionOptions.map((item, index) => (
                <Card 
                  key={item.id || index}
                  className={`p-4 transition-colors cursor-pointer border-2 hover:border-primary/60 ${
                    selectedTitleDescription?.title === item.title 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent'
                  }`}
                  onClick={() => handleSelectTitle(item.title, item.description)}
                >
                  <div className="flex">
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                    {selectedTitleDescription?.title === item.title && (
                      <div className="flex items-center">
                        <div className="bg-primary text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="pt-6">
            <div className="space-y-8">
              <HeadingsCountSelector
                value={titleDescriptionForm.headingsCount?.id || null}
                onChange={handleHeadingsCountChange}
              />
              
              <WritingStyleSelector
                savedStyles={savedWritingStyles}
                selectedStyle={titleDescriptionForm.writingStyle}
                onSelectStyle={handleWritingStyleSelect}
                onAddStyle={addWritingStyle}
              />
              
              <PointOfViewSelector
                value={titleDescriptionForm.pointOfView}
                onChange={handlePointOfViewChange}
              />
              
              <ExpertGuidanceInput
                value={titleDescriptionForm.expertGuidance}
                onChange={handleExpertGuidanceChange}
                saveForLater={titleDescriptionForm.saveExpertGuidance}
                onToggleSave={handleToggleSaveGuidance}
                savedGuidance={savedExpertGuidance}
                onSelectSaved={handleSelectSavedGuidance}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {submissionError && (
          <div className="mb-6 p-4 border border-red-400 bg-red-50 text-red-700 rounded-md">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{submissionError}</p>
          </div>
        )}
        
        <div className="flex justify-between">
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
            className="flex items-center"
            disabled={isLoading || !selectedTitleDescription || (activeTab === 'settings' && !titleDescriptionForm.headingsCount)}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
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
      </div>
    </DashboardLayout>
  );
};

export default TitleDescriptionStep;
