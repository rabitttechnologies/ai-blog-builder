import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

// Common languages for dropdown
const commonLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' }
];

// Countries for dropdown (abbreviated list - would be expanded in production)
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' }
  // In a real implementation, this would include all 200+ countries
];

// Create an array of numbers from 1 to 30 for depth and limit dropdowns
const numberOptions = Array.from({ length: 30 }, (_, i) => i + 1);

// Form schema with validation
const formSchema = z.object({
  keyword: z.string().min(3, 'Keyword must be at least 3 characters').max(100, 'Keyword must be less than 100 characters'),
  language: z.string().min(1, 'Please select a language'),
  country: z.string().min(1, 'Please select a country'),
  depth: z.string().min(1, 'Please select a depth'),
  limit: z.string().min(1, 'Please select a limit'),
});

type FormValues = z.infer<typeof formSchema>;

interface KeywordSearchFormProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const KeywordSearchForm: React.FC<KeywordSearchFormProps> = ({ onComplete, onCancel }) => {
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [profileData, setProfileData] = useState<{ language?: string; country?: string } | null>(null);
  const [researchSettings, setResearchSettings] = useState<{ depth?: string; limit?: string } | null>(null);

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
      language: '',
      country: '',
      depth: '',
      limit: '',
    },
  });

  // Fetch user profile and research settings on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id || !session) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to use this feature.",
          variant: "destructive"
        });
        onCancel();
        return;
      }

      try {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('language, country')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile data:', profileError);
        } else if (profile) {
          setProfileData(profile);
          
          // Set form defaults if available
          if (profile.language) {
            form.setValue('language', profile.language);
          }
          if (profile.country) {
            form.setValue('country', profile.country);
          }
        }

        // Fetch research settings - using the correct table name
        const { data: research, error: researchError } = await supabase
          .from('Primary Research Table')
          .select('Depth, Limit')
          .eq('uuid', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (researchError && researchError.code !== 'PGRST116') {
          console.error('Error fetching research settings:', researchError);
        } else if (research) {
          // Set research settings with the correct column names
          setResearchSettings({
            depth: research.Depth?.toString() || '',
            limit: research.Limit?.toString() || ''
          });
          
          // Set form defaults if available
          if (research.Depth) {
            form.setValue('depth', research.Depth.toString());
          }
          if (research.Limit) {
            form.setValue('limit', research.Limit.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user, session, form, toast, onCancel]);

  // Generate a unique workflow ID
  const generateWorkflowId = () => {
    return crypto.randomUUID();
  };

  // Get current session ID
  const getSessionId = () => {
    return session?.access_token?.substring(0, 16) || 'anonymous-session';
  };

  // Submit form data to webhook
  const onSubmit = async (formData: FormValues) => {
    if (!user?.id || !session) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive"
      });
      onCancel();
      return;
    }

    setIsLoading(true);
    setTimeoutReached(false);

    const workflowId = generateWorkflowId();
    const sessionId = getSessionId();

    const payload = {
      keyword: formData.keyword,
      language: formData.language,
      country: formData.country,
      depth: Number(formData.depth),
      limit: Number(formData.limit),
      uuid: user.id,
      workflowId,
      sessionId
    };

    try {
      // Set up timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds

      const response = await fetch('https://n8n.agiagentworld.com/webhook/googlesearchresponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      const responseData = await response.json();

      // Process successful response - filtering out null values
      if (responseData && responseData.data) {
        // Only include fields that have non-null values
        const filteredData = Object.fromEntries(
          Object.entries(responseData.data).filter(([_, value]) => value !== null)
        );

        onComplete({
          ...filteredData,
          keyword: formData.keyword,
          workflowId
        });
      } else {
        toast({
          title: "Empty Response",
          description: "The search returned no results. Please try a different keyword.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setTimeoutReached(true);
        toast({
          title: "Request Timeout",
          description: "The request took too long to complete. Please try again or try another keyword.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Request Failed",
          description: error.message || "Failed to fetch search data.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keyword<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter keyword to research" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language<span className="text-red-500">*</span></FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {commonLanguages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
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
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country<span className="text-red-500">*</span></FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="depth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Depth<span className="text-red-500">*</span></FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select depth" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {numberOptions.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
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
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limit<span className="text-red-500">*</span></FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {numberOptions.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          {timeoutReached ? (
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              Try Again
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="flex justify-center mb-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Fetching search data... This may take up to 60 seconds.
            </p>
          </div>
        )}
      </form>
    </Form>
  );
};

export default KeywordSearchForm;
