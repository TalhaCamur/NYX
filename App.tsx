





import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { CartProvider } from './contexts/CartContext';
import CartSidebar from './components/CartSidebar';
import AskNyx from './pages/AskNyxPage';
import { FAQ_DATA, FEATURES_DATA } from './constants';
import { useCart } from './contexts/CartContext';
import { Product, User, UserRole, BlogPost } from './types';
import { AuthProvider, useAuth, supabase } from './contexts/AuthContext';
import CookieConsentBanner from './components/CookieConsentBanner';
import { ProductCard } from './components/ProductShowcase';


// Define shared icons here to avoid creating new files
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

const PlusMinusIcon: React.FC<{ isOpen: boolean; className?: string }> = ({ isOpen, className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12" className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}></line>
    </svg>
);

// Icons for Contact Page
const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

// Google Icon for AuthForm
const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.356-11.303-7.918l-6.573 5.013C9.657 39.646 16.318 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.417 44 30.638 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);

// Facebook Icon for AuthForm
const FacebookAuthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" />
  </svg>
);

const ImageUploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`${
            checked ? 'bg-brand-purple' : 'bg-gray-600'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-dark-accent`}
    >
        <span
            aria-hidden="true"
            className={`${
                checked ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);


// Define the Products Page components here to avoid creating new files
const ProductsPage: React.FC<{ navigateTo: (page: string, params?: any) => void, products: Product[], loading: boolean, error: string | null }> = ({ navigateTo, products, loading, error }) => {
    const { user } = useAuth();
    const isAuthorized = user && (user.roles.includes('seller') || user.roles.includes('admin') || user.roles.includes('super-admin'));
    
    const displayedProducts = isAuthorized ? products : products.filter(p => p.isVisible);

    return (
        <div className="bg-dark pt-24 animate-fade-in min-h-screen">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Our Full Collection</h1>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Explore the entire NYX ecosystem. Every device is crafted to enhance your home and simplify your life.
                    </p>
                </div>
                {loading && <p className="text-center text-gray-400 text-xl">Loading products...</p>}
                {error && <p className="text-center text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</p>}
                {!loading && !error && displayedProducts.length === 0 && (
                    <div className="text-center text-gray-500 py-16">
                        <h2 className="text-2xl font-semibold mb-2">No Products Yet</h2>
                    </div>
                )}
                {!loading && displayedProducts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {displayedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} navigateTo={navigateTo} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


// Define the How It Works Page
const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      title: '1. Unbox & Power On',
      description: 'Getting started is effortless. Unbox your NYX device, plug it in, and it will power on automatically, ready for setup.',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    },
    {
      title: '2. Connect with NYX App',
      description: 'Download the NYX app, create an account, and tap "Add Device." The app will automatically detect nearby devices for a seamless pairing process.',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 12.55a8 8 0 0 1 14.08 0"></path><path d="M1.42 9a12 12 0 0 1 21.16 0"></path><path d="M8.53 16.11a4 4 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12" y2="20"></line>
        </svg>
      )
    },
    {
      title: '3. Create Automations',
      description: 'Once connected, unleash the true power of NYX. Create scenes and automations to make your devices work together, like turning on lights when motion is detected.',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="bg-dark pt-24 animate-fade-in">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Simplicity in Three Steps</h1>
          <p className="text-gray-300 text-lg md:text-xl">
            We've engineered the NYX experience to be intuitive from the moment you open the box.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
            <div className="relative">
                {/* Dotted line for desktop */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-transparent">
                   <svg width="100%" height="100%"><line x1="0" y1="0" x2="100%" y2="0" strokeWidth="2" strokeDasharray="8, 8" stroke="rgba(107, 114, 128, 0.5)"/></svg>
                </div>
                 {/* Solid line for mobile */}
                <div className="md:hidden absolute top-0 left-12 w-px h-full bg-gray-600/50"></div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex-1 flex md:flex-col items-start md:items-center text-left md:text-center">
                            <div className="flex-shrink-0 mb-0 md:mb-6 mr-6 md:mr-0 z-10 flex items-center justify-center h-24 w-24 rounded-full bg-dark-accent border-2 border-brand-purple/50">
                                <step.icon className="w-10 h-10 text-brand-purple" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                                <p className="text-gray-400">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Define the Setup Videos Page
const SetupVideosPage: React.FC = () => {
    const videos = [
        { id: 'dQw4w9WgXcQ', title: 'Unboxing and First Setup of NYX-1 Sensor', duration: '3:45' },
        { id: 'y6120QOlsfU', title: 'Connecting NYX-Bulb to Your Wi-Fi Network', duration: '2:15' },
        { id: '3tmd-ClpJxA', title: 'Advanced Automations with NYX-Plug', duration: '5:30' },
        { id: 'V-_O7nl0Ii0', title: 'Installing and Configuring NYX-Cam', duration: '4:10' },
    ];

    const [activeVideo, setActiveVideo] = useState(videos[0].id);

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Visual Setup Guides</h1>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Follow along with our step-by-step video tutorials to get your NYX devices up and running in minutes.
                    </p>
                </div>
                
                <div className="max-w-5xl mx-auto">
                    <div className="aspect-video bg-dark-accent rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-2xl shadow-brand-purple/20">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&theme=dark&color=white`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {videos.map(video => (
                            <button 
                                key={video.id}
                                onClick={() => setActiveVideo(video.id)}
                                className={`p-4 rounded-lg transition-all duration-300 text-left ${activeVideo === video.id ? 'bg-brand-purple/20 ring-2 ring-brand-purple' : 'bg-dark-accent hover:bg-dark-accent/70'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-dark p-2 rounded-full">
                                        <PlayIcon className={`w-5 h-5 ${activeVideo === video.id ? 'text-brand-purple' : 'text-gray-400'}`} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{video.title}</p>
                                        <p className="text-xs text-gray-500">{video.duration}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Define FAQ Page
const FAQPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Have questions? We've got answers. Find the information you're looking for about NYX products and services.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                    {FAQ_DATA.map((faq, index) => (
                        <div key={index} className="border border-white/10 rounded-xl overflow-hidden bg-dark-accent">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center text-left p-6"
                            >
                                <h3 className="text-lg md:text-xl font-semibold text-white">{faq.question}</h3>
                                <PlusMinusIcon isOpen={openIndex === index} className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-45' : ''}`} />
                            </button>
                             <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="p-6 pt-0 text-gray-300 leading-relaxed">
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

// Define Contact Page
const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Get in Touch</h1>
                    <p className="text-gray-300 text-lg md:text-xl">
                        We're here to help. Whether you have a question about our products, need support, or want to partner with us, we'd love to hear from you.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Form */}
                    <div className="bg-dark-accent p-8 md:p-12 rounded-2xl border border-white/10">
                        {submitted ? (
                             <div className="text-center flex flex-col justify-center items-center h-full min-h-[300px]">
                                <h3 className="text-2xl font-semibold text-brand-purple mb-4">Thank You!</h3>
                                <p>Your message has been sent. Our team will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                                        <input type="text" id="name" required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                                        <input type="email" id="email" required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                                    <input type="text" id="subject" required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                                    <textarea id="message" rows={5} required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105">
                                    Submit Message
                                </button>
                            </form>
                        )}
                    </div>
                    {/* Contact Info */}
                    <div className="space-y-8 mt-8 lg:mt-0">
                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-dark-accent border border-white/10">
                                <MapPinIcon className="w-8 h-8 text-brand-purple" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">Our Headquarters</h3>
                                <p className="text-gray-400">Netherlands</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-dark-accent border border-white/10">
                                <MailIcon className="w-8 h-8 text-brand-purple" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">Email Us</h3>
                                <p className="text-gray-400">
                                    <a href="mailto:nyxsmarthome@gmail.com" className="hover:text-brand-purple transition-colors">nyxsmarthome@gmail.com</a>
                                </p>
                            </div>
                        </div>
                         <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-dark-accent border border-white/10">
                                <PhoneIcon className="w-8 h-8 text-brand-purple" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">Call Us</h3>
                                <p className="text-gray-400">
                                    <a href="tel:+1-800-555-0199" className="hover:text-brand-purple transition-colors">+1-800-555-0199</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Define About Us / Our Story Page
const OurStoryPage: React.FC = () => (
    <div className="bg-dark pt-24 animate-fade-in">
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Our Story</h1>
                    <p className="text-lg md:text-xl text-brand-purple font-semibold">From a simple idea to a smarter reality.</p>
                </div>
                <div className="prose prose-lg prose-invert mx-auto text-gray-300 leading-relaxed space-y-6">
                    <p>NYX was born from a simple observation: technology should make life easier, not more complicated. In 2022, our founders, a group of designers and engineers passionate about minimalist aesthetics and powerful technology, noticed a gap in the smart home market. Devices were either powerful but clunky and difficult to use, or beautifully designed but functionally limited.</p>
                    <p>We asked ourselves: Why the compromise? Why can't a smart device be both intelligent and invisible, powerful and simple?</p>
                    <figure className="my-8">
                         <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop" alt="Team working together" className="rounded-2xl shadow-lg border border-white/10" />
                         <figcaption className="text-center text-sm text-gray-500 mt-2">The founding team brainstorming the first NYX concept.</figcaption>
                    </figure>
                    <p>Driven by this question, we embarked on a mission to create a new kind of smart home experience. One where devices don't just react, but anticipate. Where setup is measured in seconds, not hours. And where the technology fades into the background, allowing the experience to shine.</p>
                    <p>Our first product, the NYX-1 sensor, was the embodiment of this philosophy. We obsessed over every detail, from its bead-blasted aluminum unibody to the custom-developed Adaptive AI that learns and adapts to a user's life. It set the standard for every product that followed: the NYX-Bulb, the NYX-Plug, and the NYX-Cam.</p>
                    <p>Today, NYX is more than just a collection of products. It's an ecosystem built on the principles of simplicity, intelligence, and design. We are still driven by that initial question, constantly pushing the boundaries of what a smart home can be. Our journey is just beginning, and we invite you to join us in shaping the future of smart living.</p>
                </div>
            </div>
        </div>
    </div>
);

// Define Why Us? Page
const WhyUsPage: React.FC = () => (
    <div className="bg-dark pt-24 animate-fade-in">
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Why Choose NYX?</h1>
                <p className="text-gray-300 text-lg md:text-xl">
                    We believe in a better smart home experience. Here's what sets us apart.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center max-w-6xl mx-auto">
                {FEATURES_DATA.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center p-6 bg-dark-accent rounded-2xl border border-white/10 transform transition-transform duration-300 hover:-translate-y-2">
                        <div className="mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-dark border border-white/10">
                            <feature.icon className="w-10 h-10 text-brand-purple" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                        <p className="text-gray-400 text-base flex-grow">{feature.description}</p>
                    </div>
                ))}
            </div>
            <div className="text-center mt-20">
                <p className="text-lg text-gray-400">Ready to experience the NYX difference?</p>
                {/* This button will be handled by App's navigateTo function */}
                <a href="/products" onClick={(e) => { e.preventDefault(); (window as any).navigateToProducts(); }} className="mt-4 inline-block bg-brand-purple text-white font-semibold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105">
                    Explore Our Products
                </a>
            </div>
        </div>
    </div>
);

// Define Add Product Page
const AddProductPage: React.FC<{ 
    navigateTo: (page: string) => void; 
    addProduct: (productData: Omit<Product, 'id' | 'ownerId'>) => Promise<void>; 
}> = ({ navigateTo, addProduct }) => {
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'ownerId'>>({
        name: '',
        tagline: '',
        price: 0,
        originalPrice: null,
        stock: 0,
        images: [],
        specs: [{ name: '', value: '' }],
        isVisible: true,
    });
    
    const [isDiscounted, setIsDiscounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleDiscountToggle = (checked: boolean) => {
        setIsDiscounted(checked);
        if (checked) {
            setFormData(f => ({ ...f, originalPrice: f.price, price: 0 }));
        } else {
            setFormData(f => ({ ...f, price: f.originalPrice || 0, originalPrice: null }));
        }
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const imagePromises = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(imagePromises).then(base64Images => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...base64Images]
                }));
            }).catch(error => {
                console.error("Error reading files:", error);
                alert("There was an error uploading images.");
            });
        }
    };
    
    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const type = e.target.getAttribute('type');
        const parsedValue = type === 'number' ? (value ? parseFloat(value) : (name === 'price' || name === 'stock' ? 0 : undefined)) : value;
        setFormData({ ...formData, [name]: parsedValue });
    };
    
    const handleSpecChange = (index: number, field: 'name' | 'value', value: string) => {
        const newSpecs = [...formData.specs];
        newSpecs[index] = { ...newSpecs[index], [field]: value };
        setFormData({ ...formData, specs: newSpecs });
    };

    const addSpec = () => {
        setFormData({ ...formData, specs: [...formData.specs, { name: '', value: '' }] });
    };
    
    const removeSpec = (index: number) => {
        const newSpecs = formData.specs.filter((_, i) => i !== index);
        setFormData({ ...formData, specs: newSpecs });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.images.length === 0) {
            alert('Please fill in all required fields: Name and at least one Image.');
            return;
        }
        
        setIsSaving(true);
        try {
            await addProduct({
                ...formData,
                originalPrice: isDiscounted ? formData.originalPrice : null,
            });
            alert('Product added successfully!');
            navigateTo('products');
        } catch (error: any) {
            console.error("Failed to add product:", error);
            alert(`Error adding product: ${error.message || 'An unknown error occurred.'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto bg-dark-accent p-8 rounded-2xl border border-white/10">
                     <button
                        onClick={() => navigateTo('products')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Products
                    </button>
                    <h1 className="text-3xl font-bold text-white mb-8">Add New Product</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">Product Name <span className="text-red-500">*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" required />
                            </div>
                            <div>
                                <label htmlFor="tagline" className="block text-sm font-medium mb-2">Tagline</label>
                                <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" />
                            </div>
                        </div>

                        {/* Image Uploader */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Images <span className="text-red-500">*</span></label>
                            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-600 px-6 py-10">
                                <div className="text-center">
                                    <ImageUploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md font-semibold text-brand-purple focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-purple focus-within:ring-offset-2 focus-within:ring-offset-dark-accent hover:text-brand-purple/80"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                            {formData.images.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img src={image} alt={`Preview ${index + 1}`} className="h-24 w-24 rounded-lg object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-0 right-0 m-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Remove image"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Pricing and Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            {/* Pricing Column */}
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor={isDiscounted ? "originalPrice" : "price"} className="block text-sm font-medium mb-2">
                                        {isDiscounted ? "Original Price (€)" : "Price (€)"}
                                        {!isDiscounted && <span className="text-red-500"> *</span>}
                                    </label>
                                    <input 
                                        type="number" 
                                        name={isDiscounted ? "originalPrice" : "price"} 
                                        id={isDiscounted ? "originalPrice" : "price"}
                                        step="0.01" 
                                        value={isDiscounted ? formData.originalPrice || '' : formData.price} 
                                        onChange={handleChange} 
                                        className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" 
                                        required={!isDiscounted}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium">Apply Discount</label>
                                    <Switch checked={isDiscounted} onChange={handleDiscountToggle} />
                                </div>

                                {isDiscounted && (
                                    <div className="animate-fade-in">
                                        <label htmlFor="price" className="block text-sm font-medium mb-2">
                                            Discounted Price (€) <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="number" 
                                            name="price" 
                                            id="price"
                                            step="0.01" 
                                            value={formData.price} 
                                            onChange={handleChange} 
                                            className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" 
                                            required 
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Stock Column */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium mb-2">Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" />
                            </div>
                        </div>


                        {/* Specifications */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 mt-4">Specifications</h3>
                            <div className="space-y-4">
                                {formData.specs.map((spec, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <input type="text" placeholder="Spec Name" value={spec.name} onChange={(e) => handleSpecChange(index, 'name', e.target.value)} className="w-1/2 bg-dark border border-gray-600 rounded-lg py-2 px-3" />
                                        <input type="text" placeholder="Spec Value" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="w-1/2 bg-dark border border-gray-600 rounded-lg py-2 px-3" />
                                        <button type="button" onClick={() => removeSpec(index)} disabled={formData.specs.length <= 1} className="text-red-500 hover:text-red-400 p-2 disabled:opacity-50 disabled:cursor-not-allowed">&times;</button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addSpec} className="mt-4 text-sm text-brand-purple hover:underline">
                                + Add Specification
                            </button>
                        </div>
                        
                        {/* Actions */}
                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <label className="block text-sm font-medium">Visible to Customers</label>
                                <Switch 
                                    checked={formData.isVisible} 
                                    onChange={(checked) => setFormData({ ...formData, isVisible: checked })} 
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => navigateTo('products')} className="border border-gray-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-700 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSaving} className="bg-brand-purple text-white font-bold py-2 px-6 rounded-full hover:bg-brand-purple/80 transition-all disabled:opacity-50 disabled:cursor-wait">
                                    {isSaving ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


// Define Edit Product Page
const EditProductPage: React.FC<{ 
    navigateTo: (page: string) => void; 
    productId: string; 
    products: Product[]; 
    updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
}> = ({ navigateTo, productId, products, updateProduct, deleteProduct }) => {
    
    const { user } = useAuth();
    const productToEdit = products.find(p => p.id === productId);
    
    const [formData, setFormData] = useState<Product | null>(productToEdit ? { ...productToEdit } : null);
    const [isDiscounted, setIsDiscounted] = useState(!!productToEdit?.originalPrice);
    const [isSaving, setIsSaving] = useState(false);

    const canEdit = user && productToEdit && (productToEdit.ownerId === user.id || user.roles.includes('admin') || user.roles.includes('super-admin'));

    useEffect(() => {
        if (productToEdit) {
            setFormData({ ...productToEdit });
            setIsDiscounted(!!productToEdit.originalPrice);
        }
    }, [productToEdit]);
    
    if (!productToEdit) {
        return (
            <div className="bg-dark pt-24 min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-400">Loading product details...</p>
            </div>
        );
    }
    
    if (!formData) return null; // Should be covered by above, but for type safety

    if (!canEdit) {
        return (
            <div className="bg-dark pt-24 min-h-screen flex items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
                    <p className="text-gray-400">You do not have permission to edit this product.</p>
                     <button
                        onClick={() => navigateTo('products')}
                        className="mt-8 flex items-center mx-auto gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Products
                    </button>
                </div>
            </div>
        )
    }

    const handleDiscountToggle = (checked: boolean) => {
        setIsDiscounted(checked);
        if (!formData) return;
        if (checked) {
            setFormData({ ...formData, originalPrice: formData.price, price: formData.price });
        } else {
            setFormData({ ...formData, price: formData.originalPrice || formData.price, originalPrice: null });
        }
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const imagePromises = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(imagePromises).then(base64Images => {
                setFormData(prev => prev ? ({
                    ...prev,
                    images: [...prev.images, ...base64Images]
                }) : null);
            });
        }
    };
    
    const removeImage = (index: number) => {
        if (!formData) return;
        setFormData(prev => prev ? ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }) : null);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        const type = e.target.getAttribute('type');
        const parsedValue = type === 'number' ? (value ? parseFloat(value) : (name === 'price' || name === 'stock' ? 0 : undefined)) : value;
        setFormData({ ...formData, [name]: parsedValue });
    };
    
    const handleSpecChange = (index: number, field: 'name' | 'value', value: string) => {
        if (!formData) return;
        const newSpecs = [...formData.specs];
        newSpecs[index] = { ...newSpecs[index], [field]: value };
        setFormData({ ...formData, specs: newSpecs });
    };

    const addSpec = () => {
         if (!formData) return;
        setFormData({ ...formData, specs: [...formData.specs, { name: '', value: '' }] });
    };
    
    const removeSpec = (index: number) => {
        if (!formData) return;
        const newSpecs = formData.specs.filter((_, i) => i !== index);
        setFormData({ ...formData, specs: newSpecs });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            setIsSaving(true);
            try {
                const updateData: Partial<Product> = {
                    ...formData,
                    originalPrice: isDiscounted ? formData.originalPrice : null,
                };
                delete (updateData as any).id; // Don't try to update the ID
                
                await updateProduct(productId, updateData);
                alert('Product updated successfully!');
                navigateTo('products');
            } catch (error: any) {
                console.error('Failed to update product:', error);
                alert(`Error updating product: ${error.message || 'An unknown error occurred.'}`);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
            setIsSaving(true);
            try {
                await deleteProduct(productId);
                alert('Product deleted successfully!');
                navigateTo('products');
            } catch (error: any) {
                console.error('Failed to delete product:', error);
                alert(`Error deleting product: ${error.message}`);
            } finally {
                setIsSaving(false);
            }
        }
    }

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto bg-dark-accent p-8 rounded-2xl border border-white/10">
                     <button
                        onClick={() => navigateTo('products')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Products
                    </button>
                    <h1 className="text-3xl font-bold text-white mb-8">Edit: {formData.name}</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" />
                            </div>
                            <div>
                                <label htmlFor="tagline" className="block text-sm font-medium mb-2">Tagline</label>
                                <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" />
                            </div>
                        </div>
                        
                        {/* Image Uploader */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Images</label>
                            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-600 px-6 py-10">
                                <div className="text-center">
                                    <ImageUploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                                        <label
                                            htmlFor="file-upload-edit"
                                            className="relative cursor-pointer rounded-md font-semibold text-brand-purple focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-purple focus-within:ring-offset-2 focus-within:ring-offset-dark-accent hover:text-brand-purple/80"
                                        >
                                            <span>Add more images</span>
                                            <input id="file-upload-edit" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {formData.images.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img src={image} alt={`Preview ${index + 1}`} className="h-24 w-24 rounded-lg object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-0 right-0 m-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Remove image"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pricing, Stock, and Visibility */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            {/* Pricing Column */}
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor={isDiscounted ? "originalPrice" : "price"} className="block text-sm font-medium mb-2">
                                        {isDiscounted ? "Original Price (€)" : "Price (€)"}
                                        {!isDiscounted && <span className="text-red-500"> *</span>}
                                    </label>
                                    <input 
                                        type="number" 
                                        name={isDiscounted ? "originalPrice" : "price"} 
                                        id={isDiscounted ? "originalPrice" : "price"}
                                        step="0.01" 
                                        value={isDiscounted ? formData.originalPrice || '' : formData.price} 
                                        onChange={handleChange} 
                                        className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" 
                                        required={!isDiscounted}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium">Apply Discount</label>
                                    <Switch checked={isDiscounted} onChange={handleDiscountToggle} />
                                </div>

                                {isDiscounted && (
                                    <div className="animate-fade-in">
                                        <label htmlFor="price" className="block text-sm font-medium mb-2">
                                            Discounted Price (€) <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="number" 
                                            name="price" 
                                            id="price"
                                            step="0.01" 
                                            value={formData.price} 
                                            onChange={handleChange} 
                                            className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" 
                                            required 
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Stock Column */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium mb-2">Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" />
                            </div>
                        </div>

                        {/* Specifications */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 mt-4">Specifications</h3>
                            <div className="space-y-4">
                                {formData.specs.map((spec, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <input type="text" placeholder="Spec Name" value={spec.name} onChange={(e) => handleSpecChange(index, 'name', e.target.value)} className="w-1/2 bg-dark border border-gray-600 rounded-lg py-2 px-3" />
                                        <input type="text" placeholder="Spec Value" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="w-1/2 bg-dark border border-gray-600 rounded-lg py-2 px-3" />
                                        <button type="button" onClick={() => removeSpec(index)} className="text-red-500 hover:text-red-400 p-2">&times;</button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addSpec} className="mt-4 text-sm text-brand-purple hover:underline">
                                + Add Specification
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <label className="block text-sm font-medium">Visible to Customers</label>
                                <Switch 
                                    checked={formData.isVisible} 
                                    onChange={(checked) => setFormData(f => f ? { ...f, isVisible: checked } : null)} 
                                />
                            </div>
                            <div className="flex gap-4 items-center">
                                <button type="button" onClick={handleDelete} disabled={isSaving} className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-wait">
                                    Delete
                                </button>
                                <button type="button" onClick={() => navigateTo('products')} className="border border-gray-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-700 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSaving} className="bg-brand-purple text-white font-bold py-2 px-6 rounded-full hover:bg-brand-purple/80 transition-all disabled:opacity-50 disabled:cursor-wait">
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


const AdminDashboardPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { fetchAllUsers, updateUserRoles, deleteUserAsAdmin, user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const availableRoles: UserRole[] = ['user', 'seller', 'Content Writer', 'UI/UX Designer', 'Web Developer', 'admin', 'super-admin'];

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
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
        if (!editingUser) return;

        const closeMenu = () => {
            setEditingUser(null);
            setMenuPosition(null);
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.closest('[data-manage-button-id]')) {
                return;
            }
            if (menuRef.current && !menuRef.current.contains(target)) {
                closeMenu();
            }
        };
        
        const handleInteraction = () => closeMenu();
        
        window.addEventListener('scroll', handleInteraction, true);
        window.addEventListener('resize', handleInteraction);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleInteraction, true);
            window.removeEventListener('resize', handleInteraction);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingUser]);

    const handleEditClick = (user: User, event: React.MouseEvent<HTMLButtonElement>) => {
        if (editingUser?.id === user.id) {
            setEditingUser(null);
            setMenuPosition(null);
        } else {
            const rect = event.currentTarget.getBoundingClientRect();
            // Position the menu using fixed positioning, relative to the viewport
            setMenuPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.right + window.scrollX,
            });
            setEditingUser(user);
            setSelectedRoles(user.roles);
        }
    };

    const handleRoleChange = (role: UserRole, isChecked: boolean) => {
        if (isChecked) {
            setSelectedRoles(prev => [...prev, role]);
        } else {
            setSelectedRoles(prev => prev.filter(r => r !== role));
        }
    };

    const handleSaveRoles = async () => {
        if (!editingUser || !currentUser) return;

        const canManagePrivilegedRoles = currentUser.roles.includes('super-admin');

        // Client-side check to prevent privilege escalation by non-super-admins
        if (!canManagePrivilegedRoles) {
            const isTryingToGrantAdmin = selectedRoles.includes('admin') && !editingUser.roles.includes('admin');
            const isTryingToGrantSuperAdmin = selectedRoles.includes('super-admin') && !editingUser.roles.includes('super-admin');
            
            if (isTryingToGrantAdmin || isTryingToGrantSuperAdmin) {
                alert('You do not have permission to grant Admin or Super-admin roles.');
                return;
            }
        }

        setIsSaving(true);
        try {
            await updateUserRoles(editingUser.id, selectedRoles);
            // Refresh the entire user list from the database to ensure data consistency
            await loadUsers();
            setEditingUser(null);
            setMenuPosition(null);
        } catch (err: any) {
            alert(`Error saving roles: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await deleteUserAsAdmin(userId);
                setUsers(users.filter(u => u.id !== userId));
            } catch (err: any) {
                alert(`Error deleting user: ${err.message}`);
            }
        }
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in min-h-screen">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Admin Dashboard</h1>
                    <button onClick={loadUsers} disabled={loading} className="text-sm border border-gray-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50">
                        {loading ? 'Refreshing...' : 'Refresh Users'}
                    </button>
                </div>
                {error && <p className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-6">{error}</p>}
                
                <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-700 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-dark-accent">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Roles</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-dark divide-y divide-gray-800">
                                    {loading ? (
                                        <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading users...</td></tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-full object-cover" src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} alt="" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-white">{user.firstName} {user.lastName}</div>
                                                            <div className="text-sm text-gray-400">{user.nickname}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.map(role => (
                                                             <span key={role} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${role === 'super-admin' ? 'bg-purple-500/30 text-purple-300' : role === 'admin' ? 'bg-blue-500/30 text-blue-300' : 'bg-gray-700 text-gray-300'}`}>
                                                                {role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {currentUser?.id !== user.id && !user.roles.includes('super-admin') ? (
                                                        <div className="flex gap-2 justify-end">
                                                            <button
                                                                data-manage-button-id={user.id}
                                                                onClick={(e) => handleEditClick(user, e)}
                                                                className="text-brand-purple hover:text-brand-purple/80"
                                                            >
                                                                Manage
                                                            </button>
                                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400">Delete</button>
                                                        </div>
                                                    ) : (
                                                         <span className="text-xs text-gray-500 italic pr-4">
                                                            {user.roles.includes('super-admin') ? 'Cannot edit super-admin' : 'Current User'}
                                                         </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {editingUser && menuPosition && (
                 <div
                    ref={menuRef}
                    className="fixed w-64 rounded-lg shadow-lg bg-dark-accent ring-1 ring-white/10 focus:outline-none z-[101] flex flex-col"
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        transform: 'translateX(-100%)',
                    }}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    <div className="p-4 border-b border-white/10">
                        <h3 className="font-semibold text-white">Edit Roles for</h3>
                        <p className="text-sm text-gray-400">{editingUser.nickname}</p>
                    </div>
                    <div className="p-4 space-y-3 flex-grow overflow-y-auto max-h-60">
                        {availableRoles.map(role => {
                            const isPrivilegedRole = role === 'admin' || role === 'super-admin';
                            const canManagePrivilegedRoles = currentUser?.roles.includes('super-admin');
                            const isDisabled = isPrivilegedRole && !canManagePrivilegedRoles;

                            return (
                                <label key={role} className={`flex items-center gap-3 text-sm ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role)}
                                        onChange={(e) => handleRoleChange(role, e.target.checked)}
                                        disabled={isDisabled}
                                        className="h-4 w-4 rounded border-gray-600 bg-dark text-brand-purple focus:ring-brand-purple focus:ring-offset-dark-accent disabled:cursor-not-allowed"
                                        aria-label={`Assign ${role} role`}
                                    />
                                    <span>{role}</span>
                                </label>
                            );
                        })}
                    </div>
                     <div className="p-4 flex justify-end gap-3 bg-dark/50 rounded-b-lg">
                        <button onClick={() => setEditingUser(null)} className="text-sm text-gray-300 hover:text-white">Cancel</button>
                        <button onClick={handleSaveRoles} disabled={isSaving} className="text-sm bg-brand-purple text-white font-semibold py-1 px-4 rounded-full hover:bg-brand-purple/80 disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- START OF BLOG COMPONENTS ---

