
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form schema with validation
export const formSchema = z.object({
  keyword: z.string().min(3, 'Keyword must be at least 3 characters').max(100, 'Keyword must be less than 100 characters'),
  language: z.string().min(1, 'Please select a language'),
  country: z.string().min(1, 'Please select a country'),
  depth: z.string().min(1, 'Please select a depth'),
  limit: z.string().min(1, 'Please select a limit'),
});

export type FormValues = z.infer<typeof formSchema>;

export const useSearchFormData = (onCancel: () => void) => {
  const { toast } = useToast();
  const { user, session } = useAuth();
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

  return {
    form,
    user,
    session,
    generateWorkflowId,
    getSessionId
  };
};
