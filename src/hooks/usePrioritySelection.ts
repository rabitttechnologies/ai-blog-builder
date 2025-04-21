
import { useState } from 'react';

export const usePrioritySelection = (maxPriority = 10) => {
  const [priorities, setPriorities] = useState<Record<string, number>>({});

  // Find the next available priority in sequence (1-10)
  const findNextAvailablePriority = (): number | null => {
    const usedPriorities = Object.values(priorities);
    
    // Look for the first gap in the sequence
    for (let i = 1; i <= maxPriority; i++) {
      if (!usedPriorities.includes(i)) {
        return i;
      }
    }
    
    return null; // No available priorities
  };

  // Assign priority to an item
  const assignPriority = (itemId: string): boolean => {
    const nextPriority = findNextAvailablePriority();
    
    if (nextPriority !== null) {
      setPriorities(prev => ({
        ...prev,
        [itemId]: nextPriority
      }));
      return true;
    }
    
    return false;
  };

  // Remove priority from an item
  const removePriority = (itemId: string): void => {
    const priorityToRemove = priorities[itemId];
    
    if (priorityToRemove) {
      // Create a new priorities object without the removed item
      const { [itemId]: _, ...restPriorities } = priorities;
      
      // Adjust priorities to maintain sequence
      const updatedPriorities = Object.entries(restPriorities).reduce((acc, [id, priority]) => {
        // If priority is greater than the removed one, decrement it
        if (priority > priorityToRemove) {
          acc[id] = priority - 1;
        } else {
          acc[id] = priority;
        }
        return acc;
      }, {} as Record<string, number>);
      
      setPriorities(updatedPriorities);
    }
  };

  // Get items sorted by priority
  const getPrioritizedItems = <T extends { id: string }>(items: T[]): T[] => {
    return [...items].sort((a, b) => {
      const priorityA = priorities[a.id] || Number.MAX_SAFE_INTEGER;
      const priorityB = priorities[b.id] || Number.MAX_SAFE_INTEGER;
      return priorityA - priorityB;
    });
  };

  // Check if an item has a priority
  const hasPriority = (itemId: string): boolean => {
    return !!priorities[itemId];
  };

  // Get priority of an item
  const getPriority = (itemId: string): number | undefined => {
    return priorities[itemId];
  };

  return {
    priorities,
    assignPriority,
    removePriority,
    hasPriority,
    getPriority,
    getPrioritizedItems
  };
};

export default usePrioritySelection;
