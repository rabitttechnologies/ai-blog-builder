
import React from 'react';
import ClusteringStep from '../ClusteringStep';
import type { ClusteringResponse, GroupingOption } from '@/types/clustering';

interface ClusteringStepWrapperProps {
  clusteringData: ClusteringResponse;
  groupBy: GroupingOption;
  filters: any;
  selectedCount: number;
  onUpdateKeyword: (clusterName: string, keyword: string, updates: any) => void;
  onSetFilters: (filters: any) => void;
  onSetGroupBy: (groupBy: GroupingOption) => void;
  onClose: () => void;
  onBack?: () => void;
  onGenerateTitles: () => void;
}

const ClusteringStepWrapper: React.FC<ClusteringStepWrapperProps> = ({
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
      <ClusteringStep
        clusteringData={clusteringData}
        groupBy={groupBy}
        filters={filters}
        selectedCount={selectedCount}
        onUpdateKeyword={onUpdateKeyword}
        onSetFilters={onSetFilters}
        onSetGroupBy={onSetGroupBy}
        onClose={onClose}
        onBack={onBack}
        onGenerateTitles={onGenerateTitles}
      />
    </div>
  );
};

export default ClusteringStepWrapper;
