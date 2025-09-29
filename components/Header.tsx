import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
    navigateTo: (page: string, params?: any) => void;
}

const Header: React.FC<HeaderProps> = ({ navigateTo }) => {
  const { user, logout } = useAuth();
  const { getCartTotalQuantity, openCart } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  
  // Use real user from auth context
    
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
                <span className="relative z-10 font-medium">{item.name}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></div>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5" />
              </svg>
              {getCartTotalQuantity() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartTotalQuantity()}
                </span>
              )}
            </button>

            {/* Login/User Menu - DESKTOP İÇİN */}
            {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onMouseEnter={() => {
                  // Global event dispatch et
                  window.dispatchEvent(new CustomEvent('profileClick'));
                }}
                onMouseLeave={() => {
                  // Mouse çıkınca dropdown'ı kapat - timeout yok
                  // window.dispatchEvent(new CustomEvent('profileClick'));
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  zIndex: 1000,
                  transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  backdropFilter: 'blur(10px)',
                  transform: 'scale(1)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation: 'shimmer 2s infinite',
                    opacity: 0.6
                  }}></div>
                  <span style={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    fontSize: '12px',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'all 0.3s ease'
                  }}>
                    {user?.nickname?.substring(0, 2).toUpperCase() || user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.split('@')[0].substring(0, 2).toUpperCase() || 'U'}
                  </span>
                        </div>
                <span style={{ fontWeight: '500' }}>
                  {user?.nickname || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    backgroundColor: '#1f2937',
                    border: '4px solid #10b981',
                    borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                    zIndex: 1000
                  }}
                >
                  <div style={{ padding: '16px', borderBottom: '1px solid #4b5563' }}>
                    <p style={{ color: 'white', fontWeight: '600', fontSize: '14px', margin: '0 0 4px 0' }}>Test User</p>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>test@nyx.com</p>
                    <p style={{ color: '#10b981', fontSize: '12px', margin: '4px 0 0 0' }}>✅ MENU AÇILDI!</p>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    <button
                      onClick={() => {
                        navigateTo('profile');
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        color: 'white',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                        </button>
                    <button
                      onClick={() => {
                        navigateTo('admin');
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        color: 'white',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Admin Dashboard
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await handleLogout();
                        } catch (error) {
                          console.error('❌ Logout failed:', error);
                        }
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        color: '#ef4444',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#7f1d1d'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Login Button - User yoksa */
                <button
                    onClick={() => {
                        navigateTo('login');
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    Login
                </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-blue-400 transition-colors duration-300 rounded-lg"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
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
                        setIsMobileMenuOpen(false);
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