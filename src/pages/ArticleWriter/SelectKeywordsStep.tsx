
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronLeft, ChevronRight, ExternalLink, Info, Search, Plus, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Radio } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import LoadingOverlay from '@/components/blog/LoadingOverlay';

// Define interfaces for typing
interface KeywordMetrics {
  competition?: string;
  avgMonthlySearches?: string;
  competitionIndex?: string;
  monthlySearchVolumes?: Array<{
    month: string;
    year: string;
    monthlySearches: string;
  }>;
}

interface KeywordItem {
  text: string;
  keywordMetrics?: KeywordMetrics;
  closeVariants?: string[];
}

interface Reference {
  title: string;
  url: string;
}

const SelectKeywordsStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    keywordResponse,
    sessionId,
    workflowId,
    keywordForm,
    setCurrentStep,
    setKeywordSelectResponse
  } = useArticleWriter();

  // States for the component
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedMainKeyword, setSelectedMainKeyword] = useState<string>('');
  const [selectedAdditionalKeywords, setSelectedAdditionalKeywords] = useState<string[]>([]);
  const [parsedKeywords, setParsedKeywords] = useState<KeywordItem[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [customReferences, setCustomReferences] = useState<Reference[]>([]);
  const [newReferenceTitle, setNewReferenceTitle] = useState('');
  const [newReferenceUrl, setNewReferenceUrl] = useState('');
  const [researchType, setResearchType] = useState('AI Agent Search');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customKeyword, setCustomKeyword] = useState('');
  
  // Parse and normalize the keyword data from the response
  useEffect(() => {
    if (!keywordResponse?.historicalSearchData) {
      // If no data, redirect to the keyword entry page
      if (!keywordForm.keyword) {
        navigate('/article-writer/keyword');
      }
      return;
    }

    // Update the current step
    setCurrentStep(2);

    try {
      // Parse and normalize the data
      const parsedData = keywordResponse.historicalSearchData
        .filter(item => item && item.text) // Filter out any null or undefined items
        .map(item => ({
          text: item.text || '',
          keywordMetrics: item.keywordMetrics || {},
          closeVariants: Array.isArray(item.closeVariants) ? item.closeVariants : []
        }));

      setParsedKeywords(parsedData);

      // Set the main keyword to the original keyword if it exists in the parsed data
      const originalKeywordExists = parsedData.some(item => item.text === keywordResponse.originalKeyword);
      if (originalKeywordExists) {
        setSelectedMainKeyword(keywordResponse.originalKeyword);
      }

      // Parse references if they exist
      if (keywordResponse.references) {
        try {
          let refs: Reference[] = [];
          if (typeof keywordResponse.references === 'string') {
            refs = JSON.parse(keywordResponse.references);
          } else if (Array.isArray(keywordResponse.references)) {
            refs = keywordResponse.references;
          }
          setReferences(refs);
        } catch (e) {
          console.error("Failed to parse references:", e);
        }
      }
    } catch (e) {
      console.error("Error processing keyword data:", e);
      setError("There was an error processing the keyword data. Please try again.");
    }
  }, [keywordResponse, keywordForm, navigate, setCurrentStep]);

  // Sort keywords based on the selected field and direction
  const sortedKeywords = [...parsedKeywords].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: any, bValue: any;

    switch (sortField) {
      case 'keyword':
        aValue = a.text.toLowerCase();
        bValue = b.text.toLowerCase();
        break;
      case 'volume':
        aValue = parseInt(a.keywordMetrics?.avgMonthlySearches || '0');
        bValue = parseInt(b.keywordMetrics?.avgMonthlySearches || '0');
        break;
      case 'competition':
        // Sort by competition level (LOW, MEDIUM, HIGH)
        const competitionOrder: Record<string, number> = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
        aValue = competitionOrder[a.keywordMetrics?.competition || 'LOW'] || 0;
        bValue = competitionOrder[b.keywordMetrics?.competition || 'LOW'] || 0;
        break;
      case 'difficulty':
        aValue = parseInt(a.keywordMetrics?.competitionIndex || '0');
        bValue = parseInt(b.keywordMetrics?.competitionIndex || '0');
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Filter keywords based on search query
  const filteredKeywords = sortedKeywords.filter(keyword => 
    keyword.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending on new sort field
    }
  };

  // Handle main keyword selection
  const handleSelectMainKeyword = (keyword: string) => {
    // If this keyword was an additional keyword, remove it from there
    if (selectedAdditionalKeywords.includes(keyword)) {
      setSelectedAdditionalKeywords(prev => prev.filter(k => k !== keyword));
    }
    setSelectedMainKeyword(keyword);
  };

  // Handle additional keyword selection
  const handleToggleAdditionalKeyword = (keyword: string, isChecked: boolean) => {
    if (keyword === selectedMainKeyword) {
      // Can't be both main and additional
      return;
    }

    if (isChecked) {
      // Check if we've reached the limit of 30 additional keywords
      if (selectedAdditionalKeywords.length >= 30) {
        toast({
          title: "Selection limit reached",
          description: "You can select a maximum of 30 additional keywords.",
          variant: "destructive"
        });
        return;
      }
      setSelectedAdditionalKeywords(prev => [...prev, keyword]);
    } else {
      setSelectedAdditionalKeywords(prev => prev.filter(k => k !== keyword));
    }
  };

  // Handle adding a custom keyword
  const handleAddCustomKeyword = () => {
    const trimmedKeyword = customKeyword.trim();
    if (!trimmedKeyword) {
      toast({
        title: "Invalid keyword",
        description: "Please enter a valid keyword.",
        variant: "destructive"
      });
      return;
    }

    // Check if keyword already exists
    if ([...parsedKeywords.map(k => k.text), ...selectedAdditionalKeywords].includes(trimmedKeyword)) {
      toast({
        title: "Duplicate keyword",
        description: "This keyword already exists in the list.",
        variant: "destructive"
      });
      return;
    }

    // Add as main keyword if none selected, otherwise as additional
    if (!selectedMainKeyword) {
      setSelectedMainKeyword(trimmedKeyword);
    } else {
      // Check if we've reached the limit
      if (selectedAdditionalKeywords.length >= 30) {
        toast({
          title: "Selection limit reached",
          description: "You can select a maximum of 30 additional keywords.",
          variant: "destructive"
        });
        return;
      }
      setSelectedAdditionalKeywords(prev => [...prev, trimmedKeyword]);
    }

    // Reset the input
    setCustomKeyword('');
  };

  // Handle adding a custom reference
  const handleAddCustomReference = () => {
    const title = newReferenceTitle.trim();
    const url = newReferenceUrl.trim();

    if (!title || !url) {
      toast({
        title: "Invalid reference",
        description: "Both title and URL are required.",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com).",
        variant: "destructive"
      });
      return;
    }

    setCustomReferences(prev => [...prev, { title, url }]);
    setNewReferenceTitle('');
    setNewReferenceUrl('');
  };

  // Handle removing a custom reference
  const handleRemoveCustomReference = (index: number) => {
    setCustomReferences(prev => prev.filter((_, i) => i !== index));
  };

  // Handle navigation back to the previous step
  const handleBack = () => {
    navigate('/article-writer/keyword');
  };

  // Handle form submission
  const handleContinue = async () => {
    // Validate that we have selected at least a main keyword
    if (!selectedMainKeyword) {
      toast({
        title: "Main keyword required",
        description: "Please select a main keyword for your article.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare the payload for the webhook
      const payload = {
        workflowId: keywordResponse?.workflowId || workflowId,
        userId: keywordResponse?.userId || user?.id,
        sessionId: sessionId,
        originalKeyword: keywordResponse?.originalKeyword || keywordForm.keyword,
        country: keywordResponse?.country || keywordForm.country,
        language: keywordResponse?.language || keywordForm.language,
        typeOfContent: keywordResponse?.contentType || keywordForm.contentType,
        mainKeyword: selectedMainKeyword,
        additionalKeyword: selectedAdditionalKeywords,
        references: [...references, ...customReferences],
        researchType: researchType,
        additionalData: keywordResponse?.additionalData || {}
      };

      // Set up timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('https://n8n.agiagentworld.com/webhook/selectedkeyword', {
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
      console.log("Selected keyword response:", responseData);
      
      // Store the response in the context
      setKeywordSelectResponse(responseData);
      
      // Navigate to the next step
      navigate('/article-writer/title-description');

    } catch (err: any) {
      console.error("Error submitting keywords:", err);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(`Failed to submit keywords: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render monthly search volumes tooltip content
  const renderMonthlySearchVolumes = (keyword: KeywordItem) => {
    const volumes = keyword.keywordMetrics?.monthlySearchVolumes || [];
    if (volumes.length === 0) return "No monthly search data available";

    return (
      <div className="p-2">
        <h4 className="font-medium mb-2">Monthly Search Volume</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {volumes.map((vol, i) => (
            <div key={i} className="text-xs">
              <div className="font-medium">{vol.month} {vol.year}</div>
              <div>{vol.monthlySearches}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get competition display
  const getCompetitionDisplay = (competition: string | undefined) => {
    switch (competition) {
      case 'HIGH':
        return <Badge variant="destructive">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'LOW':
        return <Badge variant="success" className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get difficulty display with color coding
  const getDifficultyDisplay = (difficulty: string | undefined) => {
    if (!difficulty) return "N/A";
    
    const diffValue = parseInt(difficulty);
    let colorClass = "";
    
    if (diffValue < 30) colorClass = "bg-green-100 text-green-800";
    else if (diffValue < 60) colorClass = "bg-yellow-100 text-yellow-800";
    else colorClass = "bg-red-100 text-red-800";
    
    return (
      <Badge className={colorClass}>
        {difficulty}/100
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Select Keywords - Article Writer AI</title>
      </Helmet>
      
      <div className="container max-w-7xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Keywords</h1>
          <p className="text-gray-600">
            Choose the main keyword and additional keywords for your article. You can select up to 30 additional keywords.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Current keyword info */}
        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{keywordForm.keyword}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {keywordForm.contentType} · {keywordForm.language.toUpperCase()} · {keywordForm.country}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium mr-1">Selected:</span>
                  <Badge variant="secondary">{1 + selectedAdditionalKeywords.length}</Badge>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select 1 main keyword and up to 30 additional keywords</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section A: Main and Additional Keywords */}
        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">A. Main and Additional Keywords</h2>
            
            {/* Custom keyword input */}
            <div className="mb-4 flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Add a custom keyword..."
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomKeyword()}
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                onClick={handleAddCustomKeyword}
                disabled={!customKeyword.trim() || isSubmitting}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Keyword
              </Button>
            </div>
            
            {/* Search and sort */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search keywords..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            {/* Keywords table */}
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[350px] min-w-[200px]">
                        <button 
                          className="flex items-center font-semibold text-sm"
                          onClick={() => handleSort('keyword')}
                        >
                          Keyword
                          {sortField === 'keyword' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center font-semibold text-sm"
                          onClick={() => handleSort('volume')}
                        >
                          Search Volume
                          {sortField === 'volume' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center font-semibold text-sm"
                          onClick={() => handleSort('competition')}
                        >
                          Competition
                          {sortField === 'competition' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center font-semibold text-sm"
                          onClick={() => handleSort('difficulty')}
                        >
                          Difficulty
                          {sortField === 'difficulty' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKeywords.length > 0 ? (
                      filteredKeywords.map((keyword, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Radio 
                                value={keyword.text}
                                checked={selectedMainKeyword === keyword.text}
                                onCheckedChange={() => handleSelectMainKeyword(keyword.text)}
                                disabled={isSubmitting}
                                id={`main-${index}`}
                              />
                              <Checkbox
                                checked={selectedAdditionalKeywords.includes(keyword.text)}
                                onCheckedChange={(checked) => 
                                  handleToggleAdditionalKeyword(keyword.text, checked === true)
                                }
                                disabled={selectedMainKeyword === keyword.text || isSubmitting}
                                id={`additional-${index}`}
                              />
                              <Label htmlFor={`main-${index}`} className="cursor-pointer">
                                {keyword.text}
                              </Label>
                              {selectedMainKeyword === keyword.text && (
                                <Badge className="ml-2 bg-primary">Main</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help underline underline-offset-4 decoration-dotted">
                                    {keyword.keywordMetrics?.avgMonthlySearches || 'N/A'}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="w-80">
                                  {renderMonthlySearchVolumes(keyword)}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            {getCompetitionDisplay(keyword.keywordMetrics?.competition)}
                          </TableCell>
                          <TableCell>
                            {getDifficultyDisplay(keyword.keywordMetrics?.competitionIndex)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No keywords found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Section B: References */}
          <div>
            <h2 className="text-xl font-semibold mb-4">B. References</h2>
            
            <div className="space-y-4">
              {/* Top ranking articles */}
              <div>
                <h3 className="text-lg font-medium mb-2">Top Ranking Articles</h3>
                <ul className="space-y-2">
                  {references.length > 0 ? (
                    references.map((ref, index) => (
                      <li key={index} className="bg-gray-50 p-3 rounded-md">
                        <p className="font-medium">{ref.title}</p>
                        <a 
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm flex items-center hover:underline overflow-hidden text-ellipsis"
                        >
                          {ref.url.length > 50 ? `${ref.url.substring(0, 50)}...` : ref.url}
                          <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No references available.</li>
                  )}
                </ul>
              </div>
              
              {/* Custom references */}
              <div>
                <h3 className="text-lg font-medium mb-2">Add Your References</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <Input
                    placeholder="Title"
                    value={newReferenceTitle}
                    onChange={(e) => setNewReferenceTitle(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Input
                    placeholder="URL (https://...)"
                    value={newReferenceUrl}
                    onChange={(e) => setNewReferenceUrl(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  onClick={handleAddCustomReference}
                  disabled={!newReferenceTitle.trim() || !newReferenceUrl.trim() || isSubmitting}
                  className="mb-4"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Reference
                </Button>
                
                {/* Custom references list */}
                {customReferences.length > 0 && (
                  <div className="border p-3 rounded-md bg-gray-50">
                    <h4 className="font-medium mb-2">Your References</h4>
                    <ul className="space-y-2">
                      {customReferences.map((ref, index) => (
                        <li key={index} className="flex items-start justify-between bg-white p-2 rounded-md">
                          <div>
                            <p className="font-medium">{ref.title}</p>
                            <a 
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 text-sm flex items-center hover:underline"
                            >
                              {ref.url.length > 30 ? `${ref.url.substring(0, 30)}...` : ref.url}
                              <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveCustomReference(index)}
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section C: Research Type */}
          <div>
            <h2 className="text-xl font-semibold mb-4">C. Research Type (Optional)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ai-agent-search" className="text-base">AI Agent Search</Label>
                <div className="relative">
                  <Input
                    id="ai-agent-search"
                    placeholder="Enter research instructions..."
                    value={researchType === 'AI Agent Search' ? researchType : ''}
                    onChange={(e) => setResearchType(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="your-sources" className="text-base">Your Sources</Label>
                  <Badge variant="outline" className="ml-2">Beta</Badge>
                </div>
                <div className="relative">
                  <Input
                    id="your-sources"
                    placeholder="Enter your sources..."
                    value={researchType !== 'AI Agent Search' ? researchType : ''}
                    onChange={(e) => setResearchType(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={!selectedMainKeyword || isSubmitting}
            className="flex items-center"
          >
            Continue
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Loading overlay */}
      {isSubmitting && (
        <LoadingOverlay 
          message="Processing your selection..." 
          subMessage="This may take a few moments"
        />
      )}
    </DashboardLayout>
  );
};

export default SelectKeywordsStep;
