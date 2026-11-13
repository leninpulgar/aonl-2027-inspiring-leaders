export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

export const CONSENT_STORAGE_KEY = 'aonl_cookie_consent';

// Helper to check if running in development mode
const isDevelopment = () => process.env.NODE_ENV === 'development';

// Retrieve the current user consent status
export const getCookieConsent = (): 'granted' | 'denied' | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) as 'granted' | 'denied' | null;
  } catch {
    return null;
  }
};

// Update consent in both localStorage and Google Consent Mode (dataLayer)
export const updateConsent = (status: 'granted' | 'denied') => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch (e) {
    console.warn('Unable to persist consent to localStorage', e);
  }

  // Update Google Consent Mode v2
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(arguments);
  }

  gtag('consent', 'update', {
    analytics_storage: status,
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status,
  });

  (window as any).dataLayer.push({
    event: `cookie_consent_${status}`,
  });

  if (isDevelopment()) {
    console.log(`[DEV Consent Updated]: ${status}`);
  }
};

// Dispatch events to GTM dataLayer respecting consent
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    // If the user explicitly denied consent, skip non-essential tracking
    const consent = getCookieConsent();
    if (consent === 'denied') {
      if (isDevelopment()) {
        console.log(`[DEV GTM Event Blocked - Consent Denied]: ${eventName}`, parameters);
      }
      return;
    }

    (window as any).dataLayer = (window as any).dataLayer || [];

    const eventData = {
      event: eventName,
      ...parameters,
    };

    if (isDevelopment()) {
      console.log(`[DEV GTM Event]: ${eventName}`, eventData);
    }

    (window as any).dataLayer.push(eventData);
  }
};
