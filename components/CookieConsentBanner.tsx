import React, { useState, useEffect } from 'react';

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-nyx-black border-t border-nyx-gray/50 p-4 z-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1">
            <p className="text-white text-sm">
              We use cookies to enhance your experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.{' '}
              <button className="text-nyx-blue hover:underline">
                Learn more
              </button>
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDecline}
              className="bg-nyx-gray text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="bg-nyx-blue text-nyx-black px-4 py-2 rounded-lg hover:bg-white transition-colors text-sm font-semibold"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;