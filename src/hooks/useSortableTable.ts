
import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig<T extends string> {
  field: T;
  direction: SortDirection;
}

export function useSortableTable<T extends Record<K, any>, K extends string>(
  data: T[],
  initialSortField: K,
  initialSortDirection: SortDirection = 'asc'
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<K>>({
    field: initialSortField,
    direction: initialSortDirection
  });

  const requestSort = (field: K) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.field === field) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ field, direction });
  };

  const sortedData = useMemo(() => {
    const sortableData = [...data];
    
    sortableData.sort((a, b) => {
      // Handle null values
      if (a[sortConfig.field] === null && b[sortConfig.field] === null) return 0;
      if (a[sortConfig.field] === null) return 1;
      if (b[sortConfig.field] === null) return -1;
      
      // Compare based on type
      if (typeof a[sortConfig.field] === 'string') {
        return sortConfig.direction === 'asc'
          ? (a[sortConfig.field] as string).localeCompare(b[sortConfig.field] as string)
          : (b[sortConfig.field] as string).localeCompare(a[sortConfig.field] as string);
      }
      
      // For numeric values
      return sortConfig.direction === 'asc'
        ? (a[sortConfig.field] as number) - (b[sortConfig.field] as number)
        : (b[sortConfig.field] as number) - (a[sortConfig.field] as number);
    });
    
    return sortableData;
  }, [data, sortConfig]);

  return { sortedData, requestSort, sortConfig };
}

export default useSortableTable;
