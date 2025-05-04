
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
      
      // Handle the response structure - it might be wrapped in an array
      let responseData;
      
      if (Array.isArray(data) && data.length > 0) {
        responseData = data[0];
      } else {
        responseData = data;
      }
      
      return responseData as TitleDescriptionResponse;
    } catch (error) {
      console.error('Error submitting title description selection:', error);
      throw error;
    }
  }
};

export default titleDescriptionService;
