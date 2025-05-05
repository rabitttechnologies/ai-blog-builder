
import { TitleDescriptionPayload, TitleDescriptionResponse } from '@/types/articleWriter';

// Service for title description webhook calls
const titleDescriptionService = {
  // Submit the title description selection to the webhook
  async submitTitleDescriptionSelection(payload: TitleDescriptionPayload): Promise<TitleDescriptionResponse> {
    try {
      console.log('Submitting title description payload:', payload);
      
      // Add headers to address CORS issues
      const response = await fetch('https://n8n.agiagentworld.com/webhook/titleandshortdescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        // Added mode to help with CORS issues
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Webhook error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Title Description Webhook Response:', data);
      
      // Handle the response structure - normalize it to always use the object format
      let responseData;
      
      if (Array.isArray(data)) {
        console.log('Response is an array, extracting first item');
        responseData = data.length > 0 ? data[0] : null;
      } else {
        console.log('Response is an object');
        responseData = data;
      }
      
      if (!responseData) {
        throw new Error('Invalid or empty response data');
      }
      
      return responseData as TitleDescriptionResponse;
    } catch (error) {
      console.error('Error submitting title description selection:', error);
      throw error;
    }
  },
  
  // Format title descriptions from selected keyword response
  formatTitleDescriptions(data: any) {
    console.log('Formatting title descriptions from data:', data);
    
    // Check if data is an array and extract first item if needed
    const normalizedData = Array.isArray(data) ? data[0] : data;
    
    // Enhanced logging for debugging
    console.log('Normalized data:', normalizedData);
    
    // Flexible path checking - looking for titlesandShortDescription in different formats
    let titleDescriptions = null;
    
    // Check for different possible paths to the title descriptions
    if (normalizedData) {
      // Check direct property access with various casing options
      if (Array.isArray(normalizedData.titlesandShortDescription)) {
        titleDescriptions = normalizedData.titlesandShortDescription;
        console.log('Found title descriptions at path: normalizedData.titlesandShortDescription');
      } else if (Array.isArray(normalizedData.TitlesandShortDescription)) {
        titleDescriptions = normalizedData.TitlesandShortDescription;
        console.log('Found title descriptions at path: normalizedData.TitlesandShortDescription');
      } else if (Array.isArray(normalizedData.titlesAndShortDescription)) {
        titleDescriptions = normalizedData.titlesAndShortDescription;
        console.log('Found title descriptions at path: normalizedData.titlesAndShortDescription');
      } else if (normalizedData.data && Array.isArray(normalizedData.data)) {
        titleDescriptions = normalizedData.data;
        console.log('Found title descriptions at path: normalizedData.data');
      }
    }
    
    // If we found title descriptions, map them to the expected format
    if (titleDescriptions && Array.isArray(titleDescriptions) && titleDescriptions.length > 0) {
      console.log('Found title descriptions array with length:', titleDescriptions.length);
      
      // Map the data to the expected format
      return titleDescriptions.map((item, index) => ({
        id: `title-${index}`,
        title: item.title || '',
        description: item.description || ''
      }));
    }
    
    // Return empty array if no data or invalid format
    console.warn('No valid title descriptions found in data');
    return [];
  }
};

export default titleDescriptionService;
