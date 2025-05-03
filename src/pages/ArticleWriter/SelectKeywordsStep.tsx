import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  RadioGroup, RadioGroupItem
} from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronLeft, ChevronRight, Plus, ArrowUpDown, InfoIcon, ExternalLink, Trash
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { Separator } from '@/components/ui/separator';
import { extractKeywords, extractReferences } from '@/utils/dataValidation';

// Alert component
const StatusAlert = ({ 
  status, 
  mainKeyword, 
  additionalKeywordsCount 
}: { 
  status: 'none' | 'incomplete' | 'complete',
  mainKeyword: string | null,
  additionalKeywordsCount: number
}) => {
  if (status === 'none') return null;

  if (status === 'incomplete') {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Selection incomplete</AlertTitle>
        <AlertDescription>
          {!mainKeyword ? 
            'Please select a main keyword.' : 
            'Please select at least one additional keyword.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-green-600 bg-green-50">
      <AlertTitle>Selection complete</AlertTitle>
      <AlertDescription>
        You've selected <strong>{mainKeyword}</strong> as your main keyword and {additionalKeywordsCount} additional keywords.
      </AlertDescription>
    </Alert>
  );
};

interface MonthlySearchVolume {
  month: string;
  year: string;
  monthlySearches: string;
}

interface KeywordMetrics {
  competition?: string;
  monthlySearchVolumes?: MonthlySearchVolume[];
  avgMonthlySearches?: string;
  competitionIndex?: string;
}

interface HistoricalSearchItem {
  text: string;
  keywordMetrics?: KeywordMetrics;
  closeVariants?: string[];
}

interface Reference {
  title: string;
  url: string;
}

interface SelectionState {
  mainKeyword: string | null;
  additionalKeywords: string[];
  references: Reference[];
  customReferences: Reference[];
  customKeywords: string[];
  researchType: string;
}

const SelectKeywordsStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    currentStep,
    setCurrentStep,
    keywordForm,
    keywordResponse,
    sessionId,
    workflowId,
    setKeywordSelectResponse
  } = useArticleWriter();

  // State for selections
  const [selectionState, setSelectionState] = useState<SelectionState>({
    mainKeyword: null,
    additionalKeywords: [],
    references: [],
    customReferences: [],
    customKeywords: [],
    researchType: 'AI Agent Search'
  });

  // State for form inputs
  const [newCustomKeyword, setNewCustomKeyword] = useState('');
  const [newReferenceTitle, setNewReferenceTitle] = useState('');
  const [newReferenceUrl, setNewReferenceUrl] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // State for UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationTriggered, setValidationTriggered] = useState(false);
  
  // Parsed keyword data
  const [parsedKeywords, setParsedKeywords] = useState<HistoricalSearchItem[]>([]);
  const [parsedReferences, setParsedReferences] = useState<Reference[]>([]);

  useEffect(() => {
    // Update current step
    setCurrentStep(2);
    
    // If we don't have keyword response, redirect back
    if (!keywordResponse) {
      navigate('/article-writer/keyword');
      return;
    }
    
    // Parse keyword response data
    if (keywordResponse) {
      try {
        console.log("Processing keyword response:", keywordResponse);
        
        // Parse historical search data using our utility
        const parsedData = extractKeywords(keywordResponse);
        console.log("Parsed keywords:", parsedData);
        setParsedKeywords(parsedData);
        
        // Parse references using our utility
        const refs = extractReferences(keywordResponse);
        console.log("Parsed references:", refs);
        setParsedReferences(refs);
        
        // Update selection state with references
        setSelectionState(prev => ({
          ...prev,
          references: refs
        }));
      } catch (e) {
        console.error('Error parsing keyword response:', e);
        setError('Failed to parse keyword data. Please try refreshing the page.');
      }
    }
  }, [keywordResponse, setCurrentStep, navigate]);

  // Sort data when sortConfig changes
  useEffect(() => {
    if (!sortConfig) return;
    
    const sortedData = [...parsedKeywords].sort((a, b) => {
      if (sortConfig.key === 'text') {
        return sortConfig.direction === 'ascending'
          ? a.text.localeCompare(b.text)
          : b.text.localeCompare(a.text);
      }
      
      if (sortConfig.key === 'volume') {
        const aVolume = Number(a.keywordMetrics?.avgMonthlySearches || 0);
        const bVolume = Number(b.keywordMetrics?.avgMonthlySearches || 0);
        return sortConfig.direction === 'ascending'
          ? aVolume - bVolume
          : bVolume - aVolume;
      }
      
      if (sortConfig.key === 'competition') {
        const compValues = { LOW: 1, MEDIUM: 2, HIGH: 3 };
        const aComp = compValues[a.keywordMetrics?.competition as keyof typeof compValues] || 0;
        const bComp = compValues[b.keywordMetrics?.competition as keyof typeof compValues] || 0;
        return sortConfig.direction === 'ascending'
          ? aComp - bComp
          : bComp - aComp;
      }
      
      if (sortConfig.key === 'difficulty') {
        const aDiff = Number(a.keywordMetrics?.competitionIndex || 0);
        const bDiff = Number(b.keywordMetrics?.competitionIndex || 0);
        return sortConfig.direction === 'ascending'
          ? aDiff - bDiff
          : bDiff - aDiff;
      }
      
      return 0;
    });
    
    setParsedKeywords(sortedData);
  }, [sortConfig]);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Selection handlers
  const handleSelectMainKeyword = (keyword: string) => {
    setSelectionState(prev => {
      // If this keyword was previously an additional keyword, remove it
      const updatedAdditional = prev.additionalKeywords.filter(k => k !== keyword);
      
      return {
        ...prev,
        mainKeyword: keyword,
        additionalKeywords: updatedAdditional
      };
    });
  };

  const handleToggleAdditionalKeyword = (keyword: string, isSelected: boolean) => {
    setSelectionState(prev => {
      // Don't select as additional if it's the main keyword
      if (prev.mainKeyword === keyword) return prev;
      
      // Update the additional keywords array based on selection
      let updated = [...prev.additionalKeywords];
      if (isSelected && !updated.includes(keyword)) {
        updated.push(keyword);
      } else if (!isSelected && updated.includes(keyword)) {
        updated = updated.filter(k => k !== keyword);
      }
      
      return {
        ...prev,
        additionalKeywords: updated
      };
    });
  };

  // Custom keyword handlers
  const handleAddCustomKeyword = () => {
    const trimmedKeyword = newCustomKeyword.trim();
    
    if (!trimmedKeyword) {
      toast({
        title: "Invalid input",
        description: "Please enter a keyword",
        variant: "destructive"
      });
      return;
    }
    
    // Check if already exists in any keyword list
    if (
      parsedKeywords.some(k => k.text.toLowerCase() === trimmedKeyword.toLowerCase()) ||
      selectionState.customKeywords.some(k => k.toLowerCase() === trimmedKeyword.toLowerCase())
    ) {
      toast({
        title: "Duplicate keyword",
        description: "This keyword already exists in the list",
        variant: "destructive"
      });
      return;
    }
    
    setSelectionState(prev => ({
      ...prev,
      customKeywords: [...prev.customKeywords, trimmedKeyword]
    }));
    
    setNewCustomKeyword('');
    
    toast({
      title: "Keyword added",
      description: `"${trimmedKeyword}" has been added to your keywords`
    });
  };

  const handleRemoveCustomKeyword = (keyword: string) => {
    setSelectionState(prev => ({
      ...prev,
      customKeywords: prev.customKeywords.filter(k => k !== keyword),
      // Also remove from selections if it was selected
      mainKeyword: prev.mainKeyword === keyword ? null : prev.mainKeyword,
      additionalKeywords: prev.additionalKeywords.filter(k => k !== keyword)
    }));
  };

  // Reference handlers
  const handleAddCustomReference = () => {
    const title = newReferenceTitle.trim();
    const url = newReferenceUrl.trim();
    
    if (!title || !url) {
      toast({
        title: "Invalid input",
        description: "Please enter both a title and URL",
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
        description: "Please enter a valid URL (including http:// or https://)",
        variant: "destructive"
      });
      return;
    }
    
    // Check for duplicates
    if (
      selectionState.references.some(r => r.url === url) ||
      selectionState.customReferences.some(r => r.url === url)
    ) {
      toast({
        title: "Duplicate reference",
        description: "This URL already exists in your references",
        variant: "destructive"
      });
      return;
    }
    
    const newReference = { title, url };
    setSelectionState(prev => ({
      ...prev,
      customReferences: [...prev.customReferences, newReference]
    }));
    
    setNewReferenceTitle('');
    setNewReferenceUrl('');
    
    toast({
      title: "Reference added",
      description: `"${title}" has been added to your references`
    });
  };

  const handleRemoveCustomReference = (url: string) => {
    setSelectionState(prev => ({
      ...prev,
      customReferences: prev.customReferences.filter(r => r.url !== url)
    }));
  };

  // Research type handler
  const handleResearchTypeChange = (value: string) => {
    setSelectionState(prev => ({
      ...prev,
      researchType: value
    }));
  };

  // Navigation handlers
  const handleBack = () => {
    navigate('/article-writer/keyword');
  };

  const validateSelections = (): boolean => {
    setValidationTriggered(true);
    
    // Check if main keyword is selected
    if (!selectionState.mainKeyword) {
      toast({
        title: "Main keyword required",
        description: "Please select a main keyword",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if at least one additional keyword is selected
    if (selectionState.additionalKeywords.length === 0) {
      toast({
        title: "Additional keywords required",
        description: "Please select at least one additional keyword",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleContinue = async () => {
    if (!validateSelections()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare references array combining default and custom
      const allReferences = [
        ...selectionState.references,
        ...selectionState.customReferences
      ];
      
      // Prepare payload
      const payload = {
        workflowId: workflowId,
        userId: keywordResponse?.userId || '',
        sessionId: sessionId,
        originalKeyword: keywordResponse?.originalKeyword || keywordForm.keyword,
        country: keywordResponse?.country || keywordForm.country,
        language: keywordResponse?.language || keywordForm.language,
        typeOfContent: keywordResponse?.contentType || keywordForm.contentType,
        mainKeyword: selectionState.mainKeyword,
        additionalKeyword: [
          ...selectionState.additionalKeywords,
          ...selectionState.customKeywords.filter(k => 
            k !== selectionState.mainKeyword && 
            !selectionState.additionalKeywords.includes(k)
          )
        ],
        references: allReferences,
        researchType: selectionState.researchType,
        additionalData: keywordResponse?.additionalData || {}
      };
      
      console.log("Submitting selected keywords payload:", payload);
      
      // Add timeout handling
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
      console.log("Selected keywords response:", responseData);
      
      // Save the response to context
      setKeywordSelectResponse(responseData);
      
      // Navigate to the next step
      navigate('/article-writer/title-description');
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(`Failed to submit keywords: ${err.message}`);
      }
      console.error('Error submitting selected keywords:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to determine selection status
  const getSelectionStatus = () => {
    if (!validationTriggered) return 'none';
    if (!selectionState.mainKeyword || selectionState.additionalKeywords.length === 0) return 'incomplete';
    return 'complete';
  };

  // Render monthly search volumes tooltip content
  const renderMonthlyVolumes = (volumes?: MonthlySearchVolume[]) => {
    if (!volumes || volumes.length === 0) return <div>No monthly data available</div>;
    
    return (
      <div className="p-3 max-w-md">
        <h4 className="font-medium mb-2">Monthly Search Volume</h4>
        <div className="grid grid-cols-3 gap-2">
          {volumes.map((vol, idx) => (
            <div key={idx} className="text-xs">
              <span className="font-medium">{vol.month} {vol.year}: </span>
              <span>{vol.monthlySearches}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Format competition value for display
  const formatCompetition = (competition?: string) => {
    if (!competition) return 'N/A';
    
    const colorClass = 
      competition === 'LOW' ? 'text-green-600' :
      competition === 'MEDIUM' ? 'text-yellow-600' :
      competition === 'HIGH' ? 'text-red-600' : 'text-gray-600';
    
    return <span className={colorClass}>{competition}</span>;
  };

  // Format competition index for display
  const formatCompetitionIndex = (index?: string) => {
    if (!index) return 'N/A';
    
    const numIndex = Number(index);
    const colorClass = 
      numIndex <= 33 ? 'text-green-600' :
      numIndex <= 66 ? 'text-yellow-600' : 'text-red-600';
    
    return <span className={colorClass}>{index}</span>;
  };

  // Calculate all keywords for selection
  const allSelectionKeywords = [
    ...parsedKeywords.map(k => k.text),
    ...selectionState.customKeywords
  ];

  return (
    <DashboardLayout>
      <Helmet>
        <title>Select Keywords - Article Writer</title>
      </Helmet>
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Keywords</h1>
          <p className="text-gray-600">
            Choose your main keyword and additional keywords for your article about{" "}
            <span className="font-medium">{keywordForm.keyword}</span>
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <StatusAlert 
          status={getSelectionStatus()} 
          mainKeyword={selectionState.mainKeyword} 
          additionalKeywordsCount={selectionState.additionalKeywords.length}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Main and Additional Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Select 1 main keyword and up to 30 additional keywords.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                        <span className="text-sm">Main Keyword</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded border border-primary"></div>
                        <span className="text-sm">Additional Keywords</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%] cursor-pointer" onClick={() => handleSort('text')}>
                          <div className="flex items-center">
                            Keyword
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('volume')}>
                          <div className="flex items-center">
                            Search Volume
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('competition')}>
                          <div className="flex items-center">
                            Competition
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('difficulty')}>
                          <div className="flex items-center">
                            Difficulty
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedKeywords.map((keyword, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <RadioGroup value={selectionState.mainKeyword || ""}>
                                <RadioGroupItem 
                                  value={keyword.text} 
                                  id={`main-${index}`}
                                  checked={selectionState.mainKeyword === keyword.text}
                                  onClick={() => handleSelectMainKeyword(keyword.text)}
                                />
                              </RadioGroup>
                              <Checkbox 
                                id={`additional-${index}`}
                                checked={selectionState.additionalKeywords.includes(keyword.text)}
                                onCheckedChange={(checked) => 
                                  handleToggleAdditionalKeyword(keyword.text, checked === true)
                                }
                                disabled={selectionState.mainKeyword === keyword.text}
                              />
                              <Label 
                                htmlFor={`additional-${index}`}
                                className="cursor-pointer"
                              >
                                {keyword.text}
                              </Label>
                            </div>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center cursor-help">
                                    {keyword.keywordMetrics?.avgMonthlySearches || 'N/A'}
                                    <InfoIcon className="ml-1 h-4 w-4" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {renderMonthlyVolumes(keyword.keywordMetrics?.monthlySearchVolumes)}
                                </TooltipContent>
                              </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            {formatCompetition(keyword.keywordMetrics?.competition)}
                          </TableCell>
                          <TableCell>
                            {formatCompetitionIndex(keyword.keywordMetrics?.competitionIndex)}
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Custom Keywords Section */}
                      {selectionState.customKeywords.map((keyword, index) => (
                        <TableRow key={`custom-${index}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <RadioGroup value={selectionState.mainKeyword || ""}>
                                <RadioGroupItem 
                                  value={keyword} 
                                  id={`custom-main-${index}`}
                                  checked={selectionState.mainKeyword === keyword}
                                  onClick={() => handleSelectMainKeyword(keyword)}
                                />
                              </RadioGroup>
                              <Checkbox 
                                id={`custom-additional-${index}`}
                                checked={selectionState.additionalKeywords.includes(keyword)}
                                onCheckedChange={(checked) => 
                                  handleToggleAdditionalKeyword(keyword, checked === true)
                                }
                                disabled={selectionState.mainKeyword === keyword}
                              />
                              <Label 
                                htmlFor={`custom-additional-${index}`}
                                className="cursor-pointer flex-grow"
                              >
                                {keyword}
                                <span className="ml-2 text-xs text-gray-500">(Custom)</span>
                              </Label>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleRemoveCustomKeyword(keyword)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell colSpan={3}>
                            <span className="text-gray-500 text-sm italic">Custom keyword</span>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Empty State */}
                      {parsedKeywords.length === 0 && selectionState.customKeywords.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <p>No keywords found. You can add custom keywords below.</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Add Custom Keyword Section */}
                <div className="mt-6">
                  <Label htmlFor="custom-keyword" className="text-sm font-medium">
                    Add a custom keyword
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="custom-keyword"
                      value={newCustomKeyword}
                      onChange={(e) => setNewCustomKeyword(e.target.value)}
                      placeholder="Enter a keyword"
                      className="flex-grow"
                    />
                    <Button 
                      onClick={handleAddCustomKeyword}
                      disabled={!newCustomKeyword.trim()}
                      type="button"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            {/* References Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>References</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Top Ranking Articles</h3>
                    {parsedReferences.length > 0 ? (
                      <ul className="space-y-2">
                        {parsedReferences.map((ref, index) => (
                          <li key={index} className="flex items-start">
                            <a 
                              href={ref.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-start"
                            >
                              <span className="flex-grow line-clamp-1">{ref.title}</span>
                              <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No references found</p>
                    )}
                  </div>
                  
                  {/* Custom References */}
                  {selectionState.customReferences.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm mb-2">Your Added References</h3>
                      <ul className="space-y-2">
                        {selectionState.customReferences.map((ref, index) => (
                          <li key={index} className="flex items-start group">
                            <a 
                              href={ref.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex-grow line-clamp-1"
                            >
                              {ref.title}
                            </a>
                            <button
                              onClick={() => handleRemoveCustomReference(ref.url)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove reference"
                            >
                              <Trash className="h-3 w-3 text-gray-400 hover:text-red-500" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Add Reference Form */}
                  <div className="pt-4">
                    <h3 className="font-medium text-sm mb-2">Add a reference</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="ref-title" className="text-xs">Title</Label>
                        <Input
                          id="ref-title"
                          value={newReferenceTitle}
                          onChange={(e) => setNewReferenceTitle(e.target.value)}
                          placeholder="Reference title"
                          className="h-9 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ref-url" className="text-xs">URL</Label>
                        <Input
                          id="ref-url"
                          value={newReferenceUrl}
                          onChange={(e) => setNewReferenceUrl(e.target.value)}
                          placeholder="https://"
                          className="h-9 text-sm"
                        />
                      </div>
                      <Button 
                        onClick={handleAddCustomReference} 
                        type="button"
                        disabled={!newReferenceTitle.trim() || !newReferenceUrl.trim()}
                        size="sm"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Reference
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Research Type Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  Research Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectionState.researchType}
                  onValueChange={handleResearchTypeChange}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="AI Agent Search" id="ai-search" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="ai-search" className="font-medium">
                        AI Agent Search
                      </Label>
                      <Input
                        placeholder="Enter additional research instructions..."
                        className="mt-2 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="Your Sources" id="your-sources" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="your-sources" className="flex items-center">
                        Your Sources
                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">BETA</span>
                      </Label>
                      <Input
                        placeholder="Enter your sources for research..."
                        className="mt-2 text-sm"
                        disabled={selectionState.researchType !== "Your Sources"}
                      />
                    </div>
                  </div>
                </RadioGroup>
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
            disabled={isSubmitting}
            className="flex items-center"
          >
            {isSubmitting ? "Submitting..." : "Continue"}
            {!isSubmitting && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SelectKeywordsStep;
