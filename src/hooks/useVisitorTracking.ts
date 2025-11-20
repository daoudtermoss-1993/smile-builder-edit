import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      // Check if already tracked today
      const lastVisit = localStorage.getItem('lastVisit');
      const today = new Date().toISOString().split('T')[0];
      
      if (lastVisit === today) {
        // Already tracked today, just increment page view
        try {
          await supabase.rpc('increment_visitor_count');
        } catch (error) {
          console.error('Error tracking page view:', error);
        }
        return;
      }

      // First visit today - track as unique visitor
      try {
        await supabase.rpc('increment_visitor_count');
        localStorage.setItem('lastVisit', today);
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisitor();
  }, []);
};
