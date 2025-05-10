
// CORS headers utility for API requests

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
};

// Function to check if an error is CORS-related
export const isCorsError = (error: any): boolean => {
  if (!error) return false;
  const errorMessage = error.message || '';
  return (
    errorMessage.includes('CORS') || 
    errorMessage.includes('cross-origin') || 
    errorMessage.includes('access control') ||
    errorMessage.includes('Failed to fetch')
  );
};

// Function to create a proxy URL for bypassing CORS (if available)
export const getProxyUrl = (url: string): string => {
  // If you have a CORS proxy service, you could use it here
  // Example: return `https://your-proxy-service.com/${encodeURIComponent(url)}`;
  // For now, return the original URL
  return url;
};
