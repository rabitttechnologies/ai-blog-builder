
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

// Enhanced proxy URL function for bypassing CORS
export const getProxyUrl = (url: string): string => {
  // Check if the URL is for our n8n webhook
  if (url.includes('n8n.agiagentworld.com/webhook/')) {
    // Use a CORS proxy service
    return `https://cors-anywhere.herokuapp.com/${url}`;
  }
  
  // For other URLs, return as is or implement alternative proxies if needed
  return url;
};

// Function to create fetch options with proper CORS headers
export const createCorsRequestOptions = (method: string = 'POST', body?: any): RequestInit => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Origin': window.location.origin,
      'Accept': 'application/json',
      ...corsHeaders
    },
    body: body ? JSON.stringify(body) : undefined,
    mode: 'cors',
    credentials: 'omit' // Avoid sending cookies
  };
};

// Function to handle CORS errors with fallback mechanisms
export const handleCorsError = async (url: string, options: RequestInit): Promise<Response> => {
  try {
    // First attempt: Direct request with CORS headers
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    }
    
    throw new Error(`Server responded with status: ${response.status}`);
  } catch (error) {
    // If CORS error, try with proxy
    if (isCorsError(error)) {
      console.log('CORS error detected, trying with proxy...');
      const proxyUrl = getProxyUrl(url);
      
      if (proxyUrl !== url) {
        // Second attempt: Use proxy
        const proxyResponse = await fetch(proxyUrl, options);
        if (proxyResponse.ok) {
          return proxyResponse;
        }
        throw new Error(`Proxy request failed with status: ${proxyResponse.status}`);
      }
    }
    
    // Re-throw original error if no proxy available or if proxy failed
    throw error;
  }
};
