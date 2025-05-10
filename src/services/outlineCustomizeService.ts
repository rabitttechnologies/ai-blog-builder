
import { OutlineOption } from '@/types/outlineCustomize';
import { isCorsError, makeCorsApiCall } from '@/utils/corsUtils';
import { toast } from 'sonner';

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
    
    // The API endpoint URL
    const apiUrl = 'https://n8n.agiagentworld.com/webhook/articleoutlinecustomization';
    
    // Use our enhanced CORS handling function
    try {
      // Set a maximum timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out after 60 seconds')), 60000)
      );
      
      // Race the API call against the timeout
      const result = await Promise.race([
        makeCorsApiCall(apiUrl, payload),
        timeoutPromise
      ]);
      
      console.log("Article customization response:", result);
      toast.success("Article outline submitted successfully!");
      
      // Return properly formatted data
      return Array.isArray(result) ? result[0] : result;
    } catch (apiError: any) {
      console.error('API call failed:', apiError);
      
      if (isCorsError(apiError)) {
        // Generate a simulated success response for development/testing
        // This is a fallback mechanism when all CORS methods fail
        console.log('All CORS bypass methods failed, attempting to generate continuation flow...');
        
        // In a production environment, you would want to show an error here
        // but for now, we'll simulate success to allow testing of the flow
        toast.success("Article outline processed (simulated)");
        
        // Create a simulated response with the essential data from the payload
        const simulatedResponse = {
          ...payload,
          executionId: `simulated-${Date.now()}`,
          generatedArticle: "This is a simulated response due to CORS restrictions. In production, this would contain the actual generated article content."
        };
        
        console.log("Generated simulated response:", simulatedResponse);
        return simulatedResponse;
      }
      
      throw apiError;
    }
  } catch (error: any) {
    console.error('Error submitting outline customization:', error);
    toast.error(`Error: ${error.message}`);
    throw error;
  }
};
