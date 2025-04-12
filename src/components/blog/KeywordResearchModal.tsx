
import React, { useState, useEffect } from "react";
import { useKeywordResearch } from "@/hooks/useKeywordResearch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, PlusCircle, X, Globe, BarChart } from "lucide-react";
import { toast } from "sonner";

interface KeywordResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeywordSelected?: (keyword: string) => void;
}

const KeywordResearchModal: React.FC<KeywordResearchModalProps> = ({ 
  isOpen, 
  onClose,
  onKeywordSelected
}) => {
  const [activeTab, setActiveTab] = useState("search");
  
  const {
    primaryKeyword,
    setPrimaryKeyword,
    language,
    setLanguage,
    location,
    setLocation,
    depth,
    setDepth,
    limit,
    setLimit,
    searchResults,
    relatedKeywords,
    keywordIdeas,
    searchVolumes,
    isLoading,
    hasSearched,
    error,
    runSearch,
    keywordClusters,
    historicalData,
    isLoadingClusters,
    selectedKeywords,
    setSelectedKeywords,
    pagedKeywords,
    currentKeywordPage,
    setCurrentKeywordPage
  } = useKeywordResearch();

  const handleSelectKeyword = (keyword: string) => {
    console.log("Keyword selected in modal:", keyword);
    if (onKeywordSelected) {
      onKeywordSelected(keyword);
      // Make sure to close the modal
      onClose();
    }
  };

  const handleAddKeyword = (keyword: string) => {
    if (!selectedKeywords.includes(keyword)) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryKeyword) {
      toast.error("Please enter a primary keyword");
      return;
    }
    runSearch();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyword Research</DialogTitle>
          <DialogDescription>
            Find the best keywords for your blog content
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="clusters">Clusters</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            <form onSubmit={handleSearch}>
              <div className="space-y-4">
                <div>
                  <FormLabel>Primary Keyword</FormLabel>
                  <div className="flex">
                    <Input
                      placeholder="Enter a keyword to research"
                      value={primaryKeyword}
                      onChange={(e) => setPrimaryKeyword(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button 
                      type="submit" 
                      className="rounded-l-none"
                      disabled={isLoading || !primaryKeyword}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <FormLabel>Language</FormLabel>
                <Select 
                  value={language} 
                  onValueChange={setLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4">
                <FormLabel>Location</FormLabel>
                <Select 
                  value={location} 
                  onValueChange={setLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="gb">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <FormLabel>Search Depth</FormLabel>
                  <Select 
                    value={depth.toString()} 
                    onValueChange={(value) => setDepth(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select depth" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">Basic</SelectItem>
                        <SelectItem value="2">Medium</SelectItem>
                        <SelectItem value="3">Deep</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <FormLabel>Result Limit</FormLabel>
                  <Select 
                    value={limit.toString()} 
                    onValueChange={(value) => setLimit(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="10">10 results</SelectItem>
                        <SelectItem value="20">20 results</SelectItem>
                        <SelectItem value="50">50 results</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>

          {isLoading && (
            <div className="text-center py-6 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-foreground/70">
                Researching keywords. This may take a moment...
              </p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="bg-red-50 p-4 rounded-lg text-red-800 my-4">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {hasSearched && !isLoading && !error && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Related Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedKeywords && relatedKeywords.length > 0 ? (
                    relatedKeywords.slice(0, 20).map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleSelectKeyword(keyword)}
                      >
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-foreground/60">No related keywords found</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Keyword Ideas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {keywordIdeas && keywordIdeas.length > 0 ? (
                    keywordIdeas.slice(0, 10).map((keyword, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        className="justify-start h-auto py-2 px-3"
                        onClick={() => handleSelectKeyword(keyword)}
                      >
                        <Globe className="w-3 h-3 mr-2 text-foreground/60" />
                        {keyword}
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-foreground/60">No keyword ideas found</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Search Volumes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {searchVolumes && Object.keys(searchVolumes).length > 0 ? (
                    Object.entries(searchVolumes)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 10)
                      .map(([keyword, volume], index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          className="justify-between h-auto py-2 px-3"
                          onClick={() => handleSelectKeyword(keyword)}
                        >
                          <span>{keyword}</span>
                          <Badge variant="secondary" className="ml-2">
                            <BarChart className="w-3 h-3 mr-1" />
                            {volume}
                          </Badge>
                        </Button>
                      ))
                  ) : (
                    <p className="text-sm text-foreground/60">No search volume data found</p>
                  )}
                </div>
              </div>
            </div>
          )}
          </TabsContent>
          
          <TabsContent value="clusters">
            <div className="space-y-4">
              {isLoadingClusters ? (
                <div className="text-center py-6">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="mt-2 text-foreground/70">Loading keyword clusters...</p>
                </div>
              ) : keywordClusters && keywordClusters.length > 0 ? (
                keywordClusters.map((cluster, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{cluster.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {cluster.keywords.map((keyword, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectKeyword(keyword)}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-foreground/70">
                    {hasSearched 
                      ? "No keyword clusters found" 
                      : "Search for a keyword to see clusters"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-6">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="mt-2 text-foreground/70">Loading trend data...</p>
                </div>
              ) : historicalData && historicalData.length > 0 ? (
                <div className="h-64 border rounded-lg p-4">
                  {/* Placeholder for chart */}
                  <div className="flex items-center justify-center h-full bg-gray-100 rounded">
                    <p className="text-foreground/70">Trend chart placeholder</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-foreground/70">
                    {hasSearched 
                      ? "No trend data available" 
                      : "Search for a keyword to see trend data"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          <Button
            onClick={() => {
              if (selectedKeywords.length > 0) {
                handleSelectKeyword(selectedKeywords[0]);
              } else if (primaryKeyword) {
                handleSelectKeyword(primaryKeyword);
              } else {
                toast.error("Please select or enter a keyword");
              }
            }}
          >
            Continue with Selected Keyword
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeywordResearchModal;
