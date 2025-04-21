
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { ClusterGroup, ClusterItem } from '@/types/clustering';

type SortDirection = 'asc' | 'desc' | null;

type SortableField = 'keyword' | 'monthlySearchVolume' | 'keywordDifficulty' | 'competition' | 'cpc' | 'category' | 'status';

interface SortState {
  field: SortableField;
  direction: SortDirection;
}

interface ClusterTableViewProps {
  clusters: ClusterGroup[];
  onUpdateKeyword: (clusterName: string, keyword: string, updates: Partial<ClusterItem>) => void;
}

const ClusterTableView: React.FC<ClusterTableViewProps> = ({ clusters, onUpdateKeyword }) => {
  const [sort, setSort] = useState<SortState>({ field: 'keyword', direction: 'asc' });
  
  // Track used priorities across all clusters
  const usedPriorities = useMemo(() => {
    const priorities: number[] = [];
    
    clusters.forEach(cluster => {
      cluster.items.forEach(item => {
        if (item.priority && !priorities.includes(item.priority)) {
          priorities.push(item.priority);
        }
      });
    });
    
    return priorities.sort((a, b) => a - b);
  }, [clusters]);
  
  // Handle sorting click
  const handleSort = (field: SortableField) => {
    if (sort.field === field) {
      // Toggle direction or reset
      setSort({
        field,
        direction: sort.direction === 'asc' ? 'desc' : sort.direction === 'desc' ? null : 'asc'
      });
    } else {
      // New field, default to ascending
      setSort({ field, direction: 'asc' });
    }
  };
  
  // Helper for sort indicators
  const getSortIcon = (field: SortableField) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };
  
  // Flatten and sort all keywords from all clusters
  const allKeywords = useMemo(() => {
    // Flatten all items into a single array with cluster info
    const items: (ClusterItem & { clusterName: string })[] = [];
    
    clusters.forEach(cluster => {
      cluster.items.forEach(item => {
        items.push({
          ...item,
          clusterName: cluster.clusterName
        });
      });
    });
    
    // First, separate prioritized items
    const prioritizedItems = items.filter(item => item.priority && item.priority > 0);
    const nonPrioritizedItems = items.filter(item => !item.priority || item.priority <= 0);
    
    // Sort prioritized items by priority
    prioritizedItems.sort((a, b) => {
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      return priorityA - priorityB;
    });
    
    // Sort non-prioritized items based on current sort
    if (sort.direction !== null) {
      nonPrioritizedItems.sort((a, b) => {
        // Helper function for null-safe comparison
        const compare = (valA: any, valB: any, numeric = false) => {
          // Handle null values
          if (valA === null && valB === null) return 0;
          if (valA === null) return 1;
          if (valB === null) return -1;

          // Compare based on type
          if (numeric) {
            return sort.direction === 'asc' ? valA - valB : valB - valA;
          } else {
            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            return sort.direction === 'asc' 
              ? strA.localeCompare(strB) 
              : strB.localeCompare(strA);
          }
        };

        // Sort based on field
        switch (sort.field) {
          case 'keyword':
            return compare(a.keyword, b.keyword);
          case 'monthlySearchVolume':
            return compare(a.monthlySearchVolume, b.monthlySearchVolume, true);
          case 'keywordDifficulty':
            return compare(a.keywordDifficulty, b.keywordDifficulty, true);
          case 'competition':
            return compare(a.competition, b.competition);
          case 'cpc':
            return compare(a.cpc, b.cpc, true);
          case 'category':
            return compare(a.category, b.category);
          case 'status':
            return compare(a.status, b.status);
          default:
            return 0;
        }
      });
    }
    
    // Combine prioritized and non-prioritized items
    return [...prioritizedItems, ...nonPrioritizedItems];
  }, [clusters, sort]);

  // Generate sequential priority array
  const getAvailablePriorities = (item: ClusterItem) => {
    // Start from 1 or the next available number after the highest used priority
    const highestUsedPriority = usedPriorities.length > 0 
      ? Math.max(...usedPriorities) 
      : 0;
      
    // The next available priority is the highest + 1, unless there are gaps
    // For sequential selection, we only offer the next number in sequence
    const nextPriority = highestUsedPriority + 1;
    
    // Only show priorities up to 10
    const priorities = nextPriority <= 10 ? [nextPriority] : [];
    
    // If this item already has a priority, include it as well
    if (item.priority && !usedPriorities.includes(item.priority) && item.priority !== nextPriority) {
      priorities.push(item.priority);
    }
    
    return priorities;
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 whitespace-nowrap"
              onClick={() => handleSort('keyword')}
            >
              <div className="flex items-center gap-1">
                Keyword {getSortIcon('keyword')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 whitespace-nowrap"
              onClick={() => handleSort('monthlySearchVolume')}
            >
              <div className="flex items-center gap-1">
                Monthly Volume {getSortIcon('monthlySearchVolume')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 whitespace-nowrap"
              onClick={() => handleSort('keywordDifficulty')}
            >
              <div className="flex items-center gap-1">
                Difficulty {getSortIcon('keywordDifficulty')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 whitespace-nowrap"
              onClick={() => handleSort('competition')}
            >
              <div className="flex items-center gap-1">
                Competition {getSortIcon('competition')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 whitespace-nowrap"
              onClick={() => handleSort('category')}
            >
              <div className="flex items-center gap-1">
                Category {getSortIcon('category')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 whitespace-nowrap"
              onClick={() => handleSort('cpc')}
            >
              <div className="flex items-center gap-1">
                CPC {getSortIcon('cpc')}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 whitespace-nowrap"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-1">
                Status {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead className="whitespace-nowrap">Priority</TableHead>
            <TableHead className="whitespace-nowrap">Cluster</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allKeywords.map((item) => {
            const availablePriorities = getAvailablePriorities(item);
            
            return (
              <TableRow key={`${item.clusterName}-${item.keyword}`}>
                <TableCell className="font-medium">{item.keyword}</TableCell>
                <TableCell>{item.monthlySearchVolume || 'N/A'}</TableCell>
                <TableCell>{item.keywordDifficulty || 'N/A'}</TableCell>
                <TableCell>{item.competition || 'N/A'}</TableCell>
                <TableCell>
                  {item.category ? (
                    <Badge variant="outline">{item.category}</Badge>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>${item.cpc?.toFixed(2) || 'N/A'}</TableCell>
                <TableCell>
                  <Select
                    value={item.status || 'Select for Blog Creation'}
                    onValueChange={(value) => {
                      // If moving away from selected status, clear priority
                      if (item.status === 'Select for Blog Creation' && value !== 'Select for Blog Creation') {
                        onUpdateKeyword(item.clusterName, item.keyword, { 
                          status: value as 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future',
                          priority: undefined
                        });
                      } else {
                        onUpdateKeyword(item.clusterName, item.keyword, { 
                          status: value as 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future'
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select for Blog Creation">Select for Blog</SelectItem>
                      <SelectItem value="Reject for Blog Creation">Reject for Blog</SelectItem>
                      <SelectItem value="Keep for Future">Keep for Future</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {item.status === 'Select for Blog Creation' && (
                    <Select
                      value={item.priority?.toString() || ''}
                      onValueChange={(value) => {
                        const priority = parseInt(value, 10);
                        onUpdateKeyword(item.clusterName, item.keyword, { priority });
                      }}
                      disabled={availablePriorities.length === 0}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePriorities.length === 0 ? (
                          <SelectItem value="" disabled>No available priorities</SelectItem>
                        ) : (
                          availablePriorities.map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>{item.clusterName}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClusterTableView;
