import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import ProductShowcase from '../components/ProductShowcase';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchFeaturedProducts = async () => {
    try {
      const { supabase } = await import('../contexts/AuthContext'); // Import supabase client
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_visible', true)
        .limit(4);
      
      if (error) {
        console.error("❌ HomePage: Supabase error:", error);
        setFeaturedProducts([]);
        return;
      }
      
      // Format products
      const formattedProducts = data?.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
        images: product.images || ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'],
        description: product.description,
        tagline: product.description?.substring(0, 50) + '...' || 'Smart home device',
        category: product.category,
        isVisible: product.is_visible,
        stock: product.stock,
        created_at: product.created_at
      })) || [];
      
      // Use setTimeout to ensure state update happens after current execution
      setTimeout(() => {
        setFeaturedProducts(formattedProducts);
        setLoading(false);
      }, 0);
      
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-nyx-black via-purple-900/30 to-nyx-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-nyx-black via-purple-900/30 to-nyx-black">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-brand-purple/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-nyx-blue/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-brand-pink/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Main Content Container - Pulled up */}
          <div className="relative -mt-16 md:-mt-20">
            {/* Next-Gen Tag */}
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 border border-brand-purple/30 mb-4">
                <span className="block bg-gradient-to-r from-brand-purple via-brand-pink to-nyx-blue text-transparent bg-clip-text animate-pulse">Next-Gen Smart Home Technology</span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              The Future of Smart Living
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of smart home technology with NYX. 
              Seamlessly connected, intelligently automated, beautifully designed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="group relative bg-gradient-to-r from-nyx-blue to-cyan-400 text-nyx-black font-bold py-5 px-10 rounded-full hover:from-cyan-400 hover:to-nyx-blue transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-nyx-blue/25">
                <div className="absolute inset-0 bg-gradient-to-r from-nyx-blue/20 to-cyan-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <span className="relative z-10">Explore Products</span>
              </button>
              <button className="group relative bg-transparent border-2 border-nyx-blue text-nyx-blue font-bold py-5 px-10 rounded-full hover:bg-nyx-blue hover:text-nyx-black transition-all duration-500 transform hover:scale-105">
                <span className="relative z-10">Learn More</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-nyx-blue mb-2">24</div>
                <div className="text-gray-400">Months Battery Life</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-purple mb-2">1000+</div>
                <div className="text-gray-400">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-nyx-blue rounded-full flex justify-center">
            <div className="w-1 h-3 bg-nyx-blue rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-nyx-blue/20 to-brand-purple/20 border border-nyx-blue/30 mb-6">
              <span className="block bg-gradient-to-r from-nyx-blue via-brand-purple to-brand-pink text-transparent bg-clip-text">Featured Products</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Discover Our Best Sellers
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Handpicked smart home devices that combine cutting-edge technology with elegant design
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nyx-blue"></div>
            </div>
          ) : (
            <ProductShowcase 
              products={featuredProducts} 
              onAddToCart={handleAddToCart}
              showViewAll={true}
            />
          )}
        </div>
      </section>

      {/* Why Choose NYX Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-nyx-gray/30 to-nyx-gray/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 border border-brand-purple/30 mb-6">
              <span className="block bg-gradient-to-r from-brand-purple via-brand-pink to-nyx-blue text-transparent bg-clip-text">Why Choose NYX</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              The NYX Advantage
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the difference with our innovative approach to smart home technology
            </p>
          </div>

          <Features />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-nyx-gray/40 to-nyx-gray/20 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:border-brand-purple/30 transition-all duration-500">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Transform Your Home?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have already made the switch to NYX smart home technology
            </p>
            <button className="group relative bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold py-4 px-12 rounded-full hover:from-brand-pink hover:to-brand-purple transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-brand-purple/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <span className="relative z-10">Start Your Smart Home Journey</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