const BlogCard: React.FC<{ post: BlogPost; navigateTo: (page: string, params?: any) => void }> = ({ post, navigateTo }) => {
    return (
        <div className="bg-dark-accent rounded-2xl border border-white/10 overflow-hidden flex flex-col group">
            <div className="aspect-video overflow-hidden">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{post.author} &bull; {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-400 text-sm flex-grow mb-4">{post.excerpt}</p>
                <div className="mt-auto pt-4">
                    <button onClick={() => navigateTo('blog-post', { id: post.id })} className="font-semibold text-brand-purple hover:text-brand-purple/80 transition-colors">
                        Read More &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

const BlogPage: React.FC<{ blogPosts: BlogPost[]; navigateTo: (page: string, params?: any) => void }> = ({ blogPosts, navigateTo }) => {
    const { user } = useAuth();
    const canWrite = user && (user.roles.includes('Content Writer') || user.roles.includes('admin') || user.roles.includes('super-admin'));

    return (
        <div className="bg-dark pt-24 animate-fade-in min-h-screen">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
                    <div className="text-left max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">From the NYX Journal</h1>
                        <p className="text-gray-300 text-lg md:text-xl">
                            Insights, tutorials, and stories from the team building the future of smart living.
                        </p>
                    </div>
                    {canWrite && (
                        <button
                            onClick={() => navigateTo('add-blog-post')}
                            className="mt-6 md:mt-0 flex-shrink-0 bg-brand-purple text-white font-semibold py-3 px-6 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105"
                        >
                            + Add New Post
                        </button>
                    )}
                </div>
                {blogPosts.length === 0 ? (
                    <div className="text-center text-gray-500 py-16">
                        <h2 className="text-2xl font-semibold mb-2">No Posts Yet</h2>
                        <p>Check back soon for updates from our team.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <BlogCard key={post.id} post={post} navigateTo={navigateTo} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const BlogPostPage: React.FC<{ postId: string; blogPosts: BlogPost[]; navigateTo: (page: string) => void }> = ({ postId, blogPosts, navigateTo }) => {
    const post = blogPosts.find(p => p.id === postId);

    if (!post) {
        return (
            <div className="bg-dark pt-24 min-h-screen flex items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Post Not Found</h1>
                    <button onClick={() => navigateTo('blog')} className="mt-8 flex items-center mx-auto gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }
    
    // Simple way to format paragraphs from newline-separated text
    const paragraphs = post.content.trim().split('\n').map(p => p.trim()).filter(p => p.length > 0);

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => navigateTo('blog')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Blog
                    </button>
                    <article>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">{post.title}</h1>
                        <div className="flex items-center gap-4 text-gray-400 mb-8">
                            <span>By {post.author}</span>
                            <span>&bull;</span>
                            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <img src={post.imageUrl} alt={post.title} className="w-full aspect-video object-cover rounded-2xl mb-12 border border-white/10" />
                        <div className="prose prose-lg prose-invert mx-auto text-gray-300 leading-relaxed space-y-6">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

const AddBlogPostPage: React.FC<{
    navigateTo: (page: string) => void;
    addBlogPost: (postData: Omit<BlogPost, 'id' | 'ownerId'>) => Promise<void>;
}> = ({ navigateTo, addBlogPost }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        excerpt: '',
        content: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                alert("Only image files can be uploaded.");
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.excerpt || !formData.content || !user) {
            alert('Please fill in all fields.');
            return;
        }
        setIsSaving(true);
        try {
            await addBlogPost({
                ...formData,
                author: user.nickname,
                date: new Date().toISOString(),
            });
            alert('Blog post added successfully!');
            navigateTo('blog');
        } catch (error: any) {
            alert(`Error adding post: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
         <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto bg-dark-accent p-8 rounded-2xl border border-white/10">
                     <button onClick={() => navigateTo('blog')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Blog
                    </button>
                    <h1 className="text-3xl font-bold text-white mb-8">Add New Blog Post</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-2">Post Title <span className="text-red-500">*</span></label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" required />
                        </div>
                         
                        {/* Image Section */}
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">Image URL</label>
                            <input 
                                type="url" 
                                name="imageUrl" 
                                value={formData.imageUrl} 
                                onChange={handleChange} 
                                placeholder="https://images.unsplash.com/..." 
                                className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" 
                            />
                             <div className="relative my-4 flex items-center">
                                <div className="flex-grow border-t border-gray-600"></div>
                                <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">Or</span>
                                <div className="flex-grow border-t border-gray-600"></div>
                            </div>
                             <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-lg border-2 border-dashed border-gray-600 px-6 py-10 flex flex-col justify-center items-center hover:border-brand-purple/50 transition-colors"
                            >
                                <ImageUploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                                <span className="mt-2 block text-sm font-semibold text-brand-purple">
                                    Upload an image
                                </span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                            </label>

                            {formData.imageUrl && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">Image Preview:</p>
                                    <div className="relative group">
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-auto max-h-64 object-contain rounded-lg bg-dark" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Remove image"
                                        >
                                            <CloseIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                         <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">Excerpt / Subtitle <span className="text-red-500">*</span></label>
                            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" required></textarea>
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium mb-2">Full Content <span className="text-red-500">*</span></label>
                            <textarea name="content" value={formData.content} onChange={handleChange} rows={10} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" required></textarea>
                             <p className="text-xs text-gray-500 mt-2">You can separate paragraphs by leaving a blank line between them.</p>
                        </div>
                        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                            <button type="button" onClick={() => navigateTo('blog')} className="border border-gray-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={isSaving} className="bg-brand-purple text-white font-bold py-2 px-6 rounded-full hover:bg-brand-purple/80 transition-all disabled:opacity-50 disabled:cursor-wait">
                                {isSaving ? 'Publishing...' : 'Publish Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- END OF BLOG COMPONENTS ---

const AuthForm: React.FC<{ navigateTo: (page: string, params?: any) => void }> = ({ navigateTo }) => {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgotPassword'>('login');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        password: '',
    });
    const [agreements, setAgreements] = useState({
        news: false,
        terms: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(0);
    const { login, signup, signInWithProvider, sendPasswordResetEmail } = useAuth();

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setMessage('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgreements({ ...agreements, [e.target.name]: e.target.checked });
    };

    const handleProviderSignIn = async (provider: 'google' | 'facebook') => {
        try {
            await signInWithProvider(provider);
            // OAuth redirect will handle the rest.
        } catch (err: any) {
            setError(err.message || `Failed to sign in with ${provider}.`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
                navigateTo('home');
            } else if (mode === 'signup') {
                if (!agreements.terms) {
                    setError("You must agree to the Terms and Privacy Policy to sign up.");
                    setLoading(false);
                    return;
                }
                await signup(formData.firstName, formData.lastName, formData.nickname, formData.email, formData.password, agreements.news);
                navigateTo('home');
            } else if (mode === 'forgotPassword') {
                await sendPasswordResetEmail(formData.email);
                setMessage('Password reset link has been sent.');
                setCountdown(60);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'An unexpected error occurred.';
            if (mode === 'forgotPassword' && errorMessage.includes('For security purposes, you can only request this after')) {
                const secondsMatch = errorMessage.match(/after (\d+)/);
                const secondsLeft = secondsMatch ? parseInt(secondsMatch[1], 10) : 60;
                setCountdown(secondsLeft);
                setError(`Too many requests. Please wait before trying again.`);
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };
    
    if (mode === 'forgotPassword') {
        return (
            <div className="bg-dark pt-24 animate-fade-in min-h-screen flex items-center justify-center">
                <div className="p-8 bg-dark-accent rounded-2xl border border-white/10 max-w-md w-full mx-4">
                    <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-gray-400 mb-6">Enter your email address to receive a password reset link.</p>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        </div>
                        {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>}
                        {message && !error && <p className="text-sm text-green-400 bg-green-500/10 p-3 rounded-lg">{message}</p>}
                        <button type="submit" disabled={loading || countdown > 0} className="w-full bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all disabled:opacity-50 disabled:cursor-wait">
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        {countdown > 0 && (
                            <p className="text-sm text-center text-gray-400 mt-2">
                                For security, you can request another link in {countdown} seconds.
                            </p>
                        )}
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-400">
                        Remember your password?{' '}
                        <button onClick={() => { setMode('login'); setError(''); setMessage(''); setCountdown(0); }} className="font-semibold text-brand-purple hover:underline">
                            Back to Login
                        </button>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-dark pt-24 animate-fade-in min-h-screen flex items-center justify-center">
            <div className="p-8 bg-dark-accent rounded-2xl border border-white/10 max-w-md w-full mx-4">
                <button
                    onClick={() => navigateTo('home')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
                <p className="text-gray-400 mb-6">{mode === 'login' ? 'Sign in to continue.' : 'Get started with NYX.'}</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div className="flex gap-4">
                            <div>
                                <label htmlFor="firstName" className="sr-only">First Name</label>
                                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="sr-only">Last Name</label>
                                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            </div>
                        </div>
                    )}
                    {mode === 'signup' && (
                         <div>
                            <label htmlFor="nickname" className="sr-only">Nickname</label>
                            <input type="text" name="nickname" placeholder="Nickname" value={formData.nickname} onChange={handleChange} required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="sr-only">{mode === 'login' ? 'Email or Nickname' : 'Email'}</label>
                        <input type="text" name="email" placeholder={mode === 'login' ? 'Email or Nickname' : 'Email'} value={formData.email} onChange={handleChange} required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        {mode === 'login' && (
                            <div className="text-right mt-2">
                                <button
                                    type="button"
                                    onClick={() => { setMode('forgotPassword'); setError(''); }}
                                    className="text-xs font-semibold text-brand-purple hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}
                    </div>

                    {mode === 'signup' && (
                        <div className="space-y-3 pt-2">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="news"
                                    checked={agreements.news}
                                    onChange={handleAgreementChange}
                                    className="mt-1 h-4 w-4 shrink-0 rounded border-gray-600 bg-dark text-brand-purple focus:ring-brand-purple focus:ring-offset-dark-accent"
                                />
                                <span className="text-sm text-gray-400">
                                    I agree to receive news from NYX
                                </span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={agreements.terms}
                                    onChange={handleAgreementChange}
                                    className="mt-1 h-4 w-4 shrink-0 rounded border-gray-600 bg-dark text-brand-purple focus:ring-brand-purple focus:ring-offset-dark-accent"
                                    required
                                />
                                <span className="text-sm text-gray-400">
                                    I agree to NYX's{' '}
                                    <button type="button" onClick={() => navigateTo('legal', { slug: 'terms-and-conditions', title: 'Terms & Conditions' })} className="font-semibold text-brand-purple hover:underline focus:outline-none">
                                        Terms
                                    </button> and{' '}
                                    <button type="button" onClick={() => navigateTo('legal', { slug: 'privacy-policy', title: 'Privacy Policy' })} className="font-semibold text-brand-purple hover:underline focus:outline-none">
                                        Privacy Policy
                                    </button>
                                </span>
                            </label>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>}
                    
                    <button type="submit" disabled={loading || (mode === 'signup' && !agreements.terms)} className="w-full bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-dark-accent px-2 text-gray-500">OR</span>
                    </div>
                </div>

                <div className="space-y-3">
                     <button onClick={() => handleProviderSignIn('google')} className="w-full flex justify-center items-center gap-3 bg-dark border border-gray-600 text-white font-semibold py-3 px-5 rounded-full hover:bg-gray-700 transition-colors">
                        <GoogleIcon className="w-5 h-5" />
                        Continue with Google
                    </button>
                     <button onClick={() => handleProviderSignIn('facebook')} className="w-full flex justify-center items-center gap-3 bg-[#1877F2] text-white font-semibold py-3 px-5 rounded-full hover:bg-[#1877F2]/90 transition-colors">
                        <FacebookAuthIcon className="w-5 h-5" />
                        Continue with Facebook
                    </button>
                </div>
                
                <p className="mt-6 text-center text-sm text-gray-400">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="font-semibold text-brand-purple hover:underline">
                        {mode === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
};


const ProfilePage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { user, updateUser, changePassword, logout, deleteUserAccount } = useAuth();
    
    // State for profile info form
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        nickname: user?.nickname || '',
    });
    const [profilePictureFile, setProfilePictureFile] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    // State for password change form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // State for account deletion
    const [deleteLoading, setDeleteLoading] = useState(false);

    if (!user) {
        return (
            <div className="bg-dark pt-24 animate-fade-in min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                    <p className="text-gray-400 mb-8">Please log in to view your profile.</p>
                    <button onClick={() => navigateTo('login')} className="bg-brand-purple text-white font-semibold py-3 px-8 rounded-full">
                        Login
                    </button>
                </div>
            </div>
        );
    }
    
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileMessage({ type: '', text: '' });
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordMessage({ type: '', text: '' });
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePictureFile(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage({ type: '', text: '' });
        
        try {
            const updates: Partial<User> = { ...profileData };
            if (profilePictureFile) {
                updates.profilePicture = profilePictureFile;
            }
            await updateUser(user.id, updates);
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setProfileMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
        } finally {
            setProfileLoading(false);
        }
    };
    
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
         if (passwordData.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: "Password must be at least 6 characters long." });
            return;
        }
        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            await changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setPasswordMessage({ type: 'error', text: err.message || 'Failed to change password.' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigateTo('home');
    }

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to permanently delete your account? This action is irreversible and all your data will be removed.')) {
            setDeleteLoading(true);
            setProfileMessage({ type: '', text: '' });
            setPasswordMessage({ type: '', text: '' });
            try {
                await deleteUserAccount();
                navigateTo('home');
            } catch (err: any) {
                setProfileMessage({ type: 'error', text: `Failed to delete account: ${err.message}` });
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-16">
                 <button
                    onClick={() => navigateTo('home')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group max-w-4xl mx-auto"
                >
                    <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </button>
                <div className="max-w-4xl mx-auto bg-dark-accent p-8 md:p-12 rounded-2xl border border-white/10">
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
                         <div className="relative">
                            <img 
                                src={profilePictureFile || user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                                alt="Profile" 
                                className="w-28 h-28 rounded-full object-cover bg-dark border-2 border-brand-purple"
                            />
                             <label htmlFor="profile-picture-upload" className="absolute bottom-0 right-0 bg-dark-accent p-2 rounded-full cursor-pointer hover:bg-dark border border-white/10">
                                 <ImageUploadIcon className="w-5 h-5 text-gray-300"/>
                                <input id="profile-picture-upload" type="file" className="sr-only" accept="image/*" onChange={handleProfilePictureChange} />
                            </label>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white text-center sm:text-left">{user.nickname}</h1>
                            <p className="text-gray-400 text-center sm:text-left">{user.email}</p>
                            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                                {user.roles.map(role => (
                                    <span key={role} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-700 text-gray-300">
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Profile Information Form */}
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-3">Profile Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name</label>
                                <input type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name</label>
                                <input type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium mb-2">Nickname</label>
                            <input type="text" name="nickname" value={profileData.nickname} onChange={handleProfileChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" />
                        </div>
                        {profileMessage.text && (
                            <p className={`text-sm ${profileMessage.type === 'success' ? 'text-green-400' : 'text-red-500'}`}>
                                {profileMessage.text}
                            </p>
                        )}
                        <div className="text-right">
                            <button type="submit" disabled={profileLoading} className="bg-brand-purple text-white font-bold py-2 px-6 rounded-full hover:bg-brand-purple/80 transition-all disabled:opacity-50">
                                {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                            </button>
                        </div>
                    </form>

                     {/* Password Change Form */}
                    <form onSubmit={handlePasswordSubmit} className="space-y-6 mt-12">
                        <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-3">Change Password</h2>
                         <div>
                            <label htmlFor="currentPassword" arie-label="Current Password" className="block text-sm font-medium mb-2">Current Password</label>
                            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="newPassword" aria-label="New Password" className="block text-sm font-medium mb-2">New Password</label>
                                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" required />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" aria-label="Confirm New Password" className="block text-sm font-medium mb-2">Confirm New Password</label>
                                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4" required />
                            </div>
                        </div>
                        {passwordMessage.text && (
                            <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-500'}`}>
                                {passwordMessage.text}
                            </p>
                        )}
                         <div className="text-right">
                            <button type="submit" disabled={passwordLoading} className="bg-brand-purple text-white font-bold py-2 px-6 rounded-full hover:bg-brand-purple/80 transition-all disabled:opacity-50">
                                {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 border-t border-white/10 pt-6 flex justify-center items-center gap-x-8">
                         <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
                            Logout
                         </button>
                         <button 
                            onClick={handleDeleteAccount} 
                            disabled={deleteLoading}
                            className="text-red-500 hover:text-red-400 font-semibold transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UpdatePasswordPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { updatePassword, logout } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        setLoading(true);
        try {
            await updatePassword(newPassword);
            setSuccess(true);
            setTimeout(() => {
                navigateTo('login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-dark pt-24 animate-fade-in min-h-screen flex items-center justify-center">
                <div className="p-8 bg-dark-accent rounded-2xl border border-white/10 max-w-md w-full mx-4 text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Password Updated!</h1>
                    <p className="text-gray-300">Your password has been changed successfully. You will be redirected to the login page shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-dark pt-24 animate-fade-in min-h-screen flex items-center justify-center">
            <div className="p-8 bg-dark-accent rounded-2xl border border-white/10 max-w-md w-full mx-4">
                <h1 className="text-3xl font-bold text-white mb-2">Set a New Password</h1>
                <p className="text-gray-400 mb-6">Please enter and confirm your new password.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="newPassword" className="sr-only">New Password</label>
                        <input type="password" name="newPassword" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                        <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                    </div>
                    {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all disabled:opacity-50 disabled:cursor-wait">
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                     <button onClick={logout} className="text-sm text-gray-500 hover:underline">
                        Cancel and Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- START: NEW DYNAMIC LEGAL DOCUMENT PAGE ---
// This component replaces the old hardcoded Terms, Privacy, and Cookie pages.
const getDefaultLegalContent = (slug: string, title: string): string => {
    switch(slug) {
        case 'terms-and-conditions':
            return `## Welcome to NYX\n\nThese terms and conditions outline the rules and regulations for the use of NYX's Website.\n\nBy accessing this website we assume you accept these terms and conditions. Do not continue to use NYX if you do not agree to take all of the terms and conditions stated on this page.`;
        case 'privacy-policy':
            return `## Privacy Policy for NYX\n\nAt NYX, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by NYX and how we use it.\n\nIf you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.`;
        case 'cookie-policy':
            return `## Cookie Policy for NYX\n\nThis is the Cookie Policy for NYX.\n\n**What Are Cookies**\n\nAs is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.`;
        default:
            return `Welcome to the ${title} page.`;
    }
};

const LegalDocumentPage: React.FC<{ 
    docSlug: 'terms-and-conditions' | 'privacy-policy' | 'cookie-policy';
    docTitle: string;
    navigateTo: (page: string) => void; 
}> = ({ docSlug, docTitle, navigateTo }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [content, setContent] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [isPlaceholder, setIsPlaceholder] = useState(false);

    const isAuthorized = user && (user.roles.includes('admin') || user.roles.includes('super-admin'));
    
    const fetchDocument = useCallback(async () => {
        setIsLoading(true);
        setError('');
        const { data, error: fetchError } = await supabase
            .from('legal_documents')
            .select('content, last_updated')
            .eq('slug', docSlug)
            .single();

        const placeholderContent = getDefaultLegalContent(docSlug, docTitle);

        if (fetchError || !data) {
            // Document doesn't exist in DB
            if (isAuthorized) {
                // If admin, create it with placeholder content
                const { data: insertData, error: insertError } = await supabase
                    .from('legal_documents')
                    .insert({ slug: docSlug, title: docTitle, content: placeholderContent })
                    .select('content, last_updated')
                    .single();
                
                if (insertError) {
                    setError(`Failed to create document: ${insertError.message}`);
                    setContent(placeholderContent);
                    setEditedContent(placeholderContent);
                    setLastUpdated(null);
                    setIsPlaceholder(true);
                } else if (insertData) {
                    setContent(insertData.content);
                    setEditedContent(insertData.content);
                    setLastUpdated(insertData.last_updated);
                    setIsPlaceholder(insertData.content === placeholderContent);
                }
            } else {
                // If non-admin, just show the placeholder content without saving
                setContent(placeholderContent);
                setEditedContent(placeholderContent);
                setLastUpdated(null);
                setIsPlaceholder(true);
            }
        } else {
            // Document exists, load it
            setContent(data.content);
            setEditedContent(data.content);
            setLastUpdated(data.last_updated);
            setIsPlaceholder(data.content === placeholderContent);
        }
        setIsLoading(false);
    }, [docSlug, docTitle, isAuthorized]);

    useEffect(() => {
        fetchDocument();
    }, [fetchDocument]);

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        const { error: updateError } = await supabase
            .from('legal_documents')
            .update({ content: editedContent, last_updated: new Date().toISOString() })
            .eq('slug', docSlug);

        if (updateError) {
            setError(`Failed to save: ${updateError.message}`);
        } else {
            setContent(editedContent);
            setIsEditing(false);
            fetchDocument(); // Re-fetch to get the new last_updated timestamp and check for placeholder
        }
        setIsSaving(false);
    };

    const handleCancel = () => {
        setEditedContent(content);
        setIsEditing(false);
    };

    const renderContent = () => {
        if (isLoading) return <p className="text-gray-400">Loading document...</p>;
        
        const adminError = error && isAuthorized ? <p className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-4">{error}</p> : null;

        const renderableContent = content.split('\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (trimmed.startsWith('## ')) {
                return <h2 key={index} className="text-2xl text-white font-semibold mt-6 mb-3 border-b border-white/10 pb-2">{trimmed.substring(3)}</h2>;
            }
            if (trimmed.startsWith('# ')) {
                 return <h1 key={index} className="text-3xl text-white font-bold mt-8 mb-4">{trimmed.substring(2)}</h1>;
            }
            if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                return <p key={index}><strong>{trimmed.substring(2, trimmed.length - 2)}</strong></p>;
            }
            if (trimmed === '') return null; // Skip empty lines
            return <p key={index}>{trimmed}</p>;
        });

        if (isEditing) {
            return (
                <div>
                    {adminError}
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-96 bg-dark border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                    <div className="flex justify-end gap-4 mt-4">
                        <button onClick={handleCancel} className="border border-gray-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-700 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="bg-brand-purple text-white font-bold py-2 px-6 rounded-full hover:bg-brand-purple/80 transition-all disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <>
                {adminError}
                {renderableContent}
            </>
        );
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back to Home
                    </button>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{docTitle}</h1>
                            {lastUpdated && !isEditing && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Last Updated: {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            )}
                        </div>
                        {isAuthorized && !isEditing && !isLoading && (
                            <button onClick={() => setIsEditing(true)} className="bg-brand-purple/20 text-brand-purple font-semibold py-2 px-5 rounded-full hover:bg-brand-purple/30 transition-colors">
                                Edit Content
                            </button>
                        )}
                    </div>
                    <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
                        {renderContent()}
                        {isAuthorized && !isEditing && isPlaceholder && (
                             <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                <p className="text-sm text-yellow-300">
                                    <span className="font-bold">Admin Note:</span> This document is currently a placeholder. Click the "Edit Content" button above to create the official version. This note is only visible to administrators.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- END: NEW DYNAMIC LEGAL DOCUMENT PAGE ---

// --- Data Mapping Helpers ---
const productToCamel = (product: any): Product => ({
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    price: product.price,
    originalPrice: product.original_price,
    stock: product.stock,
    images: product.images,
    specs: product.specs,
    isVisible: product.is_visible,
    ownerId: product.owner_id,
});

const productToSnake = (product: Partial<Product>): any => {
    const snakeProduct: any = {};
    if (product.name !== undefined) snakeProduct.name = product.name;
    if (product.tagline !== undefined) snakeProduct.tagline = product.tagline;
    if (product.price !== undefined) snakeProduct.price = product.price;
    if (product.hasOwnProperty('originalPrice')) snakeProduct.original_price = product.originalPrice;
    if (product.stock !== undefined) snakeProduct.stock = product.stock;
    if (product.images !== undefined) snakeProduct.images = product.images;
    if (product.specs !== undefined) snakeProduct.specs = product.specs;
    if (product.isVisible !== undefined) snakeProduct.is_visible = product.isVisible;
    if (product.ownerId !== undefined) snakeProduct.owner_id = product.ownerId;
    return snakeProduct;
};

const blogPostToCamel = (post: any): BlogPost => ({
    id: post.id,
    title: post.title,
    author: post.author,
    date: post.date,
    imageUrl: post.image_url,
    excerpt: post.excerpt,
    content: post.content,
    ownerId: post.owner_id,
});

const blogPostToSnake = (post: Partial<BlogPost>): any => {
    const snakePost: any = {};
    if (post.title !== undefined) snakePost.title = post.title;
    if (post.author !== undefined) snakePost.author = post.author;
    if (post.date !== undefined) snakePost.date = post.date;
    if (post.imageUrl !== undefined) snakePost.image_url = post.imageUrl;
    if (post.excerpt !== undefined) snakePost.excerpt = post.excerpt;
    if (post.content !== undefined) snakePost.content = post.content;
    if (post.ownerId !== undefined) snakePost.owner_id = post.ownerId;
    return snakePost;
};

const AppContent: React.FC = () => {
    const { user, isPasswordRecoveryFlow } = useAuth();
    const [currentPage, setCurrentPage] = useState('home');
    const [pageParams, setPageParams] = useState<any>({});
    const [isAskNyxOpen, setIsAskNyxOpen] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState<string | null>(null);

    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState<string | null>(null);

    const [cookieConsent, setCookieConsent] = useState<'accepted' | 'declined' | null>(null);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (consent === 'accepted' || consent === 'declined') {
            setCookieConsent(consent);
        }
    }, []);

    const handleCookieConsent = (decision: 'accepted' | 'declined') => {
        localStorage.setItem('cookieConsent', decision);
        setCookieConsent(decision);
    };

    const navigateTo = (page: string, params: any = {}) => {
        window.scrollTo(0, 0);
        setPageParams(params);
        setCurrentPage(page);
    };

    // Make navigateTo globally accessible for features like 'Why Us?' button
    useEffect(() => {
        (window as any).navigateToProducts = () => navigateTo('products');
    }, []);
    
    useEffect(() => {
        if(isPasswordRecoveryFlow) {
            navigateTo('update-password');
        }
    }, [isPasswordRecoveryFlow]);

    // Fetch Products
    const fetchProducts = useCallback(async () => {
        setProductsLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            setProductsError(`Failed to fetch products: ${error.message}`);
        } else {
            setProducts(data ? data.map(productToCamel) : []);
            setProductsError(null);
        }
        setProductsLoading(false);
    }, []);

    // Fetch Blog Posts
    const fetchBlogPosts = useCallback(async () => {
        setPostsLoading(true);
        const { data, error } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
        if (error) {
            setPostsError(`Failed to fetch blog posts: ${error.message}`);
        } else {
            setBlogPosts(data ? data.map(blogPostToCamel) : []);
            setPostsError(null);
        }
        setPostsLoading(false);
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchBlogPosts();
    }, [fetchProducts, fetchBlogPosts]);
    
    // Product CUD operations
    const addProduct = async (productData: Omit<Product, 'id' | 'ownerId'>): Promise<void> => {
        if (!user) throw new Error("You must be logged in to add products.");
        const snakeData = productToSnake({ ...productData, ownerId: user.id });
        const { data, error } = await supabase.from('products').insert(snakeData).select().single();
        if (error) throw error;
        setProducts(prev => [productToCamel(data), ...prev]);
    };

    const updateProduct = async (productId: string, updates: Partial<Product>): Promise<void> => {
        const { data, error } = await supabase.from('products').update(productToSnake(updates)).eq('id', productId).select().single();
        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === productId ? productToCamel(data) : p));
    };
    
    const deleteProduct = async (productId: string): Promise<void> => {
        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) throw error;
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    // Blog Post CUD operations
    const addBlogPost = async (postData: Omit<BlogPost, 'id' | 'ownerId'>): Promise<void> => {
        if (!user) throw new Error("You must be logged in to add blog posts.");
        const snakeData = blogPostToSnake({ ...postData, ownerId: user.id });
        const { data, error } = await supabase.from('blog_posts').insert(snakeData).select().single();
        if (error) throw error;
        setBlogPosts(prev => [blogPostToCamel(data), ...prev]);
    };
    
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage navigateTo={navigateTo} products={products} />;
            case 'products':
                return <ProductsPage navigateTo={navigateTo} products={products} loading={productsLoading} error={productsError} />;
            case 'how-it-works':
                return <HowItWorksPage />;
            case 'setup-videos':
                return <SetupVideosPage />;
            case 'faq':
                return <FAQPage />;
            case 'contact':
                return <ContactPage />;
            case 'our-story':
                return <OurStoryPage />;
            case 'why-us':
                return <WhyUsPage />;
            case 'add-product':
                return <AddProductPage navigateTo={navigateTo} addProduct={addProduct} />;
            case 'edit-product':
                return <EditProductPage navigateTo={navigateTo} productId={pageParams.id} products={products} updateProduct={updateProduct} deleteProduct={deleteProduct} />;
            case 'admin-dashboard':
                return <AdminDashboardPage navigateTo={navigateTo} />;
            case 'blog':
                return <BlogPage blogPosts={blogPosts} navigateTo={navigateTo} />;
            case 'blog-post':
                return <BlogPostPage postId={pageParams.id} blogPosts={blogPosts} navigateTo={navigateTo} />;
            case 'add-blog-post':
                return <AddBlogPostPage navigateTo={navigateTo} addBlogPost={addBlogPost} />;
            case 'login':
                return <AuthForm navigateTo={navigateTo} />;
            case 'profile':
                return <ProfilePage navigateTo={navigateTo} />;
            case 'update-password':
                return <UpdatePasswordPage navigateTo={navigateTo} />;
            case 'legal':
                if (!pageParams.slug || !pageParams.title) return <HomePage navigateTo={navigateTo} products={products} />;
                return <LegalDocumentPage docSlug={pageParams.slug} docTitle={pageParams.title} navigateTo={navigateTo} />;
            default:
                return <HomePage navigateTo={navigateTo} products={products} />;
        }
    };

    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen">
                <Header onAskNyxOpen={() => setIsAskNyxOpen(true)} navigateTo={navigateTo} />
                <main className="flex-grow">
                    {renderPage()}
                </main>
                <Footer navigateTo={navigateTo} />
            </div>
            <CartSidebar navigateTo={navigateTo} />
            <AskNyx isOpen={isAskNyxOpen} onClose={() => setIsAskNyxOpen(false)} />
            {!cookieConsent && (
                <CookieConsentBanner
                    onAccept={() => handleCookieConsent('accepted')}
                    onDecline={() => handleCookieConsent('declined')}
                />
            )}
        </CartProvider>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;