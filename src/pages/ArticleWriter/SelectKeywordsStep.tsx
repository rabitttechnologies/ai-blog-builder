
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Search, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

// Mock data for historical search data
const mockKeywordData = [
  { keyword: 'sustainable gardening tips', searchVolume: 5400, difficulty: 45 },
  { keyword: 'organic gardening for beginners', searchVolume: 3200, difficulty: 32 },
  { keyword: 'eco friendly gardening', searchVolume: 2800, difficulty: 38 },
  { keyword: 'sustainable landscaping', searchVolume: 1900, difficulty: 42 },
  { keyword: 'water conservation in gardens', searchVolume: 1500, difficulty: 28 },
  { keyword: 'native plant gardening', searchVolume: 2300, difficulty: 25 },
  { keyword: 'composting techniques', searchVolume: 4100, difficulty: 22 },
  { keyword: 'sustainable garden design', searchVolume: 2600, difficulty: 47 },
  { keyword: 'zero waste gardening', searchVolume: 1800, difficulty: 31 },
  { keyword: 'rainwater harvesting for gardens', searchVolume: 1300, difficulty: 36 },
];

const SelectKeywordsStep = () => {
  const navigate = useNavigate();
  const {
    keywordResponse,
    keywordForm,
    selectedKeywords,
    updateSelectedKeyword,
    setCurrentStep
  } = useArticleWriter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  
  // If we don't have keyword response data, we should use mock data for this demo
  const keywords = keywordResponse?.historicalSearchData?.length 
    ? keywordResponse.historicalSearchData 
    : mockKeywordData;
    
  const filteredKeywords = keywords.filter(k => 
    k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    // Update current step
    setCurrentStep(2);
    
    // If no response, redirect to the first step
    if (!keywordResponse && !keywordForm.keyword) {
      navigate('/article-writer/keyword');
    }
    
    // Count already selected keywords
    const selected = selectedKeywords.filter(k => k.isSelected).length;
    setSelectedCount(selected);
  }, [keywordResponse, keywordForm, navigate, selectedKeywords, setCurrentStep]);
  
  const handleKeywordToggle = (keyword: string, isSelected: boolean) => {
    updateSelectedKeyword(keyword, isSelected);
    setSelectedCount(prev => isSelected ? prev + 1 : prev - 1);
  };
  
  const handleBack = () => {
    navigate('/article-writer/keyword');
  };
  
  const handleContinue = () => {
    // Ensure we have at least one keyword selected
    if (selectedCount === 0) {
      // Select the main keyword as default
      updateSelectedKeyword(keywordForm.keyword, true);
    }
    
    navigate('/article-writer/title-description');
  };
  
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const getVolumeCategory = (volume: number) => {
    if (volume >= 5000) return 'High';
    if (volume >= 1000) return 'Medium';
    return 'Low';
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Select Keywords - Article Writer AI</title>
      </Helmet>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Keywords for Your Article</h1>
          <p className="text-gray-600">
            Choose the keywords you want to include in your article. These will help structure your content and improve SEO.
          </p>
        </div>
        
        <div className="mb-6">
          <Card className="mb-4 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold">{keywordForm.keyword}</h2>
                    <Badge className="ml-3 bg-primary">Main Keyword</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {keywordForm.contentType} · {keywordForm.language.toUpperCase()} · {keywordForm.country}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Selected:</span>
                    <Badge variant="secondary">{selectedCount}</Badge>
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>We recommend selecting 5-10 keywords for best results</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search keywords..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-600 w-12">Select</th>
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-600">Keyword</th>
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-600 w-32">
                      <div className="flex items-center">
                        Volume
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="ml-1 p-0.5 rounded-full hover:bg-gray-200">
                                <Info className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Monthly search volume</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-600 w-32">
                      <div className="flex items-center">
                        Difficulty
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="ml-1 p-0.5 rounded-full hover:bg-gray-200">
                                <Info className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>SEO difficulty score (0-100)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Always show the main keyword first */}
                  <tr className="border-b bg-primary/5">
                    <td className="py-3 px-4">
                      <Checkbox
                        id={`keyword-main`}
                        checked={true}
                        disabled
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{keywordForm.keyword}</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">-</td>
                  </tr>
                  
                  {filteredKeywords.map((item, index) => {
                    // Check if this keyword is already in our selected list
                    const selectedItem = selectedKeywords.find(k => k.keyword === item.keyword);
                    const isChecked = selectedItem ? selectedItem.isSelected : false;
                    
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Checkbox
                            id={`keyword-${index}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => 
                              handleKeywordToggle(item.keyword, checked === true)
                            }
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Label 
                            htmlFor={`keyword-${index}`}
                            className="cursor-pointer"
                          >
                            {item.keyword}
                          </Label>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {getVolumeCategory(item.searchVolume)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}/100
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {filteredKeywords.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        No keywords found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
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

export default SelectKeywordsStep;
