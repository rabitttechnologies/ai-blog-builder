
import { TitleDescriptionPayload, TitleDescriptionResponse } from '@/types/articleWriter';

// Service for title description webhook calls
const titleDescriptionService = {
  // Submit the title description selection to the webhook
  async submitTitleDescriptionSelection(payload: TitleDescriptionPayload): Promise<TitleDescriptionResponse> {
    try {
      const response = await fetch('https://n8n.agiagentworld.com/webhook/titleandshortdescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
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
    
    // Check if normalized data exists and has the expected titlesandShortDescription property
    if (normalizedData && Array.isArray(normalizedData.titlesandShortDescription)) {
      console.log('Found title descriptions array with length:', normalizedData.titlesandShortDescription.length);
      
      // Map the data to the expected format
      return normalizedData.titlesandShortDescription.map((item, index) => ({
        id: `title-${index}`,
        title: item.title,
        description: item.description
      }));
    }
    
    // Return empty array if no data or invalid format
    console.warn('No valid titlesandShortDescription array found in data');
    return [];
  }
};

export default titleDescriptionService;
