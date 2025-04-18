
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TranslationWorkflow, TranslationWorkflowInsert } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

export const useTranslationWorkflow = (blogId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const requestTranslation = useMutation({
    mutationFn: async (data: TranslationWorkflowInsert) => {
      const { data: result, error } = await supabase
        .from('translation_workflows')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast({
        title: "Translation requested",
        description: "The translation process has been initiated.",
      });
    },
    onError: (error) => {
      console.error('Translation request failed:', error);
      toast({
        title: "Error",
        description: "Failed to request translation. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    requestTranslation,
  };
};
