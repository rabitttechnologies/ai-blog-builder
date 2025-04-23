
import React from 'react';
import LoadingOverlay from '@/components/blog/LoadingOverlay';

interface WorkflowLoadingOverlayProps {
  isVisible: boolean;
  step: string;
}

const WorkflowLoadingOverlay: React.FC<WorkflowLoadingOverlayProps> = ({
  isVisible,
  step
}) => {
  if (!isVisible || step !== 'clustering') return null;

  return (
    <LoadingOverlay 
      message="Our AI Agent is Creating Title and Short Description for Your Keywords" 
      subMessage="This may take a minute or two to complete" 
    />
  );
};

export default WorkflowLoadingOverlay;
