
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import KeywordSearchForm from './KeywordSearchForm';
import SelectableSearchResults from './SelectableSearchResults';

interface CreateBlogDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBlogDialog: React.FC<CreateBlogDialogProps> = ({ isOpen, onClose }) => {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [workflowId, setWorkflowId] = useState<string>('');
  
  const handleSearchComplete = (data: any) => {
    setSearchResults(data);
    setKeyword(data.keyword || '');
    setWorkflowId(data.workflowId || crypto.randomUUID());
  };
  
  const handleClose = () => {
    setSearchResults(null);
    setKeyword('');
    setWorkflowId('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {!searchResults ? (
          <>
            <DialogHeader>
              <DialogTitle>Create New Blog</DialogTitle>
            </DialogHeader>
            <KeywordSearchForm 
              onComplete={handleSearchComplete} 
              onCancel={handleClose} 
            />
          </>
        ) : (
          <SelectableSearchResults 
            data={searchResults} 
            keyword={keyword}
            workflowId={workflowId}
            onClose={handleClose} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogDialog;
