
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import TitleDescriptionResults from '../../TitleDescriptionResults';
import type { TitleDescriptionResponse } from '@/types/clustering';

interface TitleDescriptionStepProps {
  data: TitleDescriptionResponse;
  onBack: () => void;
  onClose: () => void;
  onCreateBlog: (selectedItem: any) => void;
}

const TitleDescriptionStep: React.FC<TitleDescriptionStepProps> = ({
  data,
  onBack,
  onClose,
  onCreateBlog
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Keywords
        </Button>
        <h2 className="text-2xl font-semibold">Blog Title Options</h2>
      </div>
      
      <TitleDescriptionResults
        data={data}
        onUpdateItem={() => {}}
        onCreateBlog={onCreateBlog}
        onClose={onClose}
      />
    </div>
  );
};

export default TitleDescriptionStep;
