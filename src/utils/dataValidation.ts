
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
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'object' && data !== null) return Object.keys(data).length > 0;
  return !!data;
};

/**
 * Safely access nested properties in an object without causing errors
 * @param obj The object to access
 * @param path The path to the property (e.g., 'data.items.0.name')
 * @param defaultValue The default value to return if the path doesn't exist
 * @returns The value at the path or the default value
 */
export const safeGet = (obj: any, path: string, defaultValue: any = undefined): any => {
  if (!obj) return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue;
    }
    
    result = result[key];
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
 * Mapping of search section headings to their data keys
 */
export const headingMappings = {
  'Top in SERP': { key: 'organicResults', type: 'array' },
  'Hot Keyword Ideas': { key: 'relatedQueries', type: 'array' },
  'Popular Right Now': { key: 'peopleAlsoAsk', type: 'array' },
  'Other Keyword Ideas': { keys: ['paidResults', 'suggestedResults'], type: 'array' }
};
