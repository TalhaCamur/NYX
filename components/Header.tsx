import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  navigateTo: (page: string, params?: any) => void;
}

const Header: React.FC<HeaderProps> = ({ navigateTo }) => {
  const { user, logout } = useAuth();
  const { getCartTotalQuantity, openCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigateTo('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="relative bg-nyx-black/90 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-nyx-black via-purple-900/5 to-nyx-black"></div>
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-r from-nyx-blue/10 to-cyan-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigateTo('home')}
              className="group relative text-2xl font-bold text-white hover:text-blue-400 transition-all duration-300"
            >
              <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-purple-700 transition-all duration-300">
                NYX
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {[
              { name: 'Home', page: 'home' },
              { name: 'Products', page: 'products' },
              { name: 'Blog', page: 'blog' },
              { name: 'Contact', page: 'contact' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigateTo(item.page)}
                className="group relative px-4 py-2 text-white hover:text-blue-400 transition-colors duration-300 rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 font-medium">{item.name}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 group-hover:w-full transition-all duration-300"></div>
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-white hover:text-blue-400 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {getCartTotalQuantity() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartTotalQuantity()}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="group flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-300 p-2 rounded-lg"
                >
                  <div className="relative">
                    <img
                      src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                      alt={user.nickname}
                      className="w-8 h-8 rounded-full ring-2 ring-white/20 group-hover:ring-blue-400/50 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full border-2 border-nyx-black"></div>
                  </div>
                  <span className="hidden md:block font-medium">{user.nickname}</span>
                  <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-nyx-gray/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 py-3 z-50 animate-slide-up">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm text-white font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => navigateTo('profile')}
                        className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </button>
                      {user.roles.includes('admin') || user.roles.includes('super-admin') && (
                        <button
                          onClick={() => navigateTo('admin')}
                          className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="bg-gradient-to-r from-blue-400 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-500 hover:to-purple-700 transition-all duration-300"
              >
                Login
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-blue-400 transition-colors duration-300 rounded-lg"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 animate-slide-up">
            <div className="bg-nyx-gray/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <nav className="flex flex-col space-y-2">
                {[
                  { name: 'Home', page: 'home' },
                  { name: 'Products', page: 'products' },
                  { name: 'Blog', page: 'blog' },
                  { name: 'Contact', page: 'contact' }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigateTo(item.page);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-white hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-white/10"
                  >
                    <span className="font-medium">{item.name}</span>
                    <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export { Header };