
import React from 'react';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/context/auth';
import { useSearchFormData } from '@/hooks/useSearchFormData';
import { useKeywordSearch } from '@/hooks/useKeywordSearch';
import FormFields from './keyword-search/FormFields';
import FormActions from './keyword-search/FormActions';
import LoadingIndicator from './keyword-search/LoadingIndicator';

interface KeywordSearchFormProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const KeywordSearchForm: React.FC<KeywordSearchFormProps> = ({ onComplete, onCancel }) => {
  const { user } = useAuth();
  const { form, session, generateWorkflowId, getSessionId } = useSearchFormData(onCancel);
  
  const { isLoading, timeoutReached, submitSearch } = useKeywordSearch({
    getSessionId,
    generateWorkflowId,
    userId: user?.id || '',
    onComplete
  });

  const onSubmit = async (formData: any) => {
    if (!user?.id || !session) {
      return;
    }
    
    await submitSearch(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFields form={form} isLoading={isLoading} />
        
        <FormActions 
          isLoading={isLoading}
          timeoutReached={timeoutReached}
          onCancel={onCancel}
        />

        <LoadingIndicator isLoading={isLoading} />
      </form>
    </Form>
  );
};

export default KeywordSearchForm;
