




import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import CartSidebar from './components/CartSidebar';
import AskNyx from './pages/AskNyxPage';
import { FAQ_DATA, FEATURES_DATA } from './constants';
import { useCart } from './contexts/CartContext';
import { Product, User, UserRole, BlogPost } from './types';
import { useAuth, supabase, testSupabaseConnection } from './contexts/AuthContext';
import CookieConsentBanner from './components/CookieConsentBanner';
import { ProductCard, ProductListItem } from './components/ProductShowcase';
import { ProductManagement } from './components/ProductManagement';
import { BlogManagement } from './components/BlogManagement';
import { OrderManagement } from './components/OrderManagement';
import { CouponManagement } from './components/CouponManagement';

// Product Detail Page Component
const ProductDetailPage = ({ navigateTo, product }: { navigateTo: (page: string, params?: any) => void, product?: Product }) => {
  const { addToCart } = useCart();
  
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <button 
            onClick={() => navigateTo('products')}
            className="bg-nyx-blue text-nyx-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nyx-black via-purple-900/20 to-nyx-black"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-nyx-blue/20 to-brand-purple/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={product.images?.[0] || product.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&crop=center'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Additional Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg">
                      <img 
                        src={image} 
                        alt={`${product.name} ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-8">
              {/* Tagline */}
              {product.tag_line && (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-nyx-blue/20 to-brand-purple/20 border border-nyx-blue/30">
                  <span className="w-2 h-2 bg-nyx-blue rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm font-medium text-gray-300">{product.tag_line}</span>
                </div>
              )}
              
              {/* Title */}
              <div>
                <h1 className="text-5xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
                <p className="text-xl text-gray-300 leading-relaxed">{product.description}</p>
              </div>
              
              {/* Price */}
              <div className="flex items-center space-x-6">
                {product.original_price && product.original_price > product.price ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl text-gray-400 line-through">€{product.original_price}</span>
                    <span className="text-5xl font-bold text-white">€{product.price}</span>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                    </div>
                  </div>
                ) : (
                  <span className="text-5xl font-bold text-white">€{product.price}</span>
                )}
              </div>
              
              {/* Stock */}
              <div className="flex items-center space-x-4">
                <span className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
                {product.sku && (
                  <span className="text-gray-400 text-sm">SKU: {product.sku}</span>
                )}
              </div>
              
              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="bg-nyx-gray/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-2xl font-bold mb-4 text-white">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-3 h-3 bg-nyx-blue rounded-full mr-3 flex-shrink-0"></span>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Specifications */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="bg-nyx-gray/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-2xl font-bold mb-4 text-white">Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400 font-medium">{key}:</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    product.stock > 0 
                      ? 'bg-gradient-to-r from-nyx-blue to-cyan-400 text-nyx-black hover:from-cyan-400 hover:to-nyx-blue shadow-lg hover:shadow-nyx-blue/25' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigateTo('products')}
                    className="py-3 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-nyx-blue hover:text-nyx-blue transition-colors"
                  >
                    Back to Products
                  </button>
                  <button
                    onClick={() => navigateTo('home')}
                    className="py-3 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-brand-purple hover:text-brand-purple transition-colors"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Info Section */}
      <div className="py-16 bg-dark-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Product Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Shipping Info */}
              <div className="text-center p-6 bg-nyx-gray/20 rounded-2xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-nyx-blue to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Free Shipping</h3>
                <p className="text-gray-400">Free shipping on all orders over €50</p>
              </div>
              
              {/* Warranty Info */}
              <div className="text-center p-6 bg-nyx-gray/20 rounded-2xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">2 Year Warranty</h3>
                <p className="text-gray-400">Comprehensive warranty coverage</p>
              </div>
              
              {/* Support Info */}
              <div className="text-center p-6 bg-nyx-gray/20 rounded-2xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-pink to-nyx-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">24/7 Support</h3>
                <p className="text-gray-400">Round-the-clock customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Dropdown Component - Header dışında
const ProfileDropdown = ({ navigateTo, isUserMenuOpen, setIsUserMenuOpen, user, profileData, setOpenAddForm }: { 
    navigateTo: (page: string, params?: any) => void;
    isUserMenuOpen: boolean;
    setIsUserMenuOpen: (value: boolean) => void;
    user: any;
    profileData: any;
    setOpenAddForm: (value: boolean) => void;
}) => {
    const { logout } = useAuth();
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

    // Hover delay için
    const handleMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setIsUserMenuOpen(false);
        }, 250); // 250ms delay
        setHoverTimeout(timeout);
    };
    
    if (!isUserMenuOpen) return null;

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed top-16 right-4 w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl z-50 overflow-hidden"
            style={{
                animation: 'bubbleSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: 'translateZ(0)',
                willChange: 'transform, opacity'
            }}
        >
            {/* Header Section */}
            <div className="p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                            {profileData?.nickname?.substring(0, 2).toUpperCase() || user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.split('@')[0].substring(0, 2).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">
                            {profileData?.nickname || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                        </h3>
                        <p className="text-gray-300 text-sm">{user?.email || 'user@example.com'}</p>
                        <div className="flex gap-1 mt-1">
                            {(user?.roles || ['user']).slice(0, 2).map((role, index) => (
                                <span 
                                    key={index}
                                    className={`px-2 py-0.5 text-xs rounded-full ${
                                        role === 'super-admin' ? 'bg-red-500/20 text-red-300' :
                                        role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                                        role === 'seller' ? 'bg-green-500/20 text-green-300' :
                                        role === 'content_writer' ? 'bg-orange-500/20 text-orange-300' :
                                        'bg-blue-500/20 text-blue-300'
                                    }`}
                                >
                                    {role.toUpperCase()}
                                </span>
                            ))}
                            {(user?.roles || []).length > 2 && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-300">
                                    +{(user?.roles || []).length - 2}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Menu Items */}
            <div className="p-4 space-y-2">
                {/* Profile */}
                <button
                    onClick={() => {
                        navigateTo('profile');
                        setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <span className="font-medium">Profile</span>
                </button>

                {/* Admin Dashboard */}
                {(user?.roles?.includes('admin') || user?.roles?.includes('super-admin')) && (
                    <button
                        onClick={() => {
                            navigateTo('admin');
                            setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                    >
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="font-medium">Admin Dashboard</span>
                    </button>
                )}

                {/* Product Management - Admin, Super Admin, Seller */}
                {((user?.roles?.includes('admin') || user?.roles?.includes('super-admin') || user?.roles?.includes('seller'))) && (
                    <>
                        <button
                            onClick={() => {
                                                setOpenAddForm(true);
                                setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="font-medium">Manage Products</span>
                        </button>
                        
                        <button
                            onClick={() => {
                                setOpenAddForm(true);
                                                setOpenAddForm(true);
                                setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                        >
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <span className="font-medium">Add New Product</span>
                        </button>
                    </>
                )}

                {/* Add Blog Post - Admin, Super Admin */}
                {((user?.roles?.includes('admin') || user?.roles?.includes('super-admin'))) && (
                    <button
                        onClick={() => {
                            // Add blog post functionality
                            setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                    >
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <span className="font-medium">Add Blog Post</span>
                    </button>
                )}

                {/* Divider */}
                <div className="border-t border-white/10 my-2"></div>

                {/* Logout */}
                <button
                    onClick={async () => {
                        try {
                            await logout();
                            navigateTo('home');
                        } catch (error) {
                            console.error('❌ ProfileDropdown Logout failed:', error);
                        }
                        setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
                >
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

// Define shared icons here to avoid creating new files
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

const PlusMinusIcon = ({ isOpen, className }: { isOpen: boolean; className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12" className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}></line>
    </svg>
);

// Icons for Contact Page
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);


// Google Icon for AuthForm
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.356-11.303-7.918l-6.573 5.013C9.657 39.646 16.318 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C41.332 36.636 44 31.023 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);

const AuthForm = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState('');
    const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // INSTANT LOADING
    const { login, signup, signInWithProvider, sendPasswordResetEmail } = useAuth();
    
    // Forgot Password State
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    
    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Password strength state
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: [] as string[],
        isValid: false
    });

    // Common weak passwords
    const commonPasswords = [
        'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567', 
        'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
        'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
        'qazwsx', 'michael', 'football', 'admin', 'welcome', 'login'
    ];

    // Password strength checker
    const checkPasswordStrength = (password: string) => {
        const feedback: string[] = [];
        let score = 0;

        // Length check
        if (password.length < 8) {
            feedback.push('At least 8 characters required');
        } else if (password.length >= 8 && password.length < 12) {
            score += 1;
            feedback.push('Good length, but 12+ characters recommended');
        } else if (password.length >= 12) {
            score += 2;
        }

        // Uppercase check
        if (!/[A-Z]/.test(password)) {
            feedback.push('Add at least one uppercase letter (A-Z)');
        } else {
            score += 1;
        }

        // Lowercase check
        if (!/[a-z]/.test(password)) {
            feedback.push('Add at least one lowercase letter (a-z)');
        } else {
            score += 1;
        }

        // Number check
        if (!/[0-9]/.test(password)) {
            feedback.push('Add at least one number (0-9)');
        } else {
            score += 1;
        }

        // Common password check
        if (commonPasswords.includes(password.toLowerCase())) {
            feedback.push('This is a commonly used password - choose something unique');
            score = 0;
        }

        // Email similarity check
        if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
            feedback.push('Password should not contain your email');
            score = Math.max(0, score - 2);
        }

        // Sequential characters check
        if (/(.)\1{2,}/.test(password)) {
            feedback.push('Avoid repeating characters (e.g., "aaa", "111")');
            score = Math.max(0, score - 1);
        }

        const isValid = password.length >= 8 && 
                       /[A-Z]/.test(password) && 
                       /[a-z]/.test(password) && 
                       /[0-9]/.test(password) &&
                       !commonPasswords.includes(password.toLowerCase());

        return { score, feedback, isValid };
    };

    // Update password strength when password changes (only for signup)
    React.useEffect(() => {
        if (!isLogin && password) {
            const strength = checkPasswordStrength(password);
            setPasswordStrength(strength);
        } else {
            setPasswordStrength({ score: 0, feedback: [], isValid: false });
        }
    }, [password, isLogin, email]);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🎯 Form submitted!");
        setError(null);
        setMessage(null);
        setLoading(true);
        console.log("🔄 Loading set to true");

        if (isLogin) {
            try {
                console.log("🚀 Starting login...");
                console.log("📧 Email:", email);
                console.log("🔑 Password length:", password.length);
                
                // Wait for login to complete
                console.log("🔄 Calling login function...");
                await login(email, password);
                console.log("✅ Login successful!");
                
                // Only navigate if login was successful
                setLoading(false);
                setMessage("Login successful! Redirecting...");
                console.log("🔄 Navigating to home...");
                navigateTo('home');
                
            } catch (err: any) {
                console.error("❌ Login error:", err);
                setError(err.message);
                setLoading(false); // Stop loading on error
            }
        } else {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                setLoading(false);
                return;
            }
            try {
                await signup(firstName, lastName, nickname, email, password, newsletterSubscribed);
                setMessage("Success! Please check your email to confirm your account.");
                // Reset form fields after successful signup
                setFirstName(''); setLastName(''); setNickname(''); setEmail(''); setPassword(''); setConfirmPassword(''); setNewsletterSubscribed(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false); // Stop loading on error
            }
        }
    };
    
    const handleProviderSignIn = async (provider: 'google') => {
        try {
            await signInWithProvider(provider);
            // On success, the onAuthStateChange listener will handle navigation
        } catch (err: any) {
            setError(err.message);
        }
    }
    
    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            await sendPasswordResetEmail(forgotPasswordEmail);
            setMessage(`If an account with ${forgotPasswordEmail} exists, a password reset link has been sent.`);
            setForgotPasswordEmail('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const renderInput = (id: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, required: boolean = true) => (
        <div className="relative">
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-nyx-blue transition-all"
                required={required}
            />
        </div>
    );
    
    if (isForgotPassword) {
        return (
             <div className="w-full max-w-md p-8 md:p-12 bg-nyx-black rounded-2xl border border-nyx-gray/50">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Reset Password</h2>
                    <p className="text-gray-400 mt-2">Enter your email to receive a password reset link.</p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                    {renderInput('forgot-email', 'email', forgotPasswordEmail, (e) => setForgotPasswordEmail(e.target.value), 'Your Email')}
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    
                    <button type="submit" disabled={loading} className="w-full bg-nyx-blue text-nyx-black font-bold py-3 px-8 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button onClick={() => setIsForgotPassword(false)} className="text-sm text-nyx-blue hover:underline">
                        Back to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md p-8 md:p-12 bg-nyx-black rounded-2xl border border-nyx-gray/50">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">{isLogin ? "Welcome Back" : "Create Account"}</h2>
                <p className="text-gray-400 mt-2">{isLogin ? "Sign in to continue" : "Join the future of smart living"}</p>
            </div>
            
            <form onSubmit={handleAuthAction} className="space-y-4">
                {!isLogin && (
                    <>
                        <div className="flex gap-4">
                            {renderInput('firstName', 'text', firstName, (e) => setFirstName(e.target.value), 'First Name')}
                            {renderInput('lastName', 'text', lastName, (e) => setLastName(e.target.value), 'Last Name')}
                        </div>
                        {renderInput('nickname', 'text', nickname, (e) => setNickname(e.target.value), 'Nickname')}
                    </>
                )}
                {renderInput('email', isLogin ? 'text' : 'email', email, (e) => setEmail(e.target.value), isLogin ? 'Email or Nickname' : 'Email')}
                
                {/* Password Input with Show/Hide */}
                <div>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isLogin ? "Password" : "Password (min 8 characters)"}
                            className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-nyx-blue transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    
                    {/* Password Strength Meter (only for signup) */}
                    {!isLogin && password && (
                        <div className="mt-3 space-y-2">
                            {/* Strength Bar */}
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1 flex-1 rounded-full transition-all ${
                                            level <= passwordStrength.score
                                                ? passwordStrength.score <= 2
                                                    ? 'bg-red-500'
                                                    : passwordStrength.score === 3
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                                : 'bg-gray-700'
                                        }`}
                                    />
                                ))}
                            </div>
                            {/* Strength Label */}
                            <div className="flex items-center justify-between text-xs">
                                <span className={`font-medium ${
                                    passwordStrength.score <= 2 ? 'text-red-400' :
                                    passwordStrength.score === 3 ? 'text-yellow-400' :
                                    'text-green-400'
                                }`}>
                                    {passwordStrength.score === 0 ? 'Very Weak' :
                                     passwordStrength.score === 1 ? 'Weak' :
                                     passwordStrength.score === 2 ? 'Fair' :
                                     passwordStrength.score === 3 ? 'Good' :
                                     passwordStrength.score === 4 ? 'Strong' : 'Very Strong'}
                                </span>
                                {passwordStrength.isValid && (
                                    <span className="text-green-400 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Valid
                                    </span>
                                )}
                            </div>
                            {/* Feedback */}
                            {passwordStrength.feedback.length > 0 && (
                                <ul className="space-y-1">
                                    {passwordStrength.feedback.map((fb, idx) => (
                                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                                            <span className="text-red-400 mt-0.5">•</span>
                                            {fb}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Confirm Password Input with Show/Hide (only for signup) */}
                {!isLogin && (
                    <div>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-nyx-blue transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <p className="mt-2 text-xs text-red-400">Passwords do not match</p>
                        )}
                    </div>
                )}
                
                {isLogin && (
                    <div className="text-right">
                        <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-nyx-blue hover:underline">
                            Forgot Password?
                        </button>
                    </div>
                )}
                
                {!isLogin && (
                    <>
                        <div className="flex items-center">
                            <input
                                id="newsletter"
                                name="newsletter"
                                type="checkbox"
                                checked={newsletterSubscribed}
                                onChange={(e) => setNewsletterSubscribed(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-600 bg-nyx-black text-nyx-blue focus:border-nyx-blue"
                            />
                            <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-400">
                                Subscribe to our newsletter for updates.
                            </label>
                        </div>
                        
                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="h-4 w-4 mt-0.5 rounded border-gray-600 bg-nyx-black text-nyx-blue focus:border-nyx-blue"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                                I agree to the{' '}
                                <button 
                                    type="button"
                                    onClick={() => navigateTo('legal/terms')}
                                    className="text-nyx-blue hover:underline font-medium"
                                >
                                    Terms & Conditions
                                </button>
                                {' '}and{' '}
                                <button 
                                    type="button"
                                    onClick={() => navigateTo('legal/privacy')}
                                    className="text-nyx-blue hover:underline font-medium"
                                >
                                    Privacy Policy
                                </button>
                                <span className="text-red-400 ml-1">*</span>
                            </label>
                        </div>
                    </>
                )}
                
                 {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                 {message && <p className="text-green-500 text-sm text-center">{message}</p>}

                <button type="submit" disabled={loading || (!isLogin && !acceptedTerms)} className="w-full bg-nyx-blue text-nyx-black font-bold py-3 px-8 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
            </form>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-nyx-black px-2 text-gray-500">Or continue with</span>
                </div>
            </div>

            <div>
                <button
                    onClick={() => handleProviderSignIn('google')}
                    className="w-full flex justify-center items-center gap-3 bg-nyx-gray border border-gray-700 rounded-lg py-3 px-4 text-white hover:bg-nyx-gray/50 transition-colors"
                >
                    <GoogleIcon className="w-6 h-6" />
                    <span>Sign in with Google</span>
                </button>
            </div>
            
            <p className="mt-8 text-center text-sm text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }} className="font-semibold text-nyx-blue hover:underline">
                    {isLogin ? 'Sign up' : 'Login'}
                </button>
            </p>
        </div>
    );
};

const LoginPage = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-dark py-12 px-4">
             <div className="w-full max-w-md">
                 <AuthForm navigateTo={navigateTo} />
            </div>
        </main>
    );
};


// Dummy pages
const HowItWorksPage = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };
    
     useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);

        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('ended', onEnded);

        return () => {
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('ended', onEnded);
        };
    }, []);

    return (
        <div className="py-24 md:py-32 bg-dark text-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">How NYX Works</h1>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Experience the simplicity and power of the NYX ecosystem. From unboxing to everyday use, smart living has never been this effortless.
                    </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-brand-purple/50">
                        <video ref={videoRef} className="w-full h-full object-cover" poster="https://images.unsplash.com/photo-1543286386-71314c48926b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" playsInline onClick={togglePlay}></video>
                         {!isPlaying && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer" onClick={togglePlay}>
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all">
                                     <PlayIcon className="w-10 h-10 text-white ml-1" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto mt-24 text-center">
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-brand-purple mb-4">1</div>
                        <h3 className="text-xl font-bold mb-2">Unbox & Power On</h3>
                        <p className="text-gray-400">Simply unbox your NYX device and connect it to power. The status light will guide you.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-brand-purple mb-4">2</div>
                        <h3 className="text-xl font-bold mb-2">Connect to Wi-Fi</h3>
                        <p className="text-gray-400">Open the NYX app, and it will automatically detect your new device and guide you through a quick Wi-Fi setup.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-brand-purple mb-4">3</div>
                        <h3 className="text-xl font-bold mb-2">Enjoy Smart Living</h3>
                        <p className="text-gray-400">That's it! Your device is now part of your smart home, ready to be controlled and automated.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
const SetupVideosPage = () => {
    const videos = [
        { id: 1, title: "Setting Up Your NYX-1 Sensor", duration: "3:45", thumbnail: "https://images.unsplash.com/photo-1614036855179-73b185c7c229?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { id: 2, title: "Connecting the NYX-Bulb", duration: "2:15", thumbnail: "https://images.unsplash.com/photo-1608999383953-d61f5d928ace?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { id: 3, title: "Automations with NYX-Cam", duration: "5:30", thumbnail: "https://images.unsplash.com/photo-1599351549026-e57573708f52?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { id: 4, title: "Advanced Features in the NYX App", duration: "8:12", thumbnail: "https://images.unsplash.com/photo-1558233043-4559e7a826a7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ];
    return (
        <div className="py-24 md:py-32 bg-dark text-white">
            <div className="container mx-auto px-4">
                 <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Setup Videos</h1>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Visual guides to help you get started with your NYX products in minutes.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map(video => (
                        <div key={video.id} className="group cursor-pointer">
                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                        <PlayIcon className="w-8 h-8 text-white ml-1" />
                                    </div>
                                </div>
                                <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md">{video.duration}</span>
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-brand-purple transition-colors">{video.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="py-24 md:py-32 bg-dark text-white">
            <div className="container mx-auto px-4">
                 <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Find answers to common questions about NYX products and services.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                    {FAQ_DATA.map((faq, index) => (
                        <div key={index} className="bg-dark-accent rounded-lg border border-white/10">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center text-left p-6"
                            >
                                <span className="text-lg font-semibold">{faq.question}</span>
                                <PlusMinusIcon isOpen={openIndex === index} className="w-6 h-6 text-brand-purple flex-shrink-0"/>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="p-6 pt-0 text-gray-400">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
const OurStoryPage = () => (
    <div className="py-24 md:py-32 bg-dark text-white">
        <div className="container mx-auto px-4">
             <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-center">Our Story</h1>
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-6">
                    <p>Founded in 2023 by a group of designers and engineers, NYX was born from a simple yet powerful idea: smart home technology should be beautiful, intuitive, and accessible to everyone. We were tired of the clunky, complicated devices that flooded the market, devices that promised a future of convenience but delivered a present of frustration.</p>
                    <p>We envisioned a different future. A future where your home anticipates your needs, where technology fades into the background, and where design and function exist in perfect harmony. This vision drove us to create our first product, the NYX-1 Smart Sensor.</p>
                     <figure className="my-12">
                        <img src="https://images.unsplash.com/photo-1580234811497-9df7fd2f337e?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="NYX Team working" className="w-full rounded-2xl shadow-lg"/>
                        <figcaption className="text-center text-sm text-gray-500 mt-4">The founding team in our first workshop.</figcaption>
                    </figure>
                    <p>Crafted from a single piece of aluminum and powered by our proprietary Adaptive AI, the NYX-1 was more than just a motion sensor; it was a statement. It was proof that technology could be both powerful and elegant. The success of the NYX-1 paved the way for a full ecosystem of products, each designed with the same core principles.</p>
                    <p>Today, NYX is a leader in the smart home industry, but our mission remains the same: to simplify life through thoughtful design and intelligent technology. We're still a small, passionate team, dedicated to pushing the boundaries of what a smart home can be. And we're just getting started.</p>
                </div>
            </div>
        </div>
    </div>
);
const WhyUsPage = () => (
    <div className="py-24 md:py-32 bg-dark text-white">
        <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Why Choose NYX?</h1>
                <p className="text-gray-300 text-lg md:text-xl">
                    We believe in a different approach to smart technology. Here's what sets us apart.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="bg-dark-accent p-8 rounded-2xl border border-white/10">
                    <h3 className="text-2xl font-bold mb-4">Design First</h3>
                    <p className="text-gray-400">We are designers at heart. Every product is meticulously crafted to not only perform its function flawlessly but to also enhance your living space. We use premium materials and a minimalist aesthetic to create devices you'll be proud to display.</p>
                </div>
                <div className="bg-dark-accent p-8 rounded-2xl border border-white/10">
                    <h3 className="text-2xl font-bold mb-4">Intelligent Simplicity</h3>
                    <p className="text-gray-400">Technology should make life easier, not more complicated. From a setup process that takes seconds to an AI that learns your habits, our focus is on creating a user experience that is powerful yet effortlessly simple.</p>
                </div>
                <div className="bg-dark-accent p-8 rounded-2xl border border-white/10">
                    <h3 className="text-2xl font-bold mb-4">Customer-Centric</h3>
                    <p className="text-gray-400">You are at the center of everything we do. We offer lifetime support for all our products and actively listen to our community to continuously improve our software and develop new products that solve real-world problems.</p>
                </div>
            </div>
        </div>
    </div>
);
const ProductsPage = ({ navigateTo, setOpenAddForm }: { navigateTo: (page: string, params?: any) => void, setOpenAddForm: (value: boolean) => void }) => {
     const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false); // INSTANT LOADING
    const [forceUpdate, setForceUpdate] = useState(0); // Added for force re-render
    const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
     const isAuthorized = user && (user.roles.includes('seller') || user.roles.includes('admin') || user.roles.includes('super-admin'));
    
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    // Fetch products from database - INSTANT LOADING
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Use Supabase client instead of direct fetch
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) {
                    // Silently handle error if it's just a connection issue on refresh
                    if (error.message && !error.message.includes('Could not fetch')) {
                        console.error("❌ ProductsPage: Supabase error:", error);
                    }
                    setProducts([]);
                    setLoading(false);
                    return;
                }
                
                // Format products
                const formattedProducts = data?.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    original_price: product.original_price,
                    imageUrl: product.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
                    images: product.images || ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'],
                    description: product.description,
                    category: product.category,
                    isVisible: product.is_visible,
                    stock: product.stock,
                    created_at: product.created_at
                })) || [];
                
                setProducts(formattedProducts);
                setLoading(false);
                
            } catch (error) {
                // Silently handle catch errors on refresh
                setProducts([]);
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, []); // Only fetch once on mount
    
    // Sort and filter products
    const displayedProducts = React.useMemo(() => {
        let filtered = isAuthorized ? products : products.filter(p => p.isVisible);
        
        // Sort products
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'newest':
                default:
                    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
            }
        });
        
        return sorted;
    }, [products, isAuthorized, sortBy]);

    return (
        <div className="min-h-screen bg-dark text-white">
            {/* Elegant Products Header */}
            <section className="relative py-16 border-b border-gray-800/50">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-nyx-blue/5 via-transparent to-transparent"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Small badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-nyx-blue/10 to-brand-purple/10 border border-nyx-blue/20 mb-6">
                            <div className="w-1.5 h-1.5 bg-nyx-blue rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-gray-300 tracking-wide">SMART HOME COLLECTION</span>
                        </div>
                        
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            NYX <span className="bg-gradient-to-r from-nyx-blue via-brand-purple to-brand-pink text-transparent bg-clip-text">Products</span>
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-gray-400 text-lg mb-6">
                            Discover our complete range of smart home devices
                        </p>
                        
                        {/* Controls Row */}
                        <div className="flex items-center justify-center gap-4 text-sm">
                            {/* Product count */}
                            <div className="flex items-center gap-2 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span>{displayedProducts.length} {displayedProducts.length === 1 ? 'Product' : 'Products'}</span>
                            </div>
                            
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-transparent text-white text-sm border-0 outline-none appearance-none cursor-pointer"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A-Z</option>
                            </select>
                            
                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-1 bg-nyx-gray rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${
                                        viewMode === 'grid' 
                                            ? 'bg-gray-700 text-white' 
                                            : 'text-gray-400'
                                    }`}
                                    title="Grid View"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded ${
                                        viewMode === 'list' 
                                            ? 'bg-gray-700 text-white' 
                                            : 'text-gray-400'
                                    }`}
                                    title="List View"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Management Button - Only for authorized users */}
                            {isAuthorized && (
                                <button
                                    onClick={() => setOpenAddForm(true)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white rounded-lg hover:bg-white/10 font-medium text-xs border border-white/10"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Manage
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-32">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-3 border-nyx-blue/30 border-t-nyx-blue rounded-full animate-spin"></div>
                                <p className="text-gray-400">Loading...</p>
                            </div>
                        </div>
                    ) : displayedProducts.length === 0 ? (
                        <div className="flex justify-center items-center py-32">
                            <div className="text-center max-w-md">
                                <div className="w-20 h-20 bg-nyx-gray/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
                                <p className="text-gray-400 text-sm mb-6">No products are currently available.</p>
                                {isAuthorized && (
                                    <button
                                        onClick={() => setOpenAddForm(true)}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-nyx-blue text-nyx-black rounded-lg hover:bg-white transition-colors font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Your First Product
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                                : 'flex flex-col gap-6'
                        }>
                            {displayedProducts.map(product => (
                                viewMode === 'grid' ? (
                                    <ProductCard key={product.id} product={product} navigateTo={navigateTo} />
                                ) : (
                                    <ProductListItem key={product.id} product={product} navigateTo={navigateTo} />
                                )
                            ))}
                        </div>
                    )}
            </div>
            </section>
            
        </div>
    );
};
const BlogPage = ({ navigateTo }: { navigateTo: (page: string, params?: any) => void }) => {
    const { user } = useAuth();
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(false); // INSTANT LOADING
    const [forceUpdate, setForceUpdate] = useState(0); // Added for force re-render
    const [showBlogManagement, setShowBlogManagement] = useState(false);
    const isAuthorized = user && (user.roles.includes('admin') || user.roles.includes('super-admin'));
    
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    // Fetch blog posts from database - INSTANT LOADING
    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                // Use Supabase client instead of direct fetch
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });
                
                if (error) {
                    // Silently handle error if it's just a connection issue on refresh
                    if (error.message && !error.message.includes('Could not fetch')) {
                        console.error("❌ BlogPage: Supabase error:", error);
                    }
                    setBlogPosts([]);
                    setLoading(false);
                    return;
                }
                
                // Format blog posts
                const formattedPosts = data?.map(post => ({
                    id: post.id,
                    title: post.title,
                    author: post.author_name || 'NYX Team',
                    date: post.created_at,
                    imageUrl: post.featured_image || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    excerpt: post.excerpt || post.content?.substring(0, 150) + '...' || 'Read more about this topic...',
                    content: post.content || 'Full content here...'
                })) || [];
                
                setBlogPosts(formattedPosts);
                setLoading(false);
                
            } catch (error) {
                // Silently handle catch errors on refresh
                setBlogPosts([]);
                setLoading(false);
            }
        };
        
        fetchBlogPosts();
    }, []); // Only fetch once on mount
    
    // Show BlogManagement if user is authorized and clicked "New Post"
    if (showBlogManagement && isAuthorized) {
        return (
            <div className="min-h-screen bg-dark text-white">
                <div className="container mx-auto px-4 py-8">
                    <button
                        onClick={() => setShowBlogManagement(false)}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Blog
                    </button>
                    <BlogManagement onUpdate={() => {
                        setShowBlogManagement(false);
                        setForceUpdate(prev => prev + 1);
                    }} />
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-dark text-white">
            {/* Elegant Blog Header */}
            <section className="relative py-16 border-b border-gray-800/50">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 via-transparent to-transparent"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Small badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-pink/10 to-brand-purple/10 border border-brand-pink/20 mb-6">
                            <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-gray-300 tracking-wide">LATEST INSIGHTS</span>
                        </div>
                        
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            NYX <span className="bg-gradient-to-r from-brand-pink via-brand-purple to-nyx-blue text-transparent bg-clip-text">Blog</span>
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-gray-400 text-lg mb-6">
                            Stories, insights, and updates from the NYX team
                        </p>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                <span>{blogPosts.length} {blogPosts.length === 1 ? 'Post' : 'Posts'}</span>
                            </div>
                            {isAuthorized && (
                                <button
                                    onClick={() => setShowBlogManagement(true)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white rounded-lg hover:bg-white/10 font-medium text-xs border border-white/10"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Manage Blogs
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Posts */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-nyx-blue/30 border-t-nyx-blue rounded-full animate-spin"></div>
                                <p className="text-gray-400 text-lg">Loading blog posts...</p>
                            </div>
                        </div>
                    ) : blogPosts.length === 0 ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No Blog Posts Found</h3>
                                <p className="text-gray-400 mb-6">There are no blog posts available at the moment.</p>
                                {isAuthorized && (
                                    <button
                                        onClick={() => setShowBlogManagement(true)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Add First Blog Post
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {blogPosts.map((post, index) => (
                            <div key={post.id} className="group relative">
                                {/* Card Glow Effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple via-brand-pink to-nyx-blue rounded-3xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                                
                                <div className="relative bg-nyx-gray/30 backdrop-blur-sm rounded-3xl overflow-hidden flex flex-col border border-white/20 hover:border-brand-purple/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-brand-purple/20">
                                    {/* Image with overlay */}
                                    <div className="aspect-video overflow-hidden relative">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-nyx-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute top-4 left-4">
                                            <div className="bg-brand-purple/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                                        </div>
                                    </div>
                                    
                            <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 bg-nyx-blue rounded-full animate-pulse"></div>
                                            <span className="text-xs text-gray-400 font-medium">BLOG POST</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 flex-grow group-hover:text-nyx-blue transition-colors leading-tight">{post.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">{post.author.charAt(0)}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">By {post.author}</span>
                                            </div>
                                            <a 
                                                href="#" 
                                                onClick={(e) => { e.preventDefault(); navigateTo('blog-post', { post: post }); }} 
                                                className="group/link flex items-center gap-2 text-nyx-blue hover:text-cyan-400 font-semibold text-sm transition-colors"
                                            >
                                    Read More
                                                <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                </a>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    ))}
                </div>
                    )}
            </div>
            </section>
        </div>
    );
};
const BlogPostPage = ({ navigateTo, post }: { navigateTo: (page: string) => void, post: BlogPost }) => {
     return (
        <div className="min-h-screen bg-dark text-white">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-nyx-black via-brand-purple/10 to-nyx-black"></div>
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-nyx-blue/20 to-brand-purple/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <button onClick={() => navigateTo('blog')} className="flex items-center gap-2 text-brand-purple hover:text-brand-purple/80 mb-8 group">
                            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </button>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                            {post.title}
                        </h1>
                    <div className="flex items-center gap-4 text-gray-400 mb-8">
                            <span>By <span className="text-nyx-blue font-semibold">{post.author}</span></span>
                        <span>&bull;</span>
                        <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-nyx-black via-nyx-gray/10 to-nyx-black"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-nyx-gray/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 mb-8">
                            <img src={post.imageUrl} alt={post.title} className="w-full aspect-video object-cover" />
                        </div>
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                        {/* In a real app, this would be sanitized HTML */}
                            <p className="text-xl text-gray-200 mb-6">{post.excerpt} {post.content}</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat.</p>
                    </div>
                </div>
            </div>
            </section>
        </div>
     );
};
const LegalPage = ({ navigateTo, slug, title }: { navigateTo: (page: string) => void, slug: string, title: string }) => {
    const { user } = useAuth();
    const isAuthorized = user && (user.roles.includes('admin') || user.roles.includes('super-admin'));

    const [documentContent, setDocumentContent] = useState('');
    const [lastUpdated, setLastUpdated] = useState('');
    const [editableContent, setEditableContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        const fetchDocument = async () => {
            setIsLoading(true);
            setError('');
            setSaveStatus('');
            try {
                const { data, error } = await supabase
                    .from('legal_documents')
                    .select('content, last_updated')
                    .eq('slug', slug)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;
                if (data) {
                    setDocumentContent(data.content || "This document has not been written yet.");
                    setLastUpdated(data.last_updated);
                } else {
                    setDocumentContent("This document has not been written yet.");
                    setError('Document not found.');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch document.');
                setDocumentContent('Content could not be loaded.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocument();
    }, [slug]);

    const handleEdit = () => {
        setEditableContent(documentContent);
        setIsEditing(true);
        setSaveStatus('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditableContent('');
    };

    const handleSave = async () => {
        setSaveStatus('Saving...');
        try {
            const { data, error } = await supabase
                .from('legal_documents')
                .update({ content: editableContent, last_updated: new Date().toISOString() })
                .eq('slug', slug)
                .select('last_updated')
                .single();
            
            if (error) throw error;

            setDocumentContent(editableContent);
            if(data) setLastUpdated(data.last_updated);
            setSaveStatus('Changes saved successfully!');
            setIsEditing(false);
            setTimeout(() => setSaveStatus(''), 3000); // Clear status after 3s
        } catch (err: any) {
            setSaveStatus(`Error: ${err.message}`);
        }
    };

    if (isLoading) {
        return (
            <div className="py-24 md:py-32 bg-dark text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">Loading document...</div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="py-24 md:py-32 bg-dark text-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                     <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-brand-purple hover:text-brand-purple/80 mb-8">
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Home
                    </button>
                    <div className="flex justify-between items-start mb-8 gap-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
                        {isAuthorized && !isEditing && (
                            <button onClick={handleEdit} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-dark-accent p-3 rounded-lg border border-white/10 flex-shrink-0">
                                <EditIcon className="w-5 h-5"/>
                                <span className="hidden sm:inline">Edit</span>
                            </button>
                        )}
                    </div>
                    {isEditing ? (
                        <div className="space-y-4">
                             <textarea 
                                value={editableContent}
                                onChange={(e) => setEditableContent(e.target.value)}
                                className="w-full min-h-[500px] bg-dark-accent border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple font-mono"
                            />
                            <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
                               {saveStatus && <p className={`text-sm ${saveStatus.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{saveStatus}</p>}
                                <button onClick={handleCancel} className="border border-gray-600 text-gray-300 font-medium py-2 px-5 rounded-full hover:border-white hover:text-white transition-all w-full sm:w-auto">Cancel</button>
                                <button onClick={handleSave} disabled={saveStatus === 'Saving...'} className="bg-brand-purple text-white font-semibold py-2 px-5 rounded-full hover:bg-brand-purple/80 transition-all disabled:opacity-50 w-full sm:w-auto">
                                    {saveStatus === 'Saving...' ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                            {error && !error.includes('Document not found') ? <p className="text-red-400">{error}</p> : <p style={{whiteSpace: 'pre-wrap'}}>{documentContent}</p>}
                            {lastUpdated && (!error || error.includes('Document not found')) && (
                                <p className="text-sm text-gray-500 mt-8">Last Updated: {new Date(lastUpdated).toLocaleString()}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Admin & User Profile pages
const AddProductPage = () => <div className="p-8 text-white min-h-screen pt-24">Add Product Form...</div>;
const EditProductPage = ({ id }: {id: string}) => <div className="p-8 text-white min-h-screen pt-24">Edit Product Form for {id}...</div>;
const AddBlogPostPage = () => <div className="p-8 text-white min-h-screen pt-24">Add Blog Post Form...</div>;
const AdminDashboardPage = () => {
    const { fetchAllUsers, updateUserRoles, deleteUserAsAdmin, user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Role-based access control
    const isAuthorized = currentUser && (currentUser.roles.includes('admin') || currentUser.roles.includes('super-admin'));
    const isSuperAdmin = currentUser && currentUser.roles.includes('super-admin');

    // State for modals
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
    const [modalActionLoading, setModalActionLoading] = useState(false);

    // State for management components
    const [showBlogManagement, setShowBlogManagement] = useState(false);
    const [showOrderManagement, setShowOrderManagement] = useState(false);
    const [showCouponManagement, setShowCouponManagement] = useState(false);

    const availableRoles: UserRole[] = ['user', 'seller', 'content_writer', 'admin', 'super-admin', 'Web Developer', 'UI/UX Designer'];

    const roleColorMap: Record<UserRole, string> = {
        'super-admin': 'bg-red-500/20 text-red-400 border-red-500/30',
        'admin': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'seller': 'bg-green-500/20 text-green-400 border-green-500/30',
        'content_writer': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'user': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        'Web Developer': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'UI/UX Designer': 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    
    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const allUsers = await fetchAllUsers();
            setUsers(allUsers);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    }, [fetchAllUsers]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = users.filter(user =>
            user.firstName.toLowerCase().includes(lowercasedFilter) ||
            user.lastName.toLowerCase().includes(lowercasedFilter) ||
            user.nickname.toLowerCase().includes(lowercasedFilter) ||
            user.email.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);
    
    const handleEditRolesClick = (user: User) => {
        setEditingUser(user);
        setSelectedRoles(user.roles);
    };

    const handleRoleChange = (role: UserRole, isChecked: boolean) => {
        setSelectedRoles(prev => 
            isChecked ? [...prev, role] : prev.filter(r => r !== role)
        );
    };

    const handleSaveRoles = async () => {
        if (!editingUser) return;
        setModalActionLoading(true);
        try {
            await updateUserRoles(editingUser.id, selectedRoles);
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, roles: selectedRoles } : u));
            setEditingUser(null);
        } catch (err: any) {
            alert(`Error updating roles: ${err.message}`);
        } finally {
            setModalActionLoading(false);
        }
    };
    
    const handleDeleteUserClick = (user: User) => {
        setDeletingUser(user);
    };

    const confirmDeleteUser = async () => {
        if (!deletingUser) return;
        setModalActionLoading(true);
        try {
            await deleteUserAsAdmin(deletingUser.id);
            setUsers(users.filter(u => u.id !== deletingUser.id));
            setDeletingUser(null);
        } catch (err: any) {
             alert(`Error deleting user: ${err.message}`);
        } finally {
            setModalActionLoading(false);
        }
    };

    const renderModals = () => (
        <>
            {/* Edit Roles Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/60 z-[101] backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-dark-accent rounded-2xl border border-white/10 p-6 sm:p-8 w-full max-w-lg">
                        <h3 className="text-xl sm:text-2xl font-bold mb-4">Edit Roles for {editingUser.nickname}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-6">
                            {availableRoles.map(role => (
                                <label key={role} className="flex items-center gap-3 bg-dark p-3 rounded-lg cursor-pointer hover:bg-nyx-gray/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role)}
                                        onChange={(e) => handleRoleChange(role, e.target.checked)}
                                        className="h-5 w-5 rounded border-gray-600 bg-nyx-black text-nyx-blue focus:ring-nyx-blue"
                                    />
                                    <span className={`px-2 py-1 text-xs font-medium rounded-md border ${roleColorMap[role] || roleColorMap['user']}`}>{role}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button onClick={() => setEditingUser(null)} className="border border-gray-600 text-gray-300 font-medium py-2 px-5 rounded-full hover:border-white hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleSaveRoles} disabled={modalActionLoading} className="bg-brand-purple text-white font-semibold py-2 px-5 rounded-full hover:bg-brand-purple/80 transition-colors disabled:opacity-50">
                                {modalActionLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete User Modal */}
            {deletingUser && (
                 <div className="fixed inset-0 bg-black/60 z-[101] backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-dark-accent rounded-2xl border border-white/10 p-6 sm:p-8 w-full max-w-md text-center">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">Delete User</h3>
                        <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="font-bold text-white">{deletingUser.nickname}</span>? This action is irreversible.</p>
                         <div className="flex justify-center gap-4 mt-8">
                            <button onClick={() => setDeletingUser(null)} className="border border-gray-600 text-gray-300 font-medium py-2 px-5 rounded-full hover:border-white hover:text-white flex-1 transition-colors">Cancel</button>
                            <button onClick={confirmDeleteUser} disabled={modalActionLoading} className="bg-red-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-red-700 flex-1 transition-colors disabled:opacity-50">
                                {modalActionLoading ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    // Access control check
    if (!isAuthorized) {
        return (
            <div className="py-24 md:py-32 bg-dark text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
                    <p className="text-gray-400 mb-6">You don't have permission to access the admin panel.</p>
                    <p className="text-sm text-gray-500">Required roles: Admin or Super Admin</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="py-24 md:py-32 bg-dark text-white min-h-screen flex items-center justify-center">Loading users...</div>;
    }

    if (error) {
         return <div className="py-24 md:py-32 bg-dark text-red-400 min-h-screen flex items-center justify-center">Error: {error}</div>;
    }
    
    return (
        <>
            {renderModals()}
            {showBlogManagement && <BlogManagement onClose={() => setShowBlogManagement(false)} />}
            {showOrderManagement && <OrderManagement onClose={() => setShowOrderManagement(false)} />}
            {showCouponManagement && <CouponManagement onClose={() => setShowCouponManagement(false)} />}
            
        <div className="py-24 md:py-32 bg-dark text-white min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <UsersIcon className="w-8 h-8 text-brand-purple"/>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                    </div>
                     <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 bg-dark-accent border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                </div>

                {/* Management Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <button
                        onClick={() => setOpenAddForm(true)}
                        className="bg-nyx-blue text-nyx-black p-4 rounded-lg hover:bg-white transition-colors text-center"
                    >
                        <h3 className="font-semibold mb-2">Product Management</h3>
                        <p className="text-sm">Manage products, inventory, and pricing</p>
                    </button>
                    <button
                        onClick={() => setShowBlogManagement(true)}
                        className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
                    >
                        <h3 className="font-semibold mb-2">Blog Management</h3>
                        <p className="text-sm">Create and manage blog posts</p>
                    </button>
                    <button
                        onClick={() => setShowOrderManagement(true)}
                        className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
                    >
                        <h3 className="font-semibold mb-2">Order Management</h3>
                        <p className="text-sm">View and process orders</p>
                    </button>
                    <button
                        onClick={() => setShowCouponManagement(true)}
                        className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors text-center"
                    >
                        <h3 className="font-semibold mb-2">Coupon Management</h3>
                        <p className="text-sm">Create and manage discount codes</p>
                    </button>
                </div>
                
                <div className="bg-dark-accent border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-white/10">
                                <tr>
                                    <th className="p-4 font-semibold">User</th>
                                    <th className="p-4 font-semibold hidden md:table-cell">Nickname</th>
                                    <th className="p-4 font-semibold">Roles</th>
                                    <th className="p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => {
                                    if (!currentUser) return null;
                                    const isTargetSuperAdmin = user.roles.includes('super-admin');
                                    const isTargetAdmin = user.roles.includes('admin');
                                    const isCurrentUserSuperAdmin = currentUser.roles.includes('super-admin');
                                    const isCurrentUserAdmin = currentUser.roles.includes('admin');

                                    const canEdit = user.id !== currentUser.id && (isCurrentUserSuperAdmin || (isCurrentUserAdmin && !isTargetAdmin && !isTargetSuperAdmin));
                                    const canDelete = user.id !== currentUser.id && !isTargetSuperAdmin && (isCurrentUserSuperAdmin || (isCurrentUserAdmin && !isTargetAdmin));

                                    return (
                                        <tr key={user.id} className="border-b border-white/10 last:border-b-0 hover:bg-dark/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} alt={user.nickname} className="w-10 h-10 rounded-full" />
                                                    <div>
                                                        <div className="font-semibold text-white">{user.firstName} {user.lastName}</div>
                                                        <div className="text-sm text-gray-400">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <span className="text-white font-medium">@{user.nickname}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map(role => (
                                                        <span key={role} className={`px-2 py-1 text-xs font-medium rounded-md border ${roleColorMap[role] || roleColorMap['user']}`}>
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => handleEditRolesClick(user)}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                            title="Edit Roles"
                                                        >
                                                            <EditIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDeleteUserClick(user)}
                                                            className="text-red-400 hover:text-red-300 transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

// Placeholder components for missing pages

// Main App Component
const App = () => {
    // Initialize from URL hash
    const getInitialPage = () => {
        const hash = window.location.hash.slice(1); // Remove '#'
        return hash || 'home';
    };
    
    const [currentPage, setCurrentPage] = useState(getInitialPage());
    const [pageParams, setPageParams] = useState<any>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [openAddForm, setOpenAddForm] = useState(false);
    
    // Listen to hash changes (browser back/forward)
    React.useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1) || 'home';
            setCurrentPage(hash);
            setPageParams(null);
        };
        
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    // Debug state changes
    React.useEffect(() => {
    }, []);
    
    React.useEffect(() => {
    }, [openAddForm]);
    const [profileData, setProfileData] = useState<any>(null);
    const { user, loading } = useAuth();
    const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing');

    // Skip connection test for now - just set as connected
    React.useEffect(() => {
        setConnectionStatus('connected');
    }, []);

    // Load profile data
    React.useEffect(() => {
        const loadProfileData = async () => {
            if (!user) {
                setProfileData(null);
                return;
            }
            
            try {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error loading profile:', error);
                    setProfileData(null);
                } else if (profile) {
                    setProfileData(profile);
                } else {
                    setProfileData(null);
                }
            } catch (error) {
                console.error('Error loading profile data:', error);
                setProfileData(null);
            }
        };

        loadProfileData();
    }, [user]);

    // Global event listener
    React.useEffect(() => {
        const handleProfileClick = () => {
            setIsUserMenuOpen(prev => {
                return !prev;
            });
        };

        window.addEventListener('profileClick', handleProfileClick);
        return () => {
            window.removeEventListener('profileClick', handleProfileClick);
        };
    }, []);

    const navigateTo = (page: string, params?: any) => {
        // Update URL hash for browser history
        window.location.hash = page;
        setCurrentPage(page);
        setPageParams(params);
        // Scroll to top when navigating
        window.scrollTo(0, 0);
    };

        const renderPage = () => {
            switch (currentPage) {
                case 'home':
                    return <HomePage navigateTo={navigateTo} />;
                case 'login':
                    return <LoginPage navigateTo={navigateTo} />;
                case 'profile':
                    return <ProfilePage navigateTo={navigateTo} />;
                case 'products':
                    return <ProductsPage navigateTo={navigateTo} setOpenAddForm={setOpenAddForm} />;
                case 'product-detail':
                    return <ProductDetailPage navigateTo={navigateTo} product={pageParams?.product} />;
                case 'blog':
                    return <BlogPage navigateTo={navigateTo} />;
                case 'blog-post':
                    return <BlogPostPage navigateTo={navigateTo} post={pageParams?.post} />;
                case 'how-it-works':
                    return <HowItWorksPage />;
                case 'setup-videos':
                    return <SetupVideosPage />;
                case 'faq':
                    return <FAQPage />;
                case 'contact':
                    return <ContactPage navigateTo={navigateTo} />;
                case 'checkout':
                    return <CheckoutPage navigateTo={navigateTo} />;
                case 'our-story':
                    return <OurStoryPage />;
                case 'why-us':
                    return <WhyUsPage />;
                case 'ask':
                    return <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>
                        <h1>Ask NYX</h1>
                        <p>Coming Soon...</p>
                    </div>;
                case 'admin':
                    return <AdminDashboardPage />;
                case 'legal':
                    return <LegalPage navigateTo={navigateTo} slug={pageParams?.slug} title={pageParams?.title} />;
                default:
                    return <HomePage navigateTo={navigateTo} />;
            }
        };

        // INSTANT LOADING - No loading screen

    return (
        <div className="min-h-screen bg-dark text-white">
            <Header navigateTo={navigateTo} />
            <main>
                {renderPage()}
            </main>
            <Footer navigateTo={navigateTo} />
            <CartSidebar navigateTo={navigateTo} />
            <CookieConsentBanner />
            
            {/* Profile Dropdown - App Level */}
            {user && (
                <ProfileDropdown 
                    navigateTo={navigateTo} 
                    isUserMenuOpen={isUserMenuOpen}
                    setIsUserMenuOpen={setIsUserMenuOpen}
                    user={user}
                    profileData={profileData}
                    setOpenAddForm={setOpenAddForm}
                />
            )}
            
            {/* Product Management Modal - App Level */}
            {openAddForm && (
                <ProductManagement 
                    onClose={() => {
                        setOpenAddForm(false);
                    }} 
                    openAddForm={false}
                />
            )}
        </div>
    );
};

export default App;