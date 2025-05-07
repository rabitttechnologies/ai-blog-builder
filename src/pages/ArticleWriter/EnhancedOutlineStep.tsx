
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleOutlineOption from '@/components/articleWriter/outline/ArticleOutlineOption';
import CustomOutlineEditor from '@/components/articleWriter/outline/CustomOutlineEditor';
import SimpleCustomizationOptions from '@/components/articleWriter/outline/customization/SimpleCustomizationOptions';
import ImagesCustomization from '@/components/articleWriter/outline/customization/ImagesCustomization';
import LinksCustomization from '@/components/articleWriter/outline/customization/LinksCustomization';
import CoverImageCustomization from '@/components/articleWriter/outline/customization/CoverImageCustomization';
import CallToActionCustomization from '@/components/articleWriter/outline/customization/CallToActionCustomization';
import FAQsCustomization from '@/components/articleWriter/outline/customization/FAQsCustomization';
import GuidanceCustomization from '@/components/articleWriter/outline/customization/GuidanceCustomization';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { useOutlineCustomizationForm } from '@/hooks/useOutlineCustomizationForm';
import outlineCustomizeService from '@/services/outlineCustomizeService';

const EnhancedOutlineStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentStep,
    keywordForm,
    keywordSelectResponse,
    selectedTitleDescription,
    setCurrentStep,
    addExpertGuidance,
    savedExpertGuidance,
    isLoading,
    setIsLoading
  } = useArticleWriter();
  
  const [activeTab, setActiveTab] = useState('outline');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [outlineOptions, setOutlineOptions] = useState<Array<{id: string, content: string}>>([]);
  const [isCustomEditing, setIsCustomEditing] = useState(false);
  
  const {
    formState,
    updateField,
    updateInternalLinkUrl,
    updateInternalLinkCount,
    validateForm,
    preparePayload
  } = useOutlineCustomizationForm();
  
  // Update current step on mount
  useEffect(() => {
    setCurrentStep(4);
    
    // Redirect if we don't have the required data
    if (!keywordSelectResponse || !selectedTitleDescription) {
      toast({
        title: "Missing Data",
        description: "Required data is missing. Please go back and try again.",
        variant: "destructive"
      });
      navigate('/article-writer/title-description');
      return;
    }
    
    // Parse article outline options from response
    if (keywordSelectResponse) {
      try {
        const options = outlineCustomizeService.parseArticleOutline(keywordSelectResponse);
        console.log('Parsed article outline options:', options);
        setOutlineOptions(options);
        
        // If we have outline options, pre-select the first one
        if (options && options.length > 0) {
          updateField('selectedOutlineId', options[0].id);
        }
      } catch (error) {
        console.error('Error parsing article outline options:', error);
        toast({
          title: "Error Parsing Data",
          description: "There was a problem processing the article outline data.",
          variant: "destructive"
        });
      }
    }
  }, [keywordSelectResponse, selectedTitleDescription, setCurrentStep, toast, navigate, updateField]);
  
  // Handle outline selection
  const handleSelectOutline = (id: string) => {
    updateField('selectedOutlineId', id);
  };
  
  // Handle custom outline selection
  const handleSelectCustomOutline = () => {
    updateField('selectedOutlineId', 'custom');
    setIsCustomEditing(true);
  };
  
  // Handle custom outline editing
  const handleCustomOutlineChange = (content: string) => {
    updateField('customOutline', content);
  };
  
  // Handle editing an outline option
  const handleEditOutlineOption = (option: { id: string, content: string }) => {
    updateField('selectedOutlineId', 'custom');
    updateField('customOutline', option.content);
    setIsCustomEditing(true);
    setActiveTab('outline');
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/article-writer/title-description');
  };
  
  // Handle saving guidance for later
  const handleSaveGuidance = (guidance: string) => {
    addExpertGuidance(guidance);
  };
  
  // Handle continue button
  const handleContinue = async () => {
    // Validate the form
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmissionError(null);
      setIsLoading(true);
      
      // Prepare payload for submission
      const payload = preparePayload(keywordSelectResponse);
      console.log('Submitting outline customization payload:', payload);
      
      // Call the webhook service
      const response = await outlineCustomizeService.submitOutlineCustomization(payload);
      console.log('Outline customization webhook response:', response);
      
      // Navigate to the next step
      navigate('/article-writer/generated');
      
    } catch (error) {
      console.error('Error submitting outline customization:', error);
      setSubmissionError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : 'Failed to submit your outline customization. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // If data is loading, show loading state
  if (isLoading) {
    return <LoadingOverlay message="Generating your Content" subMessage="This may take up to a minute" />;
  }
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Article Outline Customization - Article Writer AI</title>
      </Helmet>
      <div className="container max-w-5xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Article Outline Customization</h1>
          <p className="text-gray-600">
            Choose and customize the outline for your article about <span className="font-medium">
              {keywordSelectResponse?.mainKeyword || keywordForm.keyword || 'your topic'}
            </span>.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="outline">Article Outline</TabsTrigger>
            <TabsTrigger value="customize">Customize Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="outline" className="pt-6 space-y-6">
            <div className="space-y-6">
              {outlineOptions.map((option) => (
                <ArticleOutlineOption
                  key={option.id}
                  id={option.id}
                  content={option.content}
                  isSelected={formState.selectedOutlineId === option.id}
                  onSelect={handleSelectOutline}
                  onEdit={() => handleEditOutlineOption(option)}
                />
              ))}
              
              <CustomOutlineEditor
                value={formState.customOutline}
                onChange={handleCustomOutlineChange}
                isSelected={formState.selectedOutlineId === 'custom'}
                onSelect={handleSelectCustomOutline}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="customize" className="pt-6">
            <div className="space-y-4">
              <SimpleCustomizationOptions
                humanized={formState.generateHumanisedArticle}
                comparison={formState.generateComparisonTable}
                expertQuotes={formState.includeExpertQuotes}
                onHumanizedChange={(value) => updateField('generateHumanisedArticle', value)}
                onComparisonChange={(value) => updateField('generateComparisonTable', value)}
                onExpertQuotesChange={(value) => updateField('includeExpertQuotes', value)}
              />
              
              <ImagesCustomization
                isEnabled={formState.includeImagesInArticle}
                imageType={formState.imageType}
                imageCount={formState.imageCount}
                onToggle={(value) => updateField('includeImagesInArticle', value)}
                onTypeChange={(value) => updateField('imageType', value)}
                onCountChange={(value) => updateField('imageCount', value)}
              />
              
              <LinksCustomization
                isInternalEnabled={formState.internalLinks}
                internalLinkCount={formState.internalLinkCount}
                internalLinkUrls={formState.internalLinkUrls}
                isExternalEnabled={formState.externalLinks}
                externalLinkCount={formState.externalLinkCount}
                onInternalToggle={(value) => updateField('internalLinks', value)}
                onInternalCountChange={updateInternalLinkCount}
                onInternalLinkUpdate={updateInternalLinkUrl}
                onExternalToggle={(value) => updateField('externalLinks', value)}
                onExternalCountChange={(value) => updateField('externalLinkCount', value)}
              />
              
              <CoverImageCustomization
                isEnabled={formState.generateCoverImage}
                imageType={formState.coverImageType}
                imageSize={formState.coverImageSize}
                onToggle={(value) => updateField('generateCoverImage', value)}
                onTypeChange={(value) => updateField('coverImageType', value)}
                onSizeChange={(value) => updateField('coverImageSize', value)}
              />
              
              <CallToActionCustomization
                isEnabled={formState.includeCallToAction}
                ctaText={formState.callToActionText}
                onToggle={(value) => updateField('includeCallToAction', value)}
                onTextChange={(value) => updateField('callToActionText', value)}
              />
              
              <FAQsCustomization
                isEnabled={formState.generateFAQs}
                faqCount={formState.faqCount}
                onToggle={(value) => updateField('generateFAQs', value)}
                onCountChange={(value) => updateField('faqCount', value)}
              />
              
              <GuidanceCustomization
                isEnabled={formState.generalGuidance}
                guidanceText={formState.generalGuidanceText}
                savedGuidance={formState.savedGeneralGuidance}
                onToggle={(value) => updateField('generalGuidance', value)}
                onTextChange={(value) => updateField('generalGuidanceText', value)}
                onSaveGuidance={handleSaveGuidance}
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
            disabled={isLoading || !formState.selectedOutlineId}
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

export default EnhancedOutlineStep;
