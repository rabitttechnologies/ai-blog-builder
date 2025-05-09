import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { HeadingsOption, headingsOptions } from '@/types/articleWriter';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, Edit, Check, Save } from 'lucide-react';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import HeadingsCountSelector from '@/components/articleWriter/HeadingsCountSelector';
import WritingStyleSelector from '@/components/articleWriter/WritingStyleSelector';
import PointOfViewSelector from '@/components/articleWriter/PointOfViewSelector';
import ExpertGuidanceInput from '@/components/articleWriter/ExpertGuidanceInput';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import ArticleLoadingOverlay from '@/components/articleWriter/ArticleLoadingOverlay';

const TitleDescriptionStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    currentStep,
    setCurrentStep,
    keywordForm,
    keywordSelectResponse,
    titleDescriptionOptions,
    selectedTitleDescription,
    setSelectedTitleDescription,
    titleDescriptionForm,
    updateTitleDescriptionForm,
    setKeywordSelectResponse,
    isLoading,
    setIsLoading,
    workflowId,
    sessionId
  } = useArticleWriter();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for editable titles and descriptions
  const [editableOptions, setEditableOptions] = useState<Array<{
    id: string;
    title: string;
    description: string;
    isEditingTitle: boolean;
    isEditingDescription: boolean;
  }>>([]);
  
  // Initialize from options
  useEffect(() => {
    if (titleDescriptionOptions.length > 0) {
      setEditableOptions(titleDescriptionOptions.map(option => ({
        ...option,
        isEditingTitle: false,
        isEditingDescription: false
      })));
    }
  }, [titleDescriptionOptions]);

  useEffect(() => {
    // Set current step
    setCurrentStep(3);
    
    // Check if we have required data, otherwise redirect
    if (!keywordSelectResponse) {
      navigate('/article-writer/select-keywords');
    }
    
    // Preselect the first title description option if none is selected
    if (titleDescriptionOptions.length > 0 && !selectedTitleDescription) {
      setSelectedTitleDescription(titleDescriptionOptions[0]);
    }
  }, [keywordSelectResponse, navigate, setCurrentStep, selectedTitleDescription, setSelectedTitleDescription, titleDescriptionOptions]);

  // Handle option selection
  const handleSelectOption = (option: any) => {
    setSelectedTitleDescription(option);
  };
  
  // Functions for editing titles and descriptions
  const startEditingTitle = (id: string) => {
    setEditableOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, isEditingTitle: true }
          : option
      )
    );
  };
  
  const stopEditingTitle = (id: string) => {
    setEditableOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, isEditingTitle: false }
          : option
      )
    );
  };
  
  const updateTitle = (id: string, title: string) => {
    setEditableOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, title }
          : option
      )
    );
    
    // Also update selected title description if this is the selected one
    if (selectedTitleDescription?.id === id) {
      const updatedTitleDesc = {...selectedTitleDescription, title};
      setSelectedTitleDescription(updatedTitleDesc);
    }
  };
  
  const startEditingDescription = (id: string) => {
    setEditableOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, isEditingDescription: true }
          : option
      )
    );
  };
  
  const stopEditingDescription = (id: string) => {
    setEditableOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, isEditingDescription: false }
          : option
      )
    );
  };
  
  const updateDescription = (id: string, description: string) => {
    setEditableOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, description }
          : option
      )
    );
    
    // Also update selected title description if this is the selected one
    if (selectedTitleDescription?.id === id) {
      const updatedTitleDesc = {...selectedTitleDescription, description};
      setSelectedTitleDescription(updatedTitleDesc);
    }
  };
  
  // Handle input changes
  const handleHeadingsChange = (headingsId: string) => {
    const selectedHeading = headingsOptions.find(h => h.id === headingsId);
    if (selectedHeading) {
      updateTitleDescriptionForm({ headingsCount: selectedHeading });
    }
  };
  
  const handleWritingStyleChange = (styleId: string) => {
    // In a real implementation, you would look up the style
    // For now, we'll create a placeholder
    const style: WritingStyle = {
      id: styleId,
      name: styleId,
      description: '',
      isSaved: false
    };
    updateTitleDescriptionForm({ writingStyle: style });
  };
  
  const handlePointOfViewChange = (pov: ArticlePointOfView) => {
    updateTitleDescriptionForm({ pointOfView: pov });
  };
  
  const handleExpertGuidanceChange = (text: string, shouldSave: boolean = false) => {
    updateTitleDescriptionForm({ 
      expertGuidance: text,
      saveExpertGuidance: shouldSave
    });
  };

  // Handle back button
  const handleBack = () => {
    navigate('/article-writer/select-keywords');
  };

  // Validate form before submission
  const validateForm = () => {
    if (!selectedTitleDescription) {
      toast({
        title: "Please select a title and description",
        variant: "destructive"
      });
      return false;
    }
    
    if (!titleDescriptionForm.headingsCount) {
      toast({
        title: "Please select a headings count",
        variant: "destructive"
      });
      return false;
    }
    
    if (!titleDescriptionForm.writingStyle) {
      toast({
        title: "Please select a writing style",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleGenerateOutline = async () => {
    if (!validateForm()) return;
    
    setError(null);
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      // Ensure we have the key response data
      if (!keywordSelectResponse) {
        throw new Error("Missing keyword data. Please go back and select keywords.");
      }
      
      // Prepare payload for title and description webhook
      const payload = {
        workflowId: workflowId,
        userId: keywordSelectResponse.userId,
        sessionId: sessionId,
        originalKeyword: keywordSelectResponse.originalKeyword,
        country: keywordSelectResponse.country,
        language: keywordSelectResponse.language,
        typeOfContent: keywordSelectResponse.typeOfContent,
        mainKeyword: keywordSelectResponse.mainKeyword,
        additionalKeyword: keywordSelectResponse.additionalKeyword,
        references: keywordSelectResponse.references,
        researchType: keywordSelectResponse.researchType,
        titlesAndShortDescription: {
          title: selectedTitleDescription?.title || "",
          description: selectedTitleDescription?.description || ""
        },
        headingsCount: titleDescriptionForm.headingsCount?.count || "",
        writingStyle: titleDescriptionForm.writingStyle?.name || "",
        articlePointOfView: titleDescriptionForm.pointOfView,
        expertGuidance: titleDescriptionForm.expertGuidance || undefined,
        additionalData: keywordSelectResponse.additionalData || {}
      };
      
      console.log("Submitting title description payload:", payload);
      
      // Handle request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      const response = await fetch('https://n8n.agiagentworld.com/webhook/titleandshortdescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log("Title description response:", responseData);
      
      // Update the keyword select response with the new data that includes the article outline
      // This is critical to make the outline available to the next step
      setKeywordSelectResponse({
        ...keywordSelectResponse,
        articleoutline: responseData.articleoutline || responseData.articleOutline,
        promptforbody: responseData.promptforbody,
        Introduction: responseData.Introduction,
        key_takeaways: responseData.key_takeaways
      });
      
      // Navigate to the next step
      navigate('/article-writer/outline');
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(`Failed to generate outline: ${err.message}`);
      }
      console.error('Error generating article outline:', err);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  
  // Render card for each title and description option
  const renderTitleDescriptionCard = (option: any, index: number) => {
    const isSelected = selectedTitleDescription?.id === option.id;
    const editableOption = editableOptions.find(o => o.id === option.id) || option;
    
    return (
      <Card 
        key={option.id} 
        className={`mb-4 cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'hover:border-gray-300'}`}
        onClick={() => !editableOption.isEditingTitle && !editableOption.isEditingDescription && handleSelectOption(option)}
      >
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <Label className="text-sm font-medium text-gray-500">Title</Label>
              <div className="flex gap-2">
                {isSelected && <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs flex items-center"><Check className="h-3 w-3 mr-1" />Selected</span>}
                <Button
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    editableOption.isEditingTitle ? stopEditingTitle(option.id) : startEditingTitle(option.id);
                  }}
                >
                  {editableOption.isEditingTitle ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {editableOption.isEditingTitle ? (
              <Input
                value={editableOption.title}
                onChange={(e) => updateTitle(option.id, e.target.value)}
                className="font-medium mb-2"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3 className="font-bold text-lg mb-2">{editableOption.title}</h3>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-start mb-2">
              <Label className="text-sm font-medium text-gray-500">Description</Label>
              <Button
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  editableOption.isEditingDescription ? stopEditingDescription(option.id) : startEditingDescription(option.id);
                }}
              >
                {editableOption.isEditingDescription ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            </div>
            
            {editableOption.isEditingDescription ? (
              <Textarea
                value={editableOption.description}
                onChange={(e) => updateDescription(option.id, e.target.value)}
                className="min-h-[100px]"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="text-gray-600">{editableOption.description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Redesigned single column layout
  return (
    <DashboardLayout>
      <Helmet>
        <title>Title & Description - Article Writer</title>
      </Helmet>
      <div className="container max-w-5xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Title & Description</h1>
          <p className="text-gray-600">
            Choose a title and description for your article about{" "}
            <span className="font-medium">
              {keywordSelectResponse?.mainKeyword || keywordForm.keyword}
            </span>
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          {/* Title and Description Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Title & Description Options</CardTitle>
              <CardDescription>
                Select one of the options below or edit them to create your custom title and description
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editableOptions.length > 0 ? (
                editableOptions.map((option, index) => renderTitleDescriptionCard(option, index))
              ) : (
                <div className="text-center py-8">
                  <p>No title and description options available. Please go back and try again.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Article Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Article Settings</CardTitle>
              <CardDescription>
                Configure the style and structure of your article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Headings Count */}
              <div>
                <h3 className="text-base font-medium mb-3">Content Length</h3>
                <HeadingsCountSelector
                  value={titleDescriptionForm.headingsCount?.id || null}
                  onChange={handleHeadingsChange}
                />
              </div>

              <Separator />

              {/* Writing Style */}
              <div>
                <h3 className="text-base font-medium mb-3">Writing Style</h3>
                <WritingStyleSelector
                  value={titleDescriptionForm.writingStyle?.id || null}
                  onChange={handleWritingStyleChange}
                />
              </div>

              <Separator />

              {/* Point of View */}
              <div>
                <h3 className="text-base font-medium mb-3">Point of View</h3>
                <PointOfViewSelector
                  value={titleDescriptionForm.pointOfView}
                  onChange={handlePointOfViewChange}
                />
              </div>

              <Separator />

              {/* Expert Guidance */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium">Expert Guidance</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="save-guidance"
                      checked={titleDescriptionForm.saveExpertGuidance}
                      onCheckedChange={(checked) => {
                        updateTitleDescriptionForm({ saveExpertGuidance: checked });
                      }}
                    />
                    <Label htmlFor="save-guidance" className="text-sm">Save for future use</Label>
                  </div>
                </div>
                <ExpertGuidanceInput
                  value={titleDescriptionForm.expertGuidance}
                  onChange={handleExpertGuidanceChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleGenerateOutline}
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? "Generating..." : "Continue"}
              {!isSubmitting && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Loading Overlay */}
        {isLoading && (
          <ArticleLoadingOverlay 
            message="We're Creating Your Article Outline" 
            subMessage="This may take a minute or two"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TitleDescriptionStep;
