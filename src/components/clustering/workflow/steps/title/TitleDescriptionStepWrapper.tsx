
import React from 'react';
import TitleDescriptionStep from '../TitleDescriptionStep';
import type { TitleDescriptionResponse } from '@/types/clustering';

interface TitleDescriptionStepWrapperProps {
  data: TitleDescriptionResponse;
  onBack: () => void;
  onClose: () => void;
  onCreateBlog: (selectedItem: any) => void;
}

const TitleDescriptionStepWrapper: React.FC<TitleDescriptionStepWrapperProps> = ({
  data,
  onBack,
  onClose,
  onCreateBlog
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <TitleDescriptionStep
        data={data}
        onBack={onBack}
        onClose={onClose}
        onCreateBlog={onCreateBlog}
      />
    </div>
  );
};

export default TitleDescriptionStepWrapper;
