
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import KeywordItem from './KeywordItem';
import FilterControls from './FilterControls';
import { Check, Filter, SortDesc, X } from 'lucide-react';
import type { ClusterGroup, ClusteringFilters, GroupingOption, ClusterItem } from '@/types/clustering';

interface ClusteringResultsProps {
  clusters: ClusterGroup[];
  workflowId: string;
  executionId: string;
  groupBy: GroupingOption;
  filters: ClusteringFilters;
  selectedCount: number;
  onUpdateKeyword: (clusterName: string, keyword: string, updates: Partial<ClusterItem>) => void;
  onSetFilters: (filters: ClusteringFilters) => void;
  onSetGroupBy: (groupBy: GroupingOption) => void;
  onClose: () => void;
  onGenerateTitles: () => void;
}

const ClusteringResults: React.FC<ClusteringResultsProps> = ({
  clusters,
  workflowId,
  executionId,
  groupBy,
  filters,
  selectedCount,
  onUpdateKeyword,
  onSetFilters,
  onSetGroupBy,
  onClose,
  onGenerateTitles
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'card' | 'table'>('card');
  
  if (!clusters || clusters.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">No clusters found</h3>
        <p className="text-muted-foreground mb-4">No clustering data is available for this analysis.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  const toggleFilters = () => setShowFilters(!showFilters);

  // Get unique search intents for filters
  const searchIntents = Array.from(
    new Set(
      clusters.flatMap(cluster => 
        cluster.items
          .map(item => item.searchIntent)
          .filter((intent): intent is string => intent !== null && intent !== undefined)
      )
    )
  );

  // Get unique categories for filters
  const categories = Array.from(
    new Set(
      clusters.flatMap(cluster => 
        cluster.items
          .map(item => item.category)
          .filter((category): category is string => category !== null && category !== undefined)
      )
    )
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-semibold">Keyword Clustering Results</h3>
          <p className="text-sm text-muted-foreground">
            Workflow ID: {workflowId} | Execution ID: {executionId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleFilters} size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button variant="outline" onClick={onClose} size="sm">
            Close Results
          </Button>
        </div>
      </div>

      {/* Tabs for view selection */}
      <Tabs defaultValue="card" onValueChange={(v) => setView(v as 'card' | 'table')}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="card">Card View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Group By:</span>
            <Select value={groupBy} onValueChange={(value) => onSetGroupBy(value as GroupingOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Grouping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clusterName">Cluster Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="intentPattern">Intent Pattern</SelectItem>
                <SelectItem value="coreTopic">Core Topic</SelectItem>
                <SelectItem value="searchIntent">Search Intent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter controls */}
        {showFilters && (
          <FilterControls 
            filters={filters} 
            onSetFilters={onSetFilters}
            searchIntents={searchIntents}
            categories={categories}
          />
        )}

        {/* Card View */}
        <TabsContent value="card" className="mt-6">
          <div className="space-y-6">
            {clusters.map((cluster, index) => (
              <Accordion key={index} type="single" collapsible defaultValue={`item-${index}`}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger>
                    <div className="flex flex-col items-start text-left">
                      <div className="font-semibold">{cluster.clusterName}</div>
                      <div className="text-sm text-muted-foreground">
                        {cluster.items.length} keywords · {cluster.coreTopic}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="border-0 shadow-none">
                      <CardHeader className="p-0 pb-4">
                        <CardDescription>
                          <strong>Intent Pattern:</strong> {cluster.intentPattern}<br />
                          <strong>Core Topic:</strong> {cluster.coreTopic}<br />
                          <strong>Reasoning:</strong> {cluster.reasoning}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="space-y-3">
                          {cluster.items.map((item, itemIndex) => (
                            <KeywordItem
                              key={itemIndex}
                              item={item}
                              clusterName={cluster.clusterName}
                              onUpdateKeyword={onUpdateKeyword}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table" className="mt-6">
          {clusters.map((cluster, index) => (
            <Card key={index} className="mb-6">
              <CardHeader>
                <CardTitle>{cluster.clusterName}</CardTitle>
                <CardDescription>
                  <strong>Intent Pattern:</strong> {cluster.intentPattern}<br />
                  <strong>Core Topic:</strong> {cluster.coreTopic}<br />
                  <strong>Reasoning:</strong> {cluster.reasoning}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Priority</TableHead>
                        <TableHead>Keyword</TableHead>
                        <TableHead className="text-right">Monthly Vol</TableHead>
                        <TableHead className="text-right">Difficulty</TableHead>
                        <TableHead className="text-right">Competition</TableHead>
                        <TableHead className="text-right">Intent</TableHead>
                        <TableHead className="text-right">Category</TableHead>
                        <TableHead className="text-right">CPC</TableHead>
                        <TableHead className="w-[180px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cluster.items.map((item, itemIndex) => (
                        <TableRow key={itemIndex}>
                          <TableCell>
                            <Select 
                              value={item.priority ? item.priority.toString() : "0"} 
                              onValueChange={(value) => onUpdateKeyword(cluster.clusterName, item.keyword, { priority: parseInt(value) })}
                            >
                              <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="#" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">-</SelectItem>
                                {Array.from({ length: 10 }).map((_, i) => (
                                  <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.isEditing ? (
                              <div className="flex items-center">
                                <Input 
                                  value={item.keyword} 
                                  onChange={(e) => onUpdateKeyword(cluster.clusterName, item.keyword, { keyword: e.target.value })}
                                  className="h-8 mr-2"
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 w-8" 
                                  onClick={() => onUpdateKeyword(cluster.clusterName, item.keyword, { isEditing: false })}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="cursor-pointer hover:text-primary" 
                                onClick={() => onUpdateKeyword(cluster.clusterName, item.keyword, { isEditing: true })}
                              >
                                {item.keyword}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.monthlySearchVolume !== null
                              ? item.monthlySearchVolume.toLocaleString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.keywordDifficulty !== null ? item.keywordDifficulty : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.competition || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.searchIntent || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.category || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.cpc !== null ? `$${item.cpc.toFixed(2)}` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.status || 'Select for Blog Creation'}
                              onValueChange={(value) => onUpdateKeyword(cluster.clusterName, item.keyword, { 
                                status: value as 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future' 
                              })}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Select for Blog Creation">Select for Blog Creation</SelectItem>
                                <SelectItem value="Reject for Blog Creation">Reject for Blog Creation</SelectItem>
                                <SelectItem value="Keep for Future">Keep for Future</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Bottom control bar with selected count */}
      <div className="sticky bottom-4 left-0 right-0 z-10 flex justify-center">
        <div className="bg-background border rounded-full shadow-lg px-4 py-2 flex items-center">
          <span className="font-medium mr-4">
            {selectedCount}/10 keywords selected
          </span>
          <Button 
            onClick={onGenerateTitles} 
            disabled={selectedCount < 10}
            size="sm"
          >
            Create Title and Description
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClusteringResults;
