
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/auth';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { Separator } from '@/components/ui/separator';
import ArticleLoadingOverlay from '@/components/articleWriter/ArticleLoadingOverlay';

// Form schema
const formSchema = z.object({
  keyword: z.string().min(1, "Keyword is required").max(100),
  country: z.string().min(1, "Country is required"),
  language: z.string().min(1, "Language is required"),
  contentType: z.string().min(1, "Content type is required"),
});

type FormValues = z.infer<typeof formSchema>;

// Country options
const countryOptions = [
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Canada', value: 'CA' },
  { label: 'Australia', value: 'AU' },
  { label: 'India', value: 'IN' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Italy', value: 'IT' },
  { label: 'Spain', value: 'ES' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Japan', value: 'JP' },
];

// Language options
const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Italian', value: 'it' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Hindi', value: 'hi' },
];

// Content type options
const contentTypeOptions = [
  { label: 'Blog Post', value: 'Blog Post' },
  { label: 'News Article', value: 'News Article' },
  { label: 'How-to Guide', value: 'How to Guide' },
  { label: 'Comparison Blog', value: 'Comparison Blog' },
  { label: 'Technical Article', value: 'Technical Article' },
  { label: 'Product Reviews', value: 'Product Reviews' },
];

const KeywordEntryStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    updateKeywordForm, 
    keywordForm, 
    setCurrentStep, 
    setKeywordResponse,
    sessionId,
    workflowId,
    setIsLoading,
    isLoading
  } = useArticleWriter();
  
  const [error, setError] = useState<string | null>(null);

  // Initialize form with existing values from context
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: keywordForm.keyword,
      country: keywordForm.country,
      language: keywordForm.language,
      contentType: keywordForm.contentType,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Update form values in context
      updateKeywordForm({
        keyword: values.keyword,
        country: values.country,
        language: values.language,
        contentType: values.contentType as any
      });
      
      setCurrentStep(1);
      
      // Prepare payload
      const payload = {
        keyword: values.keyword,
        country: values.country,
        language: values.language,
        contentType: values.contentType,
        userId: user?.id || 'anonymous',
        sessionId: sessionId,
        workflowId: workflowId,
      };
      
      console.log("Submitting keyword research payload:", payload);
      
      // Add timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout
      
      const response = await fetch('https://n8n.agiagentworld.com/webhook/keywordresearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const responseText = await response.text();
      
      // Check if response is empty
      if (!responseText) {
        throw new Error("Server returned an empty response");
      }
      
      try {
        const responseData = JSON.parse(responseText);
        console.log("Keyword research response:", responseData);
        
        // Store the response in context
        setKeywordResponse(responseData);
        
        // Navigate to the next step
        navigate('/article-writer/select-keywords');
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError, "Raw response:", responseText);
        throw new Error("Invalid response format from server");
      }
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(`Failed to submit: ${err.message}`);
      }
      console.error('Error submitting keyword:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Enter Keyword - Article Writer</title>
      </Helmet>
      <div className="container max-w-3xl py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Enter a Keyword</h1>
          <p className="text-gray-600">
            To start writing your article, enter a keyword and select your preferences.
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Keyword Information</CardTitle>
            <CardDescription>
              Provide details about the keyword you want to target.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="keyword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keyword</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your target keyword" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countryOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languageOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select content type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contentTypeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Please wait..." : "Continue"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {isLoading && (
          <ArticleLoadingOverlay 
            message="We're Getting Past Search Data for Your Keyword" 
            subMessage="This may take a minute or two"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default KeywordEntryStep;
