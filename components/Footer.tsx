import React from 'react';

interface FooterProps {
  navigateTo: (page: string, params?: any) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  return (
    <footer className="bg-nyx-black border-t border-nyx-gray/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">NYX</h3>
            <p className="text-gray-400 text-sm">
              Revolutionizing smart home technology with beautiful, intuitive devices that make life simpler.
            </p>
            <div className="flex space-x-4">
              {/* X (Twitter) */}
              <a href="https://x.com/Talha_cmr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-nyx-blue transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Facebook */}
              <a href="https://www.facebook.com/bedrettin.camur" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-nyx-blue transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a href="https://www.instagram.com/nyxofficial.nl/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-nyx-blue transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Products</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigateTo('products')}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products', { category: 'sensors' })}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  Smart Sensors
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products', { category: 'lighting' })}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  Smart Lighting
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products', { category: 'security' })}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  Security Cameras
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigateTo('how-it-works')}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  How it Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('setup-videos')}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  Setup Videos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('faq')}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigateTo('our-story')}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('why-us')}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  Why Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('blog')}
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                >
                  Blog
                </button>
              </li>
              <li>
                <a
                  href="https://talhacamur.github.io/NYX/#legal/privacy"
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://talhacamur.github.io/NYX/#legal/terms"
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="https://talhacamur.github.io/NYX/#legal/shipping"
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="https://talhacamur.github.io/NYX/#legal/returns"
                  className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Return Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-nyx-gray/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 NYX. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button
                onClick={() => navigateTo('legal', { slug: 'privacy-policy', title: 'Privacy Policy' })}
                className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
              >
                Privacy
              </button>
              <button
                onClick={() => navigateTo('legal', { slug: 'terms-of-service', title: 'Terms of Service' })}
                className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
              >
                Terms
              </button>
              <button
                onClick={() => navigateTo('legal', { slug: 'shipping-policy', title: 'Shipping Policy' })}
                className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
              >
                Shipping
              </button>
              <button
                onClick={() => navigateTo('legal', { slug: 'return-policy', title: 'Return Policy' })}
                className="text-gray-400 hover:text-nyx-blue transition-colors text-sm"
              >
                Returns
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;