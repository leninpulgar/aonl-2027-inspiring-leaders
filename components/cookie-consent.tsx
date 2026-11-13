'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { updateConsent } from '@/utils/analytics';

const AONL_LOGO_URL =
  'https://www.aonl.org/sites/default/files/styles/edp_header_logo/public/aone/AONL_Logo_Hor__RGB.png?itok=4IJ2wlBP';

export const CookieConsent: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('aonl_cookie_consent');
      if (!saved) {
        // Show banner if no consent choice has been saved yet
        setIsVisible(true);
      }
    } catch {
      // Fallback if localStorage is restricted
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    updateConsent('granted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    updateConsent('denied');
    setIsVisible(false);
  };

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-gray-200/80 text-gray-800">
        {/* Header with AONL Logo */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AONL_LOGO_URL}
            alt="AONL - American Organization for Nursing Leadership"
            className="h-7 w-auto object-contain max-w-[170px]"
            loading="eager"
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00577a]/10 text-[#00577a]">
            Privacy & Cookies
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-gray-900 text-base mb-1">
            Cookie Preferences
          </h3>
          <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
            AONL uses cookies and analytics tools (Google Analytics / GTM) to measure badge generation and downloads, and improve your AONL 2027 event experience.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              variant="teal"
              type="button"
              onClick={handleAccept}
              className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold justify-center text-center"
            >
              Accept All
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={handleDecline}
              className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 justify-center text-center"
            >
              Essential Only
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
