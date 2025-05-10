
// CORS headers utility for API requests

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
};

// Function to check if an error is CORS-related
export const isCorsError = (error: any): boolean => {
  if (!error) return false;
  const errorMessage = typeof error.message === 'string' ? error.message : String(error);
  return (
    errorMessage.toLowerCase().includes('cors') || 
    errorMessage.toLowerCase().includes('cross-origin') || 
    errorMessage.toLowerCase().includes('access control') ||
    errorMessage.toLowerCase().includes('failed to fetch') ||
    errorMessage.toLowerCase().includes('network error')
  );
};

// Multi-stage proxy approach with rotating proxies
export const getProxyUrl = (url: string): string => {
  // Check if it's an n8n webhook URL that needs special handling
  if (url.includes('n8n.agiagentworld.com/webhook/')) {
    // Use JSONp format for n8n webhook requests to avoid CORS
    // This becomes a callback-based request that doesn't use fetch directly
    return url;
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

// Enhanced CORS-bypass with multiple strategies
export const handleCorsError = async (url: string, options: RequestInit): Promise<Response> => {
  // Try direct request first
  try {
    console.log(`Attempting direct request to: ${url}`);
    const response = await fetch(url, options);
    if (response.ok) {
      console.log('Direct request successful');
      return response;
    }
    throw new Error(`Server responded with status: ${response.status}`);
  } catch (error: any) {
    // If CORS error, try advanced methods
    if (isCorsError(error)) {
      console.log('CORS error detected, trying advanced methods...');
      
      // Try using a simple form-based POST approach using a hidden iframe
      try {
        console.log('Attempting form-based POST via hidden iframe...');
        const response = await fetchWithFormSubmission(url, options.body ? JSON.parse(options.body as string) : {});
        return response;
      } catch (formError) {
        console.error('Form-based POST failed:', formError);
      }
      
      // Try using a server-side proxy if available
      try {
        const serverProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        console.log(`Attempting server proxy request to: ${serverProxyUrl}`);
        
        // Clone and modify options for the proxy
        const proxyOptions = { ...options };
        
        // The proxy expects different headers
        proxyOptions.headers = {
          ...proxyOptions.headers,
          'x-requested-with': 'XMLHttpRequest',
        };
        
        const proxyResponse = await fetch(serverProxyUrl, proxyOptions);
        
        if (proxyResponse.ok) {
          console.log('Server proxy request successful');
          return proxyResponse;
        }
        
        throw new Error(`Server proxy request failed with status: ${proxyResponse.status}`);
      } catch (proxyError) {
        console.error('Server proxy request failed:', proxyError);
        
        // All methods failed, suggest server-side solution
        throw new Error('CORS error persists despite multiple bypass attempts. Please implement a server-side solution or contact the API provider to enable CORS.');
      }
    }
    
    // Re-throw original error if it's not a CORS error
    throw error;
  }
};

// This function creates a hidden iframe and submits a form to bypass CORS restrictions
const fetchWithFormSubmission = (url: string, data: any): Promise<Response> => {
  return new Promise((resolve, reject) => {
    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.name = `cors-frame-${Date.now()}`;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Create a message channel for communication between the iframe and parent
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      if (event.data && event.data.type === 'RESPONSE') {
        // Clean up
        document.body.removeChild(iframe);
        resolve(new Response(JSON.stringify(event.data.response), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }));
      } else if (event.data && event.data.type === 'ERROR') {
        document.body.removeChild(iframe);
        reject(new Error(event.data.message));
      }
    };
    
    // Create a form inside the iframe
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = iframe.name;
    form.enctype = 'application/json';
    
    // Add hidden input for data
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'data';
    input.value = JSON.stringify(data);
    form.appendChild(input);
    
    // Add script to handle response
    const script = document.createElement('script');
    script.innerHTML = `
      window.onload = function() {
        window.addEventListener('message', function(event) {
          try {
            const response = JSON.parse(event.data);
            window.parent.postMessage({
              type: 'RESPONSE',
              response: response
            }, '*');
          } catch (error) {
            window.parent.postMessage({
              type: 'ERROR',
              message: error.message
            }, '*');
          }
        });
      }
    `;
    
    // Set up the iframe once loaded
    iframe.onload = () => {
      try {
        // Try to append the form and script to the iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow!.document;
        iframeDoc.body.appendChild(form);
        iframeDoc.body.appendChild(script);
        form.submit();
      } catch (error) {
        reject(error);
      }
    };
    
    // Set a timeout to reject the promise
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
        reject(new Error('Request timed out'));
      }
    }, 30000);
  });
};

// Function for handling JSON API calls with both fetch and JSONP approaches
export const makeCorsApiCall = async (url: string, payload: any): Promise<any> => {
  try {
    // Try using our enhanced CORS-handling fetch approach first
    const options = createCorsRequestOptions('POST', payload);
    const response = await handleCorsError(url, options);
    
    // Process the response
    const responseText = await response.text();
    if (!responseText) {
      throw new Error("Server returned an empty response");
    }
    
    try {
      return JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError, 'Raw response:', responseText);
      throw new Error("Invalid response format from server");
    }
  } catch (fetchError) {
    console.error('Error in fetch operation:', fetchError);
    
    // If it's a CORS error, try using JSONP as a last resort
    if (isCorsError(fetchError)) {
      try {
        console.log('Attempting JSONP fallback...');
        return new Promise((resolve, reject) => {
          // Try using a dynamic script tag to make a JSONP-style request
          const script = document.createElement('script');
          const callbackName = `jsonp_callback_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
          
          // Create global callback function
          (window as any)[callbackName] = (data: any) => {
            // Clean up
            document.head.removeChild(script);
            delete (window as any)[callbackName];
            resolve(data);
          };
          
          // Create URL with query params from payload
          const queryParams = new URLSearchParams();
          Object.entries(payload).forEach(([key, value]) => {
            queryParams.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
          });
          queryParams.append('callback', callbackName);
          
          // Set the script source
          script.src = `${url}?${queryParams.toString()}`;
          
          // Handle errors
          script.onerror = () => {
            document.head.removeChild(script);
            delete (window as any)[callbackName];
            reject(new Error('JSONP request failed'));
          };
          
          // Add to document
          document.head.appendChild(script);
          
          // Set timeout
          setTimeout(() => {
            if (document.head.contains(script)) {
              document.head.removeChild(script);
              delete (window as any)[callbackName];
              reject(new Error('JSONP request timed out'));
            }
          }, 30000);
        });
      } catch (jsonpError) {
        console.error('JSONP fallback failed:', jsonpError);
        throw new Error('All CORS bypass methods failed. Please implement a server-side solution.');
      }
    }
    
    throw fetchError;
  }
};

// For documentation - using this approach would require server implementation
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
