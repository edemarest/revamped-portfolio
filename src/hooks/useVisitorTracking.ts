import { useEffect } from 'react';

export const useVisitorTracking = () => {
  useEffect(() => {
    // Check if user has consented to analytics
    const hasConsent = localStorage.getItem('analytics-consent');
    
    if (hasConsent !== 'true') {
      return; // Don't track if no consent
    }

    const trackPageView = async () => {
      try {
        await fetch('/.netlify/functions/track-visitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: window.location.pathname,
            referrer: document.referrer,
          }),
        });
      } catch (error) {
        // Silent fail - don't break site if tracking fails
        console.debug('Analytics tracking failed:', error);
      }
    };

    trackPageView();
  }, []);
};
