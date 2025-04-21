
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { ClusterGroup, ClusterItem } from '@/types/clustering';

interface KeywordMergerProps {
  clusters: ClusterGroup[];
  onMergeKeywords: (keywords: string[]) => void;
  onClose: () => void;
}

const KeywordMerger: React.FC<KeywordMergerProps> = ({ clusters, onMergeKeywords, onClose }) => {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  
  // Flatten all keywords for selection
  const availableKeywords = clusters.flatMap(cluster => 
    cluster.items.map(item => ({
      keyword: item.keyword,
      clusterName: cluster.clusterName
    }))
  );
  
  // Filter keywords by selected cluster
  const filteredKeywords = selectedCluster 
    ? availableKeywords.filter(item => item.clusterName === selectedCluster)
    : availableKeywords;
  
  // Get all cluster names
  const clusterNames = Array.from(new Set(clusters.map(cluster => cluster.clusterName)));
  
  const handleSelectKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) return;
    
    if (selectedKeywords.length < 3) {
      setSelectedKeywords(prev => [...prev, keyword]);
    }
  };
  
  const handleRemoveKeyword = (keyword: string) => {
    setSelectedKeywords(prev => prev.filter(k => k !== keyword));
  };
  
  const handleMerge = () => {
    if (selectedKeywords.length > 0) {
      onMergeKeywords(selectedKeywords);
      onClose();
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Merge Keywords</CardTitle>
        <CardDescription>
          Select up to 3 keywords to merge together for your blog content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Filter by Cluster</h3>
          <Select 
            value={selectedCluster || ''} 
            onValueChange={(value) => setSelectedCluster(value || null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Clusters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Clusters</SelectItem>
              {clusterNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Selected Keywords ({selectedKeywords.length}/3)</h3>
          
          {selectedKeywords.length === 0 ? (
            <p className="text-sm text-muted-foreground">No keywords selected yet</p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedKeywords.map(keyword => (
                <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <button 
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="h-4 w-4 rounded-full hover:bg-destructive/20 inline-flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          {selectedKeywords.length > 0 && (
            <div className="p-3 bg-muted rounded-md mb-4">
              <h4 className="text-sm font-medium mb-1">Merged Result:</h4>
              <p className="text-sm">{selectedKeywords.join(', ')}</p>
            </div>
          )}
        </div>
        
        <div className="border rounded-md max-h-60 overflow-y-auto">
          <div className="p-3 bg-muted font-medium text-sm">Available Keywords</div>
          <div className="divide-y">
            {filteredKeywords.map((item, index) => (
              <div 
                key={`${item.keyword}-${index}`}
                className={`p-3 hover:bg-accent/5 cursor-pointer ${
                  selectedKeywords.includes(item.keyword) ? 'bg-primary/10' : ''
                } ${
                  selectedKeywords.length >= 3 && !selectedKeywords.includes(item.keyword) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
                onClick={() => {
                  if (selectedKeywords.includes(item.keyword)) {
                    handleRemoveKeyword(item.keyword);
                  } else if (selectedKeywords.length < 3) {
                    handleSelectKeyword(item.keyword);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{item.keyword}</span>
                  <Badge variant="outline" size="sm">{item.clusterName}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleMerge}
            disabled={selectedKeywords.length === 0}
          >
            Merge Keywords
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordMerger;
