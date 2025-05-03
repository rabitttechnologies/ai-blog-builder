
// Utility functions for handling selections in the UI

/**
 * Check if an item is selected in a given heading
 */
export function isItemSelected(selections: Record<string, any[]>, heading: string, item: any): boolean {
  if (!selections || !selections[heading]) return false;
  
  // For text items
  if (typeof item === 'string') {
    return selections[heading].includes(item);
  }
  
  // For object items with 'text' property (keywords)
  if (item && item.text) {
    return selections[heading].some(selected => 
      selected === item.text || selected.text === item.text
    );
  }
  
  // For other object items, try to match by stringification
  const itemStr = JSON.stringify(item);
  return selections[heading].some(selected => JSON.stringify(selected) === itemStr);
}

/**
 * Toggle item selection state
 */
export function toggleItemSelection(
  selections: Record<string, any[]>, 
  heading: string, 
  item: any, 
  setSelections: (value: Record<string, any[]>) => void
): void {
  // Create copy of current selections
  const newSelections = { ...selections };
  
  // Ensure heading exists in selections
  if (!newSelections[heading]) {
    newSelections[heading] = [];
  }
  
  // Extract the value to store
  let value = item;
  if (typeof item !== 'string' && item.text) {
    value = item.text;
  }
  
  // Check if item is already selected
  const isSelected = isItemSelected(selections, heading, item);
  
  if (isSelected) {
    // Remove item from selections
    newSelections[heading] = newSelections[heading].filter(selected => {
      if (typeof selected === 'string' && typeof value === 'string') {
        return selected !== value;
      }
      if (typeof selected === 'object' && typeof value === 'object') {
        return JSON.stringify(selected) !== JSON.stringify(value);
      }
      if (typeof selected === 'string' && typeof value === 'object' && value.text) {
        return selected !== value.text;
      }
      if (typeof selected === 'object' && selected.text && typeof value === 'string') {
        return selected.text !== value;
      }
      return true;
    });
  } else {
    // Add item to selections
    newSelections[heading] = [...newSelections[heading], value];
  }
  
  // Update selections state
  setSelections(newSelections);
}
