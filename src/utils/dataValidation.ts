
// Headings and data mappings for the search results
export const headingMappings = {
  'Top in SERP': {
    keys: ['References'],
    type: 'array'
  },
  'Hot Keyword Ideas': {
    key: 'historicalSearchData',
    altKeys: ['Historical Search Data'],
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

// Function to try getting a value from multiple possible field names (case-insensitive)
export function getFieldCaseInsensitive(obj: any, fieldNames: string[]): any {
  if (!obj || typeof obj !== 'object') return null;

  // Try exact matches first
  for (const field of fieldNames) {
    if (obj[field] !== undefined) {
      return obj[field];
    }
  }

  // Try case-insensitive matches
  const lowerFieldNames = fieldNames.map(name => name.toLowerCase());
  const objKeys = Object.keys(obj);
  
  for (const key of objKeys) {
    const lowerKey = key.toLowerCase();
    const index = lowerFieldNames.findIndex(field => field === lowerKey);
    if (index !== -1) {
      return obj[key];
    }
  }

  return null;
}

// Function to normalize API response keys
export function normalizeResponse(data: any): any {
  if (!data) return null;

  // If it's an array with one item, extract the item
  if (Array.isArray(data) && data.length === 1) {
    data = data[0];
  }

  const normalizedData: any = {};

  // Map common field names
  const fieldMappings = {
    workflowId: ['workflowId', 'workflow Id', 'workflow_id', 'WorkflowId'],
    userId: ['userId', 'user Id', 'user_id', 'UserId'],
    executionId: ['executionId', 'Execution Id', 'execution_id', 'ExecutionId'],
    originalKeyword: ['originalKeyword', 'Original Keyword', 'original_keyword'],
    country: ['country', 'Country'],
    language: ['language', 'Language'],
    contentType: ['contentType', 'Type of Content', 'content_type'],
    historicalSearchData: ['historicalSearchData', 'Historical Search Data'],
    references: ['references', 'References'],
    additionalData: ['additionalData', 'Additional Data']
  };

  // Populate normalized data
  for (const [normalizedKey, possibleKeys] of Object.entries(fieldMappings)) {
    const value = getFieldCaseInsensitive(data, possibleKeys);
    if (value !== null) {
      normalizedData[normalizedKey] = value;
    }
  }

  // Handle additional data field which might be a string
  if (normalizedData.additionalData && typeof normalizedData.additionalData === 'string') {
    try {
      normalizedData.additionalData = JSON.parse(normalizedData.additionalData);
    } catch (e) {
      normalizedData.additionalData = {};
    }
  }

  return normalizedData;
}

// Function to extract keywords from historical search data
export function extractKeywords(data: any): any[] {
  if (!data) return [];
  
  // Try to get historicalSearchData using different possible field names
  const historicalData = getFieldCaseInsensitive(data, ['historicalSearchData', 'Historical Search Data']);
  
  if (!Array.isArray(historicalData)) {
    return [];
  }
  
  return historicalData.map(item => ({
    text: item.text,
    keywordMetrics: item.keywordMetrics || {},
    closeVariants: Array.isArray(item.closeVariants) ? item.closeVariants : []
  })).filter(item => item.text);
}

// Function to extract references from the response
export function extractReferences(data: any): Array<{title: string, url: string}> {
  if (!data) return [];
  
  let refs = [];
  
  // Try to get references using different possible field names
  const references = getFieldCaseInsensitive(data, ['references', 'References']);
  
  // Handle direct references array
  if (Array.isArray(references)) {
    refs = references;
  }
  // Try to parse references if it's a string
  else if (typeof references === 'string') {
    try {
      const parsedRefs = JSON.parse(references);
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
