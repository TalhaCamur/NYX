import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { FEATURES_DATA, TESTIMONIALS_DATA } from '../constants';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../contexts/AuthContext';

interface HomePageProps {
  navigateTo: (page: string, params?: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_visible', true)
        .limit(4);
      
      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

    return (
    <div className="min-h-screen bg-dark text-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-nyx-black via-purple-900/30 to-nyx-black"></div>
        
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-nyx-blue/20 to-brand-purple/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-brand-pink/20 to-nyx-blue/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 border border-brand-purple/30 mb-6">
                <span className="w-2 h-2 bg-nyx-blue rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-300">Next-Gen Smart Home Technology</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
              The Future of
              <span className="block bg-gradient-to-r from-brand-purple via-brand-pink to-nyx-blue text-transparent bg-clip-text animate-pulse">
                Smart Living
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the perfect blend of <span className="text-nyx-blue font-semibold">intelligent technology</span> and 
              <span className="text-brand-purple font-semibold"> elegant design</span>. 
              NYX devices learn your habits to create a truly personalized smart home.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => navigateTo('products')}
                className="group relative bg-gradient-to-r from-nyx-blue to-cyan-400 text-nyx-black font-bold py-5 px-10 rounded-full hover:from-cyan-400 hover:to-nyx-blue transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-nyx-blue/25"
              >
                <span className="relative z-10">Explore Products</span>
                <div className="absolute inset-0 bg-gradient-to-r from-nyx-blue to-cyan-400 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
              </button>
              <button
                onClick={() => navigateTo('how-it-works')}
                className="group border-2 border-white/30 text-white font-semibold py-5 px-10 rounded-full hover:border-brand-purple/50 hover:bg-brand-purple/10 transition-all duration-300 backdrop-blur-sm"
              >
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-nyx-blue mb-2">24+</div>
                <div className="text-gray-400">Months Battery Life</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-purple mb-2">16M</div>
                <div className="text-gray-400">Color Options</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-pink mb-2">99%</div>
                <div className="text-gray-400">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 md:py-32 bg-dark-accent overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-nyx-black via-purple-900/10 to-nyx-black"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-nyx-blue/10 to-brand-purple/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 border border-brand-purple/30 mb-6">
              <span className="w-2 h-2 bg-nyx-blue rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-300">Advanced Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Why Choose
              <span className="block bg-gradient-to-r from-brand-purple via-brand-pink to-nyx-blue text-transparent bg-clip-text">
                NYX?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We've reimagined smart home technology with a focus on 
              <span className="text-nyx-blue font-semibold"> simplicity</span>, 
              <span className="text-brand-purple font-semibold"> beauty</span>, and 
              <span className="text-brand-pink font-semibold"> intelligence</span>.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES_DATA.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-nyx-gray/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-brand-purple/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-brand-purple/10">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-purple to-brand-pink rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-glow">
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-nyx-blue transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-nyx-black via-nyx-gray/20 to-nyx-black"></div>
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-l from-nyx-blue/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-r from-brand-pink/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-nyx-blue/20 to-brand-purple/20 border border-nyx-blue/30 mb-6">
              <span className="w-2 h-2 bg-brand-pink rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-300">Premium Collection</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Featured
              <span className="block bg-gradient-to-r from-nyx-blue via-brand-purple to-brand-pink text-transparent bg-clip-text">
                Products
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover our most popular smart home devices, designed to work together 
              <span className="text-nyx-blue font-semibold"> seamlessly</span>.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="text-gray-400">Loading products...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 hover:text-nyx-blue transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{product.tagline}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-nyx-blue text-nyx-black py-2 rounded-lg font-semibold hover:bg-white transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <button
              onClick={() => navigateTo('products')}
              className="bg-transparent border border-nyx-blue text-nyx-blue font-semibold py-3 px-8 rounded-full hover:bg-nyx-blue hover:text-nyx-black transition-all duration-300"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-dark-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-300 text-lg md:text-xl">
              Join thousands of satisfied customers who have transformed their homes with NYX.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.map((testimonial, index) => (
              <div key={index} className="bg-nyx-black rounded-2xl p-8 border border-white/10">
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.publication}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple via-brand-pink to-nyx-blue"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-nyx-black/50 to-transparent"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-nyx-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-pink/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-white">Ready to Start?</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white">
              Ready to Transform
              <span className="block bg-gradient-to-r from-white via-cyan-200 to-white text-transparent bg-clip-text">
                Your Home?
              </span>
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join the smart home revolution. Start with one device and build your 
              <span className="text-cyan-200 font-semibold"> perfect ecosystem</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigateTo('products')}
                className="group relative bg-white text-brand-purple font-bold py-5 px-10 rounded-full hover:bg-gray-100 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25"
              >
                <span className="relative z-10">Shop Now</span>
                <div className="absolute inset-0 bg-white rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className="group border-2 border-white/50 text-white font-semibold py-5 px-10 rounded-full hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    );
};

export default HomePage;