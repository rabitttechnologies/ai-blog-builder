
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useArticleWriter, TitleDescription } from '@/context/articleWriter/ArticleWriterContext';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Mock data for title and description options
const mockTitleOptions: TitleDescription[] = [
  {
    id: '1',
    title: 'Sustainable Gardening: 10 Eco-Friendly Tips for a Greener Garden',
    description: 'Learn how to create an environmentally friendly garden with our top sustainable gardening tips. Reduce water usage, avoid chemicals, and support local ecosystems.'
  },
  {
    id: '2',
    title: 'The Ultimate Guide to Sustainable Gardening Practices',
    description: 'Discover comprehensive sustainable gardening techniques to transform your garden into an eco-friendly haven while saving money and protecting the environment.'
  },
  {
    id: '3',
    title: 'How to Create a Sustainable Garden: Expert Tips and Techniques',
    description: 'Expert gardeners share their best sustainable gardening practices to help you build an eco-friendly outdoor space that thrives while minimizing environmental impact.'
  },
  {
    id: '4',
    title: 'Sustainable Gardening 101: Beginners Guide to Eco-Friendly Growing',
    description: 'Start your sustainable gardening journey with these simple, effective techniques for beginners. Learn the basics of creating an environmentally responsible garden space.'
  },
  {
    id: '5',
    title: 'Transforming Your Yard: Modern Sustainable Gardening Approaches',
    description: 'Explore cutting-edge sustainable gardening methods to modernize your outdoor space while promoting biodiversity and reducing your carbon footprint.'
  }
];

const TitleDescriptionStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    keywordForm,
    setCurrentStep,
    titleDescriptionOptions,
    setTitleDescriptionOptions,
    selectedTitleDescription,
    setSelectedTitleDescription
  } = useArticleWriter();
  
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('select');
  
  useEffect(() => {
    // Update current step
    setCurrentStep(3);
    
    // If we don't have real options yet, set mock options
    if (titleDescriptionOptions.length === 0) {
      setTitleDescriptionOptions(mockTitleOptions);
    }
  }, [setCurrentStep, titleDescriptionOptions, setTitleDescriptionOptions]);
  
  const handleGenerateMore = () => {
    setIsLoading(true);
    
    // In a real implementation, this would call an API endpoint
    // For this demo, we'll just simulate a delay and show the same options
    setTimeout(() => {
      toast({
        title: "New titles generated",
        description: "Here are some fresh title and description options for your article."
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSelect = (item: TitleDescription) => {
    setSelectedTitleDescription(item);
    
    // Update custom fields as well for easier editing
    setCustomTitle(item.title);
    setCustomDescription(item.description);
    
    // Switch to custom tab
    setActiveTab('custom');
  };
  
  const handleBack = () => {
    navigate('/article-writer/select-keywords');
  };
  
  const handleContinue = () => {
    // If on custom tab, use the custom values
    if (activeTab === 'custom') {
      if (!customTitle.trim() || !customDescription.trim()) {
        toast({
          title: "Missing information",
          description: "Please provide both a title and description.",
          variant: "destructive"
        });
        return;
      }
      
      const customOption: TitleDescription = {
        id: 'custom',
        title: customTitle,
        description: customDescription
      };
      
      setSelectedTitleDescription(customOption);
    } else if (!selectedTitleDescription) {
      // If on select tab but nothing selected, show error
      toast({
        title: "No selection made",
        description: "Please select a title and description or create your own.",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/article-writer/outline');
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Select Title and Description - Article Writer AI</title>
      </Helmet>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Title and Description</h1>
          <p className="text-gray-600">
            Choose a compelling title and description for your article about <span className="font-medium">{keywordForm.keyword}</span>.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select from AI suggestions</TabsTrigger>
            <TabsTrigger value="custom">Create custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="pt-6">
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <p className="text-sm text-gray-500">
                Select one of the AI-generated title and description suggestions below.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateMore}
                disabled={isLoading}
                className="shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate More
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-4">
              {titleDescriptionOptions.map((item) => (
                <Card 
                  key={item.id}
                  className={`p-4 transition-colors cursor-pointer border-2 hover:border-primary/60 ${
                    selectedTitleDescription?.id === item.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent'
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <div className="flex">
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                    {selectedTitleDescription?.id === item.id && (
                      <div className="flex items-center">
                        <div className="bg-primary text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              
              {titleDescriptionOptions.length === 0 && (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-gray-500">No title options generated yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="custom-title" className="text-base">Custom Title</Label>
                <Input
                  id="custom-title"
                  placeholder="Enter your article title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-description" className="text-base">Custom Description</Label>
                <Textarea
                  id="custom-description"
                  placeholder="Enter a brief description of your article"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  This will be used as the meta description for SEO purposes and as an introduction to your article.
                </p>
              </div>
            </div>
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
          >
            Continue
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TitleDescriptionStep;
