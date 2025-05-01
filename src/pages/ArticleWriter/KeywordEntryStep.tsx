
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import { useArticleWriter, ContentType } from '@/context/articleWriter/ArticleWriterContext';
import { useKeywordResearch } from '@/hooks/useKeywordResearch';
import { AlertCircle, Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Content type options
const contentTypeOptions: ContentType[] = [
  'Blog Post',
  'News Article',
  'How to Guide',
  'Comparison Blog',
  'Technical Article',
  'Product Reviews'
];

// Sample country data
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
];

// Sample language data
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ja', name: 'Japanese' },
];

const KeywordEntryStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    sessionId,
    workflowId,
    keywordForm,
    updateKeywordForm,
    setKeywordResponse,
    setCurrentStep,
  } = useArticleWriter();
  
  const { isLoading, timeoutReached, submitKeywordResearch } = useKeywordResearch({
    userId: user?.id || '',
    sessionId,
    workflowId
  });
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(keywordForm.contentType);
  
  useEffect(() => {
    // Update current step
    setCurrentStep(1);
  }, [setCurrentStep]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!keywordForm.keyword.trim()) {
      setValidationError('Please enter a keyword');
      return;
    }
    
    setValidationError(null);
    
    // Submit the form data to API
    const response = await submitKeywordResearch(keywordForm);
    
    if (response) {
      setKeywordResponse(response);
      
      // Navigate to the next step
      navigate('/article-writer/select-keywords');
    }
  };
  
  const handleBack = () => {
    navigate('/article-writer');
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Enter a Keyword - Article Writer AI</title>
      </Helmet>
      <div className="container max-w-3xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Enter a Keyword</h1>
          <p className="text-gray-600">
            Start by entering a main keyword for your article. We'll use this to generate related keywords and content.
          </p>
        </div>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-800">{validationError}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="keyword" className="text-base">Keyword</Label>
              <Input
                id="keyword"
                placeholder="Enter your main keyword (e.g., sustainable gardening)"
                value={keywordForm.keyword}
                onChange={(e) => updateKeywordForm({ keyword: e.target.value })}
                className="h-12"
              />
              <p className="text-sm text-gray-500">
                This will be the primary focus of your article.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-base">Target Users Country</Label>
                <Select 
                  value={keywordForm.country}
                  onValueChange={(value) => updateKeywordForm({ country: value })}
                >
                  <SelectTrigger id="country" className="h-12">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Select the primary country you're targeting.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language" className="text-base">Article Language</Label>
                <Select 
                  value={keywordForm.language}
                  onValueChange={(value) => updateKeywordForm({ language: value })}
                >
                  <SelectTrigger id="language" className="h-12">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Choose the language for your article.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base">Type of Content</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {contentTypeOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`p-3 border rounded-md text-sm font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                      selectedContentType === type ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                    onClick={() => {
                      setSelectedContentType(type);
                      updateKeywordForm({ contentType: type });
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Select the type of content you want to create.
              </p>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !keywordForm.keyword.trim()}
                isLoading={isLoading}
              >
                {isLoading ? 'Researching...' : 'Continue'}
              </Button>
            </div>
            
            {timeoutReached && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  The request is taking longer than expected. You can wait or try with a different keyword.
                </p>
              </div>
            )}
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default KeywordEntryStep;
