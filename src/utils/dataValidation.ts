
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
 * Mapping of search section headings to their data keys
 */
export const headingMappings = {
  'Top in SERP': { key: 'organicResults', type: 'array' },
  'Hot Keyword Ideas': { key: 'relatedQueries', type: 'array' },
  'Popular Right Now': { key: 'peopleAlsoAsk', type: 'array' },
  'Other Keyword Ideas': { keys: ['paidResults', 'suggestedResults'], type: 'array' }
};
