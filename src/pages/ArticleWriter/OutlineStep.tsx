
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import OutlineCustomizeForm from '@/components/articleWriter/OutlineCustomizeForm';
import OutlineDisplay from '@/components/articleWriter/OutlineDisplay';
import { useOutlineCustomization } from '@/hooks/useOutlineCustomization';
import { OutlineOption } from '@/types/outlineCustomize';
import { parseArticleOutline } from '@/services/outlineCustomizeService';

const OutlineStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    keywordForm,
    keywordSelectResponse,
    selectedTitleDescription,
    setCurrentStep,
    generatedArticle,
    setGeneratedArticle
  } = useArticleWriter();
  
  const [activeTab, setActiveTab] = useState('select');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use our custom hook for outline customization
  const {
    loading,
    error,
    outlines,
    customOutline,
    selectedOutline,
    editingOutlineId,
    editedOutlineContent,
    customization,
    customizationResponse,
    initializeOutlines,
    startEditingOutline,
    cancelEditingOutline,
    updateEditedOutlineContent,
    saveEditedOutline,
    selectOutline,
    updateCustomization,
    submitOutlineAndCustomization
  } = useOutlineCustomization(keywordSelectResponse);

  // Custom outline state
  const [customTitle, setCustomTitle] = useState('');
  const [customOutlineContent, setCustomOutlineContent] = useState('');
  
  useEffect(() => {
    // Update current step
    setCurrentStep(4);
    
    // If we don't have a title description, go back
    if (!selectedTitleDescription) {
      navigate('/article-writer/title-description');
      return;
    }
    
    // Initialize outlines from keywordSelectResponse
    initializeOutlines();
    
    // Pre-populate custom title if selected title description is available
    if (selectedTitleDescription) {
      setCustomTitle(selectedTitleDescription.title);
    }
  }, [
    setCurrentStep, 
    selectedTitleDescription, 
    navigate, 
    initializeOutlines,
    keywordSelectResponse
  ]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  // Update generated article when customization response is received
  useEffect(() => {
    if (customizationResponse && customizationResponse.generatedArticle) {
      setGeneratedArticle({
        id: customizationResponse.workflowId || 'article-1',
        title: (customizationResponse.titlesAndShortDescription?.title || selectedTitleDescription?.title || 'Generated Article'),
        content: customizationResponse.generatedArticle,
        metaDescription: (customizationResponse.titlesAndShortDescription?.description || selectedTitleDescription?.description || ''),
        date: new Date().toISOString()
      });
    }
  }, [customizationResponse, selectedTitleDescription, setGeneratedArticle]);
  
  // Handle custom outline update
  const updateCustomOutline = () => {
    if (!customOutlineContent.trim()) {
      toast({
        title: "Missing content",
        description: "Please enter content for your custom outline.",
        variant: "destructive"
      });
      return;
    }
    
    const parsedOutline = parseArticleOutline(customOutlineContent);
    const updatedOutline: OutlineOption = {
      id: 'custom',
      content: customOutlineContent,
      parsed: parsedOutline
    };
    
    selectOutline(updatedOutline);
    setActiveTab('customize');
  };
  
  // Handle generating outline
  const handleGenerateOutline = () => {
    setIsGenerating(true);
    
    // Simulate loading for demo purposes
    setTimeout(() => {
      initializeOutlines();
      toast({
        title: "Outline generated",
        description: "Article outlines have been refreshed."
      });
      setIsGenerating(false);
    }, 1500);
  };
  
  // Handle outline selection
  const handleSelectOutline = (outline: OutlineOption) => {
    selectOutline(outline);
    setActiveTab('customize');
  };
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/article-writer/title-description');
  };
  
  // Handle continue to next step
  const handleContinue = async () => {
    // Validate selected outline
    if (!selectedOutline) {
      toast({
        title: "No outline selected",
        description: "Please select an outline before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Submit outline and customization
      const response = await submitOutlineAndCustomization();
      
      if (response) {
        // Navigate to generated article step
        navigate('/article-writer/generated');
      }
    } catch (err) {
      console.error("Error processing outline:", err);
      toast({
        title: "Error",
        description: "Failed to process outline. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Article Outline - Article Writer AI</title>
      </Helmet>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Article Outline</h1>
          <p className="text-gray-600">
            Review and customize the structure of your article about <span className="font-medium">{keywordForm.keyword}</span>.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select">Select AI outline</TabsTrigger>
            <TabsTrigger value="custom">Create custom outline</TabsTrigger>
            <TabsTrigger value="customize" disabled={!selectedOutline}>Customize options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="pt-6">
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <p className="text-sm text-gray-500">
                Review the AI-generated outlines or generate new ones.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateOutline}
                disabled={loading || isGenerating}
                className="shrink-0"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Outlines
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-4">
              {outlines.length > 0 ? (
                outlines.map((outline) => (
                  <OutlineDisplay
                    key={outline.id}
                    outline={outline}
                    isEditing={editingOutlineId === outline.id}
                    editedContent={editingOutlineId === outline.id ? editedOutlineContent : outline.content}
                    onEdit={() => editingOutlineId === outline.id ? cancelEditingOutline() : startEditingOutline(outline)}
                    onEditChange={updateEditedOutlineContent}
                    onSelect={() => handleSelectOutline(outline)}
                  />
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-gray-500">No outlines generated yet. Click the "Refresh Outlines" button.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="custom-title" className="text-base">Article Title</Label>
                <Input
                  id="custom-title"
                  placeholder="Enter your article title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-outline" className="text-base">Custom Outline</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Write your outline using markdown format. Use ## for main headings and ### for subheadings.
                </p>
                <Textarea
                  id="custom-outline"
                  placeholder="## Introduction\n### What to expect\n## Main Section 1\n### Subtopic 1\n### Subtopic 2\n## Main Section 2\n### Subtopic 1\n## Conclusion"
                  value={customOutlineContent}
                  onChange={(e) => setCustomOutlineContent(e.target.value)}
                  rows={12}
                  className="font-mono"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={updateCustomOutline}>
                  Use Custom Outline
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="customize" className="pt-6">
            {selectedOutline ? (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Selected Outline</h3>
                  <div className="space-y-2 mb-4">
                    {selectedOutline.parsed.headings.map((heading, idx) => (
                      <div key={idx} className={`pl-${heading.level * 4} ${heading.level === 1 ? 'font-bold text-base' : heading.level === 2 ? 'font-semibold text-sm' : 'text-sm'}`}>
                        {heading.title}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab(selectedOutline.id === 'custom' ? 'custom' : 'select')}
                  >
                    Edit Outline
                  </Button>
                </Card>
                
                <OutlineCustomizeForm
                  customization={customization}
                  onChange={updateCustomization}
                />
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-gray-500">Please select an outline first.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
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
            disabled={!selectedOutline || loading}
          >
            {loading ? 'Processing...' : 'Continue'}
            {!loading && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OutlineStep;
