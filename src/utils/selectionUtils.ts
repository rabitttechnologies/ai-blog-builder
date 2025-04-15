
export const isItemSelected = (selections: Record<string, any[]>, heading: string, item: any) => {
  const currentSelections = selections[heading] || [];
  
  const getItemId = (item: any) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.id || item.url || item.title || JSON.stringify(item);
    }
    return String(item);
  };
  
  return currentSelections.some(selectedItem => 
    getItemId(selectedItem) === getItemId(item)
  );
};

export const toggleItemSelection = (
  selections: Record<string, any[]>,
  heading: string,
  item: any,
  setSelections: (value: Record<string, any[]>) => void
) => {
  const currentSelections = selections[heading] || [];
  
  const getItemId = (item: any) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.id || item.url || item.title || JSON.stringify(item);
    }
    return String(item);
  };
  
  const itemId = getItemId(item);
  
  const isSelected = currentSelections.some(selectedItem => 
    getItemId(selectedItem) === itemId
  );
  
  setSelections({
    ...selections,
    [heading]: isSelected
      ? currentSelections.filter(i => getItemId(i) !== itemId)
      : [...currentSelections, item]
  });
};
