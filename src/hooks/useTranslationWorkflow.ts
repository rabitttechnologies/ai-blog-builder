
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TranslationWorkflow, TranslationWorkflowInsert } from '@/types/blog';

export const useTranslationWorkflow = (blogId?: string) => {
  const queryClient = useQueryClient();

  const getTranslationWorkflow = async (id: string) => {
    const { data, error } = await supabase
      .from('translation_workflows')
      .select('*')
      .eq('blog_id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  };

  const { data: workflow, isLoading } = useQuery({
    queryKey: ['translation_workflow', blogId],
    queryFn: () => blogId ? getTranslationWorkflow(blogId) : null,
    enabled: !!blogId,
  });

  const requestTranslation = useMutation({
    mutationFn: async (newWorkflow: TranslationWorkflowInsert) => {
      const { data, error } = await supabase
        .from('translation_workflows')
        .insert(newWorkflow)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translation_workflow'] });
    },
  });

  return {
    workflow,
    isLoading,
    requestTranslation,
  };
};
