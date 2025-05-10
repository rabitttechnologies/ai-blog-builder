
import { OutlineOption } from '@/types/outlineCustomize';
import { corsHeaders, handleCorsError, createCorsRequestOptions, isCorsError } from '@/utils/corsUtils';

export const parseArticleOutline = (outlineText: string): OutlineOption['parsed'] => {
  if (!outlineText) {
    return { headings: [] };
  }
  
  // Normalize line breaks to ensure consistent parsing
  // Replace literal "\n" strings with actual line breaks
  const normalizedText = outlineText.replace(/\\n/g, '\n').trim();
  
  // Parse headings from the markdown outline
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+\*\(.*?\)\*)?$/gm;
  const headings = [];
  let match;
  
  while ((match = headingRegex.exec(normalizedText)) !== null) {
    headings.push({
      level: match[1].length,
      title: match[2].trim()
    });
  }
  
  return { headings };
};

// Local storage functions for saving user guidance preferences
export const saveGeneralGuidance = (guidance: string): void => {
  try {
    const savedGuidance = getSavedGeneralGuidance();
    const updatedGuidance = [...savedGuidance, guidance];
    localStorage.setItem('savedGeneralGuidance', JSON.stringify(updatedGuidance));
  } catch (error) {
    console.error('Failed to save general guidance:', error);
  }
};

export const getSavedGeneralGuidance = (): string[] => {
  try {
    const savedGuidance = localStorage.getItem('savedGeneralGuidance');
    return savedGuidance ? JSON.parse(savedGuidance) : [];
  } catch (error) {
    console.error('Failed to retrieve general guidance:', error);
    return [];
  }
};

// Enhanced outline formatting function with direct access to the webhook response data structure
export const formatOutlineOptions = (response: any): OutlineOption[] => {
  if (!response) {
    console.warn('No response data provided');
    return [];
  }
  
  console.log('Formatting outlines from response:', response);
  
  // Log if the new fields are present
  if (response.promptforbody) {
    console.log('Found promptforbody in response:', response.promptforbody);
  }
  
  if (response.Introduction) {
    console.log('Found Introduction in response:', response.Introduction);
  }
  
  if (response.key_takeaways) {
    console.log('Found key_takeaways in response:', response.key_takeaways);
  }
  
  // Create array to store the formatted options
  const options: OutlineOption[] = [];
  
  // Check if the response has the articleoutline property directly
  if (response.articleoutline && Array.isArray(response.articleoutline)) {
    console.log('Found articleoutline array in response (lowercase):', response.articleoutline);
    
    // Process each outline item
    response.articleoutline.forEach((item: any, index: number) => {
      // Process outline1
      if (item && typeof item.outline1 === 'string') {
        options.push({
          id: `outline-${index}-1`,
          content: item.outline1,
          parsed: parseArticleOutline(item.outline1)
        });
      }
      
      // Process outline2
      if (item && typeof item.outline2 === 'string') {
        options.push({
          id: `outline-${index}-2`,
          content: item.outline2,
          parsed: parseArticleOutline(item.outline2)
        });
      }
      
      // Check for any other outline keys
      if (item) {
        Object.keys(item).forEach(key => {
          if (key.startsWith('outline') && key !== 'outline1' && key !== 'outline2' && typeof item[key] === 'string') {
            const outlineNumber = key.replace('outline', '');
            options.push({
              id: `outline-${index}-${outlineNumber}`,
              content: item[key],
              parsed: parseArticleOutline(item[key])
            });
          }
        });
      }
    });
  }
  
  // Try with uppercase 'articleOutline' if lowercase didn't work
  else if (response.articleOutline && Array.isArray(response.articleOutline)) {
    console.log('Found articleOutline array in response (uppercase):', response.articleOutline);
    
    // Process each outline item
    response.articleOutline.forEach((item: any, index: number) => {
      // Process outline1
      if (item && typeof item.outline1 === 'string') {
        options.push({
          id: `outline-${index}-1`,
          content: item.outline1,
          parsed: parseArticleOutline(item.outline1)
        });
      }
      
      // Process outline2
      if (item && typeof item.outline2 === 'string') {
        options.push({
          id: `outline-${index}-2`,
          content: item.outline2,
          parsed: parseArticleOutline(item.outline2)
        });
      }
      
      // Check for any other outline keys
      if (item) {
        Object.keys(item).forEach(key => {
          if (key.startsWith('outline') && key !== 'outline1' && key !== 'outline2' && typeof item[key] === 'string') {
            const outlineNumber = key.replace('outline', '');
            options.push({
              id: `outline-${outlineNumber}`,
              content: item[key],
              parsed: parseArticleOutline(item[key])
            });
          }
        });
      }
    });
  }
  
  if (options.length > 0) {
    console.log('Successfully parsed outline options:', options);
    return options;
  }
  
  console.warn('No valid article outlines found in response');
  return [];
};

export const submitOutlineCustomization = async (payload: any): Promise<any> => {
  try {
    console.log('Submitting outline customization payload:', payload);
    
    // Log the selected article outline to confirm it's being sent
    if (payload.articleOutline) {
      console.log('Sending articleOutline:', payload.articleOutline);
    }
    
    // Create proper request options with CORS headers
    const options = createCorsRequestOptions('POST', payload);
    
    // Enhanced error handling for the API call
    try {
      // The API endpoint URL
      const apiUrl = 'https://n8n.agiagentworld.com/webhook/articleoutlinecustomization';
      
      // Try the request with our enhanced error handling
      const response = await handleCorsError(apiUrl, options);
      
      // Process the response
      const responseText = await response.text();
      if (!responseText) {
        throw new Error("Server returned an empty response");
      }
      
      try {
        const responseData = JSON.parse(responseText);
        console.log("Article customization response:", responseData);
        
        // Normalize response
        return Array.isArray(responseData) ? responseData[0] : responseData;
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError, 'Raw response:', responseText);
        throw new Error("Invalid response format from server");
      }
    } catch (fetchError: any) {
      console.error('Error in fetch operation:', fetchError);
      
      if (isCorsError(fetchError)) {
        // Provide a more detailed error for CORS issues
        console.error('CORS issue details:', {
          message: fetchError.message,
          origin: window.location.origin,
          targetUrl: 'https://n8n.agiagentworld.com/webhook/articleoutlinecustomization'
        });
        
        throw new Error('The server does not allow cross-origin requests. Try an alternative approach or contact the API provider to enable CORS for your domain.');
      }
      
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Error submitting outline customization:', error);
    throw error;
  }
};
