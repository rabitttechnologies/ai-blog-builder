
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

// Enhanced proxy URL function with multiple fallback options
export const getProxyUrl = (url: string): string => {
  // List of CORS proxies to try in order
  const corsProxies = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://thingproxy.freeboard.io/fetch/',
    'https://crossorigin.me/'
  ];
  
  // Check if the URL is for our n8n webhook
  if (url.includes('n8n.agiagentworld.com/webhook/')) {
    // Select the first proxy in the list
    return `${corsProxies[0]}${encodeURIComponent(url)}`;
  }
  
  // For other URLs, return as is
  return url;
};

// Function to create fetch options with proper headers
export const createCorsRequestOptions = (method: string = 'POST', body?: any): RequestInit => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Origin': window.location.origin,
      'Accept': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined,
    mode: 'cors',
    credentials: 'omit' // Avoid sending cookies
  };
};

// Function to handle CORS errors with multiple fallback mechanisms
export const handleCorsError = async (url: string, options: RequestInit): Promise<Response> => {
  try {
    // First attempt: Direct request
    console.log(`Attempting direct request to: ${url}`);
    const response = await fetch(url, options);
    if (response.ok) {
      console.log('Direct request successful');
      return response;
    }
    
    throw new Error(`Server responded with status: ${response.status}`);
  } catch (error) {
    // If CORS error, try with proxy
    if (isCorsError(error)) {
      console.log('CORS error detected, trying with proxy...');
      const proxyUrl = getProxyUrl(url);
      
      if (proxyUrl !== url) {
        try {
          // Second attempt: Use proxy
          console.log(`Attempting proxy request to: ${proxyUrl}`);
          const proxyResponse = await fetch(proxyUrl, options);
          
          if (proxyResponse.ok) {
            console.log('Proxy request successful');
            return proxyResponse;
          }
          
          throw new Error(`Proxy request failed with status: ${proxyResponse.status}`);
        } catch (proxyError) {
          console.error('Proxy request failed:', proxyError);
          
          // Try a server-side approach suggestion
          throw new Error('CORS error persists. Consider using a server-side proxy or requesting CORS headers to be added on the API server.');
        }
      }
    }
    
    // Re-throw original error if no proxy available or if it's not a CORS error
    throw error;
  }
};

// Function for server-side API calls (for documentation - using this approach would require server implementation)
export const serverSideAPICallExample = () => {
  /* 
  The best solution for CORS issues is to have your own server make the API request:
  
  1. Create a server endpoint (e.g., /api/articleoutlinecustomization)
  2. Forward requests from your client to this endpoint
  3. The server makes the actual request to n8n.agiagentworld.com
  4. Return the response to your client
  
  This way, CORS is not an issue since server-to-server requests don't have CORS restrictions.
  */
  
  console.log('This is a placeholder for the recommended server-side approach');
};
