
import React from 'react';
import { Button } from '@/components/ui/Button';
import ClusteringResults from '../../ClusteringResults';
import type { ClusteringResponse } from '@/types/clustering';

interface ClusteringStepProps {
  clusteringData: ClusteringResponse;
  groupBy: string;
  filters: any;
  selectedCount: number;
  onUpdateKeyword: (clusterName: string, keyword: string, updates: any) => void;
  onSetFilters: (filters: any) => void;
  onSetGroupBy: (groupBy: string) => void;
  onClose: () => void;
  onBack?: () => void;
  onGenerateTitles: () => void;
}

const ClusteringStep: React.FC<ClusteringStepProps> = ({
  clusteringData,
  groupBy,
  filters,
  selectedCount,
  onUpdateKeyword,
  onSetFilters,
  onSetGroupBy,
  onClose,
  onBack,
  onGenerateTitles
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <ClusteringResults
        clusters={clusteringData.clusters}
        workflowId={clusteringData.workflowId}
        executionId={clusteringData.executionId}
        groupBy={groupBy}
        filters={filters}
        onUpdateKeyword={onUpdateKeyword}
        onSetFilters={onSetFilters}
        onSetGroupBy={onSetGroupBy}
        onClose={onClose}
        onBack={onBack}
        selectedCount={selectedCount}
        onGenerateTitles={onGenerateTitles}
      />
    </div>
  );
};

export default ClusteringStep;
