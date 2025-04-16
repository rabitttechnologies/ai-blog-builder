
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

export const useProfileData = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<{ country?: string; language?: string } | null>(null);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('country, language')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // No toast here to avoid annoying the user
      }
    };
    
    fetchProfileData();
  }, [user]);

  return profileData;
};
