
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
  console.log("TitleDescriptionStep - Rendering with data:", data);
  
  // Enhanced normalization logic to handle different possible response structures
  let normalizedData = null;
  
  if (Array.isArray(data)) {
    console.log("TitleDescriptionStep - Data is an array, extracting first element");
    normalizedData = data[0];
  } else if (data && typeof data === 'object') {
    console.log("TitleDescriptionStep - Data is an object");
    normalizedData = data;
  }
  
  // Additional checks for data.data structure which is sometimes returned
  if (!normalizedData && data && data.data) {
    console.log("TitleDescriptionStep - Using data.data property");
    if (Array.isArray(data.data)) {
      normalizedData = data.data.length > 0 ? { data: data.data } : null;
    } else {
      normalizedData = { data: data.data };
    }
  }
  
  console.log("TitleDescriptionStep - Using normalized data:", normalizedData);
  
  // Check if we have valid data to render
  if (!normalizedData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center mb-4 flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Keywords
          </Button>
          <h2 className="text-xl sm:text-2xl font-semibold">No Title Options Available</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No title options were found. Please go back and try again.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center mb-4 flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Keywords
        </Button>
        <h2 className="text-xl sm:text-2xl font-semibold">Blog Title Options</h2>
      </div>
      
      <TitleDescriptionResults
        data={normalizedData}
        onUpdateItem={() => {}}
        onCreateBlog={onCreateBlog}
        onClose={onClose}
      />
    </div>
  );
};

export default TitleDescriptionStep;
