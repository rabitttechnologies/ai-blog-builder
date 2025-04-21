
/**
 * Checks if the data is valid based on the specified type
 * @param data The data to validate
 * @param type The expected data type
 * @returns boolean indicating whether the data is valid
 */
export const isValidData = (data: any, type?: string): boolean => {
  if (data === null || data === undefined) return false;
  if (type === 'array') return Array.isArray(data) && data.length > 0;
  if (type === 'object') return typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0;
  if (type === 'string') return typeof data === 'string' && data.trim() !== '';
  if (type === 'number') return typeof data === 'number' && !isNaN(data);
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'object' && data !== null) return Object.keys(data).length > 0;
  return !!data;
};

/**
 * Safely access nested properties in an object without causing errors
 * @param obj The object to access
 * @param path The path to the property (e.g., 'data.items.0.name') or a string key
 * @param defaultValue The default value to return if the path doesn't exist
 * @returns The value at the path or the default value
 */
export const safeGet = (obj: any, path: string | number, defaultValue: any = undefined): any => {
  if (obj === null || obj === undefined) return defaultValue;
  
  // Handle direct property access for simple keys
  if (typeof path === 'string' && !path.includes('.')) {
    return obj[path] !== undefined ? obj[path] : defaultValue;
  }

  // Handle numeric index
  if (typeof path === 'number') {
    return Array.isArray(obj) && obj[path] !== undefined ? obj[path] : defaultValue;
  }
  
  // Handle dot notation paths
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue;
    }
    
    // Handle array index in path (e.g., items.0.name)
    if (/^\d+$/.test(key) && Array.isArray(result)) {
      const index = parseInt(key, 10);
      result = index < result.length ? result[index] : undefined;
    } else {
      result = result[key];
    }
  }
  
  return result !== undefined ? result : defaultValue;
};

/**
 * Safely filter an array, returning an empty array if the input is not valid
 * @param array The array to filter
 * @param predicate The filter function
 * @returns Filtered array or empty array if input is invalid
 */
export const safeFilter = <T>(array: T[] | undefined | null, predicate: (item: T) => boolean): T[] => {
  if (!array || !Array.isArray(array)) return [];
  return array.filter(predicate);
};

/**
 * Safely maps an array, returning an empty array if the input is not valid
 * @param array The array to map
 * @param mapper The mapping function
 * @returns Mapped array or empty array if input is invalid
 */
export const safeMap = <T, R>(array: T[] | undefined | null, mapper: (item: T, index: number) => R): R[] => {
  if (!array || !Array.isArray(array)) return [];
  return array.map(mapper);
};

/**
 * Mapping of search section headings to their data keys
 */
export const headingMappings = {
  'Top in SERP': { key: 'organicResults', type: 'array' },
  'Hot Keyword Ideas': { key: 'relatedQueries', type: 'array' },
  'Popular Right Now': { key: 'peopleAlsoAsk', type: 'array' },
  'Other Keyword Ideas': { keys: ['paidResults', 'suggestedResults'], type: 'array' }
};
