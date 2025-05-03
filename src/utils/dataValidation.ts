
// Headings and data mappings for the search results
export const headingMappings = {
  'Top in SERP': {
    keys: ['References'],
    type: 'array'
  },
  'Hot Keyword Ideas': {
    key: 'historicalSearchData',
    type: 'array'
  },
  'Popular Right Now': {
    key: 'additionalData.questions',
    type: 'array',
    optional: true
  },
  'Related Terms': {
    key: 'additionalData.relatedTerms',
    type: 'array',
    optional: true
  }
};

// Safe accessor function to get nested properties
export function safeGet(obj: any, path: string, defaultValue: any = null): any {
  const keys = path.split('.');
  return keys.reduce((acc, key) => {
    if (acc === null || acc === undefined) return defaultValue;
    return acc[key] !== undefined ? acc[key] : defaultValue;
  }, obj);
}

// Safe map function that handles potentially undefined arrays
export function safeMap<T, R>(arr: T[] | null | undefined, callback: (item: T, index: number) => R): R[] {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  return arr.map(callback);
}

// Data validation function
export function isValidData(data: any, type: string): boolean {
  if (data === undefined || data === null) return false;
  
  if (type === 'array') {
    return Array.isArray(data) && data.length > 0;
  }
  
  if (type === 'object') {
    return typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0;
  }
  
  return true;
}

// Function to extract keywords from historical search data
export function extractKeywords(data: any): any[] {
  if (!data || !Array.isArray(data.historicalSearchData)) {
    return [];
  }
  
  return data.historicalSearchData.map(item => ({
    text: item.text,
    keywordMetrics: item.keywordMetrics || {},
    closeVariants: Array.isArray(item.closeVariants) ? item.closeVariants : []
  })).filter(item => item.text);
}

// Function to extract references from the response
export function extractReferences(data: any): Array<{title: string, url: string}> {
  if (!data) return [];
  
  let refs = [];
  
  // Handle direct references array
  if (Array.isArray(data.References)) {
    refs = data.References;
  }
  // Handle references in the response object
  else if (Array.isArray(data.references)) {
    refs = data.references;
  }
  // Try to parse references if it's a string
  else if (typeof data.references === 'string' || typeof data.References === 'string') {
    const refsStr = data.references || data.References;
    try {
      const parsedRefs = JSON.parse(refsStr);
      if (Array.isArray(parsedRefs)) {
        refs = parsedRefs;
      }
    } catch (e) {
      console.error('Failed to parse references:', e);
    }
  }
  
  // Ensure each reference has title and url
  return refs
    .filter(ref => ref && typeof ref === 'object' && ref.title && ref.url)
    .map(ref => ({
      title: ref.title,
      url: ref.url
    }));
}
