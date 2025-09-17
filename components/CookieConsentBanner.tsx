
import React from 'react';

interface CookieConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-accent/90 backdrop-blur-sm border-t border-white/10 p-4 z-[100] animate-fade-in">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
        </p>
        <div className="flex-shrink-0 flex gap-3">
          <button
            onClick={onDecline}
            className="border border-gray-600 text-gray-300 font-medium py-2 px-5 rounded-full hover:border-white hover:text-white transition-all duration-300 text-sm"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="animate-gradient-flow text-white font-semibold py-2 px-5 rounded-full hover:shadow-lg hover:shadow-brand-purple/20 transition-all duration-300 transform hover:scale-105 text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
