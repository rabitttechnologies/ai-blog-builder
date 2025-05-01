
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useArticleWriter, ArticleOutline, OutlineSection } from '@/context/articleWriter/ArticleWriterContext';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Trash2, MoveUp, MoveDown, RefreshCw, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

// Mock data for article outline
const mockOutline: ArticleOutline = {
  id: '1',
  title: 'Sustainable Gardening: 10 Eco-Friendly Tips for a Greener Garden',
  introduction: 'Sustainable gardening is not just a trend but a necessary approach to creating outdoor spaces that work in harmony with nature. By adopting eco-friendly gardening practices, you can reduce your environmental impact while creating a beautiful, thriving garden that supports local ecosystems.',
  sections: [
    {
      heading: 'What is Sustainable Gardening?',
      content: 'Sustainable gardening is an approach that minimizes environmental impact while maximizing the garden's benefits. It involves working with nature rather than against it, conserving resources, and creating habitats for wildlife.'
    },
    {
      heading: 'Water Conservation Techniques',
      content: 'Learn effective methods for reducing water usage in your garden, including rainwater harvesting, drip irrigation, proper mulching techniques, and selecting drought-tolerant plants native to your region.'
    },
    {
      heading: 'Chemical-Free Pest Management',
      content: 'Explore natural alternatives to chemical pesticides, including companion planting, beneficial insects, homemade organic solutions, and preventative measures to maintain a healthy garden ecosystem.'
    },
    {
      heading: 'Composting Fundamentals',
      content: 'Discover how to turn kitchen scraps and yard waste into nutrient-rich compost that improves soil health, reduces landfill waste, and provides free, high-quality fertilizer for your plants.'
    },
    {
      heading: 'Native Plant Selection',
      content: 'Understand the benefits of choosing native plants, which are adapted to local conditions, require less maintenance, provide better habitat for local wildlife, and contribute to regional biodiversity.'
    },
    {
      heading: 'Soil Health Management',
      content: 'Learn essential practices for maintaining healthy soil, including testing, amendments, cover cropping, minimal tillage, and how healthy soil contributes to plant health and carbon sequestration.'
    },
    {
      heading: 'Energy-Efficient Garden Design',
      content: 'Implement smart design principles that reduce resource use, such as strategic tree placement for natural cooling, solar-powered garden tools and lighting, and efficient garden layouts.'
    },
    {
      heading: 'Sustainable Lawn Alternatives',
      content: 'Explore eco-friendly alternatives to traditional lawns, including native meadows, ground covers, edible landscapes, and low-maintenance turf options that reduce mowing, watering, and chemical use.'
    },
    {
      heading: 'Resource-Efficient Gardening Tools',
      content: 'Discover sustainable gardening equipment and practices, from manual and electric tools to recycled materials and techniques that minimize waste and environmental impact.'
    },
    {
      heading: 'Creating Wildlife Habitats',
      content: 'Learn how to transform your garden into a sanctuary for birds, pollinators, and beneficial insects by providing food sources, water features, shelter, and nesting areas throughout the seasons.'
    }
  ],
  conclusion: 'By implementing these sustainable gardening practices, you can create a beautiful outdoor space that not only brings you joy but also contributes positively to the environment. Start with small changes and gradually transform your garden into an eco-friendly haven that future generations will thank you for.'
};

const OutlineStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    keywordForm,
    selectedTitleDescription,
    setCurrentStep,
    articleOutlineOptions,
    setArticleOutlineOptions,
    selectedOutline,
    setSelectedOutline
  } = useArticleWriter();
  
  const [customTitle, setCustomTitle] = useState('');
  const [customIntroduction, setCustomIntroduction] = useState('');
  const [customSections, setCustomSections] = useState<OutlineSection[]>([]);
  const [customConclusion, setCustomConclusion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('select');
  
  useEffect(() => {
    // Update current step
    setCurrentStep(4);
    
    // If we don't have a title description, go back
    if (!selectedTitleDescription) {
      navigate('/article-writer/title-description');
    }
    
    // If we don't have real options yet, set mock options
    if (articleOutlineOptions.length === 0) {
      setArticleOutlineOptions([mockOutline]);
    }
    
    // Pre-populate custom fields if we have a selected outline
    if (selectedOutline) {
      setCustomTitle(selectedOutline.title);
      setCustomIntroduction(selectedOutline.introduction);
      setCustomSections([...selectedOutline.sections]);
      setCustomConclusion(selectedOutline.conclusion);
    } else if (selectedTitleDescription) {
      // Use the title from the previous step if available
      setCustomTitle(selectedTitleDescription.title);
    }
  }, [
    setCurrentStep, 
    selectedTitleDescription, 
    navigate, 
    articleOutlineOptions, 
    setArticleOutlineOptions,
    selectedOutline
  ]);
  
  const handleGenerateOutline = () => {
    setIsLoading(true);
    
    // In a real implementation, this would call an API endpoint
    // For this demo, we'll just simulate a delay and show the mock outline
    setTimeout(() => {
      setArticleOutlineOptions([mockOutline]);
      toast({
        title: "Outline generated",
        description: "Your article outline is ready for review."
      });
      setIsLoading(false);
    }, 2000);
  };
  
  const handleSelectOutline = (outline: ArticleOutline) => {
    setSelectedOutline(outline);
    
    // Update custom fields as well for easier editing
    setCustomTitle(outline.title);
    setCustomIntroduction(outline.introduction);
    setCustomSections([...outline.sections]);
    setCustomConclusion(outline.conclusion);
    
    // Switch to custom tab for editing
    setActiveTab('custom');
  };
  
  const addSection = () => {
    setCustomSections([
      ...customSections,
      { heading: '', content: '' }
    ]);
  };
  
  const removeSection = (index: number) => {
    if (customSections.length <= 1) {
      toast({
        title: "Cannot remove section",
        description: "Your outline must have at least one section.",
        variant: "destructive"
      });
      return;
    }
    
    const newSections = [...customSections];
    newSections.splice(index, 1);
    setCustomSections(newSections);
  };
  
  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === customSections.length - 1)
    ) {
      return;
    }
    
    const newSections = [...customSections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newSections[index];
    newSections[index] = newSections[newIndex];
    newSections[newIndex] = temp;
    
    setCustomSections(newSections);
  };
  
  const updateSection = (index: number, field: 'heading' | 'content', value: string) => {
    const newSections = [...customSections];
    newSections[index] = {
      ...newSections[index],
      [field]: value
    };
    setCustomSections(newSections);
  };
  
  const handleBack = () => {
    navigate('/article-writer/title-description');
  };
  
  const handleContinue = () => {
    // Validate the outline data
    if (activeTab === 'custom') {
      // Check title
      if (!customTitle.trim()) {
        toast({
          title: "Missing title",
          description: "Please provide a title for your article.",
          variant: "destructive"
        });
        return;
      }
      
      // Check introduction
      if (!customIntroduction.trim()) {
        toast({
          title: "Missing introduction",
          description: "Please provide an introduction for your article.",
          variant: "destructive"
        });
        return;
      }
      
      // Check sections
      if (customSections.length === 0) {
        toast({
          title: "No sections",
          description: "Please add at least one section to your article outline.",
          variant: "destructive"
        });
        return;
      }
      
      // Check for empty sections
      const hasEmptySection = customSections.some(
        section => !section.heading.trim() || !section.content.trim()
      );
      
      if (hasEmptySection) {
        toast({
          title: "Incomplete sections",
          description: "Please fill out all section headings and content.",
          variant: "destructive"
        });
        return;
      }
      
      // Check conclusion
      if (!customConclusion.trim()) {
        toast({
          title: "Missing conclusion",
          description: "Please provide a conclusion for your article.",
          variant: "destructive"
        });
        return;
      }
      
      // Create a new outline object from custom data
      const customOutline: ArticleOutline = {
        id: 'custom',
        title: customTitle,
        introduction: customIntroduction,
        sections: customSections,
        conclusion: customConclusion
      };
      
      setSelectedOutline(customOutline);
    } else if (!selectedOutline) {
      // If on select tab but nothing selected, show error
      toast({
        title: "No outline selected",
        description: "Please select an outline or create your own.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to the next step
    navigate('/article-writer/generated');
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select AI outline</TabsTrigger>
            <TabsTrigger value="custom">Customize outline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="pt-6">
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <p className="text-sm text-gray-500">
                Review the AI-generated outline or generate a new one.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateOutline}
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
                    Generate Outline
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-4">
              {articleOutlineOptions.map((outline) => (
                <Card 
                  key={outline.id}
                  className="p-6 border-2 hover:border-primary/40"
                >
                  <h3 className="text-xl font-bold mb-3">{outline.title}</h3>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium uppercase text-gray-500 mb-2">Introduction</h4>
                    <p className="text-gray-800">{outline.introduction}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium uppercase text-gray-500 mb-2">Sections ({outline.sections.length})</h4>
                    <div className="space-y-3">
                      {outline.sections.slice(0, 3).map((section, idx) => (
                        <div key={idx}>
                          <h5 className="font-medium">{section.heading}</h5>
                          <p className="text-sm text-gray-600">{section.content}</p>
                        </div>
                      ))}
                      
                      {outline.sections.length > 3 && (
                        <div className="text-sm text-gray-500">
                          + {outline.sections.length - 3} more sections
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium uppercase text-gray-500 mb-2">Conclusion</h4>
                    <p className="text-gray-800">{outline.conclusion}</p>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => handleSelectOutline(outline)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Outline
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedOutline(outline);
                        handleContinue();
                      }}
                    >
                      Use This Outline
                    </Button>
                  </div>
                </Card>
              ))}
              
              {articleOutlineOptions.length === 0 && (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-gray-500">No outlines generated yet. Click the "Generate Outline" button.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="pt-6">
            <div className="space-y-8">
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
                <Label htmlFor="custom-introduction" className="text-base">Introduction</Label>
                <Textarea
                  id="custom-introduction"
                  placeholder="Write an engaging introduction for your article"
                  value={customIntroduction}
                  onChange={(e) => setCustomIntroduction(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  A good introduction hooks the reader and provides context for your article.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base">Article Sections</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={addSection}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Section
                  </Button>
                </div>
                
                {customSections.length === 0 ? (
                  <div className="text-center py-6 border border-dashed rounded-lg">
                    <p className="text-gray-500">No sections yet. Click "Add Section" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {customSections.map((section, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">Section {idx + 1}</h3>
                          <div className="flex gap-1">
                            <button 
                              className="p-1 hover:bg-gray-100 rounded-md" 
                              title="Move Up"
                              onClick={() => moveSection(idx, 'up')}
                              disabled={idx === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 hover:bg-gray-100 rounded-md" 
                              title="Move Down"
                              onClick={() => moveSection(idx, 'down')}
                              disabled={idx === customSections.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 hover:bg-red-50 text-red-500 rounded-md" 
                              title="Remove Section"
                              onClick={() => removeSection(idx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`section-heading-${idx}`} className="text-sm">Heading</Label>
                            <Input
                              id={`section-heading-${idx}`}
                              placeholder="Section heading"
                              value={section.heading}
                              onChange={(e) => updateSection(idx, 'heading', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`section-content-${idx}`} className="text-sm">Content Summary</Label>
                            <Textarea
                              id={`section-content-${idx}`}
                              placeholder="Briefly describe what this section will cover"
                              value={section.content}
                              onChange={(e) => updateSection(idx, 'content', e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-conclusion" className="text-base">Conclusion</Label>
                <Textarea
                  id="custom-conclusion"
                  placeholder="Write a conclusion that summarizes your main points"
                  value={customConclusion}
                  onChange={(e) => setCustomConclusion(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  A strong conclusion reinforces your key messages and provides a call to action.
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

export default OutlineStep;
